import { Plugin, WorkspaceLeaf, addIcon, moment } from 'obsidian';
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

    this.addSettingTab(new OrrerySettingTab(this.app, this));

    /* Excluded-files patterns can change while a view is open. */
    this.registerEvent(this.app.workspace.on('layout-change', () => this.pushSettingsToViews()));
  }

  onunload() {
    this.styleEl?.remove();
    this.styleEl = null;
    /* Views are torn down by Obsidian, which calls onClose(); that is where the
       engine's own listeners, camera and audio context are released. */
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

  /* ---- bundled MediaPipe ------------------------------------------------- */

  /** Where the hand-tracking files are served from, as an app:// directory.
      Nothing is ever fetched from a network; this resolves inside the vault. */
  mediapipeBasePath(): string {
    const dir = this.manifest.dir;
    if (!dir) return '';
    const adapter = this.app.vault.adapter as unknown as { getResourcePath?(p: string): string };
    if (!adapter.getResourcePath) return '';
    /* getResourcePath appends a cache-busting query, so a directory path cannot
       simply be concatenated with a filename. Resolve a known file and cut it
       back to its folder instead. */
    const one = adapter.getResourcePath(`${dir}/vendor/mediapipe/hands.js`);
    return one.replace(/hands\.js(\?.*)?$/, '');
  }

  private mpLoad: Promise<boolean> | null = null;

  /** Put `Hands` on the window, from disk, once.

      Loaded when a view opens rather than when the camera starts: the engine
      tests for `Hands` the moment you press C, and a fetch begun at that point
      would report "module failed to load" for the first press and work on the
      second. Failure here is not an error — hand tracking is optional, and the
      engine already says so in its own words if the global never appears. */
  ensureMediaPipe(): Promise<boolean> {
    if (this.mpLoad) return this.mpLoad;
    this.mpLoad = new Promise<boolean>(resolve => {
      if ((window as unknown as { Hands?: unknown }).Hands) return resolve(true);
      const base = this.mediapipeBasePath();
      if (!base) return resolve(false);
      const s = document.createElement('script');
      s.src = base + 'hands.js';
      s.async = true;
      s.onload = () => resolve(!!(window as unknown as { Hands?: unknown }).Hands);
      s.onerror = () => {
        console.warn('Vault Orrery: vendor/mediapipe/hands.js not found — ' +
                     'hand tracking stays unavailable. See THIRD-PARTY-NOTICES.md.');
        resolve(false);
      };
      document.head.appendChild(s);
      this.register(() => s.remove());
    });
    return this.mpLoad;
  }
}
