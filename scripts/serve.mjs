/* ============================================================================
   serve.mjs — npm run harness

   Serves this folder so harness.html can be opened in a browser. A static
   server rather than file://, because the engine and the generated module are
   both loaded as scripts and a file:// page is not allowed to.

   What it is for: nothing else in this repository runs a frame. The build
   checks the generated module, the smoke test loads the bundle against a
   stubbed Obsidian — and both of those passed while the engine threw on every
   single frame, because neither of them ever mounts it and draws. harness.html
   does, so it is the only thing here that can tell you the renderer works.
   ========================================================================= */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = +(process.argv[2] || 8731);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript',
                '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/harness.html';
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404).end('not found: ' + rel); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
}).listen(PORT, () => {
  console.log(`harness:  http://localhost:${PORT}/harness.html?shim=1`);
  console.log(`engine:   http://localhost:${PORT}/vault-orrery-v2.html`);
  console.log('?shim drives the frame loop from timers and reports what a frame');
  console.log('threw — needed when the window is not compositing. Ctrl+C to stop.');
});
