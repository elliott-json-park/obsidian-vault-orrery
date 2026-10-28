/* Loads the built bundle against a stand-in Obsidian API and checks that the
   plugin registers itself and that settings — above all the exclusion filters —
   actually reach the engine. Not a substitute for running it in Obsidian; it is
   the part that can be checked without a GPU. Run: npm test */

const Module = require('module'), path = require('path'), fs = require('fs');
const calls = [];
class Plugin {
  constructor(app, manifest) { this.app = app; this.manifest = manifest; }
  registerView(t) { calls.push('registerView:' + t); }
  addRibbonIcon() { calls.push('ribbon'); return {}; }
  addCommand(c) { calls.push('command:' + c.id); }
  addSettingTab(t) { calls.push('settingTab'); this._tab = t; }
  registerEvent() { calls.push('event'); }
  registerHoverLinkSource(id) { calls.push('hover:' + id); }
  /* Bases, as 1.10.0 and later have it. The stub records the registration
     and keeps the factory, so the view can be built and fed below. */
  registerBasesView(id, reg) { calls.push('basesView:' + id); this._bases = reg; return true; }
  register() {}
  async loadData() { return this._data ?? null; }
  async saveData(d) { this._data = d; }
}
/* debounce() here fires immediately and keeps the .cancel() the plugin calls,
   so a write scheduled by the store is observable within one tick. */
const debounce = fn => Object.assign((...a) => fn(...a), { cancel() { return this; } });
/* TFile here is a class the test can instantiate, so the Bases view's
   instanceof check and the report's file walk both see real files. */
class TFile { constructor(path, stat) { this.path = path; this.stat = stat || { ctime: 0, mtime: 0 };
  this.extension = path.split('.').pop(); this.basename = path.split('/').pop().replace(/\.md$/, ''); } }
const stub = { Plugin, ItemView: class {}, PluginSettingTab: class {}, Setting: class {},
  Notice: class {}, TFile, WorkspaceLeaf: class {}, Menu: class {}, debounce,
  BasesView: class { constructor(controller) { this.controller = controller; } },
  getAllTags: c => (c && c.tags ? c.tags.map(t => t.tag) : []),
  addIcon: n => calls.push('icon:' + n), moment: { locale: () => 'ko' } };
const or = Module._resolveFilename;
Module._resolveFilename = function (r, ...a) { return r === 'obsidian' ? 'obsidian' : or.call(this, r, ...a); };
require.cache['obsidian'] = { id: 'obsidian', filename: 'obsidian', loaded: true, exports: stub };

const made = [];
global.window = { addEventListener() {}, removeEventListener() {} };
global.document = {
  head: { appendChild: el => made.push(el) },
  createElement: () => ({ style: {}, textContent: '', remove() {}, appendChild() {} }),
  addEventListener() {}, removeEventListener() {},
};

const P = require(path.resolve(__dirname, '..', 'main.js')).default;
const ok = (c, m) => { console.log((c ? '  ok  ' : 'FAIL  ') + m); if (!c) process.exitCode = 1; };
const mkApp = vault => ({
  vault: Object.assign({ getMarkdownFiles: () => [], getName: () => 'VAULT' }, vault),
  workspace: { on() {}, getLeavesOfType: () => [], getActiveFile: () => null,
               /* run at once: the stub has no layout to wait for, and the
                  first-run sidebar placement is what it is there to check */
               onLayoutReady: f => f(), getRightLeaf: () => null },
  metadataCache: { on() {}, resolvedLinks: {}, unresolvedLinks: {}, getFileCache: () => null },
});

