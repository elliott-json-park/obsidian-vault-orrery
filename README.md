# Vault Orrery

**Fly through your vault as a star system — and steer it with your hands.**

Vault Orrery renders your notes as an orbiting cosmos you can pilot: folders
become stars, notes become planets, and the sources they cite become moons. It
is the only Obsidian graph view you can drive with **webcam hand gestures** —
close your fist and open your palm to summon a mind map, spread three fingers
to fly to the selected note, raise a thumb to glide back to the opening view.
The camera is entirely optional; everything it does is also on the mouse and
keyboard.

> **Not another galaxy graph.** Several plugins draw your vault as a starfield.
> This one is a *flight simulator* for it: a WASD spaceship with a scanner and
> radar, a surface mode where you stand on a note and watch its neighbours rise
> over the horizon, a Genesis timeline that plays the vault's formation from
> void to present, and gesture control. If you only want a prettier graph, the
> other plugins are lighter and you should use one of those.

---

## Privacy: the camera never leaves your machine

This plugin can read your notes and, if you turn it on, your webcam. That
combination deserves a straight answer, so here it is.

- **No network access at runtime. At all.** There is no server, no telemetry,
  no analytics, no update check, no remote font, no CDN. The plugin makes zero
  outbound requests.
- **Video is never transmitted, stored, or written to disk.** Frames go from
  the camera into the hand-tracking model in memory and are discarded. Only
  21 landmark coordinates per hand survive a frame, and only long enough to
  classify a gesture.
- **The hand-tracking model is bundled, not downloaded.** MediaPipe's WASM and
  model files ship inside the plugin. This matters: a plugin that fetched its
  model from a CDN would be sending a request every time you enabled the
  camera, and the privacy claim above would be worth less.
- **The camera is off by default** and only starts when you press `C`. When the
  view is hidden — you switch to another tab or another note — the camera is
  suspended along with the renderer, so it is not quietly running behind your
  work.
- **Note contents never leave the view either.** Parsing, layout, and rendering
  all happen locally.

You can verify all of this. The plugin is a single readable HTML/JS file, and
`grep -rn "fetch\|XMLHttpRequest\|WebSocket\|https://" ` over it will show you
what it does and does not reach for.

If you never enable the camera, no camera permission is ever requested.

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
clock, the audio context, and the camera are all suspended when the view's leaf
is hidden or the window is in the background, and resume where they left off.
An orrery in a background tab costs nothing.

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
| `C` | toggle webcam hand gestures |
| `R` · `H` | reset view · hide HUD |
| drag / wheel | orbit · zoom |

### Gestures (optional, left hand)

| | |
|---|---|
| ✊ → ✋ | open the mind map |
| ✊ → 🖖 | travel to the selected note |
| ✊ → 👍 | return to the opening view |
| 🤟 L-shape | close the mind map |

If your left hand is detected as your right, press **⇄ HAND SWAP**.

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
npm run vendor    # copy three.js + MediaPipe into vendor/
npm run build     # engine -> typecheck -> bundle to main.js
npm test          # build, then verify no remote code and run the smoke test
npm run dev       # rebuild on change
```

A fresh clone builds with nothing else present — the engine source, the build
scripts, and the tests are all in this repository. `vendor/` is the one thing
not committed: three.js and MediaPipe are multi-megabyte binaries shipped
verbatim under their own licences, so `npm run vendor` copies them out of
`node_modules` at pinned exact versions and verifies the result. See
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

`npm run check` is the policy gate: it greps the built bundle for anything that
could execute from a remote host and fails if it finds one.

## Third-party software

This plugin bundles **three.js** (MIT) and **MediaPipe Hands** (Apache 2.0).
Full notices, licence texts, and instructions for populating `vendor/` are in
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

Neither library is fetched from a network at runtime.

---

## License

MIT — see [LICENSE](LICENSE).
