# Changelog

Each version's section here becomes that release's description on GitHub —
`.github/workflows/release.yml` reads it when the tag is pushed, and refuses to
publish a version that has no section.

## 1.0.1

Everything in this release comes from the Obsidian plugin review. Nothing about
what the plugin does has changed.

- The engine's stylesheet now ships as `styles.css` instead of being injected
  into a `<style>` element at runtime. It is still generated from
  `vault-orrery-v2.html`, so there is still only one copy to keep in step; the
  generator writes the file rather than a string constant.
- The engine's own preferences — language, panel and radar sizes, its exclusion
  list — move from `localStorage` to Obsidian's plugin data. They now live in
  the vault, travel with it, and leave when the plugin is uninstalled.
- `minAppVersion` is now 1.7.2, which is where `revealLeaf` became asynchronous.
  The plugin was already using the newer form and now awaits it.
- The settings tab uses `Setting().setHeading()` for its Privacy heading and a
  CSS class for the exclusion box, instead of a raw `<h3>` and an inline style.
  The deprecated `setDynamicTooltip()` call is gone — the slider shows its value
  inline now.
- No console logging on the diagnostics command; the notice already carries the
  whole report.
- `LICENSE` is the MIT text and nothing else, so it is recognised as MIT. The
  note about bundled third-party components moved to the README, next to the
  link it was already sharing.
- `authorUrl` points at a page that exists.
- Dropped the `builtin-modules` dependency in favour of Node's own
  `node:module`.
- The build no longer breaks on a Windows checkout: the generator normalises
  line endings before matching, and `.gitattributes` keeps sources at LF, which
  also makes the built `main.js` byte-identical across platforms.
- Releases are built by a workflow that attaches a provenance attestation, so
  `main.js` and `styles.css` can be verified against this repository.

## 1.0.0

First release.
