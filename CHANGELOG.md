# Changelog

Each version's section here becomes that release's description on GitHub —
`.github/workflows/release.yml` reads it when the tag is pushed, and refuses to
publish a version that has no section.

## 1.8.0

The astronomy audited against itself. Every term this view uses as a name for
something — Kepler, limb darkening, the Roche limit, Rayleigh, tidal locking —
was checked to see whether the code behind it does what the word means, and
where it did not, it does now. Nothing here is a new feature. It is the same
cosmos, telling the truth about more of itself.

- **All three of Kepler's laws hold.** Every orbit was a circle turned at a
  constant rate, with the star at the centre of it, which is a turntable
  rather than an orbit.

  *First.* Each ring lane carries an eccentricity and a direction of
  periapsis, and a body's position is measured from the focus. The numbers are
  the Solar System's own — Venus 0.007, Earth 0.017, Jupiter 0.048 — and each
  is capped by the clearance to the next lane, so no two orbits saw through
  each other. Notes sharing a lane share the ellipse and differ only in where
  they are on it, which is what keeps six bodies at one radius from ever
  meeting.

  *Second.* Kepler's equation, solved per body per frame. Equal areas in equal
  times hold to three thousandths of a per cent, and what it looks like is a
  planet hurrying through the near side of its orbit and loitering at the far.

  *Third.* The mean motion goes as the semi-major axis to the minus three
  halves against the geometry as it currently is, not as it was when the
  layout was computed. ORBIT SPREAD and ORBIT GAP used to move the radii and
  leave the periods where they were.

- **The moons are tidally locked.** Every large moon in the Solar System keeps
  one face to the body it orbits, because its own tidal bulge bleeds its spin
  away until the two periods match. These now turn once per revolution off the
  same clock that places them, so the lock cannot drift. Libration comes with
  it for nothing: rotation is uniform and travel is not, so the face rocks a
  couple of degrees each way over an orbit and you see a little round each
  limb in turn. A locked satellite also loses most of its obliquity, the way
  tides drive one into a Cassini state.

- **A world's limb has wavelengths in it.** The atmosphere was one blue
  constant at every angle to the star. It is Rayleigh scattering at λ⁻⁴ now,
  with its own phase function; an air-mass term, so the fringe goes blue at
  noon and copper at the terminator the way an orbital photograph of a sunset
  does; and a Mie forward lobe at g = 0.76, which is what puts a white halo
  round a world with its star behind it and nothing at all round one lit from
  the side.

- **The rings are inside the Roche limit, and on the equator.** They ran from
  2.4 to 7.2 planetary radii, where rubble accretes into a moon within a few
  orbits rather than staying a ring. The annulus is Saturn's now — 1.239 to
  2.267 radii — with Saturn's own measured profile in it: the faint C ring,
  the bright banded B, the Cassini Division dark but not empty, the A ring at
  two thirds of B, and the Encke gap where Pan holds it open. And the plane is
  the planet's equator rather than a seed of its own, because a ring off the
  equator is dragged into it by the planet's oblateness. The innermost moon
  orbits at 3.4 radii, so ring and moons now fall either side of the limit
  that decides which is which.

- **The planet's shadow falls across its rings**, and the rings are brighter
  seen from the far side than from the lit one — ring particles are enormous
  against a wavelength and scatter forwards almost entirely, which is why
  Cassini's pictures from Saturn's night side look nothing like the ones from
  its day side.

- **The sky is coloured by Planck's law.** The six spectral rows were typed in
  by eye and were close. They are computed now: Planck for the spectrum, the
  CIE 1931 colour matching functions for what the eye does with it, the sRGB
  matrix for what a screen can show. Checked against Mitchell Charity's
  blackbody table. The star at the centre takes its two colours from two
  brightness temperatures of its own gas — about 6300 K looking straight into
  the disc, about 4800 K where the sight line skims the limb — rather than
  from two rows of a table of unrelated stars.

- **The star does not turn as one piece.** Its equator goes round faster than
  its poles, on the measured law, which is why it has spots at all: the shear
  winds the field up until the tubes go buoyant and break the surface. And the
  spot bands walk down toward the equator over a cycle and wax and wane with
  it — Maunder's butterfly, on a clock compressed to be watchable.

- **A moon goes into its planet's shadow, and goes copper there.** The
  geometry is the real one — an umbra that closes to a point and a penumbra
  that opens out, so the edge of the shadow is soft because it is the region
  where part of the star is still visible. Totality is not black: the only
  light reaching a fully eclipsed moon has come through the ring of
  atmosphere round the world eclipsing it, which takes the blue end out by
  the same λ⁻⁴ the limbs are drawn with. Every sunrise on that planet at
  once, projected onto its moon.

- **Systems are flat, and moons share their planet's plane.** Orbital
  inclination used to grow with distance from the star — 7° on the innermost
  lane and 36° on the sixth — which is a fan rather than a disc, and has the
  trend backwards: the Solar System's inclinations are all under two degrees
  except Mercury's, and they fall outward, not inward. And moons ran between
  29° and 79° off their planet's equator when Io is 0.05° off Jupiter's,
  because a planet's equatorial bulge drags anything else into line. Rings
  and moons now share a plane, which is the thing about a giant planet a
  photograph shows before anything else. ORBIT SHELL still opens any of it
  back out into a sphere, and still ships at 1.00.

