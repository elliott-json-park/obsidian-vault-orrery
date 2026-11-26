import { App, PluginSettingTab, Setting } from 'obsidian';
import type { SettingDefinitionItem, SettingGroupItem } from 'obsidian';
import type VaultOrreryPlugin from './main';
import type { FloatFrame, FloatRect } from './float';

export type Lang = 'auto' | 'ko' | 'en' | 'ja' | 'zh';

const LANGS: readonly Lang[] = ['auto', 'ko', 'en', 'ja', 'zh'];
const isLang = (v: unknown): v is Lang =>
  typeof v === 'string' && (LANGS as readonly string[]).includes(v);

export interface OrrerySettings {
  /** The one-time star request after an update (star.ts). */
  starAsk?: import('./star').StarState;
  language: Lang;
  /** 0 = no ceiling. */
  maxNodes: number;
  /** Unlinked notes stay in their folder's system rather than the archives. */
  looseInFolder: boolean;
  /** Re-derive the cosmos when the vault changes under an open view. */
  liveSync: boolean;
  /** Move the camera to whatever note is being edited. */
  followActiveNote: boolean;
  /** Follow Settings → Files & Links → Excluded files. */
  followExcludedFiles: boolean;
  /** Extra patterns, same syntax as Obsidian's: a prefix, or /regex/. */
  extraIgnoreFilters: string[];
  /** Whether the mini orrery has been put in the sidebar once (2.0.0). */
  miniOffered: boolean;
  /** The floating orrery is shown, and comes back on the next start. */
  floatOn: boolean;
  /** How close its camera sits. */
  floatFrame: FloatFrame;
  /** Where it was left, in window pixels. Null until it has been moved. */
  floatRect: FloatRect | null;
  /** A fine zoom on top of the frame, set from the float's own panel. 1 is
      the frame as named; smaller is closer. Picking a frame resets it. */
  floatZoom: number;
  /** Knobs the float's panel has moved away from the full view's deck, by
      engine knob key. A key absent here follows the deck. */
  floatTune: Record<string, number>;
  /** The float's link layer: every link, or none. */
  floatLinks: boolean;
  /** The whole float, from 0.2 (faint) to 1. */
  floatOpacity: number;
  /** Stopped on its last frame: no drawing, no motion. */
  floatPaused: boolean;
  /** No grip or resize corner, so it cannot be moved by accident. */
  floatLocked: boolean;
  /** The engine's own preferences — panel sizes, radar size, its language
      chip. The standalone page keeps these in localStorage; inside a plugin
      they belong in the plugin's data file, so they live in the vault and
      leave with the plugin. Opaque to this file: the engine owns both the
      keys and the encoding. */
  engineStore: Record<string, string>;
}

export const DEFAULT_SETTINGS: OrrerySettings = {
  language: 'auto',
  /* No ceiling, which is what the engine's own MAX NODES knob ships at. The
     two used to disagree — the engine said NO LIMIT, this said 3000, and the
     plugin pushes its value into the engine at mount, so the knob's own
     default was never the one anybody got. A cap that quietly drops half a
     vault answers 'show me my notes' with a subset; a slow first minute is at
     least a problem whose cause is visible, and the slider is right there. */
  maxNodes: 0,
  looseInFolder: false,
  liveSync: true,
  /* Off by default. Following is a strong opinion about where the camera
     should be — right for a view kept open beside the editor, wrong for one
     you are flying through — and the wrong default here takes the controls
     out of the user's hands every time they switch note. */
  followActiveNote: false,
  followExcludedFiles: true,
  extraIgnoreFilters: [],
  miniOffered: false,
  floatOn: false,
  floatFrame: 'medium',
  floatRect: null,
  floatZoom: 1,
  floatTune: {},
  floatLinks: true,
  floatOpacity: 1,
  floatPaused: false,
  floatLocked: false,
  engineStore: {},
};

const FRAMES: readonly FloatFrame[] = ['close', 'medium', 'whole'];
const isFrame = (v: unknown): v is FloatFrame =>
  typeof v === 'string' && (FRAMES as readonly string[]).includes(v);

