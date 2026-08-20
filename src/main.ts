import { Plugin, WorkspaceLeaf, Notice, TFile, Menu, addIcon, debounce, moment } from 'obsidian';
import type { OrreryApi, OrreryCommand, OrreryStore } from './engine.generated.js';
import { OrreryView, VIEW_TYPE_ORRERY, HOVER_SOURCE } from './view';
import { OrrerySettingTab, DEFAULT_SETTINGS, type OrrerySettings, type Lang } from './settings';

const ORBIT_ICON = `<circle cx="50" cy="50" r="12" fill="currentColor"/>` +
  `<ellipse cx="50" cy="50" rx="44" ry="18" fill="none" stroke="currentColor" stroke-width="6"/>` +
  `<circle cx="94" cy="50" r="8" fill="currentColor"/>`;

/* Every mode the view has, offered as a command so that it can be reached from
   the palette and bound to a key. The engine already owns what each one does
   and answers to these names; this table is only what to call them in a list
   that is sorted alphabetically among a hundred other plugins' commands.

   No key is bound by default. The engine's own single-letter shortcuts work
   inside the view, and claiming a global hotkey for "Genesis" would be taking
   something the user has other uses for. */
const MODE_COMMANDS: ReadonlyArray<[OrreryCommand, string]> = [
  ['open',    'Open the selected note'],
  ['search',  'Search the cosmos'],
  ['mindmap', 'Mind map of the selected note'],
  ['ship',    'Spaceship mode'],
  ['genesis', 'Genesis — play the vault\'s formation'],
  ['twins',   'Find twins of the selected note'],
  ['ripple',  'Ripple from the selected note'],
  ['poster',  'Save a poster'],
  ['layer',   'Cycle the link layer'],
  ['sound',   'Ambient sound'],
  ['reset',   'Reset the view'],
  ['hud',     'Show or hide the HUD'],
  ['help',    'Show the first-flight guide'],
];

export default class VaultOrreryPlugin extends Plugin {
  settings: OrrerySettings = DEFAULT_SETTINGS;

  /* The engine writes its own preferences — language, panel sizes, radar size,
     its exclusion list — as it is used. They are held here and flushed to the
     plugin's data file rather than written through on every keystroke: a
     panel being dragged emits a value per frame, and each of those would
     otherwise be a write to disk. */
  private flushStore = debounce(() => { void this.saveSettings(); }, 800, false);

  async onload() {
    await this.loadSettings();
    addIcon('orbit', ORBIT_ICON);

    /* The engine's stylesheet is not injected at runtime: it is generated from
       vault-orrery-v2.html into styles.css at build time (npm run engine), and
       Obsidian loads that file itself. */

    this.registerView(VIEW_TYPE_ORRERY, leaf => new OrreryView(leaf, this));

    this.addRibbonIcon('orbit', 'Open Vault Orrery', () => this.activateView());
    this.addCommand({ id: 'open', name: 'Open', callback: () => this.activateView() });
    this.addCommand({
      id: 'reload-vault',
      name: 'Reload vault',
      checkCallback: (checking: boolean) => {
        const views = this.views();
        if (!views.length) return false;
        if (!checking) views.forEach(v => void v.loadVault());
        return true;
      },
    });

    /* "It does not draw" is the one report that carries no information: the
       view mounts, the vault loads, the panels lay out, and the canvas is
       blank. Everything that would distinguish the causes — whether the frame
       loop is running, what size the drawing buffer is, whether some pane is
       simply covering it — is readable from the DOM, so read it here and put
       it where someone can copy it without opening a developer console. */
    this.addCommand({
      id: 'diagnostics',
      name: 'Show render diagnostics',
      checkCallback: (checking: boolean) => {
        const views = this.views();
        if (!views.length) return false;
        if (!checking) new Notice(views[0].diagnostics(), 60000);
        return true;
      },
    });

    /* Reachable from anywhere: the note you are reading, found in the sky.
       This is the other half of clicking a planet to open a note, and the one
       that makes the view worth leaving open beside the editor. */
    this.addCommand({
      id: 'reveal-active',
      name: 'Reveal the active note in the orrery',
      checkCallback: (checking: boolean) => {
        const file = this.app.workspace.getActiveFile();
        if (!file || file.extension !== 'md') return false;
        if (!checking) void this.revealFile(file);
        return true;
      },
    });

    /* Each mode, so it can be bound to a key or found by name. Only offered
       while a view is open — a command that silently does nothing is worse
       than one that is not in the list. */
    for (const [id, name] of MODE_COMMANDS) {
      this.addCommand({
        id: 'mode-' + id,
        name,
        checkCallback: (checking: boolean) => {
          const views = this.views();
          if (!views.length) return false;
          if (!checking) views[0].getApi()?.command(id);
          return true;
        },
      });
    }

    /* "Show in Vault Orrery", where a note is already being right-clicked. */
    this.registerEvent(this.app.workspace.on('file-menu', (menu: Menu, file) => {
      if (!(file instanceof TFile) || file.extension !== 'md') return;
      menu.addItem(item => item
        .setTitle('Show in Vault Orrery')
        .setIcon('orbit')
        .onClick(() => { void this.revealFile(file); }));
    }));

    /* Hovering a note's name in the inspector offers Obsidian's own page
       preview. Registering it here is what puts Vault Orrery in Settings →
       Page preview, so the user can turn it off where they turn off every
       other one. */
    this.registerHoverLinkSource(HOVER_SOURCE, { display: 'Vault Orrery', defaultMod: true });

    this.addSettingTab(new OrrerySettingTab(this.app, this));

    /* Excluded-files patterns can change while a view is open. */
    this.registerEvent(this.app.workspace.on('layout-change', () => this.pushSettingsToViews()));
  }

