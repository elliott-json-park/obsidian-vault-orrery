/* ============================================================================
   build-demo.mjs

   Assembles the browsable demo: vault-orrery-v2.html and the one library it
   loads, laid out the way a static host serves them.

   The engine is already a real, openable page — that is how it is developed —
   so the demo is not a port of the plugin, it is that same file with nothing
   done to it. Copying rather than editing is the whole point: an edited copy
   is a second engine that drifts, and then the thing people try in a browser
   is not the thing they install.

   vendor/ is not committed, so this runs after `npm run vendor` and asserts
   the library is actually there. A demo that 404s on three.js shows the
   dependency screen, which is a worse first impression than no demo at all.

   Run: npm run demo   ->   demo/index.html, demo/vendor/three.min.js
   ========================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT  = path.join(ROOT, 'demo');
const fail = m => { console.error('build-demo: ' + m); process.exit(1); };

const PAGE   = path.join(ROOT, 'vault-orrery-v2.html');
const VENDOR = path.join(ROOT, 'vendor', 'three.min.js');

if (!fs.existsSync(PAGE))   fail(`the engine is missing at ${PAGE}`);
if (!fs.existsSync(VENDOR)) fail('vendor/three.min.js is missing. Run `npm run vendor` first.');

const html = fs.readFileSync(PAGE, 'utf8');

/* The page loads the library by relative path, and the layout below has to
   match it. Asserted rather than assumed: if the tag is ever rewritten, the
   demo would deploy a page that cannot start, and nothing else here would
   notice — the copy would succeed and the files would all be present. */
const TAG = '<script src="vendor/three.min.js"></script>';
if (!html.includes(TAG))
  fail(`the engine no longer loads the library with ${TAG}. Update this script ` +
       `so the demo's layout still matches what the page asks for.`);

/* The same gate the plugin ships under. The demo is served from a domain
   rather than opened from disk, which is exactly where a remote script would
   start working and therefore stop being obvious. */
const remote = html.match(/https?:\/\/[^"']*\.(?:js|wasm|tflite|data)\b/g);
if (remote) fail(`the engine references remote code: ${remote.join(', ')}`);

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'vendor'), { recursive: true });

/* index.html, byte for byte. A static host serves a directory's index.html at
   the directory's own URL, so this is only a rename. */
fs.copyFileSync(PAGE, path.join(OUT, 'index.html'));
fs.copyFileSync(VENDOR, path.join(OUT, 'vendor', 'three.min.js'));

/* Jekyll is GitHub Pages' default and it skips paths beginning with an
   underscore and rewrites others. Nothing here needs processing. */
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

const kb = f => Math.round(fs.statSync(f).size / 1024).toLocaleString();
console.log(`build-demo: demo/index.html          (${kb(path.join(OUT, 'index.html'))} KB)`);
console.log(`build-demo: demo/vendor/three.min.js (${kb(path.join(OUT, 'vendor', 'three.min.js'))} KB)`);
