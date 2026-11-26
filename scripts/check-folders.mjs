/* ============================================================================
   check-folders.mjs — part of npm test

   The follow-up on issue #2: folders seemed to be missing from STAR SYSTEMS,
   and the path order set some folders under the wrong parent.

     unlinked notes            with looseInFolder off they go to the year
                               archives, as before; on, they stay in their
                               folder's system, and a note named in someone's
                               sources stays a moon either way
     header rows               a folder that holds only folders gets a row of
                               its own, so a child is never indented under a
                               row that is not its parent
     switching a branch        the systems under a path are that folder and
                               its subfolders, and nothing that merely shares
                               the prefix ("Alpha Beta" is not under "Alpha")

   The engine source is read, not copied, so the test follows the original.
   ========================================================================= */
import fs from 'node:fs';
const src = fs.readFileSync(new URL('../vault-orrery-v2.html', import.meta.url), 'utf8');

const grab = (name, head) => {
  const i = src.indexOf(head);
  if (i < 0) throw new Error('not found: ' + name);
  let j = src.indexOf('{', i), depth = 0, k = j;
  for (; k < src.length; k++) {
    if (src[k] === '{') depth++;
    else if (src[k] === '}') { depth--; if (!depth) break; }
  }
  return src.slice(i, k + 1);
};
const decl = name => {
  const i = src.indexOf('const ' + name + ' ');
  if (i < 0) throw new Error('not found: ' + name);
  let depth = 0, k = i;
  for (; k < src.length; k++) {
    const c = src[k];
    if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c)) depth--;
    else if (c === ';' && !depth) break;
  }
  return src.slice(i, k + 1);
};

let fails = 0;
const ok = (name, cond, extra) => {
  console.log((cond ? '  ok  ' : '  FAIL ') + name + (extra !== undefined ? ' -> ' + JSON.stringify(extra) : ''));
  if (!cond) fails++;
};

/* ---- unlinked notes ---- */
const consts = ['MD_RE', 'FM_SKIP', 'DATE_RE'];
const fns = ['unq', 'splitFront', 'propsOf', 'tagsOf', 'mergeTags', 'dateOf', 'excerptOf', 'buildGraph'];
const build = loose => new Function(
  'const T = k => k;\nconst looseInFolder = ' + loose + ';\n' + consts.map(decl).join('\n') + '\n' +
  fns.map(n => grab(n, 'function ' + n + '(')).join('\n') +
  '\nreturn buildGraph;')();

const files = [
  { path: 'Study/Physics.md', text: '---\nsources: "[[Lecture clip]]"\n---\nSee [[Optics]].',
    meta: { links: { 'Study/Lecture clip.md': 1, 'Study/Optics.md': 1 } } },
  { path: 'Study/Lecture clip.md', text: 'Raw notes.', meta: { links: {} } },
  { path: 'Study/Optics.md', text: 'Light.', meta: { links: {} } },
  { path: 'Books/Thinking Fast and Slow.md', text: 'A loose reading note.', meta: { links: {} } },
];
const cat = (g, name) => g.nodes.find(n => n.n === name)?.c;

const off = build(false)(files, 't');
ok('off: an unlinked note in a folder goes to an archive, as before', /^raw:/.test(cat(off, 'Thinking Fast and Slow')), cat(off, 'Thinking Fast and Slow'));
ok('off: so its folder is not a system', !off.cats.some(c => c.key === 'wiki:Books'));

const on = build(true)(files, 't');
ok('on: the unlinked note stays in its folder', cat(on, 'Thinking Fast and Slow') === 'wiki:Books', cat(on, 'Thinking Fast and Slow'));
ok('on: and the folder is a system', on.cats.some(c => c.key === 'wiki:Books'));
ok('on: a note named in sources is still raw, so still a moon', on.nodes.find(n => n.n === 'Lecture clip')?.k === 'raw');
ok('on: linked notes are where they were', cat(on, 'Optics') === cat(off, 'Optics'));

