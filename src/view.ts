import { ItemView, WorkspaceLeaf, Notice, TFile } from 'obsidian';
import { createOrrery, ENGINE_HTML } from './engine.generated.js';
import type { OrreryApi } from './engine.generated.js';
import type VaultOrreryPlugin from './main';

export const VIEW_TYPE_ORRERY = 'vault-orrery-view';

export class OrreryView extends ItemView {
  private api: OrreryApi | null = null;
  private io: IntersectionObserver | null = null;
  private ro: ResizeObserver | null = null;

  constructor(leaf: WorkspaceLeaf, private plugin: VaultOrreryPlugin) { super(leaf); }

  getViewType() { return VIEW_TYPE_ORRERY; }
  getDisplayText() { return 'Vault Orrery'; }
  getIcon() { return 'orbit'; }

  async onOpen() {
    const host = this.contentEl;
    host.empty();
    host.addClass('vault-orrery-host');

    const root = host.createDiv({ cls: 'vo-root' });
    /* ENGINE_HTML is a build-time constant with no user data in it, so innerHTML
       would be safe here — but DOMParser is safe by construction rather than by
       argument, and it does not run scripts. Cheaper to reason about, and one
       less thing for a reviewer to have to take on trust. */
    const doc = new DOMParser().parseFromString(ENGINE_HTML, 'text/html');
    while (doc.body.firstChild) root.appendChild(doc.body.firstChild);

    try {
      this.api = createOrrery(root, { mediapipePath: this.plugin.mediapipeBasePath() });
    } catch (e) {
      console.error('Vault Orrery: engine failed to start', e);
      host.empty();
      host.createEl('p', { text: 'Vault Orrery could not start. See the developer console for details.' });
      return;
    }

    this.plugin.applySettingsTo(this.api);
    /* optional, and deliberately not awaited — the cosmos should not wait on a
       hand-tracking model that most sessions never use */
    void this.plugin.ensureMediaPipe();

    /* Visibility, asked of the browser rather than inferred from workspace
       events. An IntersectionObserver answers the question that actually
       matters — is any of this on screen — and so covers a buried tab, a
       collapsed sidebar and a minimised window with one mechanism. */
    this.io = new IntersectionObserver(
      entries => { for (const e of entries) this.api?.setVisible(e.isIntersecting); },
      { threshold: 0 });
    this.io.observe(root);

    /* A leaf can change size while the window does not, so the engine's own
       window resize handler is not enough on its own. */
    this.ro = new ResizeObserver(() => this.api?.resize());
    this.ro.observe(root);

    await this.loadVault();
  }

  async onClose() {
    this.io?.disconnect(); this.io = null;
    this.ro?.disconnect(); this.ro = null;
    this.api?.destroy();
    this.api = null;
    this.contentEl.empty();
  }

  onResize() { this.api?.resize(); }

  getApi(): OrreryApi | null { return this.api; }

  /** Hand the whole vault over and let the engine apply its own gates, so the
      exclusion rules live in exactly one place. */
  async loadVault() {
    if (!this.api) return;
    const files: TFile[] = this.app.vault.getMarkdownFiles();
    if (!files.length) { new Notice('Vault Orrery: no markdown files in this vault.'); return; }
    await this.api.load(
      files.map(f => ({ path: f.path, file: { text: () => this.app.vault.cachedRead(f) } })),
      this.app.vault.getName());
  }
}
