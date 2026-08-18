# Changelog

Each version's section here becomes that release's description on GitHub —
`.github/workflows/release.yml` reads it when the tag is pushed, and refuses to
publish a version that has no section.

## 1.4.0

The cosmos goes quiet. Almost nothing here is new; most of it is what was
already drawn, made to stop arguing with the idea that this is space — orbits
that lie flat, planets lit by the star they actually go round, a night side
that is dark, and a sky that does not slide when you fly. Two things are
subtracted rather than added. The one genuinely new thing is a second clock:
the vault could draw its own history and never its present.

- **A second clock: where you have been working.** The cosmos had one date per
  note — the one written inside it — so it could draw the vault's history and
  not its present. A note revised this morning and one untouched since 2022
  were the same object if their front matter agreed. Obsidian knows both times
  already, and now hands over the file's: `RECENT WORK` in the drawer lights
  what has been touched inside a window you set, brightest today and gone by
  the far edge, and the inspector says how long ago in the coarsest unit that
  still means something. The knob is the window rather than the brightness,
  because "how bright" is taste and "what counts as recent" is a claim about
  how you work. A vault that cannot report file times — a folder dropped on
  the standalone page — reads N/A rather than sitting at a value and changing
  nothing.
- **The empty column is gone.** Every note carried a field named `g`, always
  the empty string, read by nothing. A field never written and never read is
  not an extension point, it is a column of blanks as deep as the vault.
- **The ring guides are gone.** A faint circle used to be drawn on the orbital
  plane for each ring of systems, on the argument that they made the layout
  read as a layout. They did — and they also drew a grid over a sky. The
  systems turning on those rings say it without the rails.
- **Orbits lie flat, and the lean is yours.** Every orbit was tilted, and all of
  them about the same axis, so at map range a link between two planets crossed
  the frame at an angle that described neither of them. `ORBIT TILT` in the
  drawer, FLAT to 2.00×, read live rather than baked into the layout — and it
  ships FLAT.
- **A planet is lit by its own star.** The one point light sat at the hub with
  no falloff, and every planet in every system took its day and night from the
  centre of the vault. The body shader now carries its star per instance —
  where it is, how far its light reaches, what colour it burns — so the
  crescents face inward toward the star that owns them, moons take the star
  of the planet they orbit, and the archive takes the hub. Falloff is
  inverse-square softened at the star's own reach.
- **The night side is dark.** Ambient was a third of the sun, with a rim and a
  fill on top: a studio. It is a floor now, and the shadow side of a world is
  a shadow.
- **A limb, not a halo.** A Fresnel term on the day side and across the
  terminator, pulled toward blue — the atmosphere the additive sprite was
  standing in for at close range. The halo itself now carries phase, like
  the reflected light it is: full when the star is behind you, a sliver when
  the planet stands between you and its star. And it goes as the disc
  resolves, because a world seen from orbit does not glow.
- **Kepler.** Angular rate falls as the radius to the minus three halves —
  planets, moons and the systems round the hub alike. Rings no longer
  alternate direction; nothing condensed from one disc turns both ways.
- **The sky does not move.** Stars, band, gas and veil were built fourteen
  thousand units out and left there, and a few hundred units of flight slid
  the whole dome against itself. They ride with the eye now — translation
  only, their slow spins are still theirs — and become the one thing flight
  cannot reach.

## 1.3.0

The star at the centre gets a face, the bodies around it get a size you choose,
and the spaceship stops being a camera with a crosshair and becomes something
you fly from a cockpit.

- **A star with a face.** The hub's photosphere was limb darkening and one
  scale of convection, and the granulation was coarse enough to read as a
  motif rather than as the material the star is made of. It now has two scales
  of convection an order apart, a domain warp so the cells are uneven rather
  than tiled, sunspots in the two active latitude bands with fibrous penumbrae
  and a floor at a fifth of the disc's brightness, faculae brightening the
  lanes near the limb against the darkening, a spicule fringe on the
  chromosphere instead of a pencil line, and prominences standing a fifth of a
  radius clear of the limb on a shell of their own. The whole face turns,
  slowly, which is the only thing on screen that says the star rotates.
- **Sun, planet and moon sizes.** Three controls in the drawer, 0.30× to
  3.00×, scaling a whole class of body at once so the *ratios* between notes —
  which are citation counts, and mean something — never move. Moon orbits are
  re-derived when planets grow, so a doubled planet does not swallow its
  satellites.
- **Arriving is a capture, not a stop.** The autopilot used to run out of
  bezier and leave the ship hanging motionless a few radii off a planet. It
  now inserts into orbit, in the plane it arrived on, at three and a half body
  radii, and stays there — so flying in from below leaves you in a polar
  orbit. The trip also tracks the body while it flies: the endpoint was fixed
  when the trip was booked and a note is a planet in orbit, so the ship had
  been arriving at where the planet used to be.