/* ---- the legend's rows ---- */
const mk = (key, n) => ({ key, dom: key.startsWith('raw:') ? 'raw' : 'wiki', n, on: true });
const cats = [mk('wiki:W.Templates', 30), mk('wiki:Reading/快思慢想', 20), mk('wiki:Reading/Novels/Old', 5),
              mk('wiki:Alpha', 12), mk('wiki:Alpha/Child', 8), mk('wiki:Alpha Beta', 6), mk('raw:2025', 40)];
const wikiCats = cats.filter(c => c.dom === 'wiki');
const rawCats = cats.filter(c => c.dom === 'raw');
const lib = new Function('cats', 'wikiCats', 'rawCats', 'SET',
  ['catPath', 'legendOrder', 'catsUnder', 'legendRows'].map(n => grab(n, 'function ' + n + '(')).join('\n') +
  '\nreturn { legendRows, catsUnder };');
const rowsOf = sort => lib(cats, wikiCats, rawCats, { legSort: sort }).legendRows()
  .map(r => r.hdr != null ? 'H:' + r.hdr + '@' + r.depth : r.c.key + '@' + r.depth);

const bySize = rowsOf('n');
ok('size order has no header rows and no steps', bySize.every(s => !s.startsWith('H:') && s.endsWith('@0')), bySize);

const byPath = rowsOf('p');
/* Checked by structure, not by one exact list: how 快 sorts against Latin
   letters is the platform's collation, and it differs between machines. */
const pathOf = s => s.replace(/^H:/, '').replace(/^wiki:/, '').replace(/@\d+$/, '');
const depthOf = s => +s.split('@').pop();
const treeOk = byPath.every((s, k) => {
  if (s.startsWith('raw:')) return true;
  const d = depthOf(s);
  if (!d) return true;
  /* the nearest row above at one step less is this row's real parent */
  for (let j = k - 1; j >= 0; j--) {
    if (depthOf(byPath[j]) === d - 1) return pathOf(s).startsWith(pathOf(byPath[j]) + '/');
    if (depthOf(byPath[j]) < d - 1) return false;
  }
  return false;
});
ok('path order: every indented row sits under its real parent', treeOk, byPath);
ok('a folder of folders gets a header, and only those do',
   JSON.stringify(byPath.filter(s => s.startsWith('H:'))) === JSON.stringify(['H:Reading@0', 'H:Reading/Novels@1']), byPath);
ok('Latin names keep their order, archives last',
   JSON.stringify(byPath.filter(s => /^wiki:(Alpha|W\.)/.test(s))) === JSON.stringify(['wiki:Alpha@0', 'wiki:Alpha/Child@1', 'wiki:Alpha Beta@0', 'wiki:W.Templates@0']) &&
   byPath[byPath.length - 1] === 'raw:2025@0', byPath);
const iT = byPath.indexOf('wiki:W.Templates@0'), iK = byPath.indexOf('wiki:Reading/快思慢想@1');
ok('快思慢想 is not set under W.Templates', iK < iT || byPath[iK - 1] !== 'wiki:W.Templates@0');

const { catsUnder } = lib(cats, wikiCats, rawCats, { legSort: 'p' });
const under = p => catsUnder(p).map(c => c.key);
ok('a branch is the folder and its subfolders', JSON.stringify(under('Alpha')) === JSON.stringify(['wiki:Alpha', 'wiki:Alpha/Child']), under('Alpha'));
ok('a header branch is every system under it', under('Reading').length === 2, under('Reading'));

/* ---- wiring ---- */
ok('the engine exposes the switch to the plugin', /\n  setLooseInFolder,\n/.test(src));
ok('the legend draws from the rows', /legendRows\(\)\.forEach/.test(src));

if (fails) { console.log(fails + ' failed'); process.exit(1); }