- **The comet has both its tails.** The dust tail is grains pushed out by
  radiation pressure while keeping the comet's own orbital velocity, so it
  curves and is the colour of reflected sunlight. The ion tail is CO⁺ picked
  up by the solar wind at four hundred kilometres a second, so it runs dead
  straight along the anti-solar line, knotted where the field has folded, and
  blue because that molecule fluoresces at 420 nm. There was one tail before,
  wearing the wrong colour half the time.

## 1.7.0

- **SUN HALO grows an ice display.** Low on the knob it is what it was: a
  smooth scattering skirt, light bent by no particular angle. Past halfway the
  air stops being air and starts being ice, and refraction has angles where
  scattering has none — a twenty-two degree ring with a hard inner edge and
  nothing inside it, red on that edge and white going out; a sun dog either
  side, level with the star and brighter than the ring, with a tail running
  outward; a column through the star; a thin white band right across the sky,
  white because it is reflection rather than refraction and so nothing splits
  it; a fainter ring at forty-six degrees; and the bright cap where the
  crystals stop tumbling. Each is the real feature at its real radius relative
  to the ring, which is what makes the set of them read as one optical event
  rather than five decorations sharing a centre.

  It ramps in rather than switching on, and off the same distance factor the
  glare uses, so it cannot appear on a star you are standing beside. The
  texture is built on the first frame that wants it: three quarters of a
  million pixels of exp() is a real cost and it is paid by the reader who
  asked for it.
- **SUN GLOW ships at 0.40x and PLANET GLOW at 1.70x.**

## 1.6.3

- **SUN HALO is back**, unchanged from the version 1.6.1 left it at. Taking it
  out was reasoned from the corona and the bloom having grown into the job,
  and they have not: both belong to the star and are drawn at the star’s own
  scale, so both shrink away at exactly the range where the star stops being a
  disc. The halo is the only thing here that grows as you back away from it,
  which is why nothing else can stand in for it.

  The two glow defaults 1.6.2 brought with it stay — SUN GLOW at 0.65x and
  SYSTEM GLOW at 0.60x.

## 1.6.2

- **SUN HALO is gone.** It was added in 1.6.0 and fixed in 1.6.1 — the fix
  was real, the arithmetic was wrong and then it was right — and with the
  folder stars turned into emitters there is nothing left for it to do that
  the corona and the bloom were not already doing better. Removed rather than
  defaulted to zero: a knob nobody should turn up is a knob that should not be
  in the drawer.
- **SUN GLOW ships at 0.65x and SYSTEM GLOW at 0.60x.** The stars are white
  through the middle and driven past 1.0 as of 1.6.1; at 3.00x and 1.26x they
  were burning out everything they were meant to be lighting.

## 1.6.1

Five corrections to 1.6.0, four of them things that were built and could not
be seen.

- **The folder stars are white-hot.** They were drawn as the system colour
  mixed halfway to white, which is a lit rock rather than a light source —
  and they have been lighting their own planets all along. White through the
  middle, the folder hue kept at the limb, driven past 1.0 so the bloom finds
  them.
- **The sun halo is actually a halo.** Its falloff put essentially all the
  light inside the first twentieth of the radius, so on a sprite a third of
  the frame across it was a bright dot on an empty card. Three exponentials
  replace it: thirty per cent of the light now falls outside half the radius
  where thirteen did, and the skirt is eleven to twenty-five times brighter
  where a halo actually lives. It also opens much earlier and runs to 3.00x.
- **The control deck resizes from all four corners**, each holding its own
  opposite edge. Fixes a jump on the first drag: while the deck was still
  placed automatically, its CSS left was the centre and offsetLeft did not
  know it.
- **The mind map is furnished.** Engraved orbit rings, a bezel and claws
  around the star, a collet on whatever is being read, a tapered rule under
  the subject’s name, and a breath of warm light on the air between the
  reader and the plate. Structure made fine, not decoration added beside it.
- **AMBIENT ships at 0.20x.**

## 1.6.0

The picture, mostly. 1.5.0 subtracted; this one goes back over what was left
and makes it look like the thing it is describing.

- **The bodies stop being mirror balls.** The plating lit every plate
  independently, and a surface made of independently bright facets says
  "covered in small reflectors" however the light falls on it — the sphere
  underneath disappears. The plates vary by six per cent now instead of fifty,
  the albedo is charcoal with the system's hue mixed into it rather than the
  system's colour dimmed, and what makes a body legible is the star: a long
  day gradient swept from well behind the terminator to past noon, and a
  narrow lit-side limb so a dark planet in front of the starfield still has an
  edge.
- **The sun gets its glare**, which is what a star looks like once its disc is
  too small to be one. It is keyed to the disc's size in pixels rather than to
  distance, so it takes over exactly where the corona has become a dot, and it
  is the only thing in the scene that grows as you back away from it.
  **SUN HALO** turns it down.
