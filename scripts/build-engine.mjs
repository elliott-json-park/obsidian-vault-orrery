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

   Run: npm run engine   ->   src/engine.generated.js
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
const CLS  = 'vo-root';

const html = fs.readFileSync(SRC, 'utf8');
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

/* 7. the missing-dependency screen cannot fire here (three is bundled), but it
      still refers to the page */
js = sub(js, "document.getElementById('boot')", 'root.querySelector("#boot")',
  1, 'dependency-guard lookup scoped');

/* 8. where MediaPipe is served from is the host's business: inside Obsidian it
      is an app:// resource path, not a relative folder */
js = sub(js,
  "const VENDOR = { mediapipe: 'vendor/mediapipe/' };",
  'const VENDOR = { mediapipe: host.mediapipePath || "vendor/mediapipe/" };',
  1, 'vendor path supplied by the host');

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

export const ENGINE_CSS = ${JSON.stringify(css)};
export const ENGINE_HTML = ${JSON.stringify(markup)};

export function createOrrery(root, host) {
  host = host || {};
  /* "Hands" is deliberately NOT bound here. MediaPipe is loaded lazily — the
     view mounts long before anyone presses C — so the engine's own
     "typeof Hands === undefined" test has to resolve against the global at the
     moment the camera starts, not against whatever was there at mount. */
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
];
let dirty = 0;
for (const [name, rx, allowed] of residue) {
  const real = (out.match(rx) || []).length - (allowed || 0);
  if (real > 0) { console.error(`build-engine: ${real} x ${name} left in the output`); dirty += real; }
}
if (dirty) fail(`${dirty} page-level references survived. The engine changed shape; ` +
                `add or adjust a substitution above.`);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out, 'utf8');

console.log('build-engine: substitutions');
notes.forEach(n => console.log(n));
console.log(`build-engine: wrote ${path.relative(PLUGIN_ROOT, OUT)} ` +
            `(${(out.length / 1024).toFixed(0)} KB)`);
