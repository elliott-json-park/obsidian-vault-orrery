/* Obsidian's plugin policy forbids loading executable code from a remote host
   at runtime, and this plugin's privacy claim depends on the same thing. This
   is the check, runnable in CI: npm run check
   It reads the built artefacts, not the sources, so anything a bundler pulled
   in is covered too. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* Everything checked lives in this folder ("옵시디언 등재", the plugin repo):
   vault-orrery-v2.html is the engine source, main.js and src/engine.generated.js
   are build output. */
const PLUGIN_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE_HTML = path.join(PLUGIN_ROOT, 'vault-orrery-v2.html');

/* A URL is only a finding if something could execute or instantiate it. Links
   in comments and licence headers are not. */
const CODE_URL = /(?:src|href|url|locateFile|importScripts|fetch)\s*[:=(]\s*["'`]https?:\/\/[^"'`]+/gi;
const WASM_URL = /https?:\/\/[^\s"'`)]+\.(?:js|mjs|wasm|tflite|data|binarypb)\b/gi;
/* The list is wider than what is actually bundled today (three.js is one .js
   file). It costs nothing to keep the loadable-asset extensions in it, and a
   future dependency that ships wasm should trip this without anyone having to
   remember to widen it first. */

/* The engine source is always present in the repo, so a missing one means the
   path is wrong, not that a build is pending — silently checking nothing is
   the one way this gate can pass while meaning nothing. */
if (!fs.existsSync(ENGINE_HTML)) {
  console.error(`check-no-remote: engine source not found at ${ENGINE_HTML}`);
  process.exit(1);
}

const built = [
  path.join(PLUGIN_ROOT, 'main.js'),
  path.join(PLUGIN_ROOT, 'src', 'engine.generated.js'),
].filter(f => fs.existsSync(f));

if (!built.length) {
  console.error('check-no-remote: no build output to check — run `npm run build` first.');
  process.exit(1);
}

const targets = [...built, ENGINE_HTML];

let findings = 0;
for (const file of targets) {
  const text = fs.readFileSync(file, 'utf8');
  for (const rx of [CODE_URL, WASM_URL]) {
    for (const m of text.matchAll(rx)) {
      const line = text.slice(0, m.index).split('\n').length;
      console.error(`${path.relative(PLUGIN_ROOT, file)}:${line}  ${m[0].slice(0, 100)}`);
      findings++;
    }
  }
  console.log(`  checked ${path.relative(PLUGIN_ROOT, file)}`);
}

if (findings) {
  console.error(`\ncheck-no-remote: ${findings} remote code reference(s). ` +
                `Bundle the file into vendor/ instead — see THIRD-PARTY-NOTICES.md.`);
  process.exit(1);
}
console.log('check-no-remote: no remote code references.');
