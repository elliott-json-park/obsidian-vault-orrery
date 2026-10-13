# Third-Party Notices

Vault Orrery bundles one piece of third-party software. Nothing is fetched from
a remote host at runtime — the library listed here ships inside the plugin's
`main.js` and is loaded from disk.

The standalone page and the browser demo load it from `vendor/` instead, which
is **not** checked into this repository.
See [Populating `vendor/`](#populating-vendor) below.

---

## three.js

- **Version:** r128
- **Homepage:** https://threejs.org
- **Source:** https://github.com/mrdoob/three.js
- **License:** MIT
- **Bundled as:** in the plugin, the parts of three.js the engine uses, built
  into `main.js` from three's own source files (`three/src/`). In the
  standalone page and the browser demo, `vendor/three.min.js`.
- **Modified:** No. The code is three's own; the plugin build leaves out the
  modules it does not use and strips comments from the shader sources, as
  three's own release build does. `vendor/three.min.js` is used verbatim.

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

## Populating `vendor/`

three.js is a pinned npm dependency, so this is one command:

```bash
npm install
npm run vendor
```

`scripts/vendor.mjs` copies `three/build/three.min.js` out of `node_modules`
and checks the result — it refuses to finish if the file is missing or
implausibly small, so a changed upstream layout fails there rather than as a
syntax error inside someone else's minified bundle.

The version in `package.json` is exact, and the script asserts it rather than
taking whatever npm resolved: the engine is written against r128, and a
silently newer `vendor/` would not match what this file says is bundled.

If `vendor/` is absent the plugin does not degrade quietly — the application
refuses to start and says on screen what is missing and where it belongs. It
does not fall back to a CDN.

---

## Verifying no remote code

Obsidian's plugin policy forbids loading executable code from a remote host at
runtime. `npm run check` is that gate, run over the built artefacts as well as
the source. To spot-check by hand:

```bash
grep -nE "https?://[^\"']*\.(js|wasm|mjs)" vault-orrery-v2.html
```

This should print nothing.

---

## Removed dependency

Versions before 1.0 bundled **MediaPipe Hands** for optional webcam gesture
control. That feature was removed along with the library, so no Google or
Apache-licensed code ships here any more. This note exists only so that anyone
comparing against an older tree knows the omission is deliberate.
