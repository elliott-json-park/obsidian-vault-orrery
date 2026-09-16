/* ============================================================================
   build-demo.mjs

   Assembles the browsable demo: vault-orrery-v2.html and the one library it
   loads, laid out the way a static host serves them.

   The engine is already a real, openable page — that is how it is developed —
   so the demo is not a port of the plugin, it is that same file. Copying
   rather than editing is the whole point: an edited copy is a second engine
   that drifts, and then the thing people try in a browser is not the thing
   they install.

   Exactly one line is added, and it is a seam rather than an edit: a <script>
   tag for demo-sample.js, which fills the demo with a vault through the same
   public load() a host uses. Nothing in the page itself is rewritten.

   vendor/ is not committed, so this runs after `npm run vendor` and asserts
   the library is actually there. A demo that 404s on three.js shows the
   dependency screen, which is a worse first impression than no demo at all.

   Run: npm run demo   ->   demo/{index.html, sample.js, vendor/three.min.js}
   ========================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT  = path.join(ROOT, 'demo');
const fail = m => { console.error('build-demo: ' + m); process.exit(1); };

const PAGE   = path.join(ROOT, 'vault-orrery-v2.html');
const VENDOR = path.join(ROOT, 'vendor', 'three.min.js');
const SAMPLE = path.join(ROOT, 'scripts', 'demo-sample.js');

if (!fs.existsSync(PAGE))   fail(`the engine is missing at ${PAGE}`);
if (!fs.existsSync(VENDOR)) fail('vendor/three.min.js is missing. Run `npm run vendor` first.');
if (!fs.existsSync(SAMPLE)) fail(`the demo's sample vault is missing at ${SAMPLE}`);

const html = fs.readFileSync(PAGE, 'utf8');

/* The page loads the library by relative path, and the layout below has to
   match it. Asserted rather than assumed: if the tag is ever rewritten, the
   demo would deploy a page that cannot start, and nothing else here would
   notice — the copy would succeed and the files would all be present. */
const TAG = '<script src="vendor/three.min.js"></script>';
if (!html.includes(TAG))
  fail(`the engine no longer loads the library with ${TAG}. Update this script ` +
       `so the demo's layout still matches what the page asks for.`);

const sample = fs.readFileSync(SAMPLE, 'utf8');

/* The same gate the plugin ships under, over everything the demo serves. It
   is a page on the open web, which is exactly where a remote script would
   start working and therefore stop being obvious. */
for (const [what, text] of [['the engine', html], ["the demo's sample vault", sample]]) {
  const remote = text.match(/https?:\/\/[^"']*\.(?:js|wasm|tflite|data)\b/g);
  if (remote) fail(`${what} references remote code: ${remote.join(', ')}`);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'vendor'), { recursive: true });

/* One line is added to the page, and it is a seam rather than an edit: a
   <script> tag after the engine's own, loading a file that talks to the engine
   only through vaultOrrery.load(). Nothing inside the page is rewritten, so
   the demo cannot say something the plugin does not — which is the reason this
   script copies rather than forks in the first place.

   Anchored to </body> and counted, because a silent miss here would deploy a
   demo that opens on an empty starfield with nothing to say why. */
const ANCHOR = '</body>';
if (html.split(ANCHOR).length - 1 !== 1)
  fail(`expected exactly one ${ANCHOR} in the engine to inject the sample vault before.`);
const page = html.replace(ANCHOR, '<script src="sample.js"></script>\n' + ANCHOR);

/* index.html: a static host serves a directory's index.html at the directory's
   own URL, so the rename is the whole of the layout. */
fs.writeFileSync(path.join(OUT, 'index.html'), page, 'utf8');
fs.writeFileSync(path.join(OUT, 'sample.js'), sample, 'utf8');
fs.copyFileSync(VENDOR, path.join(OUT, 'vendor', 'three.min.js'));

/* Jekyll is GitHub Pages' default and it skips paths beginning with an
   underscore and rewrites others. Nothing here needs processing. */
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

const kb = f => Math.round(fs.statSync(f).size / 1024).toLocaleString();
console.log(`build-demo: demo/index.html          (${kb(path.join(OUT, 'index.html'))} KB)`);
console.log(`build-demo: demo/sample.js           (${kb(path.join(OUT, 'sample.js'))} KB)`);
console.log(`build-demo: demo/vendor/three.min.js (${kb(path.join(OUT, 'vendor', 'three.min.js'))} KB)`);
