# Vault Orrery

**Fly through your vault as a star system.**

Vault Orrery renders your notes as an orbiting cosmos you can pilot: folders
become stars, notes become planets, and the sources they cite become moons.

> **Not another galaxy graph.** Several plugins draw your vault as a starfield.
> This one is a *flight simulator* for it: a WASD spaceship with a scanner and
> radar, orbits you can open from a disc into a sphere, and a Genesis timeline
> that plays the vault's formation from void to present. If you only want a
> prettier graph, the other plugins are lighter and you should use one of
> those.

---

## It is wired into the editor

A cosmos you cannot leave is an ornament, so every body on screen is a note you
can be reading a second later.

- **Open the note** with `O`, with the inspector's button, from the mind map,
  or by Ctrl/Cmd-clicking a planet — the same gesture that opens a link
  anywhere else in Obsidian. Ctrl/Cmd opens it *beside* the orrery rather than
  on top of it, so the view you clicked from is still there when you come back.
- **Find where you are.** The note you are editing carries its own violet
  beacon, separate from the selection: where you are working and where you are
  looking are usually different notes, and both are worth keeping on screen.
- **Get there from anywhere.** *Reveal the active note in the orrery* is a
  command, **Show in Vault Orrery** is on every note's context menu, and the
  camera will follow the editor if you turn that on in settings.
- **Every mode is a command**, so the spaceship, Genesis, the mind map, the
  reference plane, the poster and the rest can be bound to whatever keys you
  like. None is bound by default.
- **You are told how to fly it once.** The first time a vault loads, a card
  names the four moves that are enough to get going, over the cosmos it has
  just built. Any key dismisses it and it is not shown again; `?` brings it
  back when you want it.
- **The vault stays current.** Notes written, created, renamed or deleted while
  the view is open re-derive the cosmos — with the camera and the selection
  left where they were, and no loading curtain over a view you are using.

The graph is Obsidian's own. Links, backlinks and tags come from the index
Obsidian already keeps, so a link written through an alias resolves rather than
counting as broken, an embed counts as a link, and a `#tag` written in a
paragraph counts alongside the ones in the front matter.

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

**Why it reads the whole vault.** The plugin calls `vault.getMarkdownFiles()`
and reads each note it is left with. That breadth is the feature rather than an
excess of it: what is being drawn is the shape of the vault — every note as a
body, every link between them as an orbit — and a graph of a subset is a
different vault's picture, silently wrong in a way the user cannot see. Reading
is done with `cachedRead`, so it goes through Obsidian's own cache rather than
touching disk again, and the exclusion rules below are applied first, so notes
you have hidden are never opened at all.

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

Keeping up with the vault re-reads every note each time it rebuilds, debounced
so that writing a note costs one rebuild rather than one per save. On a vault
large enough for that to be felt, turn **Keep up with the vault** off in
settings; the *Reload vault* command then does it when you ask.

---

## Giving the vault room

Two knobs on the control panel decide how tightly the cosmos is packed, and
they are not the same question.

- **ORBIT GAP** is how much room one orbit ring gets. It is the measurement the
  whole layout is built out of, so widening it also pushes the star systems
  apart to keep their clearance — the vault opens up rather than growing into
  itself. It moves while you drag: the whole cosmos widens and settles under a
  camera that stays where you left it, so you are watching the space open
  rather than watching a new layout appear.
- **ORBIT SPREAD** scales the orbits within each system, leaving the systems
  themselves where they are. Turn it up to pull a crowded system's planets
  away from their star without moving the vault around them.

A dense folder — a few hundred notes in one place — is the case worth reaching
for these on. Start with ORBIT GAP.

**SUN SIZE**, **SYSTEM SIZE**, **PLANET SIZE** and **MOON SIZE** scale a whole
class of body at once. They never change the *ratios* between notes — a body's
radius is its citation count and that is worth reading — so what moves is how
big the whole class is drawn. Four controls rather than one because the
complaint is never "everything is too small": it is a hub that swallows its
inner ring on a vault with one enormous folder, or moons that are specks from
the deck of the ship. Orbits widen with the body they stand off from, so
nothing turned up ends up with its satellites inside it.

**SUN GLOW**, **SYSTEM GLOW**, **PLANET GLOW** and **MOON GLOW** do the same
for brightness. NODE GLOW is still the master and moves all of them together;
these are the balance between the four, which is the question you are actually
asking when the hub is a white hole in the middle of the frame or the moons
have gone to nothing against their planets. The two lit classes run to 8.00×
where the two light sources stop at 3.00× — a planet asked for more brightness
has much further to climb before it reads at all.

**SUN HALO** is what the sky does with the star, and it is the only thing
here that gets *bigger* as you back away from it. A star at map range is four
pixels of disc, and four pixels of disc is not what a sun looks like from a
distance.