  onunload() {
    /* Anything the engine changed in the last moments before the plugin was
       disabled is still sitting in the debounce. */
    this.flushStore.cancel();
    void this.saveSettings();
    /* Views are torn down by Obsidian, which calls onClose(); that is where the
       engine's own listeners and audio context are released. */
  }

  private views(): OrreryView[] {
    return this.app.workspace.getLeavesOfType(VIEW_TYPE_ORRERY)
      .map(l => l.view)
      .filter((v): v is OrreryView => v instanceof OrreryView);
  }

  /** Open the orrery if it is not open, then put the camera on this note. */
  async revealFile(file: TFile) {
    await this.activateView();
    const view = this.views()[0];
    if (!view) return;
    /* A view that has just been created is still reading the vault, and there
       is nothing yet to reveal. Ask again until it has something, silently —
       only the last attempt is allowed to report that the note is not there,
       or a slow vault produces one notice per retry. */
    const attempt = (tries: number) => {
      if (view.reveal(file, tries > 0)) return;
      if (tries > 0) window.setTimeout(() => attempt(tries - 1), 400);
    };
    attempt(view.getApi()?.busy() ? 25 : 0);
  }

  async activateView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_ORRERY);
    if (existing.length) { await this.app.workspace.revealLeaf(existing[0]); return; }
    const leaf: WorkspaceLeaf = this.app.workspace.getLeaf('tab');
    await leaf.setViewState({ type: VIEW_TYPE_ORRERY, active: true });
    await this.app.workspace.revealLeaf(leaf);
  }

  /* ---- settings plumbing ------------------------------------------------ */

  async loadSettings() {
    /* loadData() is whatever JSON was on disk, so it is typed as unknown here
       rather than trusted: a hand-edited data.json must not be able to put a
       string where a number belongs and have TypeScript agree with it. */
    const saved = (await this.loadData()) as Partial<OrrerySettings> | null;
    this.settings = Object.assign({}, DEFAULT_SETTINGS, saved ?? {});
    /* Object.assign copies the reference, so a saved file with no engine state
       would otherwise have every view writing into DEFAULT_SETTINGS itself. */
    this.settings.engineStore = Object.assign({}, this.settings.engineStore);
  }
  async saveSettings() { await this.saveData(this.settings); }

  /** The engine's own preferences, in the shape it reads them: a synchronous
      store, hydrated from the plugin's data file before the engine starts. */
  engineStore(): OrreryStore {
    return {
      get: (k: string) => this.settings.engineStore[k] ?? null,
      set: (k: string, v: string) => {
        this.settings.engineStore[k] = String(v);
        this.flushStore();
      },
    };
  }

  pushSettingsToViews() {
    this.views().forEach(v => { const api = v.getApi(); if (api) this.applySettingsTo(api); });
  }

  applySettingsTo(api: OrreryApi) {
    api.setLang(this.resolveLang());
    api.setMaxNodes(this.settings.maxNodes);
    api.setIgnoreFilters(this.ignoreFilters());
  }

  private resolveLang(): 'ko' | 'en' | 'ja' | 'zh' {
    const pick = (l: Lang) => (l === 'auto' ? null : l);
    const explicit = pick(this.settings.language);
    if (explicit) return explicit;
    /* "Match Obsidian" means Obsidian's own display language, not the OS. */
    const loc = (moment.locale() || 'en').toLowerCase();
    if (loc.startsWith('ko')) return 'ko';
    if (loc.startsWith('ja')) return 'ja';
    if (loc.startsWith('zh')) return 'zh';
    return 'en';
  }

  /** Obsidian's own excluded-file patterns, plus the plugin's own. */
  private ignoreFilters(): string[] {
    const mine = this.settings.extraIgnoreFilters.slice();
    if (!this.settings.followExcludedFiles) return mine;
    /* getConfig is not in the public typings. It is how the core graph reads
       the same setting, but it is undocumented, so a version that drops it must
       degrade to "no filters from Obsidian" rather than throwing and taking the
       whole view down with it. */
    let theirs: unknown = null;
    try {
      const vault = this.app.vault as unknown as { getConfig?(k: string): unknown };
      theirs = vault.getConfig?.('userIgnoreFilters');
    } catch (e) {
      console.warn('Vault Orrery: could not read userIgnoreFilters', e);
    }
    if (!Array.isArray(theirs)) {
      if (theirs != null) console.warn('Vault Orrery: unexpected userIgnoreFilters shape', theirs);
      return mine;
    }
    return [...theirs.filter((x): x is string => typeof x === 'string'), ...mine];
  }

}
