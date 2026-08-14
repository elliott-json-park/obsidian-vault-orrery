/* Hand-written types for the generated engine.

   This sits beside engine.generated.js so TypeScript uses it instead of
   inferring from 7,000 lines of untyped JavaScript. The generated file is
   disposable; this is the contract it is held to, and a drift between the two
   surfaces as a compile error, which is the point of writing it out.

   The engine's source of truth is vault-orrery-v2.html. If a method changes
   there, change it here too. */

export declare const ENGINE_HTML: string;

/** Where the engine keeps its own preferences. The standalone page uses
    localStorage; inside a plugin the host supplies this instead, backed by
    Obsidian's plugin data. Both halves are synchronous because the engine
    reads its state while it is starting up — the host hydrates the store
    before handing it over, and writes back on its own schedule. */
export interface OrreryStore {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

/** A file for the engine to read. Duck-typed to match the browser's File, so
    the same engine takes a drag-and-drop in the standalone page and a TFile
    from the vault here. */
export interface OrreryFile {
  path: string;
  file: { text(): Promise<string> };
  /** What the host already knows about this file. Obsidian has resolved every
      link in the vault — through aliases, headings, block ids and embeds — and
      indexed the tags written in the body as well as in the front matter. The
      engine's own parser is a regular expression over the text and gets a
      worse answer, so where this is supplied it wins. Optional: the standalone
      page has no host and parses for itself. */
  meta?: OrreryFileMeta;
}

export interface OrreryFileMeta {
  /** Resolved outgoing links, as vault paths mapped to how many times this
      file refers to each. The shape of Obsidian's resolvedLinks[path]. */
  links?: Record<string, number>;
  /** How many of this file's links resolve to nothing. */
  broken?: number;
  /** Tags, with or without the leading '#', body and front matter alike. */
  tags?: string[];
}

/** Which mode a host command switches on. The engine owns what each one does;
    this is only the list, so a host can offer them in its own palette. */
export type OrreryCommand =
  | 'search' | 'mindmap' | 'ship' | 'surface' | 'genesis' | 'twins'
  | 'ripple' | 'poster' | 'layer' | 'sound' | 'reset' | 'hud' | 'open' | 'help';

/** What the host can do that a web page cannot. Every hook is optional, and an
    affordance whose hook is missing is not drawn at all rather than drawn and
    then inert. */
export interface OrreryHostHooks {
  /** Open this note in the editor. `path` is the vault path the host gave. */
  open?(path: string, opts: { newLeaf: boolean; newWindow: boolean }): void;
  /** Offer the host's own hover preview over an element the engine owns. */
  hover?(path: string, event: MouseEvent, el: HTMLElement): void;
}

export interface OrreryApi {
  /** State of the run gate, for the diagnostics command. */
  debug(): { running: boolean; host: boolean; raf: number; hidden: boolean;
             frames: number; nodes: number };
  /** Declare that the vault is the host's, not the user's to pick. Drops the
      intro screen, the folder picker, the drop target and the clear button —
      all of which describe a choice that does not exist inside a plugin. Call
      before load(). */
  setHosted(on: boolean): void;
  /** On-screen or not. False suspends rendering, physics and audio. */
  setVisible(on: boolean): void;
  /** Obsidian's userIgnoreFilters, verbatim: path prefixes, or /regex/. */
  setIgnoreFilters(list: string[]): void;
  setLang(lang: 'ko' | 'en' | 'ja' | 'zh'): void;
  /** 0 means no ceiling. */
  setMaxNodes(n: number): void;
  /** The engine applies its own exclusion and cap gates, so hand it
      everything and let one set of rules decide.

      `quiet` is a rebuild the user did not ask for — a note saved while the
      view is open. It keeps the camera where it is, restores the selection by
      path, and shows neither the loading curtain nor the summary. */
  load(files: OrreryFile[], vaultName?: string,
       opts?: { quiet?: boolean }): Promise<void>;
  clear(): void;
  /** Hand the engine the things only a host can do. */
  setHostHooks(hooks: OrreryHostHooks): void;
  /** Put the camera on the note at this path. False if that note is not in
      the cosmos on screen — excluded, or past the node ceiling. */
  revealPath(path: string, opts?: { select?: boolean }): boolean;
  /** The note being edited, marked in the sky while the camera goes
      elsewhere. Empty string clears it. */
  setActivePath(path: string): void;
  /** True while a vault is being read. */
  busy(): boolean;
  commands(): OrreryCommand[];
  /** Run one. False if the engine does not have a command by that name. */
  command(name: OrreryCommand): boolean;
  /** Re-measure against the container. Call when the leaf changes size. */
  resize(): void;
  destroy(): void;
  readonly root: HTMLElement;
}

export declare function createOrrery(root: HTMLElement, store?: OrreryStore): OrreryApi;
