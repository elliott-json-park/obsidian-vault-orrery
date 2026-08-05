# Third-Party Notices

Vault Orrery bundles the following third-party software. Nothing is fetched
from a remote host at runtime — every file listed here ships with the plugin
and is loaded from disk.

Files live under `vendor/`, which is **not** checked into this repository.
See [Populating `vendor/`](#populating-vendor) below.

---

## three.js

- **Version:** r128
- **Homepage:** https://threejs.org
- **Source:** https://github.com/mrdoob/three.js
- **License:** MIT
- **Bundled as:** `vendor/three.min.js`
- **Modified:** No. Used verbatim.

```
The MIT License

Copyright © 2010-2021 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

---

## MediaPipe Hands

- **Version:** `@mediapipe/hands` 0.4.1675469240
- **Homepage:** https://mediapipe.dev
- **Source:** https://github.com/google/mediapipe
- **License:** Apache License 2.0
- **Bundled as:** everything under `vendor/mediapipe/`
- **Modified:** No. The npm package contents are copied verbatim.

This is an optional component. The plugin is fully usable with the mouse and
keyboard alone; MediaPipe is only loaded when hand-gesture control is enabled.

Apache 2.0 requires that a copy of the licence accompany the distribution. The
npm package ships without one, so the full text is kept in this repository at
`licenses/mediapipe-Apache-2.0.txt` and installed to `vendor/mediapipe/LICENSE`
by `npm run vendor`.

```
Copyright 2020 The MediaPipe Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

The full licence text is at http://www.apache.org/licenses/LICENSE-2.0 and
must be shipped in `vendor/mediapipe/LICENSE`.

---

## Populating `vendor/`

Both libraries are pinned npm dependencies, so this is one command:

```bash
npm install
npm run vendor
```

`scripts/vendor.mjs` copies `three/build/three.min.js` and the whole of
`@mediapipe/hands` out of `node_modules`, adds MediaPipe's licence text from
`licenses/`, and then checks the result — it refuses to finish if an expected
file is missing or implausibly small, so a changed upstream layout fails here
rather than at the moment you switch the camera on.

It copies the MediaPipe directory wholesale rather than picking files by name.
The package ships `hands.js` alongside several WASM binaries, their loaders, a
packed asset blob and the tflite models, the exact names have changed between
releases, and `hands.js` resolves them at runtime through `locateFile` — a
missing sibling would surface only as a failure to initialise.

The versions in `package.json` are exact, and the script asserts them rather
than taking whatever npm resolved: the engine is written against three r128 and
this MediaPipe build specifically, and a silently newer `vendor/` would not
match what this file says is bundled.

If `vendor/` is absent the plugin does not degrade quietly — the application
refuses to start with an on-screen message when `vendor/three.min.js` is
missing, and hand tracking reports its own failure when `vendor/mediapipe/` is
incomplete. Neither falls back to a CDN.

### Note on `hands_solution_simd_wasm_bin.data`

The package ships this file at zero bytes. That is upstream's own artefact, not
a truncated download: nothing references it. `hands_solution_simd_wasm_bin.js`
never names a `.data` file, and the asset loader reads only
`hands_solution_packed_assets.data`. It is copied along with everything else
because the copy is wholesale, and it is harmless.

---

## Verifying no remote code

Obsidian's plugin policy forbids loading executable code from a remote host at
runtime. To confirm nothing has crept back in:

```bash
grep -nE "https?://[^\"']*\.(js|wasm|tflite|data)" vault-orrery-v2.html
```

This should print nothing.
