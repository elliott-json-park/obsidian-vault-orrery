/* ============================================================================
   build-engine.mjs

   vault-orrery-v2.html is the engine. It stays a real, openable, single-file
   page — that is how it gets developed and demoed — and this script turns it
   into the module the plugin imports.

   Generating rather than forking matters: a hand-maintained copy of a 7,000
   line renderer drifts from its original within a week, and then there are two
   subtly different orreries and no way to tell which one a bug lives in.

   The page assumes it owns the viewport. Inside Obsidian it owns a leaf. Three
   things bridge that gap:

     · CSS is scoped under .vo-root, and .vo-root carries a transform, which
       makes it the containing block for `position: fixed`. All eighteen fixed
       panels then lay themselves out against the leaf instead of the window,
       with no changes to the stylesheet's own geometry.
     · innerWidth / innerHeight become the root's box.
     · Pointer coordinates are taken relative to the root, not the page. This
       is the one substitution that is not a rename: clientX is measured from
       the viewport, so inside a leaf it has to have the root's offset removed
       or every click picks the wrong body.

   The stylesheet is written to styles.css rather than exported as a string.
   Obsidian loads styles.css for us and forbids a plugin building its own
   <style> element, so the generated CSS is concatenated with the hand-written
   seam in src/styles.src.css and the pair becomes the shipped stylesheet.

   Run: npm run engine   ->   src/engine.generated.js, styles.css
   ========================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
/* PLUGIN_ROOT is this folder ("옵시디언 등재") — the plugin repo, holding
   manifest.json, src/, vendor/, the whole build, and vault-orrery-v2.html
   itself. The engine used to live one directory up in the personal workspace,
   which meant a bare clone of this repo could not build: the source it reads
   was not in it. Keeping the engine here instead costs nothing — the page is
   still a real, openable file, developed and demoed by double-clicking it —
   and it makes the repo self-contained, so a reviewer can both reproduce the
   build and read the source it is generated from. The parent workspace now
   holds only history: v1, the backup snapshot, and the dev journals. */
const PLUGIN_ROOT  = path.resolve(here, '..');
const SRC  = path.join(PLUGIN_ROOT, 'vault-orrery-v2.html');
const OUT  = path.join(PLUGIN_ROOT, 'src', 'engine.generated.js');
const SEAM = path.join(PLUGIN_ROOT, 'src', 'styles.src.css');
const CSS_OUT = path.join(PLUGIN_ROOT, 'styles.css');
const CLS  = 'vo-root';

/* Line endings are normalised before anything is matched. Several of the
   substitutions below are anchored to a newline or span one, so a checkout
   that turned the engine into CRLF — which is the default on Windows — makes
   them all miss at once, and the first thing that notices is the extraction
   failing to find the <script> block at all. Normalising here also makes the
   generated output identical on every platform, which is what lets a reviewer
   reproduce the released main.js byte for byte. */
const html = fs.readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n');
const notes = [];
const fail = m => { console.error('build-engine: ' + m); process.exit(1); };

/* Every substitution states how many hits it expects. A refactor upstream that
   silently stops matching is the failure mode this whole script has to survive,
   so a count that moves is an error, not a warning. */
function sub(text, find, repl, expect, label) {
  const parts = text.split(find);
  const n = parts.length - 1;
  if (expect !== null && n !== expect)
    fail(`"${label}" matched ${n} times, expected ${expect}. ` +
         `The engine changed; update scripts/build-engine.mjs.`);
  notes.push(`  ${String(n).padStart(4)}  ${label}`);
  return parts.join(repl);
}
function subRx(text, rx, repl, min, label) {
  let n = 0;
  const out = text.replace(rx, (...a) => { n++; return typeof repl === 'function' ? repl(...a) : repl; });
  if (n < min) fail(`"${label}" matched ${n} times, expected at least ${min}.`);
  notes.push(`  ${String(n).padStart(4)}  ${label}`);
  return out;
}

/* ---------------------------------------------------------------- extract */
const styleM = /<style>([\s\S]*?)<\/style>/.exec(html);
if (!styleM) fail('no <style> block found');

const scriptM = /<script>\n([\s\S]*?)\n<\/script>/.exec(html);
if (!scriptM) fail('no inline <script> block found');