- **A cockpit rather than a HUD.** A canopy frame with rounded corners, corner
  struts, a wrapping dash and two reflections drifting on periods that do not
  divide into each other. `H` takes it down with the rest of the instruments.
- **The deck answers "am I getting there".** Closing rate on the locked body,
  differentiated from the range so that the target's own orbital motion is
  already in it, and a time to arrival measured to the orbit you would end up
  in rather than to the collision. Plus the star system you are currently
  inside, announced across the frame when you cross into it.
- **Contacts, not a contact.** The aiming cone usually holds four or five
  bodies and which one the reticle settled on was decided by fractions of a
  degree. All of them are listed now, `1`–`6` holds one against the cone's
  own opinion, `B` turns the cone round to ask what you just passed, and `T`
  filters it to one folder at a time.
- **A radar with a third dimension.** Tilted thirty-eight degrees, so the
  ship's plane is an ellipse you can see and height off it is a genuinely
  vertical offset with a stalk and a shadow rather than a tick of unknown
  sign. The locked body's links are drawn between blips.
- **Speed you can feel.** Radial motion blur trailing to the edges with the
  centre of the frame left sharp, and a camera shake on three incommensurable
  periods — on the mount, not on the ship, so the reticle never loses its
  target. One control, SPEED FEEL, and it goes to zero.
- **The engine is somewhere.** The thruster pans to whichever one is firing,
  a low shelf opens under it with the boost, and a note sounded while you are
  closing on it is Doppler shifted — capped at a minor third, so it still
  belongs to the scale the rest of the vault is tuned to.
- **The star will kill you.** Inside six stellar radii the exposure goes,
  the frame warms, a strip names it and an alarm pulses faster the closer it
  gets. Bounded by the cosmos as well as by the star, so on a small vault it
  is not lit for an ordinary flight past the hub.
- **A tour that runs itself.** `X` walks the graph to notes you have not
  visited, one hop at a time, dwelling in orbit long enough to read the name
  before moving on — and jumping to the nearest unvisited note when the
  component runs out, rather than reporting a fraction of a vault as the whole
  of it.
- **First flight.** The HUD is an instrument panel, and an instrument panel
  says nothing to someone who has not been told what it flies. The first time
  a vault loads, a card names the four moves that are enough to get going —
  drag and wheel to look, `/` to find a note, `F` to fly it yourself, `O` to
  open what you are looking at — over the cosmos it has just built, rather
  than as a splash in front of nothing. It is shown once and remembered, any
  key dismisses it, and `?` or the new `[ ? ]` in the SHORTCUTS title bar
  brings it back. Also a command, *Show the first-flight guide*, so it can be
  bound to a key or found by name.

## 1.2.0

The control deck stops being one person's idea of which knobs matter, the
sound stops being one person's idea of what a room sounds like, and the star at
the centre of the vault stops being a ball with a wireframe on it.

- **Arrange the deck yourself.** Every control carries a ◆. Click it and the
  control moves between the bar that is always out and the drawer you open, and
  the arrangement is saved. The drawer is grouped into motion and structure,
  light and film, and sound. Thirty-four controls, and which five you keep in
  front of you is your decision rather than a fact about the markup.
- **Tune the sound.** Master level, tuning in semitones, the scale the vault is
  played in (pentatonic, minor, lydian, whole tone, open fifths), room size and
  mix and damping, echo tail and time, drone level and tone, note level and
  decay, engine. Every one of these was a constant buried in the audio graph;
  all of them now move while the sound is playing, and every one of them
  defaults to exactly the number that was hard-coded, so switching sound on
  sounds the way it did.
- **Light the cosmos like a photograph.** Sun rays marched from the star's own
  place on screen, a filmic curve with cold shadows and warm highlights, a
  vignette, grain that sits in the shadows, and colour separating toward the
  corners the way a real lens cannot help doing. Each is a knob and each goes
  to zero, and at zero the frame is drawn by the same path it always was.
- **A sky worth lowering your voice in.** Nine curtains of very faint colour
  hang on the celestial sphere, crossing at every angle and drifting past the
  band of the galaxy.
- **The camera breathes.** A very slow drift on four incommensurable periods,
  added after the damping rather than into it, so a still frame stops reading
  as a paused video and nothing else in the rig knows about it.
- **The star at the centre.** It had a flat cream surface with two counter-
  rotating wireframe shells standing in for convection, which is how you draw
  an object you are explaining rather than one you are looking at. It now has
  limb darkening — the disc is white in the middle and amber at the edge,
  because at the edge you are seeing a shallower and cooler layer — granulation
  drawn as the dark lanes between convection cells rather than as the cells,
  and a chromosphere standing just off the limb. Its colours are rows of the
  same temperature table the starfield is built from. The corona is depth
  tested now, so it surrounds the disc instead of being painted over it, and it
  gives way to the photosphere as you approach.
- **Orbits open twice as far.** ORBIT GAP reaches 6.00×. What limited it was
  never the layout but the fog, which greyed out the structure exactly as it
  was spread apart, and the dust disk, which the cosmos walked out of. Both
  track the reach of the cosmos now, and the fog is only ever thinned — a vault
  smaller than the reference looks exactly as it did.

