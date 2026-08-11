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
      this.api = createOrrery(root, this.plugin.engineStore());
    } catch (e) {
      console.error('Vault Orrery: engine failed to start', e);
      host.empty();
      host.createEl('p', { text: 'Vault Orrery could not start. See the developer console for details.' });
      return;
    }

    /* Before anything is drawn: the vault here is the one the plugin is
       installed in, so the engine's own way of asking for a folder has to be
       gone by the first paint rather than dismissed after it. */
    this.api.setHosted(true);
    this.plugin.applySettingsTo(this.api);

    /* Visibility, asked of the browser rather than inferred from workspace
       events. An IntersectionObserver answers the question that actually
       matters — is any of this on screen — and so covers a buried tab, a
       collapsed sidebar and a minimised window with one mechanism.

       Zero-area observations are dropped, and that is the whole subtlety here.
       Obsidian mounts a view before the leaf has been laid out, so the first
       notification often describes a 0x0 box, which the observer reports as
       not intersecting — true in the letter, and nothing at all like "the user
       has this hidden". Acting on it suspends the renderer at mount, and
       nothing ever resumes it: the next notification only comes when the
       intersection *changes*, and by the observer's reckoning it never did.
       The result is a view that looks completely correct — panels laid out,
       vault loaded, keys responding — and draws nothing at all.

       Ignoring those reports leaves the engine at its own default, which is
       running. A leaf that really is hidden has a size, so the notification
       that matters still arrives. */
    this.io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          const r = e.boundingClientRect;
          if (!r.width || !r.height) continue;
          this.api?.setVisible(e.isIntersecting);
        }
      },
      { threshold: 0 });
    this.io.observe(root);

    /* A leaf can change size while the window does not, so the engine's own
       window resize handler is not enough on its own.

       It also carries the other half of the visibility question. Obsidian
       gives an inactive tab's content no box at all, so "has a box" is a
       direct reading of "is being displayed" — and unlike the intersection
       observer, this one is guaranteed to fire when the leaf is finally laid
       out. Without it the view depends on a notification that may already
       have been and gone before the leaf existed to be seen. */
    this.ro = new ResizeObserver(() => {
      this.api?.resize();
      this.api?.setVisible(root.offsetWidth > 0 && root.offsetHeight > 0);
    });
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

  /** Why the canvas is blank, in the terms that actually separate the causes.
      Read by the "Show render diagnostics" command. */
  diagnostics(): string {
    const root = this.api?.root ?? this.contentEl.querySelector('.vo-root');
    if (!root) return 'no engine mounted in this leaf';
    const q = (id: string) => root.querySelector<HTMLElement>('#' + id);
    const gl = root.querySelector<HTMLCanvasElement>('#gl');
    const r = root.getBoundingClientRect();
    const cs = gl ? getComputedStyle(gl) : null;
    /* Asking for the context the renderer already holds returns that same
       context rather than making a new one, so this is a safe read. */
    const ctx = gl ? (gl.getContext('webgl2') || gl.getContext('webgl')) : null;

    /* What is actually on top at the middle of the leaf. If the renderer is
       working and something opaque is parked over it, this names it — which no
       amount of reasoning about the engine would have. */
    let covering = 'n/a';
    if (r.width && r.height) {
      const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      covering = el ? `${el.tagName.toLowerCase()}#${el.id || '-'}.${el.className || '-'}` : 'nothing';
    }

    /* An FPS readout that never moves means the frame loop is not running;
       one that moves means it is, and the problem is further down. */
    const fps = q('s-fps')?.textContent ?? '?';

    return [
      `leaf box      ${Math.round(r.width)} x ${Math.round(r.height)}`,
      `root client   ${root.clientWidth} x ${root.clientHeight}`,
      `canvas buffer ${gl ? gl.width + ' x ' + gl.height : 'NO CANVAS'}`,
      `canvas css    ${cs ? `${cs.width} x ${cs.height} display:${cs.display} vis:${cs.visibility} op:${cs.opacity} z:${cs.zIndex}` : '-'}`,
      `webgl         ${ctx ? (ctx.isContextLost() ? 'CONTEXT LOST' : 'ok') : 'no context'}`,
      `at leaf centre ${covering}`,
      `nodes ${q('s-nodes')?.textContent ?? '?'}   fps ${fps}   range ${q('s-dist')?.textContent ?? '?'}`,
      `run gate      ${this.api ? JSON.stringify(this.api.debug()) : '-'}`,
      `root classes  ${root.className}`,
    ].join('\n');
  }

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
