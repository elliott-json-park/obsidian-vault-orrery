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
  addSettingTab() { calls.push('settingTab'); }
  registerEvent() { calls.push('event'); }
  register() {}
  async loadData() { return this._data ?? null; }
  async saveData(d) { this._data = d; }
}
/* debounce() here fires immediately and keeps the .cancel() the plugin calls,
   so a write scheduled by the store is observable within one tick. */
const debounce = fn => Object.assign((...a) => fn(...a), { cancel() { return this; } });
const stub = { Plugin, ItemView: class {}, PluginSettingTab: class {}, Setting: class {},
  Notice: class {}, TFile: class {}, WorkspaceLeaf: class {}, debounce,
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
const mkApp = vault => ({ vault, workspace: { on() {}, getLeavesOfType: () => [] } });

(async () => {
  const p = new P(mkApp({ getConfig: k => k === 'userIgnoreFilters' ? ['journal', '/^\d{4}-/'] : null }),
                  { dir: '.obsidian/plugins/vault-orrery' });
  await p.onload();
  ok(calls.includes('registerView:vault-orrery-view'), 'registers the orrery view');
  ok(calls.some(c => c.startsWith('command:')), 'registers commands');
  ok(calls.includes('settingTab'), 'registers the settings tab');
  ok(calls.includes('icon:orbit'), 'registers its icon');
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

  const seen = {};
  const fake = { setLang: v => seen.lang = v, setMaxNodes: v => seen.max = v, setIgnoreFilters: v => seen.ig = v };
  p.applySettingsTo(fake);
  ok(seen.lang === 'ko', 'language follows Obsidian locale on auto -> ' + seen.lang);
  ok(seen.max === 3000, 'node ceiling reaches the engine -> ' + seen.max);
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
