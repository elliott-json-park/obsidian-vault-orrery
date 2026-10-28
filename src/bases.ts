import { BasesView, TFile } from 'obsidian';
import type { QueryController } from 'obsidian';
import type { OrreryApi } from './engine.generated.js';
import { mountEngine, hostIcon, openNoteFrom, hoverNote, orreryFiles } from './host';
import type VaultOrreryPlugin from './main';

/* An Orrery view for Bases.

   A Base is a question asked of the vault — these notes, filtered and sorted
   — and its views are ways of looking at the answer: a table, cards, a list.
   This adds the cosmos. The notes the Base selects are the whole vault the
   engine is handed, so a Base of one project's notes is drawn as that
   project's star systems and nothing else, and the filters in the toolbar
   are the way to carve the vault before it is drawn — which the orrery has
   never had a way to do on its own.

   The same engine, mounted the same way as the full view: hosted, with the
   hooks that make a planet a note you can open. What differs is only where
   the files come from — `this.data`, re-supplied by Bases whenever the vault
   or the query changes — and that the view is a Component inside Bases'
   container rather than a leaf of its own. */

export const BASES_VIEW_TYPE = 'vault-orrery';

/** How long a data update waits when the engine is still reading the last
    one. Bases re-queries on every vault event, so a burst of saves is a
    burst of updates, and the engine should take one reload for the lot. */
const RETRY_MS = 600;

/** Register the view. The plugin's minAppVersion is 1.10.0, where Bases
    gained a plugin API, so this is expected to succeed; the guard stays
    because a plugin folder copied by hand onto an older Obsidian would
    otherwise throw at `extends BasesView` and take the whole plugin down.
    Returns false where it could not register. */
export function registerOrreryBasesView(plugin: VaultOrreryPlugin): boolean {
  if (typeof BasesView !== 'function' || typeof plugin.registerBasesView !== 'function') return false;

  class OrreryBasesView extends BasesView {
    type = BASES_VIEW_TYPE;
    private api: OrreryApi | null = null;
    private ro: ResizeObserver | null = null;
    private root: HTMLElement | null = null;
    /** True once the first vault has been drawn; later updates are quiet. */
    private drawn = false;
    private retry = 0;

    constructor(controller: QueryController, private hostEl: HTMLElement) {
      super(controller);
    }

    onload() {
      const host = this.hostEl;
      host.empty();
      host.addClass('vault-orrery-host');
      host.addClass('vault-orrery-bases');
      const root = host.createDiv({ cls: 'vo-root' });
      this.root = root;
      try {
        this.api = mountEngine(root, plugin.engineStore(), false);
      } catch (e) {
        console.error('Vault Orrery: engine failed to start in a Base', e);
        host.empty();
        host.createEl('p', { text: 'Vault Orrery could not start. See the developer console for details.' });
        return;
      }
      /* No leaf of our own to keep clear of: a click opens the note in the
         most recent leaf, as the full view does from a planet. */
      this.api.setHostHooks({
        open: (path, opts) => { void openNoteFrom(plugin.app, null, path, opts); },
        hover: (path, event, el) => hoverNote(plugin.app, this, path, event, el),
        icon: hostIcon,
      });
      plugin.applySettingsTo(this.api);
      /* Bases gives the container no box until it is laid out, and a Base
         embedded in a note comes and goes with the scroll. "Has a box" is
         the reading of "is being displayed" that the leaf view relies on
         too, and it is what stops a hidden Base drawing for nobody. */
      this.ro = new ResizeObserver(() => {
        this.api?.resize();
        this.api?.setVisible(root.offsetWidth > 0 && root.offsetHeight > 0);
      });
      this.ro.observe(root);
      const f = plugin.app.workspace.getActiveFile();
      this.api.setActivePath(f && f.extension === 'md' ? f.path : '');
    }

    onDataUpdated() {
      if (!this.api) return;
      window.clearTimeout(this.retry);
      /* a reload while one is running would interleave two reads of the
         vault; wait for the one in flight and then do exactly one more */
      if (this.api.busy()) {
        this.retry = window.setTimeout(() => this.onDataUpdated(), RETRY_MS);
        return;
      }
      const files: TFile[] = [];
      for (const e of this.data.data) {
        if (e.file instanceof TFile && e.file.extension === 'md') files.push(e.file);
      }
      plugin.pruneTexts(plugin.app.vault.getMarkdownFiles());
      const name = this.config.name || plugin.app.vault.getName();
      void this.api.load(orreryFiles(plugin, files), name, { quiet: this.drawn });
      this.drawn = true;
    }

    onunload() {
      window.clearTimeout(this.retry);
      this.ro?.disconnect(); this.ro = null;
      this.api?.destroy(); this.api = null;
      this.root = null;
      this.hostEl.empty();
      plugin.releaseTexts();
    }
  }

  return plugin.registerBasesView(BASES_VIEW_TYPE, {
    name: 'Orrery',
    icon: 'orbit',
    factory: (controller, containerEl) => new OrreryBasesView(controller, containerEl),
  });
}
