/* ============================================================================
   check-moons.mjs — part of npm test

   A moon is a raw note tethered to the concept that cites it, and in a vault
   without raw/ and wiki/ folders "raw" means nothing links to it. The way to
   cite one is `sources:` in the concept's front matter, and inside Obsidian a
   [[link]] written there arrives with the note's other links: Obsidian puts
   property links in resolvedLinks. Counted as an ordinary link, the source
   came out a planet and no moon could ever form (2.0.2). The standalone page
   reads links from the body only, so it never showed the bug, which is why
   this runs buildGraph with host links the way the plugin hands them over.

   buildGraph and the helpers it calls are pulled out of the engine source
   rather than copied, so the test keeps following the original.
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

/* a top-level `const`, up to the semicolon that ends it */
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

const consts = ['MD_RE', 'FM_SKIP', 'DATE_RE'];
const fns = ['unq', 'splitFront', 'propsOf', 'tagsOf', 'mergeTags', 'dateOf', 'excerptOf', 'buildGraph'];
const { buildGraph } = new Function(
  'const T = k => k;\n' + consts.map(decl).join('\n') + '\n' +
  fns.map(n => grab(n, 'function ' + n + '(')).join('\n') +
  '\nreturn { buildGraph };')();

let fails = 0;
const ok = (name, cond, extra) => {
  console.log((cond ? '  ok  ' : '  FAIL ') + name + (extra ? ' -> ' + extra : ''));
  if (!cond) fails++;
};

/* Three notes as Obsidian would describe them: a concept citing a clipping in
   its sources, the clipping, and a second concept the first links to. */
const files = [
  { path: 'Physics.md', text: '---\nsources: "[[Lecture clip]]"\n---\nSee [[Optics]].',
    meta: { links: { 'Lecture clip.md': 1, 'Optics.md': 1 } } },
  { path: 'Lecture clip.md', text: 'Raw notes from the lecture.', meta: { links: {} } },
  { path: 'Optics.md', text: 'Light.', meta: { links: {} } },
];
const g = buildGraph(files, 'test');
const at = name => g.nodes.findIndex(n => n.n === name);
const tether = g.edges.find(([a, b, t]) => t === 1);

ok('a note named only in sources is raw material, not a concept', g.nodes[at('Lecture clip')]?.k === 'raw',
   'k = ' + g.nodes[at('Lecture clip')]?.k);
ok('and it is tethered to the note that cites it, which makes it a moon',
   !!tether && tether[0] === at('Lecture clip') && tether[1] === at('Physics'));
ok('a note reached by an ordinary link is still a concept', g.nodes[at('Optics')]?.k !== 'raw');

/* A source some other note links to in the ordinary way is a concept: that
   link is a statement that it stands on its own, and 2.0.1 drew it so. */
const shared = buildGraph([
  ...files,
  { path: 'Waves.md', text: 'Compare [[Lecture clip]].', meta: { links: { 'Lecture clip.md': 1 } } },
], 'test');
ok('a source another note links to stays a planet',
   shared.nodes[shared.nodes.findIndex(n => n.n === 'Lecture clip')].k !== 'raw');

if (fails) { console.log(fails + ' failed'); process.exit(1); }