The knob does two things over its range, and they are the same thing. Low, it
is scattering: a soft skirt with a small unbearable centre, because light
bends by no particular angle on its way to you. Turn it up and the air stops
being air and starts being ice — and refraction has angles where scattering
has none. A ring at twenty-two degrees with nothing inside it and red on its
inner edge, a sun dog either side level with the star, a column through it, a
white band right across, a fainter ring at forty-six, and a bright cap where
the crystals line up. Every one of those is the real feature at its real
radius; it is one optical event at two strengths, not two effects.

All of it needs distance. It ramps off how small the star's disc has become
in pixels, so it cannot appear on a star you are standing next to, and it
hands back to the corona and then to the photosphere as you approach.

**The control deck can be moved.** Drag its title bar to put it anywhere in
the pane, pull any of the four corners to set its width, and the sliders
reflow into whatever width you leave them. Each corner holds the edge
opposite it, so a left-hand one keeps the right edge where it is. Double-click
the title bar — or press RESET — to hand it back to the automatic layout. Its
height is always its contents, which is why the corners set width alone.

**ORBIT SHELL** opens each system from a disc into a sphere. Every orbit in the
layout is tilted about the same axis, so a system is a flat ring however far
ORBIT TILT leans it over; turn this up and each body takes an orbit plane of
its own, spread evenly over every direction. DISC at zero, SPHERE at one, and
the numbers in between are one opening into the other.

**`X`** draws a reference plane: a polar grid on the plane the systems are
actually laid out on, with rings at the radii they sit on rather than at round
numbers. Space has no floor, and without one "further out" and "further away"
look identical — which is the one thing a picture of a graph must not be vague
about. It is off until you ask for it.

---

## The astronomy is not decoration

A view like this can use the vocabulary of a sky without owing it anything —
call a thing a corona, draw a soft circle, and nobody checks. The rule here is
the opposite one: if the code uses a word, the word has to be doing work in it.

- **Orbits are ellipses with the star at a focus**, and Kepler's equation is
  solved for every body every frame. So the second law is visible: a planet
  hurries through periapsis and loiters at apoapsis, exactly as far as its
  eccentricity says it should. Periods go as the semi-major axis to the three
  halves, and they follow when a knob moves the orbits.
- **Moons keep one face to their planet**, the way every large moon in the
  Solar System does. Because rotation is uniform and travel is not, the face
  rocks a few degrees each way over an orbit — libration, which is not
  simulated but simply what having a real ellipse means.
- **Rings sit inside the Roche limit** and lie in their planet's equatorial
  plane, because that is the only place a ring can be and the only plane it
  can survive in. The band across them is Saturn's measured profile, Cassini
  Division and Encke gap included, and the planet's shadow falls across it.
- **A moon eclipsed by its planet goes copper, not black**, because the only
  light that reaches it has been through that planet's air — with a soft
  shadow edge, because that is the part of the shadow from which some of the
  star is still visible.
- **A system is flat and its moons lie in their planet's equator**, the way a
  thing condensed from a disc and held by an equatorial bulge has to be. Turn
  ORBIT SHELL up and it opens out into a sphere anyway; that is a knob and
  not a claim.
- **A world's limb is Rayleigh and Mie scattering**, not a blue outline: it
  goes blue at noon and copper at the terminator because that is what a long
  path through air does to light, and a world with its star behind it wears a
  white halo because particles that size scatter forwards.
- **The star has limb darkening, granulation, supergranulation, faculae,
  spots, spicules and prominences**, it turns faster at its equator than at
  its poles on the measured law, and its spot bands walk toward the equator
  over a cycle. Colours come out of Planck's law and the CIE colour matching
  functions rather than off a palette.
- **An ice halo is uneven the way a real one is**, made by whatever crystals
  lie along that line of sight — with the twenty-two and forty-six degree
  rings, sun dogs, tangent arcs above and below, a pillar, the parhelic
  circle, and the circumzenithal arc that opens upward and keeps its violet.
- **Diffraction spikes are beaded and chromatic**, because a spike is the
  Fraunhofer pattern of a straight edge and its fringe spacing goes as the
  wavelength.
- **The corona follows Baumbach's measured brightness law** and is pearl-white
  rather than amber, because that is what Thomson-scattered photospheric
  light is. The glare around a star is the published CIE glare equation, not
  a curve picked to look right.
- **A meteor's light climbs and then stops**, flares where the grain breaks
  up, wears the metal's colour at its head and oxygen's green in its wake,
  and leaves a train that spreads and drifts after it has gone.
- **The Milky Way is lumpy, narrows toward the anticentre, and its rift only
  runs down one side**, because the star clouds are sight lines down an arm,
  the band is a disc seen from inside it rather than a ribbon laid over the
  sky, and the Great Rift is one nearby molecular complex rather than a belt.
