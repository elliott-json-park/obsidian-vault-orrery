import { ItemView, WorkspaceLeaf, Notice, TFile, debounce, getAllTags } from 'obsidian';
import { createOrrery, ENGINE_HTML } from './engine.generated.js';
import type { OrreryApi, OrreryFile, OrreryFileMeta } from './engine.generated.js';
import type VaultOrreryPlugin from './main';

export const VIEW_TYPE_ORRERY = 'vault-orrery-view';

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
    /* What the engine cannot do for itself. Without this the orrery is a
       picture of the vault; with it, every body on screen is a note you can
       be reading a second later. */
    this.api.setHostHooks({
      open: (path, opts) => { void this.openNote(path, opts); },
      hover: (path, event, el) => this.hoverNote(path, event, el),
    });
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

  /** Open a note from the cosmos. The default lands it beside the orrery
      rather than on top of it: replacing this leaf with the note would close
      the very view the click came from, which is never what a click on a
      planet means. */
  private async openNote(path: string, opts: { newLeaf: boolean; newWindow: boolean }) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) {
      new Notice(`Vault Orrery: ${path} is no longer in the vault.`);
      return;
    }
    const ws = this.app.workspace;
    let leaf: WorkspaceLeaf;
    if (opts.newWindow) leaf = ws.getLeaf('window');
    else if (opts.newLeaf) leaf = ws.getLeaf('tab');
    else {
      const recent = ws.getMostRecentLeaf(ws.rootSplit);
      leaf = recent && recent !== this.leaf ? recent : ws.getLeaf('tab');
    }
    await leaf.openFile(file, { active: true });
  }

  /** Obsidian's own page preview, over an element the engine owns. Registered
      as a hover source by the plugin, so the user's "preview on hover"
      preference — including the Ctrl requirement — is honoured here as it is
      anywhere else. */
  private hoverNote(path: string, event: MouseEvent, el: HTMLElement) {
    this.app.workspace.trigger('hover-link', {
      event, source: HOVER_SOURCE, hoverParent: this, targetEl: el, linktext: path,
    });
  }

  /** Mark the note being edited, and follow it if the user asked to. */
  private syncActive(file: TFile | null) {
    if (!this.api) return;
    const path = file && file.extension === 'md' ? file.path : '';
    this.api.setActivePath(path);
    if (path && this.plugin.settings.followActiveNote) this.api.revealPath(path);
  }

  /** Put the camera on a note, and say so if it is not in the cosmos. `quiet`
      is for a caller that is going to try again. */
  reveal(file: TFile, quiet = false): boolean {
    if (!this.api) return false;
    const ok = this.api.revealPath(file.path);
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

  cancelSync() { this.scheduleSync.cancel(); }

  async onClose() {
    this.scheduleSync.cancel();
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
    const list: OrreryFile[] = files.map(f => ({
      path: f.path,
      file: { text: () => this.app.vault.cachedRead(f) },
      meta: this.metaFor(f),
    }));
    await this.api.load(list, this.app.vault.getName(), { quiet });
  }

  /** What Obsidian already knows about a note, in the shape the engine reads.

      This is the difference between a graph that agrees with Obsidian's and
      one that quietly disagrees. The engine's own parser is a regular
      expression over the text: it cannot follow a link written through an
      alias, does not see an embed as a link, and only finds tags in the front
      matter. Obsidian has resolved all of it already, for the whole vault, in
      an index it keeps up to date — so inside the plugin that index is the
      answer and the parser is the fallback for the standalone page. */
  private metaFor(f: TFile): OrreryFileMeta {
    const cache = this.app.metadataCache;
    /* Both maps are keyed by source path and hold counts. Attachments and
       other non-markdown targets are in there too; the engine drops the ones
       it has no body for. */
    const links = cache.resolvedLinks[f.path];
    const unresolved = cache.unresolvedLinks[f.path];
    let broken = 0;
    if (unresolved) for (const k in unresolved) broken += unresolved[k];
    /* getAllTags merges the front matter and the body, and returns them with
       the leading '#', which the engine strips. Nested tags arrive whole
       (#project/orrery); leaving them whole is right, because two notes under
       the same parent are not the same subject. */
    const fc = cache.getFileCache(f);
    const tags = fc ? getAllTags(fc) : null;
    return {
      links: links ? { ...links } : {},
      broken,
      tags: tags ? tags.map(t => t.replace(/^#/, '')) : [],
      /* When the file was last written, which is not the same question as the
         date inside it. A note's front matter says when the thing it describes
         happened; the file system says when the person last had their hands on
         it. The engine had only the first, so it could draw a vault's history
         and not its present — a note rewritten this morning and one untouched
         since 2022 were the same object if their dates matched.

         Obsidian has both stats already, for free, on every TFile. */
      mtime: f.stat.mtime,
      ctime: f.stat.ctime,
    };
  }
}

/** Named once. It is what Obsidian shows the user in Settings → Core plugins →
    Page preview, so it has to be stable across releases. */
export const HOVER_SOURCE = 'vault-orrery';