/** The settings this tab edits. The engine's own store is not among them: it is
    written by the engine, not by a human, and has no place in settings search. */
type Key = 'language' | 'maxNodes' | 'looseInFolder' | 'liveSync' | 'followActiveNote'
         | 'followExcludedFiles' | 'extraIgnoreFilters' | 'showMini'
         | 'showFloat' | 'floatFrame';

/* This tab is English-only, deliberately, even though the engine itself speaks
   four languages. Obsidian gives plugins no i18n facility for settings, and the
   pane this tab renders inside is English for most users regardless of vault
   language — a tab that localised itself would be the odd one out among its
   neighbours rather than the consistent one. The language a user actually reads
   the plugin in is chosen here and applies to the whole interface they then
   spend their time in. Revisit only if Obsidian ships a settings i18n API. */
export class OrrerySettingTab extends PluginSettingTab {
  constructor(app: App, private plugin: VaultOrreryPlugin) { super(app, plugin); }

  /* Declared rather than drawn, so that from Obsidian 1.13.0 these settings are
     indexed by the settings search and a user looking for "excluded" finds this
     tab without knowing the plugin has an opinion about it. display() below
     renders the same declarations for older versions. */
  getSettingDefinitions(): SettingDefinitionItem<Key>[] {
    return [
      {
        name: 'Language',
        desc: 'Interface language. Your note and folder names are never translated.',
        aliases: ['한국어', '日本語', '中文', 'locale', 'translation'],
        control: {
          type: 'dropdown',
          key: 'language',
          options: { auto: 'Match Obsidian', ko: '한국어', en: 'English', ja: '日本語', zh: '中文' },
          defaultValue: DEFAULT_SETTINGS.language,
        },
      },
      {
        name: 'Maximum notes',
        desc: 'A ceiling on how many notes are drawn at once. Large vaults run a ' +
              'spring simulation over every body, so this is where performance is ' +
              'traded for completeness. Set to 0 for no limit. When the ceiling ' +
              'truncates a vault, the view says so rather than showing a partial ' +
              'cosmos as if it were the whole one.',
        aliases: ['performance', 'limit', 'large vault'],
        control: {
          type: 'slider',
          key: 'maxNodes',
          min: 0,
          max: 10000,
          step: 500,
          defaultValue: DEFAULT_SETTINGS.maxNodes,
        },
      },
      {
        name: 'Unlinked notes stay in their folder',
        desc: 'By default a note that no other note links to is filed in a ' +
              'yearly archive system, so folders whose notes are not linked ' +
              'do not appear as star systems. Turn this on to keep every note ' +
              'in its own folder\'s system. Notes listed in another note\'s ' +
              '"sources" stay its moons either way. Has no effect in a vault ' +
              'with raw/ and wiki/ folders, where those folders decide.',
        aliases: ['archive', 'folder', 'missing folders', 'star systems'],
        control: {
          type: 'toggle',
          key: 'looseInFolder',
          defaultValue: DEFAULT_SETTINGS.looseInFolder,
        },
      },
      {
        type: 'group',
        heading: 'The editor',
        items: [
          {
            name: 'Mini orrery in the sidebar',
            desc: 'Keep a small, quiet copy of the cosmos in the right sidebar. It drifts ' +
                  'on its own, marks the note you are editing, and opens a note when you ' +
                  'click its planet. It draws at a third of the full view\'s frame rate ' +
                  'with the light effects off, and stops entirely while the sidebar is ' +
                  'closed.',
            aliases: ['sidebar', 'mini', 'ambient', 'background', 'widget'],
            control: {
              type: 'toggle',
              key: 'showMini',
              defaultValue: true,
            },
          },
          {
            name: 'Floating orrery',
            desc: 'Hang the cosmos over the workspace with its sky taken away, so only ' +
                  'the suns, planets and their light are left, turning. It ignores clicks, ' +
                  'which go through to the note underneath. Point at it to bring up a grip ' +
                  'to move it, a corner to resize it and a button to hide it. Right-click ' +
                  'it for its own zoom, speed, light and orbit settings; anything left ' +
                  'untouched there follows the full view\'s control deck.',
            aliases: ['float', 'overlay', 'transparent', 'sticker', 'widget', 'always on top'],
            control: {
              type: 'toggle',
              key: 'showFloat',
              defaultValue: DEFAULT_SETTINGS.floatOn,
            },
          },
          {
            name: 'Floating orrery frame',
            desc: 'How close the floating orrery\'s camera sits.',
            aliases: ['float', 'zoom', 'overlay'],
            control: {
              type: 'dropdown',
              key: 'floatFrame',
              options: { close: 'Close: the central star', medium: 'Medium: its neighbours', whole: 'Whole: every system' },
              defaultValue: DEFAULT_SETTINGS.floatFrame,
            },
          },
          {
            name: 'Keep up with the vault',
            desc: 'Re-derive the cosmos when notes are written, created, renamed or ' +
                  'deleted while the view is open. The camera and the selection stay ' +
                  'where they are. Turn this off on a very large vault, where each ' +
                  'rebuild reads every note again; the Reload vault command then does ' +
                  'it on request.',
            aliases: ['live', 'refresh', 'update', 'watch'],
            control: {
              type: 'toggle',
              key: 'liveSync',
              defaultValue: DEFAULT_SETTINGS.liveSync,
            },
          },
          {
            name: 'Follow the active note',
            desc: 'Move the camera to whichever note you open in the editor. Left off, ' +
                  'the note being edited is still marked in the sky — the camera simply ' +
                  'stays where you put it, and "Reveal the active note in the orrery" ' +
                  'flies to it on request.',
            aliases: ['sync', 'active file', 'follow'],
            control: {
              type: 'toggle',
              key: 'followActiveNote',
              defaultValue: DEFAULT_SETTINGS.followActiveNote,
            },
          },
        ],
      },
      {
        type: 'group',
        heading: 'Exclusions',
        cls: 'vault-orrery-exclusions',
        items: [
          {
            name: 'Respect excluded files',
            desc: 'Hide the notes listed under Settings → Files & Links → Excluded files, ' +
                  'exactly as Obsidian\'s own graph does. Turning this off will show ' +
                  'notes you have hidden elsewhere.',
            aliases: ['hidden', 'ignore', 'userIgnoreFilters'],
            control: {
              type: 'toggle',
              key: 'followExcludedFiles',
              defaultValue: DEFAULT_SETTINGS.followExcludedFiles,
            },
          },
          {
            name: 'Additional exclusions',
            desc: 'One pattern per line, on top of Obsidian\'s. A plain path is treated ' +
                  'as a prefix (archive hides archive/ and archive.md); a pattern wrapped ' +
                  'in slashes is a regular expression (/^\\d{4}-/).',
            aliases: ['ignore', 'filter', 'regex'],
            control: {
              type: 'textarea',
              key: 'extraIgnoreFilters',
              placeholder: 'archive\n/^\\d{4}-/',
              rows: 4,
              defaultValue: '',
            },
          },
        ],
      },
      {
        type: 'group',
        heading: 'Privacy',
        items: [
          {
            name: 'Network access',
            desc: 'This plugin makes no network requests of any kind — no telemetry, no ' +
                  'update check, no remote fonts or scripts. Your notes are read, laid out ' +
                  'and drawn entirely on this machine, and nothing about them is stored ' +
                  'outside the vault.',
            aliases: ['telemetry', 'offline', 'analytics'],
          },
        ],
      },
    ];
  }

