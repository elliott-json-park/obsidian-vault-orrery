/* Obsidian's plugin policy forbids loading executable code from a remote host
   at runtime. This is the check, runnable in CI: npm run check
   It reads the built artefacts, not the sources, so anything a bundler pulled
   in is covered too.

   What this proves, and what it does not. The patterns below match a URL
   written as a literal at a load site, which is what pulling in remote code
   looks like. They do not match a URL assembled at runtime — fetch(base + p)
   passes this gate — so a green run here is evidence of no remote *code*, and
   is not on its own evidence of no outbound *requests*.

   The stronger claim in the README — that the plugin makes no network request
   of any kind — rests on something else, and it is worth writing down where:
   there is no call site to make one. No fetch, XMLHttpRequest, WebSocket,
   EventSource, sendBeacon or dynamic import anywhere in the engine or the
   plugin. three.js ships a FileLoader that uses XMLHttpRequest and it is
   bundled, but the engine never constructs a loader of any kind — every
   texture in the cosmos is a CanvasTexture generated in process. That absence
   is the thing a reviewer should check, and this gate cannot check it for
   them: an absence has no pattern to match. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* Everything checked lives in the repo root: vault-orrery-v2.html is the
   engine source, main.js and src/engine.generated.js are build output. */
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
