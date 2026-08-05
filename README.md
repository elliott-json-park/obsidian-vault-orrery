# Vault Orrery

**Fly through your vault as a star system.**

Vault Orrery renders your notes as an orbiting cosmos you can pilot: folders
become stars, notes become planets, and the sources they cite become moons.

> **Not another galaxy graph.** Several plugins draw your vault as a starfield.
> This one is a *flight simulator* for it: a WASD spaceship with a scanner and
> radar, a surface mode where you stand on a note and watch its neighbours rise
> over the horizon, and a Genesis timeline that plays the vault's formation
> from void to present. If you only want a prettier graph, the other plugins
> are lighter and you should use one of those.

---

## Privacy

This plugin reads your notes. That deserves a straight answer, so here it is.

- **No network access at runtime. At all.** There is no server, no telemetry,
  no analytics, no update check, no remote font, no CDN. The plugin makes zero
  outbound requests.
- **Nothing leaves the view.** Parsing, layout and rendering all happen
  locally, and nothing derived from your notes is written anywhere outside the
  vault.
- **No camera, no microphone, no other device permission** is requested — the
  plugin has no code that could ask for one.

You can verify all of this. The engine is a single readable HTML/JS file, and
`grep -rn "fetch\|XMLHttpRequest\|WebSocket\|https://"` over it will show you
what it does and does not reach for. `npm run check` is the same test,
automated and run over the built bundle.

---

## Respecting your excluded files

Notes you have hidden from Obsidian's own graph are hidden here too.

The plugin reads your **Settings → Files & Links → Excluded files** patterns
(`userIgnoreFilters`) and applies them with the same semantics Obsidian uses:
an entry wrapped in slashes is a regular expression, anything else is a path
prefix. Excluded folders are pruned during the vault walk, so a hidden note is
never read, never parsed, and never drawn.

After loading, the plugin tells you how many notes your filters removed, so a
too-broad pattern is visible rather than silent.

`.obsidian`, `.git`, `.trash`, and `node_modules` are always skipped regardless
of your settings.

---

## Performance on large vaults

A spring simulation over several thousand instanced bodies is not free. The
plugin ships a **MAX NODES** ceiling, default **3000**, adjustable on the
control panel from 500 up to 10 000 or off entirely.

When the ceiling truncates a vault, it says so — "Loaded 3000 of 7412 notes" —
rather than presenting a partial cosmos as if it were the whole thing.

**Rendering stops when you are not looking at it.** The render loop, the physics
clock and the audio context are all suspended when the view's leaf is hidden or
the window is in the background, and resume where they left off. An orrery in a
background tab costs nothing.

If a large vault still runs slowly, the cheapest wins are lowering **LINK
GLOW**, turning **STARFIELD** down, and reducing **MAX NODES**.

---

## Controls

| | |
|---|---|
| `/` | search |
| `M` · double-click | mind map |
| `F` | spaceship (WASD to fly, `SPACE` to scan links) |
| `V` | stand on the selected planet |
| `G` | Genesis — play the vault's formation |
| `N` | find twins (notes alike but not yet linked) |
| `SPACE` | ripple from the selected note |
| `P` | save a poster (high-resolution PNG, no HUD) |
| `L` | cycle the link layer |
| `U` | ambient sound |
| `R` · `H` | reset view · hide HUD |
| drag / wheel | orbit · zoom |
| right-drag · shift-drag | pan · move a node |

---

## Languages

The interface is available in **한국어 · English · 日本語 · 中文**, switchable
from the control panel without reloading, or set in Settings → Vault Orrery.
Your vault's own folder and note names are never translated. (The settings tab
itself is English, as Obsidian's settings are.)

---

## Installation

### From the community plugin browser

Settings → Community plugins → Browse → "Vault Orrery" → Install.

### Manual

Copy `main.js`, `manifest.json`, `styles.css`, and the `vendor/` directory into
`<vault>/.obsidian/plugins/vault-orrery/`, then enable it in Settings.

---

## Development

The engine is `vault-orrery-v2.html`, in this directory — a real page you can
open by double-clicking it. That is where the renderer is developed and demoed,
and it is the single source of truth. `scripts/build-engine.mjs` turns the page
into the module the plugin imports: it scopes the stylesheet under `.vo-root`,
redirects the page-level APIs at the view's container, and makes every window
listener removable. Editing `src/engine.generated.js` is pointless — it is
overwritten on every build.

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
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

`npm run check` is the policy gate: it greps the built bundle for anything that
could execute from a remote host and fails if it finds one.

## Third-party software

This plugin bundles **three.js** (MIT) and nothing else. Full notice, licence
text, and instructions for populating `vendor/` are in
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

It is not fetched from a network at runtime.

---

## License

MIT — see [LICENSE](LICENSE).
