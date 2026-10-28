import { App, Notice, TFile, WorkspaceLeaf, getAllTags, setIcon } from 'obsidian';
import { createOrrery, ENGINE_HTML } from './engine.generated.js';
import type { OrreryApi, OrreryFile, OrreryFileMeta, OrreryStore } from './engine.generated.js';
import type VaultOrreryPlugin from './main';

/* The half of hosting the engine that every surface shares: the leaf view,
   the sidebar mini and the Bases view all mount the same page into a box,
   hand it the same hooks, and feed it notes in the same shape. Kept here so
   that there is one answer to "what does Obsidian tell the engine about a
   note", and a Bases view cannot quietly drift from the full view's. */

/** How many of a note's dead links travel with it. The inspector lists a
    handful and says how many more there were, so the rest would be carried
    across the whole vault to be counted and thrown away. */
const BROKEN_NAME_CAP = 24;

/** How many front-matter keys travel with a note. The inspector shows a
    dozen and a vault of ten thousand notes carries every one of these. */
const PROP_CAP = 24;

/** Named once. It is what Obsidian shows the user in Settings → Core plugins →
    Page preview, so it has to be stable across releases. */
export const HOVER_SOURCE = 'vault-orrery';

/** Mount the engine's markup into `root` and start it. Throws if the engine
    cannot start; the caller decides what to show instead. */
export function mountEngine(root: HTMLElement, store: OrreryStore, mini: boolean): OrreryApi {
  /* ENGINE_HTML is a build-time constant with no user data in it, so innerHTML
     would be safe here — but DOMParser is safe by construction rather than by
     argument, and it does not run scripts. Cheaper to reason about, and one
     less thing for a reviewer to have to take on trust. */
  const doc = new DOMParser().parseFromString(ENGINE_HTML, 'text/html');
  while (doc.body.firstChild) root.appendChild(doc.body.firstChild);
  const api = createOrrery(root, store, { mini });
  /* Before anything is drawn: the vault here is the one the plugin is
     installed in, so the engine's own way of asking for a folder has to be
     gone by the first paint rather than dismissed after it. */
  api.setHosted(true);
  return api;
}

/** Draw one of Obsidian's icons into an element the engine owns. The engine
    names its first choice first and older names after it — Lucide has renamed
    a few — and the first one Obsidian knows is the one drawn. False, and the
    element left empty, when it knows none; the engine then keeps its glyph. */
export function hostIcon(el: HTMLElement, names: string[]): boolean {
  for (const n of names) {
    setIcon(el, n);
    if (el.querySelector('svg')) return true;
    el.empty();
  }
  return false;
}

/** Open a note from the cosmos. The default lands it beside the orrery
    rather than on top of it: replacing the orrery's own leaf with the note
    would close the very view the click came from, which is never what a
    click on a planet means. `from` is that leaf, or null when the engine is
    not in a leaf of its own (a Bases view inside a note). */
export async function openNoteFrom(app: App, from: WorkspaceLeaf | null, path: string,
                                   opts: { newLeaf: boolean; newWindow: boolean }) {
  const file = app.vault.getAbstractFileByPath(path);
  if (!(file instanceof TFile)) {
    new Notice(`Vault Orrery: ${path} is no longer in the vault.`);
    return;
  }
  const ws = app.workspace;
  let leaf: WorkspaceLeaf;
  if (opts.newWindow) leaf = ws.getLeaf('window');
  else if (opts.newLeaf) leaf = ws.getLeaf('tab');
  else {
    const recent = ws.getMostRecentLeaf(ws.rootSplit);
    leaf = recent && recent !== from ? recent : ws.getLeaf('tab');
  }
  await leaf.openFile(file, { active: true });
}

/** Obsidian's own page preview, over an element the engine owns. The plugin
    registers itself as a hover source, so the user's "preview on hover"
    preference — including the Ctrl requirement — is honoured here as it is
    anywhere else. */
export function hoverNote(app: App, hoverParent: object, path: string, event: MouseEvent, el: HTMLElement) {
  app.workspace.trigger('hover-link', {
    event, source: HOVER_SOURCE, hoverParent, targetEl: el, linktext: path,
  });
}

/** The notes, in the shape the engine reads them. The text is read lazily
    through the plugin's shared cache, so two surfaces showing the same vault
    read it once between them. */
export function orreryFiles(plugin: VaultOrreryPlugin, files: TFile[]): OrreryFile[] {
  return files.map(f => ({
    path: f.path,
    file: { text: () => plugin.readText(f) },
    meta: metaFor(plugin.app, f),
  }));
}

/** What Obsidian already knows about a note, in the shape the engine reads.

    This is the difference between a graph that agrees with Obsidian's and
    one that quietly disagrees. The engine's own parser is a regular
    expression over the text: it cannot follow a link written through an
    alias, does not see an embed as a link, and only finds tags in the front
    matter. Obsidian has resolved all of it already, for the whole vault, in
    an index it keeps up to date — so inside the plugin that index is the
    answer and the parser is the fallback for the standalone page. */
export function metaFor(app: App, f: TFile): OrreryFileMeta {
  const cache = app.metadataCache;
  /* Both maps are keyed by source path and hold counts. Attachments and
     other non-markdown targets are in there too; the engine drops the ones
     it has no body for. */
  const links = cache.resolvedLinks[f.path];
  /* A dead link is the one fact about a note that is worth acting on the
     moment you see it, and a count on its own cannot be acted on: it says
     three of this note's links reach nothing and leaves you to go and find
     which three. The keys of the unresolved map are what was written, so
     they come along with the count.

     Capped, because nothing downstream lists more than a handful and a
     note pasted full of broken references should not be able to make the
     payload for a whole vault large on its own. */
  const unresolved = cache.unresolvedLinks[f.path];
  let broken = 0;
  const brokenNames: string[] = [];
  if (unresolved) for (const k in unresolved) {
    broken += unresolved[k];
    if (brokenNames.length < BROKEN_NAME_CAP) brokenNames.push(k);
  }
  /* getAllTags merges the front matter and the body, and returns them with
     the leading '#', which the engine strips. Nested tags arrive whole
     (#project/orrery); leaving them whole is right, because two notes under
     the same parent are not the same subject. */
  const fc = cache.getFileCache(f);
  const tags = fc ? getAllTags(fc) : null;
  /* ---- and whatever else the note keeps about itself ----
     Obsidian's Properties are a first-class part of a vault, and the
     orrery read four keys out of the front matter and discarded the rest.
     Passed as they were parsed, minus the one key Obsidian adds for its
     own bookkeeping: `position` is where the block sat in the file, which
     is a fact about the text and not about the subject.

     Scalars and flat lists only. Nothing downstream can render a nested
     map and the whole vault's worth of these travels together, so a note
     carrying an object graph in its front matter contributes its scalars
     and nothing else. */
  const props: Record<string, unknown> = {};
  const fm = fc?.frontmatter;
  if (fm) {
    let n = 0;
    for (const k in fm) {
      if (k === 'position' || n >= PROP_CAP) continue;
      const v = (fm as Record<string, unknown>)[k];
      if (v === null || v === undefined) continue;
      const ok = typeof v !== 'object' ||
        (Array.isArray(v) && v.every(x => x === null || typeof x !== 'object'));
      if (!ok) continue;
      props[k] = v;
      n++;
    }
  }
  return {
    links: links ? { ...links } : {},
    broken,
    brokenNames,
    tags: tags ? tags.map(t => t.replace(/^#/, '')) : [],
    props,
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