(async () => {
  const p = new P(mkApp({ getConfig: k => k === 'userIgnoreFilters' ? ['journal', '/^\d{4}-/'] : null }),
                  { dir: '.obsidian/plugins/vault-orrery' });
  await p.onload();
  ok(calls.includes('registerView:vault-orrery-view'), 'registers the orrery view');
  ok(calls.includes('registerView:vault-orrery-mini'), 'registers the sidebar mini orrery');
  ok(calls.includes('command:open-mini'), 'the mini orrery can be opened from the palette');
  ok(p.settings.miniOffered === true, 'the mini is offered once, and the offer is remembered');
  ok(calls.some(c => c.startsWith('command:')), 'registers commands');
  ok(calls.includes('settingTab'), 'registers the settings tab');
  /* Every mode the engine answers to has to be reachable from the palette, or
     it exists only for someone who already knows the single-letter key. */
  const modes = ['open','search','mindmap','genesis',
                 'ripple','poster','card','layer','grid','sound','reset','hud','help'];
  const missing = modes.filter(m => !calls.includes('command:mode-' + m));
  ok(missing.length === 0, 'every engine mode is a command -> ' +
     (missing.length ? 'missing ' + missing.join(', ') : modes.length + ' of them'));
  ok(calls.includes('command:reveal-active'), 'the active note can be revealed from anywhere');
  ok(calls.includes('hover:vault-orrery'),
     'declares itself a hover source, so page preview can be turned off for it');
  ok(calls.includes('icon:orbit'), 'registers its icon');
  ok(calls.includes('basesView:vault-orrery'), 'registers an Orrery view for Bases');
  ok(p.basesRegistered === true && p._bases && p._bases.name === 'Orrery' && p._bases.icon === 'orbit',
     'the Bases view is named and has the orbit icon');
  ok(typeof p._bases.factory === 'function', 'the Bases view has a factory');
  ok(calls.includes('command:report-insert') && calls.includes('command:report-copy'),
     'the sky report can be inserted or copied from the palette');

  /* And on an Obsidian without Bases the plugin still loads: the view is
     built from a class that only exists on 1.10.0 and later, so this is
     the path that must not throw. */
  const hadBases = stub.BasesView;
  delete stub.BasesView;
  const pOld = new P(mkApp({}), { dir: 'x' });
  pOld.registerBasesView = undefined;
  await pOld.onload();
  ok(pOld.basesRegistered === false, 'an Obsidian without Bases loads the plugin without the view');
  stub.BasesView = hadBases;

  /* The sky report, against a small vault with known numbers. Three
     systems; two notes born this month, one of them in 'b'; one note that
     nothing links and that links to nothing; one dead link. */
  const now = new Date(2026, 9, 28), m0 = new Date(2026, 9, 1).getTime(), old = m0 - 86400000 * 40;
  const F = [new TFile('a/index.md', { ctime: old, mtime: old }),
             new TFile('a/one.md', { ctime: old, mtime: m0 + 1000 }),
             new TFile('b/two.md', { ctime: m0 + 1000, mtime: m0 + 1000 }),
             new TFile('b/three.md', { ctime: m0 + 2000, mtime: m0 + 2000 }),
             new TFile('alone.md', { ctime: old, mtime: old }),
             new TFile('hidden/x.md', { ctime: m0 + 3000, mtime: m0 + 3000 })];
  const appR = mkApp({ getMarkdownFiles: () => F, getName: () => 'TESTVAULT', getConfig: () => ['hidden'] });
  appR.metadataCache.resolvedLinks = {
    'a/one.md': { 'a/index.md': 2 }, 'b/two.md': { 'a/index.md': 1, 'b/three.md': 1 },
    'b/three.md': { 'a/index.md': 1, 'pic.png': 1 }, 'hidden/x.md': { 'a/index.md': 5 } };
  appR.metadataCache.unresolvedLinks = { 'b/two.md': { 'Nowhere': 1 } };
  const pR = new P(appR, { dir: 'x' });
  await pR.onload();
  const { skyReport, renderReport } = require(path.resolve(__dirname, '..', 'main.js')).__test;
  const r = skyReport(appR, pR.ignoreFilters(), now);
  ok(r.notes === 5 && r.born === 2 && r.touched === 3, `report counts notes 5 / born 2 / touched 3 -> ${r.notes} / ${r.born} / ${r.touched}`);
  ok(r.links === 5 && r.broken === 1, `report counts links 5 and broken 1 -> ${r.links} / ${r.broken}`);
  ok(r.systems === 3 && r.biggest && r.biggest.name === 'a' && r.grew && r.grew.name === 'b' && r.grew.n === 2,
     'report names the biggest system and the one that grew -> ' + JSON.stringify([r.biggest, r.grew]));
  ok(r.cited && r.cited.name === 'index' && r.cited.n === 4, 'report drops excluded notes from the citation count -> ' + JSON.stringify(r.cited));
  ok(r.rogue === 1, 'report counts the one rogue planet -> ' + r.rogue);
  const md = renderReport(r, 'ko', now);
  ok(md.startsWith('> [!orrery] 하늘 보고서 · 2026년 10월') && md.includes('[[a/index|index]]') && md.includes('**+2**'),
     'the report renders as a callout in Korean');
  ok(renderReport(r, 'en', now).includes('SKY REPORT · October 2026'), 'and in English');
  ok(pR.skyReportText().includes('하늘 보고서'), 'skyReportText follows the plugin language (ko locale)');
  /* The stylesheet is a file Obsidian loads, not something the plugin builds
     at runtime — so it is checked on disk, and the plugin is checked for not
     reaching for document.head at all. */
  ok(made.length === 0, 'creates no <style> element of its own');
  const css = fs.readFileSync(path.resolve(__dirname, '..', 'styles.css'), 'utf8');
  ok(css.includes('.vo-root'), 'styles.css carries the scoped engine stylesheet');
  ok(css.includes('.vault-orrery-host'), 'styles.css carries the hand-written seam');
  ok(!/(^|[;}])\s*body\s*\{/.test(css), 'stylesheet has no unscoped body rule');
  ok(!/(^|[;}])\s*\*\s*\{/.test(css), 'stylesheet has no unscoped universal reset');

  /* Engine preferences must land in plugin data, not in web storage. */
  const store = p.engineStore();
  ok(store.get('orrery2.lang') === null, 'engine store starts empty');
  store.set('orrery2.lang', 'ja');
  ok(store.get('orrery2.lang') === 'ja', 'engine store reads back what it wrote');
  await new Promise(r => setTimeout(r, 0));
  ok(p._data && p._data.engineStore && p._data.engineStore['orrery2.lang'] === 'ja',
     'engine store persists through saveData, not localStorage');

  /* The settings tab is declared, not drawn, so what can be checked here is the
     declaration: that every setting the tab offers is reachable by the settings
     search, and that a value round-trips through the tab's own storage in the
     shape the plugin keeps it in. */
  const tab = p._tab;
  const flatten = items => items.flatMap(i => i.type === 'group' ? flatten(i.items ?? []) : [i]);
  const defs = flatten(tab.getSettingDefinitions());
  const keys = defs.filter(d => d.control).map(d => d.control.key).sort();
  ok(JSON.stringify(keys) === '["extraIgnoreFilters","followActiveNote","followExcludedFiles",' +
                             '"language","liveSync","maxNodes","showMini"]',
     'every setting is declared for search -> ' + JSON.stringify(keys));
  ok(defs.every(d => d.name), 'every declared setting has a name to be found by');

  await tab.setControlValue('extraIgnoreFilters', 'archive\n\n  /^x/  ');
  ok(JSON.stringify(p.settings.extraIgnoreFilters) === '["archive","/^x/"]',
     'the exclusions textarea round-trips as a list, not a string');
  ok(tab.getControlValue('extraIgnoreFilters') === 'archive\n/^x/',
     'the exclusions list reads back as textarea lines');
  await tab.setControlValue('language', 'not-a-language');
  ok(p.settings.language === 'auto', 'a value that is not a language is refused');
  p.settings.extraIgnoreFilters = [];

  const seen = {};
  const fake = { setLang: v => seen.lang = v, setMaxNodes: v => seen.max = v, setIgnoreFilters: v => seen.ig = v };
  /* An earlier check above put a language in the engine store. "Match
     Obsidian" defers to that, so clear it first: this case is the one where
     nobody has chosen inside the view. */
  delete p.settings.engineStore['orrery2.lang'];
  p.applySettingsTo(fake);
  ok(seen.lang === 'ko', 'language follows Obsidian locale on auto -> ' + seen.lang);
  ok(seen.max === 0, 'node ceiling reaches the engine -> ' + seen.max);

  /* The engine has a language chip of its own, and it is persisted in this
     same data file. On 'auto' a chosen one wins — otherwise the next workspace
     layout-change, which is every sidebar toggle, undid the click. */
  const held = {};
  const pl = new P(mkApp({ getConfig: () => [] }), { dir: 'x' });
  await pl.onload();
  pl.settings.engineStore['orrery2.lang'] = 'ja';
  pl.applySettingsTo({ setLang: v => held.lang = v, setMaxNodes() {}, setIgnoreFilters() {} });
  ok(held.lang === undefined,
     'auto does not overwrite a language chosen in the view -> ' + held.lang);
  ok(Array.isArray(seen.ig) && seen.ig.includes('journal') && seen.ig.includes('/^\d{4}-/'),
     'excluded files reach the engine -> ' + JSON.stringify(seen.ig));

  p.settings.followExcludedFiles = false;
  p.settings.extraIgnoreFilters = ['archive'];
  p.applySettingsTo(fake);
  ok(JSON.stringify(seen.ig) === '["archive"]', 'toggle off drops Obsidian patterns, keeps our own');

  p.settings.followExcludedFiles = true;
  p.settings.language = 'ja';
  p.applySettingsTo(fake);
  ok(seen.lang === 'ja', 'explicit language overrides the locale');

  /* And a repeat push of unchanged settings is not a push at all — the same
     view, asked twice. Tracked per view, so this has to be the same object. */
  seen.lang = seen.max = seen.ig = undefined;
  p.applySettingsTo(fake);
  ok(seen.lang === undefined && seen.max === undefined && seen.ig === undefined,
     'unchanged settings are not re-pushed over the view');

  const p2 = new P(mkApp({}), { dir: 'x' });
  await p2.onload();
  const s2 = {};
  p2.applySettingsTo({ setLang() {}, setMaxNodes() {}, setIgnoreFilters: v => s2.ig = v });
  ok(Array.isArray(s2.ig) && s2.ig.length === 0, 'degrades quietly when getConfig is missing');

  const p3 = new P(mkApp({ getConfig: () => 'not-an-array' }), { dir: 'x' });
  await p3.onload();
  const s3 = {};
  p3.applySettingsTo({ setLang() {}, setMaxNodes() {}, setIgnoreFilters: v => s3.ig = v });
  ok(Array.isArray(s3.ig), 'survives an unexpected getConfig shape');

  const p4 = new P(mkApp({ getConfig: () => { throw new Error('boom'); } }), { dir: 'x' });
  await p4.onload();
  const s4 = {};
  p4.applySettingsTo({ setLang() {}, setMaxNodes() {}, setIgnoreFilters: v => s4.ig = v });
  ok(Array.isArray(s4.ig), 'survives getConfig throwing');

  p.onunload();
  ok(true, 'unload runs clean');
})().catch(e => {
  console.log('FAIL  ' + (e && e.message ? e.message : String(e)));
  const at = ((e && e.stack) || '').split('\n').find(l => l.includes('smoke'));
  if (at) console.log('      ' + at.trim());
  process.exitCode = 1;
});