## 1.1.0

The orrery stops being a picture of the vault and becomes a way to move around
in it. Everything below is about the seam between the view and the editor.

- **Open the note.** Every body on screen is a note you can be reading a second
  later: `O`, the inspector's button, the mind map's button, Ctrl/Cmd-click on
  a planet, Ctrl/Cmd-Enter in search. Ctrl/Cmd opens beside the orrery rather
  than on top of it, so the view you clicked from is still there when you come
  back.
- **Find where you are.** The note being edited is marked in the sky with its
  own violet beacon — distinct from the selection, because where you are
  working and where you are looking are usually different notes. "Reveal the
  active note in the orrery" flies to it from anywhere, there is a **Show in
  Vault Orrery** item on every note's context menu, and a setting to have the
  camera follow the editor if you want it to.
- **The graph agrees with Obsidian's.** Links, tags and backlinks now come from
  Obsidian's own index instead of being re-derived from the text. Links written
  through an alias resolve instead of counting as broken, embeds count as
  links, and `#tags` written in the body count alongside the ones in the front
  matter. The plugin's own parser stays as the fallback for the standalone
  engine page.
- **It keeps up with the vault.** Notes written, created, renamed or deleted
  while the view is open re-derive the cosmos, with the camera and the
  selection left exactly where they were and no loading curtain over a view
  someone is using. Switchable off for very large vaults.
- **Every mode is a command.** Spaceship, Genesis, mind map, surface, poster,
  twins, search and the rest are in the command palette and can be bound to
  keys. No key is bound by default.
- **Hover preview.** Hovering a note's name in the inspector offers Obsidian's
  own page preview, registered as a hover source so it can be turned off where
  every other one is.
- **Rings.** One planet in each star system — the note its own folder points at
  most — now wears one, widening with the count, plus the handful of notes the
  whole vault leans on. They open out as you approach rather than being drawn
  at every range, so the overview stays a map and a close pass finds a ringed
  world. The vault's hubs are legible at a glance, which is not something a
  slightly larger sphere ever managed.
- **ORBIT GAP.** A new control for how much room each orbit ring gets. It is
  the measurement the whole layout is built from, so widening the orbits also
  moves the star systems apart to keep their clearance — the vault opens up
  instead of growing into itself. It moves under your hand: the orbits widen
  and settle continuously while the slider is dragged, with a little overshoot
  at the end, rather than the cosmos being rebuilt in one cut when the handle
  is let go. Orbits are roomier by default than they were, and ORBIT SPREAD
  now reaches 3.2×.
- **Links are arcs.** A link used to sag in the vertical plane alone, which
  from directly above — where the map is usually read from — is a straight
  line. It is now bowed outward, away from the core, so the curve is there
  from any angle and two bodies going round the same centre are joined by
  something that looks like it belongs to that centre. Drawn from more
  samples, so the curve is a curve rather than a bent straw.
- **Shooting stars.** One crosses the sky now and then: a burning head with a
  tapering trail, the real meteor colours — magnesium blue-white, sodium
  yellow, iron gold, and green from the oxygen behind it — and one in six is a
  fireball. Aimed across the frame you are actually looking at, so
  occasionally means occasionally seen.
- **The sound has a room.** The drone and the selection pings run through a
  generated convolution reverb — several seconds of tail, darkening as it
  decays, with the pings also feeding a long echo that answers them a few
  times over. A dry sine is a tone generator; the same note arriving through a
  room is a sound with somewhere to have come from.
- **A sky that is not science fiction.** The starfield was drawn in the
  interface's own cyan, which is the single thing that made this read as a
  set rather than as space. Stars are now coloured by temperature along the
  only line real starlight runs along — blue-white to amber, and never green
  or teal. Scintillation is gone, because twinkling is atmosphere and there
  is none out here; the diffraction spike on bright stars stays, because that
  is the camera and every real photograph has it. The Milky Way has a bulge
  it comes from and a dust rift cut along it, and it is cream rather than
  blue. Nebulae are Hα red where they are emission and dusty blue where they
  are reflection, and they are clustered into complexes instead of scattered
  as separate discs. The dust in the disk is faint and warm, the way scattered
  starlight is. The geodesic boundary grid is down to the threshold of being
  noticed.

## 1.0.2

- The settings tab is declared rather than drawn. From Obsidian 1.13.0 its
  settings are indexed by the settings search, so someone looking for
  "excluded" or "language" finds this tab without knowing to look in it. The
  exclusion settings gained a heading of their own on the way.
- `display()` remains as a fallback for Obsidian before 1.13.0, which has no
  declarative renderer. It renders the same declarations rather than a second
  copy of them, so the two paths cannot drift apart, and `minAppVersion` stays
  at 1.7.2.
- The README says why the plugin reads every note in the vault, which is a fair
  thing to want answered before installing it.

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
