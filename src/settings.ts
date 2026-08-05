import { App, PluginSettingTab, Setting } from 'obsidian';
import type VaultOrreryPlugin from './main';

export type Lang = 'auto' | 'ko' | 'en' | 'ja' | 'zh';

export interface OrrerySettings {
  language: Lang;
  /** 0 = no ceiling. */
  maxNodes: number;
  /** Follow Settings → Files & Links → Excluded files. */
  followExcludedFiles: boolean;
  /** Extra patterns, same syntax as Obsidian's: a prefix, or /regex/. */
  extraIgnoreFilters: string[];
}

export const DEFAULT_SETTINGS: OrrerySettings = {
  language: 'auto',
  maxNodes: 3000,
  followExcludedFiles: true,
  extraIgnoreFilters: [],
};

/* This tab is English-only, deliberately, even though the engine itself speaks
   four languages. Obsidian gives plugins no i18n facility for settings, and the
   pane this tab renders inside is English for most users regardless of vault
   language — a tab that localised itself would be the odd one out among its
   neighbours rather than the consistent one. The language a user actually reads
   the plugin in is chosen here and applies to the whole interface they then
   spend their time in. Revisit only if Obsidian ships a settings i18n API. */
export class OrrerySettingTab extends PluginSettingTab {
  constructor(app: App, private plugin: VaultOrreryPlugin) { super(app, plugin); }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('Language')
      .setDesc('Interface language. Your note and folder names are never translated.')
      .addDropdown(d => d
        .addOptions({ auto: 'Match Obsidian', ko: '한국어', en: 'English', ja: '日本語', zh: '中文' })
        .setValue(this.plugin.settings.language)
        .onChange(async v => {
          this.plugin.settings.language = v as Lang;
          await this.plugin.saveSettings();
          this.plugin.pushSettingsToViews();
        }));

    new Setting(containerEl)
      .setName('Maximum notes')
      .setDesc('A ceiling on how many notes are drawn at once. Large vaults run a ' +
               'spring simulation over every body, so this is where performance is ' +
               'traded for completeness. Set to 0 for no limit. When the ceiling ' +
               'truncates a vault, the view says so rather than showing a partial ' +
               'cosmos as if it were the whole one.')
      .addSlider(s => s
        .setLimits(0, 10000, 500)
        .setValue(this.plugin.settings.maxNodes)
        .setDynamicTooltip()
        .onChange(async v => {
          this.plugin.settings.maxNodes = v;
          await this.plugin.saveSettings();
          this.plugin.pushSettingsToViews();
        }));

    new Setting(containerEl)
      .setName('Respect excluded files')
      .setDesc('Hide the notes listed under Settings → Files & Links → Excluded files, ' +
               'exactly as Obsidian\'s own graph does. Turning this off will show ' +
               'notes you have hidden elsewhere.')
      .addToggle(t => t
        .setValue(this.plugin.settings.followExcludedFiles)
        .onChange(async v => {
          this.plugin.settings.followExcludedFiles = v;
          await this.plugin.saveSettings();
          this.plugin.pushSettingsToViews();
        }));

    new Setting(containerEl)
      .setName('Additional exclusions')
      .setDesc('One pattern per line, on top of Obsidian\'s. A plain path is treated ' +
               'as a prefix (archive hides archive/ and archive.md); a pattern wrapped ' +
               'in slashes is a regular expression (/^\\d{4}-/).')
      .addTextArea(t => {
        t.setPlaceholder('archive\n/^\\d{4}-/')
          .setValue(this.plugin.settings.extraIgnoreFilters.join('\n'))
          .onChange(async v => {
            this.plugin.settings.extraIgnoreFilters =
              v.split('\n').map(s => s.trim()).filter(Boolean);
            await this.plugin.saveSettings();
            this.plugin.pushSettingsToViews();
          });
        t.inputEl.rows = 4;
        t.inputEl.style.width = '100%';
      });

    containerEl.createEl('h3', { text: 'Privacy' });
    const p = containerEl.createEl('p', { cls: 'setting-item-description' });
    p.append(
      'This plugin makes no network requests of any kind. Hand tracking is off ' +
      'by default; when you enable it, video frames are read in memory and ' +
      'discarded, never stored or transmitted, and the model that reads them is ' +
      'bundled with the plugin rather than downloaded. The camera is suspended ' +
      'whenever the view is not on screen.');
  }
}
