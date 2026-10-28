import { ItemView, WorkspaceLeaf, Notice, TFile, debounce, setIcon } from 'obsidian';
import type { OrreryApi } from './engine.generated.js';
import { mountEngine, hostIcon, openNoteFrom, hoverNote, orreryFiles } from './host';
import type VaultOrreryPlugin from './main';

export { HOVER_SOURCE } from './host';

export const VIEW_TYPE_ORRERY = 'vault-orrery-view';
/** The same cosmos, small and quiet, kept in a sidebar. */
export const VIEW_TYPE_MINI = 'vault-orrery-mini';

/** How long the vault has to be quiet before the cosmos is re-derived. Typing
    in a note fires `modify` on Obsidian's own save cadence, so a rebuild per
    event would be a rebuild every couple of seconds while someone writes. */
const SYNC_DELAY = 2500;

export class OrreryView extends ItemView {
  private api: OrreryApi | null = null;
  private io: IntersectionObserver | null = null;
  private ro: ResizeObserver | null = null;
  /** Set while a sync is waiting on a load that is already running. */
  private syncPending = false;
  /** The mini's caption: the name of the note being edited. */
  private caption: HTMLElement | null = null;
  /** The sidebar's mini orrery rather than the full view. Set by the
      subclass before onOpen, because the engine has to be told at birth. */
  protected readonly mini: boolean = false;

  constructor(leaf: WorkspaceLeaf, protected plugin: VaultOrreryPlugin) { super(leaf); }

  getViewType() { return VIEW_TYPE_ORRERY; }
  getDisplayText() { return 'Vault Orrery'; }
  getIcon() { return 'orbit'; }
  isMini() { return this.mini; }

  async onOpen() {
    const host = this.contentEl;
    host.empty();
    host.addClass('vault-orrery-host');
    if (this.mini) host.addClass('vault-orrery-host-mini');

    const root = host.createDiv({ cls: 'vo-root' });
    try {
      /* The mini reads the full view's preferences and writes none of them:
         its quality is forced down and its panels never move, and either of
         those written back would change the full view's picture. */
      this.api = mountEngine(root,
        this.mini ? this.plugin.engineStoreReadOnly() : this.plugin.engineStore(),
        this.mini);
    } catch (e) {
      console.error('Vault Orrery: engine failed to start', e);
      host.empty();
      host.createEl('p', { text: 'Vault Orrery could not start. See the developer console for details.' });
      return;
    }

    /* What the engine cannot do for itself. Without this the orrery is a
       picture of the vault; with it, every body on screen is a note you can
       be reading a second later. The icon hook is how the rail comes to be
       drawn in Obsidian's own icon set rather than in text glyphs. */
    this.api.setHostHooks({
      open: (path, opts) => { void openNoteFrom(this.app, this.leaf, path, opts); },
      hover: (path, event, el) => hoverNote(this.app, this, path, event, el),
      icon: hostIcon,
    });
    this.plugin.applySettingsTo(this.api);

    /* The mini's finish. The engine draws a hard-edged sky into a sidebar
       whose own background is the theme's, so a vignette in that colour
       melts the edges into the pane, and a one-line caption names the note
       the light is on — the thing the sidebar is turning about. The one
       control, the way to the full view, is the host's as well: the engine
       draws no panels in the mini. */
    if (this.mini) {
      host.createDiv({ cls: 'vo-mini-vignette' });
      this.caption = host.createDiv({ cls: 'vo-mini-caption' });
      const exp = host.createDiv({ cls: 'vo-mini-expand', attr: { 'aria-label': 'Open the full orrery' } });
      setIcon(exp, 'maximize-2');
      exp.addEventListener('click', () => { void this.plugin.activateView(); });
    }

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

    /* The vault changes under an open view: notes are written, created,
       renamed and deleted while the cosmos is on screen. A graph that only
       matches the vault it was opened with is a screenshot, so every one of
       those is a reason to re-derive — debounced, because `modify` fires on
       Obsidian's save cadence and a rebuild per keystroke-batch would be a
       rebuild every few seconds while someone writes. */
    const bump = () => this.scheduleSync();
    this.registerEvent(this.app.vault.on('create', bump));
    this.registerEvent(this.app.vault.on('delete', bump));
    this.registerEvent(this.app.vault.on('rename', bump));
    this.registerEvent(this.app.vault.on('modify', bump));
    /* Links resolve after the file that made them is written, so this is the
       event that actually knows the graph changed. */
    this.registerEvent(this.app.metadataCache.on('resolved', bump));

    /* Where you are working, as distinct from where you are looking. */
    this.registerEvent(this.app.workspace.on('file-open', f => this.syncActive(f)));
    this.syncActive(this.app.workspace.getActiveFile());

    await this.loadVault();
  }

