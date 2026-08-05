/* ============================================================================
   vendor.mjs

   Fills vendor/ from node_modules. Run: npm run vendor

   vendor/ is not committed — three.js is a multi-megabyte build shipped
   verbatim under its own licence, and a repository is the wrong place to keep
   a second copy of someone else's release. But "not committed" used to mean
   "assembled by hand from instructions", which is the kind of step that is
   done slightly differently every time and cannot be checked. three is an
   ordinary npm dependency at a pinned exact version, so this script just
   copies it into place: `npm install && npm run vendor` gets a fresh clone to
   a runnable plugin with nothing to interpret.
   ========================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT    = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODULES = path.join(ROOT, 'node_modules');
const VENDOR  = path.join(ROOT, 'vendor');

const fail = m => { console.error('vendor: ' + m); process.exit(1); };

/* The version is asserted, not assumed. The engine is written against three
   r128; picking up whatever npm happened to resolve would produce a vendor/
   that does not match what the code and THIRD-PARTY-NOTICES.md both claim is
   bundled. */
const WANT = '0.128.0';
const manifest = path.join(MODULES, 'three', 'package.json');
if (!fs.existsSync(manifest)) fail('three is not installed. Run `npm install` first.');
const got = JSON.parse(fs.readFileSync(manifest, 'utf8')).version;
if (got !== WANT)
  fail(`three is ${got}, expected ${WANT}. Update WANT here and the version ` +
       `recorded in THIRD-PARTY-NOTICES.md together, or reinstall.`);

fs.rmSync(VENDOR, { recursive: true, force: true });
fs.mkdirSync(VENDOR, { recursive: true });

const OUT = path.join(VENDOR, 'three.min.js');
fs.copyFileSync(path.join(MODULES, 'three', 'build', 'three.min.js'), OUT);

/* A truncated copy is worse than a missing one — the engine's dependency guard
   catches an absent three.js and says so, but a half-written file fails as a
   syntax error in someone else's minified bundle. */
const size = fs.statSync(OUT).size;
if (size < 100_000)
  fail(`vendor/three.min.js is ${size} bytes, expected far more. ` +
       `The upstream package layout changed.`);

console.log(`vendor: three r${WANT.split('.')[1]} -> vendor/three.min.js ` +
            `(${Math.round(size / 1024).toLocaleString()} KB)`);
