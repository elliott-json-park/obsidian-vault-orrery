/* Hand-written types for the generated engine.

   This sits beside engine.generated.js so TypeScript uses it instead of
   inferring from 7,000 lines of untyped JavaScript. The generated file is
   disposable; this is the contract it is held to, and a drift between the two
   surfaces as a compile error, which is the point of writing it out.

   The engine's source of truth is vault-orrery-v2.html. If a method changes
   there, change it here too. */

export declare const ENGINE_CSS: string;
export declare const ENGINE_HTML: string;

/** A file for the engine to read. Duck-typed to match the browser's File, so
    the same engine takes a drag-and-drop in the standalone page and a TFile
    from the vault here. */
export interface OrreryFile {
  path: string;
  file: { text(): Promise<string> };
}

export interface OrreryApi {
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
      everything and let one set of rules decide. */
  load(files: OrreryFile[], vaultName?: string): Promise<void>;
  clear(): void;
  /** Re-measure against the container. Call when the leaf changes size. */
  resize(): void;
  destroy(): void;
  readonly root: HTMLElement;
}

export declare function createOrrery(root: HTMLElement): OrreryApi;