  /* ---- the host's half of the conversation ------------------------------ */

  /** Mark the note being edited, and follow it if the user asked to. */
  private syncActive(file: TFile | null) {
    if (!this.api) return;
    const path = file && file.extension === 'md' ? file.path : '';
    this.api.setActivePath(path);
    if (this.caption) {
      this.caption.setText(file && path ? file.basename : '');
      this.caption.toggleClass('is-empty', !path);
    }
    /* The mini marks the note and keeps drifting: following would stop the
       one thing it is for every time a note is opened. */
    if (path && !this.mini && this.plugin.settings.followActiveNote) this.api.revealPath(path);
  }

  /** Put the camera on a note, and say so if it is not in the cosmos. `quiet`
      is for a caller that is going to try again. `fly` arrives over a couple
      of seconds instead of cutting — right for a reveal that came from
      outside the view, where the flight is what shows where the note is. */
  reveal(file: TFile, quiet = false, fly = false): boolean {
    if (!this.api) return false;
    const ok = this.api.revealPath(file.path, { fly });
    if (!ok && !quiet) new Notice(`Vault Orrery: ${file.basename} is not in the cosmos on screen — ` +
                        `it may be excluded, or past the maximum-notes ceiling.`);
    return ok;
  }

  /* ---- keeping up with the vault ---------------------------------------- */

  private scheduleSync = debounce(() => { void this.syncVault(); }, SYNC_DELAY, false);

  private async syncVault() {
    if (!this.api || !this.plugin.settings.liveSync) return;
    /* A reload while one is running would interleave two reads of the vault.
       Wait for the one in flight and then do exactly one more, rather than
       queueing a rebuild per event that arrived while it ran. */
    if (this.api.busy()) {
      if (this.syncPending) return;
      this.syncPending = true;
      window.setTimeout(() => { this.syncPending = false; void this.syncVault(); }, SYNC_DELAY);
      return;
    }
    await this.loadVault(true);
  }

  async onClose() {
    this.scheduleSync.cancel();
    this.io?.disconnect(); this.io = null;
    this.ro?.disconnect(); this.ro = null;
    this.api?.destroy();
    this.api = null;
    this.caption = null;
    this.contentEl.empty();
    this.plugin.releaseTexts();
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
      exclusion rules live in exactly one place.

      `quiet` is a reload the user did not ask for — see the engine's own note
      on it: same cosmos, same camera, no curtain. */
  async loadVault(quiet = false) {
    if (!this.api) return;
    const files: TFile[] = this.app.vault.getMarkdownFiles();
    if (!files.length) {
      if (!quiet) new Notice('Vault Orrery: no markdown files in this vault.');
      return;
    }
    this.plugin.pruneTexts(files);
    await this.api.load(orreryFiles(this.plugin, files), this.app.vault.getName(), { quiet });
  }
}

/** The mini orrery: the same view, born small. Everything it does
    differently is either the engine's MINI mode or a `this.mini` above. */
export class MiniOrreryView extends OrreryView {
  protected readonly mini = true;
  getViewType() { return VIEW_TYPE_MINI; }
  getDisplayText() { return 'Vault Orrery mini'; }
}