- **A spiral arm carries a dust lane on its concave side** with the young blue
  associations standing in a line just outside it, which is what the shock at
  the leading edge of a standing wave leaves behind.
- **The comet has two tails**, because comets do: a curved dust tail the
  colour of reflected sunlight, and a straight blue ion tail along the
  anti-solar line where the solar wind has taken the gas.

What is deliberately not to scale is said out loud where it happens, and
there are two kinds of it. Clocks are compressed: a star that turned once in
twenty-seven days would never appear to turn at all, and a spot cycle at its
true length would be a constant. And bodies are drawn far larger against
their orbits than they are, because a note you cannot see is not a note —
which is why satellite systems here are wider relative to their planets than
a Hill sphere would allow, and could not be otherwise while a planet is
several pixels across from three rings away.

Neither of those is licence to invent the shape of a thing, and the shapes
are what this list is about.

---

## Which note is the centre

The hub — the star everything else turns around — is chosen for you: a note
named like an index (`index`, `README`, `home`, `MOC`, `인덱스`, `목차`),
largest and shallowest first, and failing that the most cited note in the
vault.

Select any note and the inspector offers **★ make this the central star**. The
whole layout is measured from the hub, so choosing a new one rebuilds the
cosmos — the framing you were at is kept, so it arrives where you were already
looking. Your choice is remembered as a path, so it survives reloads and
renames around it. The hub's own inspector is where you hand the choice back to
the vault.

---

## Flying it

`F` puts you in the cockpit. WASD moves, QE goes up and down, the mouse looks,
`SHIFT` is the throttle.

- **Arriving is a capture.** Travel to a note — from the inspector, from the
  mind map, from search — and the ship falls into orbit around it and stays
  there, in the plane it arrived on. Come in from below and you end up in a
  polar orbit. Any key on the stick hands control back, with the speed the
  orbit had.
- **The deck says whether you are getting there.** A time to arrival on
  whatever is locked, measured to the orbit you would end up in rather than to
  the body itself, and accounting for the target's own motion — a note is a
  planet, and it is going somewhere too. The reticle reaches two thirds of the
  way across the cosmos, so it answers about places you can see and have not
  reached yet rather than only about what you are nearly on top of.
- **A scan stays taken.** `SPACE` lights up everything the locked note is tied
  to, and it keeps them lit while you turn to look at where they went. Only
  `SPACE` again puts them out.
- **You are told which system you are in.** Crossing into a folder's territory
  announces it, and the deck names it the whole time you are inside.
- **The scanner reports everything it found.** The aiming cone usually holds
  four or five bodies; the CONTACTS panel lists them, `1`–`6` holds one against
  the cone's own opinion, `B` turns the cone round to see what you just passed,
  and `T` filters it to one folder at a time.
- **The radar has a third dimension.** It is a bowl, not a plan: the ship's
  plane is an ellipse and height off it is a real vertical offset with a stalk
  and a shadow, so above and below are told apart at a glance. The locked
  note's links are drawn between blips.
- **Do not fly into the star.** Inside six stellar radii the exposure goes, the
  frame warms and an alarm pulses faster the closer you get.
- **`X` flies it for you.** An ambient tour that walks the graph to notes you
  have not visited, dwelling in orbit at each long enough to read its name.

**SPEED FEEL** on the control panel scales the camera shake and the radial
motion blur together, and goes to zero.

---

## Controls

| | |
|---|---|
| `O` · ctrl/cmd-click | open the note in Obsidian |
| `/` | search |
| `M` · double-click | mind map |
| `F` | spaceship (WASD to fly, `SPACE` to scan links) |
| in the cockpit | `1`–`6` hold a contact · `B` rear scan · `T` filter · `X` patrol · `[` `]` radar size |
| `G` | Genesis — play the vault's formation |
| `N` | find twins (notes alike but not yet linked) |
| `SPACE` | ripple from the selected note |
| `P` | save a poster (high-resolution PNG, no HUD) |
| `L` | cycle the link layer |
| `X` | the reference plane on the layout's own plane |
| `U` | ambient sound |
| `R` · `H` | reset view · hide HUD |
| `?` | first-flight guide (also `[ ? ]` in the SHORTCUTS pane) |
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

Copy `main.js`, `manifest.json` and `styles.css` from the release into
`<vault>/.obsidian/plugins/vault-orrery/`, then enable it in Settings. Those
three files are the whole plugin — three.js is bundled into `main.js`, so
nothing is fetched at runtime and `vendor/` is only needed to develop against
the standalone engine page.

---

## Development

The engine is `vault-orrery-v2.html`, in this directory — a real page you can
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

This software bundles third-party components under their own licences; see
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