- **The folder stars stop being cages.** The shield was twenty wireframe
  triangles the size of the star itself; it is eighty finer facets now, pulled
  in and taken down to a third of its opacity. The ring went from 0.12 of the
  radius thick to 0.035, and a second, fainter one leans against it at another
  angle. What they lose in structure the star gains in light.
- **The sky stretches under thrust.** Stars streak radially away from wherever
  the nose is pointed — barely at the centre of the frame, hard at the edges,
  which is the gradient that makes it read as travelling rather than as a
  filter. Only the background: a planet whose glow smeared while the planet
  did not would read as a fault.
- **The control deck can be moved and resized.** Drag the title bar, pull the
  bottom-right corner, and the sliders reflow into whatever width you leave
  them. Double-click the title or press RESET to hand it back to the automatic
  layout.
- **PLANET GLOW and MOON GLOW run to 8.00×**, where the two light sources stop
  at 3.00×.
- **Genesis has a close button**, having been the one pane whose only exits
  were a key you had to already know.
- **The sound panel keeps six knobs**: MASTER, TUNING, SCALE, ROOM SIZE, ECHO
  TAIL, ECHO TIME — and AMBIENT, which is what DRONE always was. The rest are
  constants at exactly the values they shipped at, so switching sound on
  sounds the way it did.
- **New defaults.** Slower and wider (ORBIT SPEED 0.18×, GAP 4.37×, SPREAD
  3.20×), darker between the bodies and brighter at them (LINK GLOW 0.05×
  against NODE GLOW 2.60×), flat arcs and spherical orbits, and every ambient
  effect turned down. MAX NODES ships with no ceiling: a cap that quietly
  drops half a vault answers "show me my notes" with a subset.
- **Gone:** the twelve-second clip recorder.

## 1.5.0

A subtractive release. Six of the picture's knobs, one whole mode and about a
thousand lines of the renderer are gone, and what is added in their place is
mostly control over things that were previously decided for you.

- **You choose the centre.** The hub was whichever note was literally called
  `wiki/index.md`, which is one vault's convention stated as if it were
  everyone's. Any note named like an index now qualifies — `index`, `README`,
  `home`, `MOC`, `인덱스`, `목차` — largest and shallowest first, and the
  inspector's **★ make this the central star** overrides all of it. The choice
  is held as a path, so it survives reloads and renames; the hub's own
  inspector hands it back to the vault.
- **The folder stars have a size.** They are the middle term of the whole
  picture — the hub is the vault, a planet is a note, this is the folder — and
  they had no control at all: the radius came out of the note count and stopped
  there. **SYSTEM SIZE** scales it and the clearance its planets stand off from
  follows, so growing a star pushes its system outward instead of swallowing
  it.
- **Every class of body has its own glow.** **SUN**, **SYSTEM**, **PLANET** and
  **MOON GLOW** under NODE GLOW, which stays the master. "The hub is a white
  hole" and "the moons have vanished" are opposite complaints and one slider
  answers only one of them.
- **ORBIT SHELL opens the discs into spheres.** Every orbit in the layout is
  tilted about the same axis, so a system is a flat ring however far it is
  leaned over. Each body now also carries an orbit plane of its own, spread
  evenly over every direction, and the knob blends between the two: DISC at
  zero, SPHERE at one.
- **A reference plane, on `X`.** Space has no floor and the layout has one.
  Without something to read it against, "further out" and "further away" look
  identical — the one thing a picture of a graph must not be vague about. A
  polar grid on the layout's own plane, at the radii the systems actually sit
  on, off until you ask for it.
- **One planet design, at every range.** A body used to be an instanced sphere
  wearing a patch of a shared texture from far off and a wholly different,
  generated world — gas giant, terrestrial, cratered rock — up close. The swap
  was the most conspicuous event in the frame. There is one machined shell now,
  computed in the shader from the sphere's own direction, and the high-detail
  mesh is rounder rather than different.
- **A scan stays taken.** `SPACE` lit the locked note's connections and lost
  them the moment the reticle moved on — so pressing space to find out where
  the links go, and then turning to look at where they went, erased the marks.
  Only `SPACE` again puts them out now.
- **The reticle reaches.** It could only name a target within a sixth of the
  cosmos, which meant the range and the arrival estimate arrived when you were
  most of the way there. Two thirds now, with the estimate's ceiling raised to
  match.
- **The control deck holds one group at a time**, chosen from a strip of names,
  with a find box beside it that searches every group at once — in the deck's
  language and in the original. Opening ADVANCED shows eight or ten rows
  instead of thirty. The pins are invisible until the pointer is on their row.
- **Gone:** film grade, vignette, film grain, lens fringe, camera drift and age
  tint — a photographic treatment laid over an instrument, costing a
  full-screen pass to apply. The surface mode, where you stood on a note and
  looked up: a second renderer, camera, scene and input layer for a view that
  answered no question the cosmos does not. The archive's drawn spiral track
  and two thirds of the selection marker. And the mind map's deep field,
  vignette, graduation ticks and entry wave — scenery in front of an answer
  about six links.

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