  /* The tab's own storage is the plugin's data file, and one of the four values
     is not stored in the shape its control edits: a textarea hands back a
     string, while the filter list is a list. Both directions of that conversion
     belong here, so the definitions above can stay declarative. */
  getControlValue(key: string): unknown {
    const s = this.plugin.settings;
    switch (key as Key) {
      case 'language': return s.language;
      case 'maxNodes': return s.maxNodes;
      case 'looseInFolder': return s.looseInFolder;
      case 'liveSync': return s.liveSync;
      case 'followActiveNote': return s.followActiveNote;
      case 'followExcludedFiles': return s.followExcludedFiles;
      case 'extraIgnoreFilters': return s.extraIgnoreFilters.join('\n');
      /* Not stored: the workspace is the record of whether it is open. */
      case 'showMini': return this.plugin.miniOpen();
      case 'showFloat': return s.floatOn;
      case 'floatFrame': return s.floatFrame;
      default: return undefined;
    }
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    const s = this.plugin.settings;
    switch (key as Key) {
      case 'language':
        /* Checked rather than asserted: the value arrives as unknown, and a
           dropdown is not the only thing that can reach this method. */
        if (!isLang(value)) return;
        s.language = value;
        break;
      case 'maxNodes': {
        const n = Number(value);
        if (!Number.isFinite(n)) return;
        s.maxNodes = n;
        break;
      }
      case 'looseInFolder':
        s.looseInFolder = Boolean(value);
        break;
      case 'liveSync':
        s.liveSync = Boolean(value);
        break;
      case 'followActiveNote':
        s.followActiveNote = Boolean(value);
        break;
      case 'followExcludedFiles':
        s.followExcludedFiles = Boolean(value);
        break;
      case 'extraIgnoreFilters':
        s.extraIgnoreFilters = String(value).split('\n').map(p => p.trim()).filter(Boolean);
        break;
      case 'showMini':
        if (value) await this.plugin.openMini(true);
        else this.plugin.closeMini();
        this.plugin.syncWidgets();
        return;
      case 'showFloat':
        await this.plugin.setFloat(Boolean(value));
        return;
      case 'floatFrame':
        if (!isFrame(value)) return;
        s.floatFrame = value;
        s.floatZoom = 1;
        this.plugin.floatFrameChanged();
        break;
      default:
        return;
    }
    await this.plugin.saveSettings();
    this.plugin.pushSettingsToViews();
  }