const bodyM = /<body>([\s\S]*?)<script src=/.exec(html);
if (!bodyM) fail('could not find the markup between <body> and the first <script src>');

let css    = styleM[1];
let markup = bodyM[1];
let js     = scriptM[1];

/* ------------------------------------------------------------------- CSS
   Scope every rule under .vo-root so nothing leaks into Obsidian's own UI.  */
function scopeSelector(sel) {
  return sel.split(',').map(s => {
    s = s.trim();
    if (!s) return s;
    /* the variable block and the page box all become the root itself */
    if (s === ':root' || s === 'html' || s === 'body' || s === 'html,body') return '.' + CLS;
    /* the reset has to reach the root as well as its descendants */
    if (s === '*') return `.${CLS}, .${CLS} *`;
    /* body.ship / body.sky / body.look / body.cursor are mode flags that the
       engine now toggles on the root */
    if (/^body(?=[.#:\[])/.test(s)) return '.' + CLS + s.slice(4);
    if (/^html(?=[.#:\[])/.test(s)) return '.' + CLS + s.slice(4);
    if (s.startsWith('.' + CLS)) return s;
    return `.${CLS} ${s}`;
  }).join(', ');
}

/* A small rule-walker. Not a full CSS parser — it only needs to tell a
   selector from a declaration block and to recurse into @media/@supports. */
function scopeCss(input) {
  let out = '', i = 0, buf = '';
  while (i < input.length) {
    const c = input[i];
    if (c === '{') {
      const head = buf.trim();
      buf = '';
      /* find the matching close */
      let depth = 1, j = i + 1;
      while (j < input.length && depth > 0) {
        if (input[j] === '{') depth++;
        else if (input[j] === '}') depth--;
        j++;
      }
      const inner = input.slice(i + 1, j - 1);
      if (/^@(media|supports|container|layer)/i.test(head)) {
        out += head + ' {' + scopeCss(inner) + '}';
      } else if (/^@(keyframes|-webkit-keyframes|font-face|property)/i.test(head)) {
        out += head + ' {' + inner + '}';           // percentages, not selectors
      } else {
        out += scopeSelector(head) + ' {' + inner + '}';
      }
      i = j;
    } else { buf += c; i++; }
  }
  return out + buf;
}
/* Comments have to go before the walker runs. Whatever sits between one rule's
   closing brace and the next rule's opening brace is that rule's selector, and
   a comment parked there gets prefixed as if it were part of one — which, when
   the comment contains a comma, splits it and scatters `.vo-root` through the
   prose. Stripping first removes the whole class of problem, and the shipped
   stylesheet has no use for the commentary anyway. */
css = css.replace(/\/\*[\s\S]*?\*\//g, '');
const cssRules = (css.match(/\{/g) || []).length;
css = scopeCss(css);
notes.push(`  ${String(cssRules).padStart(4)}  css blocks scoped under .${CLS}`);

/* The root must be a containing block for the eighteen position:fixed panels,
   and must clip and size itself to the leaf. */
css = `.${CLS}{position:relative;width:100%;height:100%;overflow:hidden;` +
      `transform:translateZ(0);contain:layout paint;}\n` + css;

/* ---------------------------------------------------------------- markup */
markup = markup.replace(/<script[\s\S]*?<\/script>/g, '').trim();

/* -------------------------------------------------------------------- JS */

/* 1. element lookup, scoped to this instance's subtree. Two open orreries
      would otherwise share ids; querySelector rooted at the container returns
      each view's own copy. */
js = sub(js,
  'const $ = id => document.getElementById(id);',
  'const $ = id => root.querySelector("#" + id);',
  1, '$() scoped to the mount root');

/* 2. pointer coordinates. Must run before innerWidth is rewritten — clientX is
      viewport-relative and needs the root's offset removed, which is a
      different correction from simply changing the divisor. */
js = subRx(js, /\(e\.clientX\/innerWidth\)\*2-1/g,   'ndcX(e)', 3, 'pointer x -> root-relative NDC');
js = subRx(js, /-\(e\.clientY\/innerHeight\)\*2\+1/g, 'ndcY(e)', 3, 'pointer y -> root-relative NDC');

/* 3. viewport size -> the leaf's box */
js = subRx(js, /\binnerWidth\b/g,  'VW()', 10, 'innerWidth -> VW()');
js = subRx(js, /\binnerHeight\b/g, 'VH()', 10, 'innerHeight -> VH()');

/* 4. mode flags live on the root, not on <body> */
js = subRx(js, /document\.body\.classList/g, 'root.classList', 7, 'body.classList -> root.classList');

/* 5. the i18n sweep and the language chips must not reach outside this view */
js = subRx(js, /document\.querySelectorAll/g, 'root.querySelectorAll', 5, 'querySelectorAll scoped');

/* 6. listeners have to be removable, or every reopened leaf leaves a live
      keydown handler behind that still drives an orrery nobody can see */
js = subRx(js, /^addEventListener\(/gm,          'onWin(', 11, 'window listeners -> tracked');
js = subRx(js, /^document\.addEventListener\(/gm, 'onDoc(', 2,  'document listeners -> tracked');
/* the audio arming pair is indented and removes itself when it fires, but a
   leaf closed before the first click would leave both behind */
js = sub(js,
  "    removeEventListener('pointerdown', arm); removeEventListener('keydown', arm);",
  "    offWin('pointerdown', arm); offWin('keydown', arm);",
  1, 'audio-arm removal');
js = sub(js,
  "  addEventListener('pointerdown', arm);\n  addEventListener('keydown', arm);",
  "  onWin('pointerdown', arm);\n  onWin('keydown', arm);",
  1, 'audio-arm listeners -> tracked');

/* 6b. persistence. The standalone page is a page, so it keeps its preferences
      in localStorage; a plugin has to use Obsidian's own plugin-data API
      instead, so that the settings live in the vault, travel with it, and
      leave with the plugin when it is uninstalled. The engine reads its state
      synchronously while it starts up, so the host cannot hand it a promise —
      it hands it a store it has already hydrated, and STORE.set() is what
      schedules the write back. */
js = subRx(js, /\blocalStorage\.getItem\(/g, 'STORE.get(', 4, 'localStorage.getItem -> host store');
js = subRx(js, /\blocalStorage\.setItem\(/g, 'STORE.set(', 5, 'localStorage.setItem -> host store');

/* 7. the missing-dependency screen cannot fire here (three is bundled), but it
      still refers to the page */
js = sub(js, "document.getElementById('boot')", 'root.querySelector("#boot")',
  1, 'dependency-guard lookup scoped');


/* 9. the page exported itself onto window; a module returns it */
js = sub(js, 'window.vaultOrrery = {', 'const API = {', 1, 'global export -> return value');

const preamble = `
/* --- host bridge -------------------------------------------------------- */
const VW = () => root.clientWidth  || 1;
const VH = () => root.clientHeight || 1;
function ndcX(e){ const r = root.getBoundingClientRect(); return ((e.clientX - r.left) / (r.width  || 1)) * 2 - 1; }
function ndcY(e){ const r = root.getBoundingClientRect(); return -((e.clientY - r.top) / (r.height || 1)) * 2 + 1; }
const _off = [];
function onWin(t, f, o){ window.addEventListener(t, f, o);   _off.push(() => window.removeEventListener(t, f, o)); }
function onDoc(t, f, o){ document.addEventListener(t, f, o); _off.push(() => document.removeEventListener(t, f, o)); }
function offWin(t, f, o){ window.removeEventListener(t, f, o); }
/* The host's store, already hydrated. Falling back to a plain Map keeps the
   engine startable without one — the harness and the smoke test both do that —
   and means no code path here ever reaches for the browser's own web storage. */
const STORE = store && typeof store.get === 'function' ? store : (() => {
  const m = new Map();
  return { get: k => (m.has(k) ? m.get(k) : null), set: (k, v) => { m.set(k, String(v)); } };
})();
`;

const epilogue = `
/* Resizing is the host's call: a leaf can change size without the window
   doing anything, so a window resize event is not enough on its own. */
API.resize = () => { resize(); layoutHUD(); if (mindOpen) mmResize(); };
API.root = root;
const _destroy = API.destroy;
API.destroy = () => {
  try { _destroy(); } catch (e) { console.error('vault-orrery: teardown', e); }
  _off.splice(0).forEach(f => { try { f(); } catch (e) {} });
  root.replaceChildren();
};
return API;
`;

const out = `/* AUTO-GENERATED — do not edit.
 * Source:    vault-orrery-v2.html
 * Generator: scripts/build-engine.mjs   (npm run engine)
 *
 * Edit the HTML, then regenerate. Edits made here are lost on the next build.
 */
/* eslint-disable */
import * as THREE from 'three';

export const ENGINE_HTML = ${JSON.stringify(markup)};

export function createOrrery(root, store) {
${preamble}
${js}
${epilogue}
}
`;

/* ------------------------------------------------------------ self-check
   The substitutions above are pattern matches against a file that will keep
   being edited. Verifying the *result* rather than trusting the patterns is
   what stops a renamed call site from quietly shipping a leak. */
const residue = [
  ['document.getElementById',  /document\.getElementById/g],
  ['document.body',            /document\.body/g],
  ['document.querySelector',   /document\.querySelector/g],
  ['bare innerWidth',          /(?<![.\w])innerWidth\b/g],
  ['bare innerHeight',         /(?<![.\w])innerHeight\b/g],
  /* Listeners on window or document outlive the leaf and must be tracked. The
     only two allowed are onWin/onDoc in the bridge itself. Listeners bound to
     elements are fine untracked: they are inside the root and die with it. */
  ['untracked window/document listener', /(?:window|document)\.addEventListener\(/g, 2],
  /* a bare call is an implicit window listener that escaped rewriting */
  ['untracked bare listener', /(?<![.\w])addEventListener\(/g, 0],
  ['remote code url',          /https?:\/\/[^"']*\.(?:js|wasm|tflite|data)\b/g],
  /* Web storage belongs to the page, not to a plugin: Obsidian's review asks
     for plugin data instead, and a key left behind here would outlive the
     vault it came from. */
  ['web storage access',       /\b(?:local|session)Storage\b/g],
];
let dirty = 0;
for (const [name, rx, allowed] of residue) {
  const real = (out.match(rx) || []).length - (allowed || 0);
  if (real > 0) { console.error(`build-engine: ${real} x ${name} left in the output`); dirty += real; }
}
if (dirty) fail(`${dirty} page-level references survived. The engine changed shape; ` +
                `add or adjust a substitution above.`);

/* Every $('id') must exist in the markup that ships with it. Deleting a
   feature means deleting both its panels and its code, and a lookup left
   behind returns null and throws on the first frame it runs — in a build that
   compiled, bundled and passed a smoke test, because nothing short of actually
   mounting the engine in a browser would touch it. Both halves come from the
   same file, so they can be compared here. */
/* Every function called by name must exist. This is the check that was
   missing when the gesture engine came out: gestureStep() was deleted with it,
   the call at the top of frameLoop was not, and the result threw on every
   frame — after frameLoop had already queued the next one, so the loop kept
   "running" while never getting far enough to draw or to update the FPS
   readout. Nothing caught it. The build passed, the bundle passed, the smoke
   test passed, the vault loaded, the panels laid out, clicks picked the right
   planet. It only failed where nobody was looking: inside a frame.

   A crude scan, deliberately: this file declares its functions at the top
   level, so "called but never declared and not a known global" is a real
   finding, and the allowlist below is short enough to read. */
const GLOBALS = new Set([
  'Array','Boolean','Date','Error','Float32Array','Float64Array','Function','Image',
  'Int16Array','Int32Array',
  'JSON','Map','Math','Number','Object','Promise','RegExp','Set','String','Symbol',
  'THREE','Uint8Array','Uint16Array','Uint32Array','WeakMap','WeakSet',
  'alert','atob','btoa','cancelAnimationFrame','clearInterval','clearTimeout',
  'confirm','decodeURIComponent','encodeURIComponent','fetch','getComputedStyle',
  'isFinite','isNaN','parseFloat','parseInt','performance','prompt',
  'requestAnimationFrame','setInterval','setTimeout','structuredClone',
  /* the bridge the generator itself supplies */
  'VW','VH','ndcX','ndcY','onWin','onDoc','offWin',
  /* keywords and syntax that look like calls */
  'if','for','while','switch','catch','return','typeof','function','case','do',
  'new','delete','void','in','of','else','await','yield','super','this','import',
]);
/* Comments and string literals go first. GLSL lives in template strings and is
   full of things that look like calls — sin(), vec3(), texture2D() — and prose
   in a comment does the same the moment it says "condenses (roughly)". */
const bare = js
  /* Regex literals go before comments: a pattern is not code either, and
     /^wiki(\/|$)/ reads as a call to wiki() otherwise. Recognised by what can
     precede one — an operator or an opening bracket, never a value — which is
     the same way a reader tells it from a division. */
  .replace(/([=(,:[!&|?{};+\-*%^~]\s*)\/(?![*/])(?:\\.|\[(?:\\.|[^\]\\])*\]|[^/\\\n])+\/[gimsuy]*/g, '$1/re/')
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
  .replace(/`(?:\\.|[^`\\])*`/g, '``')
  .replace(/'(?:\\.|[^'\\])*'/g, "''")
  .replace(/"(?:\\.|[^"\\])*"/g, '""');

const declared = new Set([...GLOBALS]);
for (const rx of [/function\s+([A-Za-z_$][\w$]*)/g,
                  /(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g,
                  /class\s+([A-Za-z_$][\w$]*)/g])
  for (const m of bare.matchAll(rx)) declared.add(m[1]);
/* Parameter lists, which is also how object-literal method shorthand and every
   arrow function declares its names — one pattern covers all three. */
for (const m of bare.matchAll(/\(([^()]*)\)\s*(?:=>|\{)/g))
  for (const p of m[1].split(','))
    { const n = p.trim().replace(/[=.].*$/s, '').trim(); if (/^[A-Za-z_$][\w$]*$/.test(n)) declared.add(n); }
for (const m of bare.matchAll(/(?:^|[^\w$.])([A-Za-z_$][\w$]*)\s*=>/g)) declared.add(m[1]);
/* `foo(a) {` inside an object literal declares foo as well as a. */
for (const m of bare.matchAll(/(?:^|[,{]\s*)([A-Za-z_$][\w$]*)\s*\([^()]*\)\s*\{/g)) declared.add(m[1]);

const calledUndeclared = new Set();
for (const m of bare.matchAll(/(^|[^.\w$])([A-Za-z_$][\w$]*)\s*\(/g))
  if (!declared.has(m[2])) calledUndeclared.add(m[2]);
if (calledUndeclared.size)
  fail(`called but never declared: ${[...calledUndeclared].join(', ')}. ` +
       `Either the function was removed and its call site was not, or it is a ` +
       `global that belongs in GLOBALS here.`);
notes.push(`  ${String(declared.size - GLOBALS.size).padStart(4)}  declarations, every call resolves`);

const markupIds = new Set([...markup.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
const looked    = new Set([...js.matchAll(/\$\('([^']+)'\)/g)].map(m => m[1]));
const orphans   = [...looked].filter(id => !markupIds.has(id));
if (orphans.length)
  fail(`${orphans.length} $() lookup(s) name an element the markup does not ` +
       `contain: ${orphans.join(', ')}. Either the panel was removed and its ` +
       `code was not, or an id was renamed in only one place.`);
notes.push(`  ${String(looked.size).padStart(4)}  $() lookups, all present in markup`);

/* The stylesheet ships as a file, because Obsidian loads styles.css itself and
   a plugin building its own <style> element is not allowed. The seam between
   the leaf and the engine's root is hand-written; everything below it comes
   from the engine and is regenerated every build. */
if (!fs.existsSync(SEAM)) fail(`the hand-written stylesheet is missing at ${SEAM}`);
const styles =
`/* AUTO-GENERATED — do not edit.
 * Hand-written part: src/styles.src.css
 * Engine part:      vault-orrery-v2.html, scoped under .${CLS}
 * Generator:        scripts/build-engine.mjs   (npm run engine)
 */
${fs.readFileSync(SEAM, 'utf8').trimEnd()}

/* ---- engine, scoped under .${CLS} ---------------------------------------- */
${css}
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out, 'utf8');
fs.writeFileSync(CSS_OUT, styles, 'utf8');

console.log('build-engine: substitutions');
notes.forEach(n => console.log(n));
console.log(`build-engine: wrote ${path.relative(PLUGIN_ROOT, OUT)} ` +
            `(${(out.length / 1024).toFixed(0)} KB)`);
console.log(`build-engine: wrote ${path.relative(PLUGIN_ROOT, CSS_OUT)} ` +
            `(${(styles.length / 1024).toFixed(0)} KB)`);
