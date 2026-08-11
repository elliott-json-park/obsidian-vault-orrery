import { Plugin, WorkspaceLeaf, Notice, addIcon, debounce, moment } from 'obsidian';
import type { OrreryApi, OrreryStore } from './engine.generated.js';
import { OrreryView, VIEW_TYPE_ORRERY } from './view';
import { OrrerySettingTab, DEFAULT_SETTINGS, type OrrerySettings, type Lang } from './settings';

const ORBIT_ICON = `<circle cx="50" cy="50" r="12" fill="currentColor"/>` +
  `<ellipse cx="50" cy="50" rx="44" ry="18" fill="none" stroke="currentColor" stroke-width="6"/>` +
  `<circle cx="94" cy="50" r="8" fill="currentColor"/>`;

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
