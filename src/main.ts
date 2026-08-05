import { Plugin, WorkspaceLeaf, Notice, addIcon, moment } from 'obsidian';
import { ENGINE_CSS } from './engine.generated.js';
import type { OrreryApi } from './engine.generated.js';
import { OrreryView, VIEW_TYPE_ORRERY } from './view';
import { OrrerySettingTab, DEFAULT_SETTINGS, type OrrerySettings, type Lang } from './settings';

const ORBIT_ICON = `<circle cx="50" cy="50" r="12" fill="currentColor"/>` +
  `<ellipse cx="50" cy="50" rx="44" ry="18" fill="none" stroke="currentColor" stroke-width="6"/>` +
  `<circle cx="94" cy="50" r="8" fill="currentColor"/>`;

export default class VaultOrreryPlugin extends Plugin {
  settings: OrrerySettings = DEFAULT_SETTINGS;
  private styleEl: HTMLStyleElement | null = null;

  async onload() {
    await this.loadSettings();
    addIcon('orbit', ORBIT_ICON);

    /* The engine's stylesheet is injected here rather than living in
       styles.css, because it is generated from the HTML and would otherwise be
       a second copy to keep in step. It is removed with the plugin. */
    this.styleEl = document.createElement('style');
    this.styleEl.id = 'vault-orrery-engine-css';
    this.styleEl.textContent = ENGINE_CSS;
    document.head.appendChild(this.styleEl);

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
        if (!checking) {
          const text = views[0].diagnostics();
          console.log('Vault Orrery diagnostics\n' + text);
          new Notice(text, 60000);
        }
        return true;
      },
    });

    this.addSettingTab(new OrrerySettingTab(this.app, this));

    /* Excluded-files patterns can change while a view is open. */
    this.registerEvent(this.app.workspace.on('layout-change', () => this.pushSettingsToViews()));
  }

  onunload() {
    this.styleEl?.remove();
    this.styleEl = null;
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
    if (existing.length) { this.app.workspace.revealLeaf(existing[0]); return; }
    const leaf: WorkspaceLeaf = this.app.workspace.getLeaf('tab');
    await leaf.setViewState({ type: VIEW_TYPE_ORRERY, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  /* ---- settings plumbing ------------------------------------------------ */

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() { await this.saveData(this.settings); }

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
