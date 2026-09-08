# Development

Part of the [Vault Orrery](../README.md) documentation.

The engine is `vault-orrery-v2.html`, in the repository root — a real page you can
open by double-clicking it. That is where the renderer is developed and demoed,
and it is the single source of truth. `scripts/build-engine.mjs` turns the page
into the module the plugin imports: it scopes the stylesheet under `.vo-root`,
redirects the page-level APIs at the view's container, makes every window
listener removable, and routes the page's `localStorage` calls at a store the
host supplies — inside Obsidian that is the plugin's own data file, so nothing
is left in web storage.

Two files are build output and must not be edited by hand:
`src/engine.generated.js`, and `styles.css` — the latter is
`src/styles.src.css` (the seam between Obsidian's leaf and the engine's root)
concatenated with the scoped engine stylesheet. Both are overwritten on every
build.

```bash
npm install
npm run vendor    # copy three.js into vendor/
npm run build     # engine -> typecheck -> bundle to main.js
npm test          # build, then verify no remote code and run the smoke test
npm run dev       # rebuild on change
npm run harness   # serve harness.html — mount the engine and actually draw
```

`npm test` never renders anything: it checks the generated module and loads the
bundle against a stubbed Obsidian. Both of those have passed while the engine
threw on every frame, so **the harness is the only thing here that can tell you
the renderer works.** It mounts `src/engine.generated.js` — the exact module the
plugin loads — inside a sized container and runs the same calls the view makes.
Add `?shim=1` to drive the loop from timers and report what a frame threw;
without it a window that is not compositing never delivers a frame at all.

A fresh clone builds with nothing else present — the engine source, the build
scripts, and the tests are all in this repository. `vendor/` is the one thing
not committed: three.js is a multi-megabyte build shipped verbatim under its
own licence, so `npm run vendor` copies it out of `node_modules` at a pinned
exact version and verifies the result. See
[THIRD-PARTY-NOTICES.md](../THIRD-PARTY-NOTICES.md).

`npm run check` is the policy gate: it greps the built bundle for anything that
could execute from a remote host and fails if it finds one.

## Third-party software

This plugin bundles **three.js** (MIT) and nothing else. Full notice, licence
text, and instructions for populating `vendor/` are in
[THIRD-PARTY-NOTICES.md](../THIRD-PARTY-NOTICES.md).

It is not fetched from a network at runtime.