  /* Fallback for Obsidian older than 1.13.0, which has no declarative renderer.
     Obsidian 1.13.0 and later ignore this method entirely, because
     getSettingDefinitions() returns a non-empty array. It renders those same
     definitions rather than a second copy of them, so the two paths cannot
     drift apart. */
  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    for (const item of this.getSettingDefinitions()) {
      if ('type' in item && item.type === 'group') {
        if (item.heading) new Setting(containerEl).setName(item.heading).setHeading();
        const host = item.cls ? containerEl.createDiv({ cls: item.cls }) : containerEl;
        for (const child of item.items ?? []) this.renderFallback(host, child);
      } else if (!('type' in item)) {
        this.renderFallback(containerEl, item);
      }
    }
  }

  private renderFallback(host: HTMLElement, def: SettingGroupItem<Key>): void {
    /* Sub-pages are a 1.13.0 affordance and this tab declares none. */
    if ('type' in def) return;

    const setting = new Setting(host).setName(def.name);
    if (typeof def.desc === 'string') setting.setDesc(def.desc);

    const control = def.control;
    if (!control) return;

    const value = this.getControlValue(control.key);
    const commit = (v: unknown) => { void this.setControlValue(control.key, v); };

    switch (control.type) {
      case 'dropdown':
        setting.addDropdown(d => d
          .addOptions(control.options)
          .setValue(String(value))
          .onChange(commit));
        break;
      case 'slider':
        setting.addSlider(s => s
          .setLimits(control.min, control.max, control.step)
          .setValue(Number(value))
          .onChange(commit));
        break;
      case 'toggle':
        setting.addToggle(t => t
          .setValue(Boolean(value))
          .onChange(commit));
        break;
      case 'textarea':
        setting.addTextArea(t => {
          if (control.placeholder) t.setPlaceholder(control.placeholder);
          t.setValue(String(value)).onChange(commit);
          if (control.rows) t.inputEl.rows = control.rows;
        });
        break;
    }
  }
}
