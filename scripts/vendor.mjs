/* ============================================================================
   vendor.mjs

   Fills vendor/ from node_modules. Run: npm run vendor

   vendor/ is not committed — three.js and MediaPipe are multi-megabyte binaries
   shipped verbatim under their own licences, and a repository is the wrong
   place to keep a second copy of someone else's release. But "not committed"
   used to mean "assembled by hand from instructions", which is the kind of step
   that is done slightly differently every time and cannot be checked. Both
   libraries are ordinary npm dependencies with pinned exact versions, so this
   script just copies them into place: `npm install && npm run vendor` gets a
   fresh clone to a runnable plugin with nothing to interpret.

   MediaPipe's npm package ships no LICENSE of its own, and Apache 2.0 requires
   one accompany the distribution — so the licence text lives in the repo, at
   licenses/, and is copied in alongside the binaries.
   ========================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT     = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODULES  = path.join(ROOT, 'node_modules');
const VENDOR   = path.join(ROOT, 'vendor');
const LICENSES = path.join(ROOT, 'licenses');

const fail = m => { console.error('vendor: ' + m); process.exit(1); };

/* Versions are asserted, not assumed. The engine is written against three r128
   and this MediaPipe build in particular; picking up whatever npm happens to
   have resolved would produce a vendor/ that does not match what the code and
   THIRD-PARTY-NOTICES.md both claim is bundled. */
const EXPECT = {
  'three': '0.128.0',
  '@mediapipe/hands': '0.4.1675469240',
};

for (const [pkg, want] of Object.entries(EXPECT)) {
  const manifest = path.join(MODULES, pkg, 'package.json');
  if (!fs.existsSync(manifest))
    fail(`${pkg} is not installed. Run \`npm install\` first.`);
  const got = JSON.parse(fs.readFileSync(manifest, 'utf8')).version;
  if (got !== want)
    fail(`${pkg} is ${got}, expected ${want}. Update EXPECT here and the ` +
         `version recorded in THIRD-PARTY-NOTICES.md together, or reinstall.`);
}

fs.rmSync(VENDOR, { recursive: true, force: true });
fs.mkdirSync(path.join(VENDOR, 'mediapipe'), { recursive: true });

/* --- three.js --------------------------------------------------------- */

fs.copyFileSync(
  path.join(MODULES, 'three', 'build', 'three.min.js'),
  path.join(VENDOR, 'three.min.js'));

/* --- MediaPipe Hands --------------------------------------------------- */

/* Copied wholesale rather than by a file list. hands.js resolves its siblings
   at runtime through locateFile, the set of WASM binaries and asset blobs has
   changed between releases, and a missing one surfaces only as a failure to
   initialise. package.json and the .d.ts come along; they are inert. */
const src = path.join(MODULES, '@mediapipe', 'hands');
let copied = 0;
for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const from = path.join(src, entry.name);
  const to   = path.join(VENDOR, 'mediapipe', entry.name);
  fs.copyFileSync(from, to);
  /* npm marks several of these read-only, which makes the next run's rmSync
     fail on Windows. */
  fs.chmodSync(to, 0o644);
  copied++;
}

fs.copyFileSync(
  path.join(LICENSES, 'mediapipe-Apache-2.0.txt'),
  path.join(VENDOR, 'mediapipe', 'LICENSE'));

/* --- verify ------------------------------------------------------------ */

/* The engine loads these four by name; everything else is reached through
   locateFile. A truncated copy is worse than a missing one — it fails at the
   moment the camera turns on rather than at build time — so size is checked,
   not just existence. */
const REQUIRED = [
  ['three.min.js',                                    100_000],
  ['mediapipe/hands.js',                               10_000],
  ['mediapipe/hands_solution_simd_wasm_bin.js',       100_000],
  ['mediapipe/hands_solution_packed_assets.data',   1_000_000],
  ['mediapipe/LICENSE',                                 5_000],
];

for (const [rel, min] of REQUIRED) {
  const f = path.join(VENDOR, rel);
  if (!fs.existsSync(f)) fail(`missing after copy: vendor/${rel}`);
  const size = fs.statSync(f).size;
  if (size < min)
    fail(`vendor/${rel} is ${size} bytes, expected at least ${min}. ` +
         `The upstream package layout changed.`);
}

const kb = n => `${Math.round(n / 1024).toLocaleString()} KB`;
const total = REQUIRED.reduce((a, [rel]) => a + fs.statSync(path.join(VENDOR, rel)).size, 0);
console.log(`vendor: three r128 + @mediapipe/hands (${copied} files) ` +
            `-> vendor/  [key files ${kb(total)}]`);
