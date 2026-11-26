/* ============================================================================
   check-legend.mjs — part of npm test

   Three things issue #2 and #3 asked for, checked against the engine source
   rather than a copy of it:

     the legend's path order   a parent comes before its children, numbers
                               sort as numbers, archives stay last, and the
                               size order is left exactly as the galaxy has it
     the label face            a Chinese or Japanese name is set in a face that
                               has its glyphs, a Korean one keeps Malgun first
     switched-off systems      the saved list is what buildLayout reads back
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

let failed = 0;
const ok = (cond, name, got) => {
  console.log((cond ? '  ok  ' : '  FAIL ') + name + (got !== undefined ? ' -> ' + JSON.stringify(got) : ''));
  if (!cond) failed++;
};

/* ---- the order ---- */
const mk = (key, n) => ({ key, dom: key.startsWith('raw:') ? 'raw' : 'wiki', n });
const cats = [mk('wiki:Zeta', 40), mk('wiki:Alpha/Child', 30), mk('wiki:Alpha Beta', 25), mk('wiki:Alpha', 20),
              mk('wiki:10 Later', 10), mk('wiki:2 Early', 5), mk('raw:2025', 50)];
const wikiCats = cats.filter(c => c.dom === 'wiki');
const rawCats = cats.filter(c => c.dom === 'raw');
const order = sort => new Function('cats', 'wikiCats', 'rawCats', 'SET',
  grab('catPath', 'function catPath(') + '\n' + grab('legendOrder', 'function legendOrder(') +
  '\nreturn legendOrder().map(c => c.key);')(cats, wikiCats, rawCats, { legSort: sort });

const bySize = order('n');
ok(JSON.stringify(bySize) === JSON.stringify(cats.map(c => c.key)), 'size order is the galaxy order, untouched', bySize);
const byPath = order('p');
ok(JSON.stringify(byPath) === JSON.stringify(['wiki:2 Early', 'wiki:10 Later', 'wiki:Alpha', 'wiki:Alpha/Child', 'wiki:Alpha Beta', 'wiki:Zeta', 'raw:2025']),
   'path order: numbers as numbers, parent before child, archives last', byPath);
ok(cats[0].key === 'wiki:Zeta', 'sorting the list does not reorder the systems themselves');

/* ---- the face ---- */
const { labelFace } = new Function(
  decl('LBL_FACE') + '\n' + ['LBL_HANGUL', 'LBL_KANA', 'LBL_HAN', 'LBL_FACE_JA', 'LBL_FACE_ZH'].map(decl).join('\n') +
  '\n' + grab('labelFace', 'function labelFace(') + '\nreturn { labelFace };')();
const zh = labelFace('雷博地球村的阅日切片');
ok(zh.dense && zh.face.startsWith('"Microsoft YaHei UI"'), 'a Chinese name leads with a Chinese face', zh.face.split(',')[0]);
const ja = labelFace('アニメ索引');
ok(ja.dense && ja.face.startsWith('"Yu Gothic UI"'), 'a Japanese name leads with a Japanese face', ja.face.split(',')[0]);
const ko = labelFace('한국어 노트 漢字');
ok(!ko.dense && ko.face.startsWith('"Malgun Gothic"'), 'a Korean name, hanja and all, keeps Malgun first', ko.face.split(',')[0]);
const en = labelFace('Weekly review');
ok(!en.dense, 'a Latin name keeps its weight and rim');

/* ---- remembered ---- */
ok(/c\.on = !legOff\.has\(c\.key\)/.test(src), 'buildLayout reads the switched-off systems back');
ok(/legOff:\[\], legSort:'n'/.test(src), 'both choices have defaults to fall back on');
ok(/const keepLeg = \{ legOff: SET\.legOff, legSort: SET\.legSort \}/.test(src), 'RESET leaves the legend choices alone');

if (failed) { console.error(failed + ' legend check(s) failed'); process.exit(1); }
