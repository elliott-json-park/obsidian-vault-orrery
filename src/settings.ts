import { App, PluginSettingTab, Setting } from 'obsidian';
import type { SettingDefinitionItem, SettingGroupItem } from 'obsidian';
import type VaultOrreryPlugin from './main';

export type Lang = 'auto' | 'ko' | 'en' | 'ja' | 'zh';

const LANGS: readonly Lang[] = ['auto', 'ko', 'en', 'ja', 'zh'];
const isLang = (v: unknown): v is Lang =>
  typeof v === 'string' && (LANGS as readonly string[]).includes(v);

export interface OrrerySettings {
  language: Lang;
  /** 0 = no ceiling. */
  maxNodes: number;
  /** Follow Settings → Files & Links → Excluded files. */
  followExcludedFiles: boolean;
  /** Extra patterns, same syntax as Obsidian's: a prefix, or /regex/. */
  extraIgnoreFilters: string[];
  /** The engine's own preferences — panel sizes, radar size, its language
      chip. The standalone page keeps these in localStorage; inside a plugin
      they belong in the plugin's data file, so they live in the vault and
      leave with the plugin. Opaque to this file: the engine owns both the
      keys and the encoding. */
  engineStore: Record<string, string>;
}

export const DEFAULT_SETTINGS: OrrerySettings = {
  language: 'auto',
  maxNodes: 3000,
  followExcludedFiles: true,
  extraIgnoreFilters: [],
  engineStore: {},
};

/** The settings this tab edits. The engine's own store is not among them: it is
    written by the engine, not by a human, and has no place in settings search. */
type Key = 'language' | 'maxNodes' | 'followExcludedFiles' | 'extraIgnoreFilters';

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
      case 'followExcludedFiles': return s.followExcludedFiles;
      case 'extraIgnoreFilters': return s.extraIgnoreFilters.join('\n');
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
      case 'followExcludedFiles':
        s.followExcludedFiles = Boolean(value);
        break;
      case 'extraIgnoreFilters':
        s.extraIgnoreFilters = String(value).split('\n').map(p => p.trim()).filter(Boolean);
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
