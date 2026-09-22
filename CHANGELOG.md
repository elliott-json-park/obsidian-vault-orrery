# Changelog

Each version's section here becomes that release's description on GitHub —
`.github/workflows/release.yml` reads it when the tag is pushed, and refuses to
publish a version that has no section.

## 1.15.1

- **Nothing on screen changes.** A maintenance release of the same code as
  1.15.0, rebuilt and re-attested by the release workflow. The build, the
  policy gates and the smoke test pass, and the demo was driven through
  every mode and through quiet reloads that add and remove notes without
  an error.

## 1.15.0

- **The nebula is a volume.** Fourteen hundred additive sprites drew
  something continuous from the range the vault opens at and fell apart the
  moment the camera came inside — the eye resolves a disc at two hundred
  pixels across. Each cloud is now one quad whose shader marches a ray
  through the ellipsoid the cloud occupies and integrates the gas along it:
  eight steps, a tileable noise texture read twice a step in place of a
  hash, one draw call for the sixteen clouds. It absorbs as well as emits,
  so a dense strand in front of a star dims the star, which an additive
  sheet could never do; held short of black. The clouds sit above and below
  the plane as well as in it, so the opening frame looks through them, and
  a cloud the eye is inside fades out rather than tinting the frame. The
  ionisation structure is kept — teal inside the front, Hα red outside,
  reflection clouds blue.

- **There is something near the lens and something behind the stars.** A
  few hundred motes live in a box that follows the camera and wrap through
  it, tiny, faint and biggest when nearest, so pulling back finally feels
  like pulling back. Behind the starfield a dome carries the Milky Way's
  unresolved continuum — a band that narrows toward the anticentre, a bulge
  toward the centre, the rift cut through one side — and six galaxies far
  enough away to be smudges. Three texture reads a pixel; the dome shader
  that was rejected once cost sixty sines.

- **The mind map is a system with a star in it.** The note in the middle
  is drawn as a star — the same photosphere the folder stars wear, at the
  temperature of the folder it is filed in — rather than as a larger planet
  with a ring round it, and every body on the plate was already lit from
  there. The first lane is laid out folder by folder, biggest folder first,
  with an arc of each folder's colour just outside it, so the wheel reads
  as sectors. The second hop sits near the neighbours that brought it in
  instead of evenly round the outside. The spokes to the centre come up and
  the links between neighbours go down to a trace, and the pulses run the
  plate's own edges — four in five on the spokes, so a streak leaving the
  centre is an outbound link and one arriving is a backlink.

  And the plate is an instrument, drawn the way an instrument is: in
  hairlines. A graduated disc under the wheel — rings at a fifth, radials
  every thirty degrees, the two lanes the only firm lines on it — with a
  slow, faint scan passing over the graduations; thirty-six ticks on each
  lane; a closed hairline in its folder's colour round every first-hop
  neighbour; a little dust drifting in the plate's plane; and the star's
  own flare in the middle. Cool white rather than cyan, all of it additive,
  and none of it turning for its own sake.

- **The sound is a place.** The bed under AMBIENT was three near-unison
  sines under a filter; it is a sub, a root, two detuned fifths that beat,
  an octave above them and one sine four octaves up at almost nothing —
  the shimmer, the thing in it that reads as far away — each breathing on
  its own clock, the filter opening and closing over most of a minute, and
  under all of it a band of noise that wanders and swells: the wind. It
  comes up over a second and a half rather than switching on, and it ships
  at 0.35× rather than OFF, because the vault answering when touched was
  never the whole of what a cosmos sounds like. Moving the camera is heard
  as moving — a darker band of the same noise whose level is the eye's own
  speed against its range — and stopping is heard as the sound going. The
  ping is a bell now, with the inharmonic modes a struck bell has and a
  second fundamental a few cents off for width. The mind map goes up on a
  sweep and a note an octave over the one in the middle, hums faintly while
  it is up, and comes down on the sweep reversed. Genesis opens on the low
  boom the supernova ends on.

- **The lens is in the picture.** A source in front of a real lens is seen
  more than once: the reflections between the elements land on the axis
  from the source through the middle of the frame, which is the row of
  coloured discs every photograph of a bright light has. LENS FLARE draws
  them from the bright buffer — four ghosts and a halo, each with the colour
  separation the glass puts on it — plus the horizontal streak an
  anamorphic element spills, blue because the coatings are tuned for the
  other two. The widest bloom stage now disperses by colour toward the
  corners, red outside and blue inside, and the front element carries
  smudges that catch the spill and nothing else. One knob, under LIGHT,
  shipped at 0.55×.

- **The film curve is ACES.** The exponential shoulder is the ACES fitted
  curve now: a toe that keeps black black, a straight middle, and a shoulder
  that takes four times over-exposure to a highlight with shape. Applied to
  the half-float signal, which is what it was made for; FILM CURVE is still
  how far toward it the picture goes.

- **The gas near the sun is lit by it.** The nebula's clouds pick up the
  hub's own colour, falling off with the square of the distance, so the
  gas the vault sits in reads as lit from where the light is.

- **The edges are filtered.** The composite path draws into a render
  target and a render target has no multisampling, so with BLOOM above zero
  every link and spike was on a fixed grid whenever the camera moved. One
  FXAA pass now runs on the finished frame — after the grade and the grain,
  where a filter that must not smear light across black has to sit.

- **Light flows along the links.** The pulses that travelled the links as
  dots are streaks: a head and three points behind it on the same curve,
  shrinking and fading, so the direction — from the note that links to the
  note that is linked — can be read off the motion. Three hundred and
  twenty of them, a quarter faster.

- **The wheel zooms toward the cursor.** The target slides toward the point
  under the cursor by the fraction the range shrinks, so that point stays
  where it is while the rest closes in — no more zoom, pan, zoom, pan to
  reach a planet at the edge. Zooming out, a view locked on a body and the
  mind map leave the target alone.

- **The mind map's keys are on the mind map.** Step, centre, back, hops,
  frame, go to and close were seven keys the popup answered to and nowhere
  named. They are on its footer now, in all four languages.

- **Hiding the HUD says how to get it back**, in a toast, since the panel
  that would have said so is the thing that just went.

- **Two legends promised a third kind of link.** TAG RESONANCE has not been
  drawn since the latent links went, and the mind map's key still listed
  it. It lists the two that exist. STARFIELD's help line now says what the
  knob covers — the whole sky, gas and band and dust included — since OFF
  takes all of it.

- **Thirteen knobs came off the deck.** SPLIT TONE, LENS, GRAIN and AUTO
  EXPOSURE were tuned against each other and had no reason to move one at a
  time; TUNING, ROOM SIZE, ECHO TAIL and ECHO TIME were a mixing desk; NODE
  GRAVITY, ORBIT TRAILS and ORBIT TILT were never reached for; SURFACE
  DETAIL was a frame-rate knob nobody needed once the sprites went, and
  RECENT WORK is a fortnight. All thirteen are fixed at the values they
  shipped at, and a saved value for any of them is no longer honoured.
  ADVANCED is twenty-five controls now, not thirty-nine.

- **Six defaults moved.** STARFIELD ships at OFF, ORBIT GAP at 5.00×, LINK
  GLOW at 0.30×, ZODIACAL LIGHT at 2.00×, SYSTEM GLOW at 0.30× and SKY VEIL
  at OFF. Every old value is still on the slider, and a saved value that is
  the old default to the digit moves to the new one — it is the value
  nobody chose.

- **The scene buffer is half float.** Additive light used to stop at 1.0 in
  the composite path, so a star's core, the sun's disc and a knot of links
  arrived at the same flat white. On WebGL2 the buffer holds the excess, the
  bright pass spills each source by its own excess, and a second shoulder in
  the composite — high, always on, slope one at the join — folds it back
  under 1.0 with the order kept. Nothing under 0.86 is touched. The
  granulation on the sun's disc is visible up close for the first time.

- **Things happen in the sky, and each one is the vault doing something.**
  The comet used to wander in at random and mean nothing. Now a comet lands
  on the note you just touched: the host re-derives the cosmos every time a
  file is written, the difference between the cosmos before and after is the
  list of notes whose file time moved, and each one gets a comet that falls
  in from the edge of the frame and comes down on it, with the ripple sent
  out along its links as it strikes. The first load sends one to the most
  recently touched note, so a vault opens with the place you were last
  working on being pointed at. The wandering comet is still there
  underneath, on its own slow clock.

- **A note deleted while you watch goes out as a supernova.** A body that was
  in the previous cosmos and is not in this one flashes white at the place it
  was, throws off a shell that thins as it spreads, is named once in the
  toast, and — with sound on — lands as a low boom panned to where it stood.
  A rename is not a death: the file keeps its creation time across one, and
  a new body carrying a vanished body's ctime is the same note.

- **The inspector says what a body is.** The shader has decided for a long
  time whether a note is a gas giant, a terrestrial or a rock, and the star's
  temperature has decided its colour; the inspector said none of it. The
  path line now ends with the world's kind, whether it is ringed, and the
  spectral type and temperature of the star it orbits — *F-type star ·
  7000 K*. The STAR SYSTEMS panel carries the letter beside each count, in
  all four languages, and the guide has a line on the three events under
  SKY.

- **The demo has file times and three dead links**, because the sample was
  generated text with neither, and RECENT WORK, the opening comet and the
  black holes all had nothing to show on it.

## 1.14.1

- **The code that had stopped being reachable is gone.** Nothing on screen
  changes; there is simply less of it shipped and less of it to read. The
  permutation-hash generator and the per-body seed were what generated a
  world's texture on the CPU, and worlds became a function the fragment
  shader compiles — the call sites went and the two functions stayed. Three
  sentences in the dictionary, translated four times each, were never asked
  for by any line of code or any `data-i18n` attribute. A colour variable
  nothing read, three element ids nothing looked up, and `clear()` on the
  host API, which no host, harness or test has ever called — the page's own
  CLEAR button empties the cosmos without going through it.

- **The build's own guard had stopped agreeing with itself.** Every call the
  engine makes is checked against the names it declares plus a list of the
  globals it is allowed to reach for, and eighteen entries on that list were
  names the engine does not mention anywhere — `MediaRecorder` among them,
  still carrying a comment about a `vidMime()` that was deleted along with
  the clip capture. A name on that list is a name the check has agreed never
  to question again, so the list is now exactly what the engine uses.

## 1.14.0

- **The ripple sounds like drops on glass.** It borrowed the selection ping
  at a lower level, so a wave through forty notes was a pad. It is a drop
  now: a four-millisecond click, a pitch that rises for fifty milliseconds as
  the cavity the drop made in the water closes, and two glass modes at 2.76
  and 5.40 times the note that die faster than the note does. An octave above
  the note's own pitch, still panned to where it is on screen, and Genesis
  condenses its bodies in the same voice.

- **Links are curves at the range the vault opens at.** ARC HEIGHT shipped
  FLAT and LINK TENSION at 1.00, and from six thousand units — each link a
  few hundred pixels long — that drew a web of straight spokes meeting at
  points: a five-per-cent bow is not a curve at that size, and routing only
  bends a link near its two ends. They rest at 0.60× and 0.70 now, measured
  side by side against the old pair on a 263-note vault: the same links stand
  up out of the plane and bow enough to read as arcs from the default camera
  and from overhead. Both old values are still on the sliders.

  And they are cut finely enough to stay curves. The sample ceiling on a
  vault of up to 1,500 links goes from 16 to 24, because nine links in ten
  were asking for more than 16 and being handed 16 — the ceiling, not the
  tolerance, was deciding how every visible arc was drawn. With it at 24 they
  use three quarters of it and every link is held to its third of a pixel.
  The two larger tiers move one step each (12 to 14, 8 to 10), since there
  the ceiling is also the per-frame upload. 48 fps on the test vault, the
  links costing 0.9 ms a frame.

- **AMBIENT ships off.** Switching sound on asks to hear the vault answer
  when you touch it; a drone that starts the moment the context opens answers
  nothing. The ping, the chime and the wave are reactions and all still come.

- **Every knob says what it is for, on the line that was already there.** The
  foot of the deck carried the pin hint. Put the cursor on a knob and that
  line becomes a sentence on what the knob does — all forty-three, in all four
  languages — and takes the hint back when the cursor leaves. Nothing appears,
  moves or covers anything, and the answer is a hair below the slider being
  touched.

- **Dragging a control no longer raises VAULT DROP.** A drag that caught the
  text of a knob's label is a text drag, and it fired the window's dragenter
  exactly as a folder from the desktop does, so the full-screen drop curtain
  came down over the control being adjusted. The drop target now asks
  `dataTransfer.types` whether a file is what is being dragged, and the labels
  are no longer draggable at all.

- **The sun is still there from far away.** Its corona, streamers and glare
  took the scene's fog, and the fog is measured from the eye and falls as an
  exponential of a square — so pulling back to see the whole vault put the
  star behind twenty thousand units of it, and past about eight thousand the
  fog is not faint, it is zero. All three went out. They now apply the same
  fog themselves with a floor under it: identical at every range anyone was
  already looking from, and from far out the corona keeps three tenths, the
  streamers two, the scattering skirt a little under one. Lifting the fog off
  them outright was tried and rejected — it hung a milky disc over the middle
  of the vault at the default view.

- **ORBIT GAP reaches 12.00× and ORBIT SPREAD 8.00×.** GAP had been raised to
  6.00× for forty folders and a hundred and forty still outgrow it. SPREAD
  shipped with its default equal to its ceiling, so anyone wanting a crowded
  system opened out had run out of slider before touching it. Neither default
  moved.

- **Every key on the panel now says what it does.** The SHORTCUTS pane is a
  list of letters with no sentences in it, which is the right shape for a
  panel you glance at and the wrong one for a panel you are meeting. The
  `[ ? ]` in its title bar reopened FIRST FLIGHT — four moves you already knew
  by then, and nothing about the eleven you did not.

  It opens a guide instead: every row of that pane with a line on what it
  does, plus the three things that have no key and were therefore nowhere in
  the panel at all — the broken-link filter, the route between two notes, and
  what BRIDGE keeps. `?` opens it too, it takes the keyboard while it is up so
  a mode key cannot fire into a cosmos you cannot see, and FIRST FLIGHT is one
  click away at the bottom of it, which is the right way round: the reference
  is what you come back for and the four-move card is a thing inside it.

- **Routed links are curves again.** Two faults, and only one of them was
  about drawing.

  The shape: nothing says a note's star is anywhere near the line between it
  and the note it links to, and often it is behind. That end's control point
  then lands behind its own note, the link leaves in the wrong direction, and
  it turns round to get where it is going — a hairpin with a point on it. One
  link in seven at the shipped routing, two in five with the knob at the top,
  which is why the strands looked spiky exactly where the routing was working
  hardest. Each control is now kept inside its own third of the span, along
  the chord only, so the sideways pull that *is* the routing survives whole
  and a curve that advances cannot double back.

  The sampling: how finely an arc is cut was decided from how far it left its
  own chord, which is the same number on a symmetric arch and the wrong one on
  a routed link — the two halves lean opposite ways, so they cancel in that
  measurement while doubling the bending there is to follow. Links were asking
  for four straight pieces and needing nine. The curve's own bending is
  measured now, every link holds under half a pixel, and the unrouted arch
  comes out on exactly the count it had.

- **LINK GLOW reaches 3.00× again, and rests at 0.20×.** The ceiling was cut
  to 1.30× and then to 0.85× because an additive *line* saturates to white
  long before the top of a knob — both cuts made against a one-pixel line, and
  the links have not been one for some time. A ribbon spreads the same light
  across its width instead of piling it into a single pixel, so the old
  ceiling landed a long way short of anything glaring. The default stays low,
  a quiet structure under the notes; the rest of the range is there for
  anyone who wants the strands in front.

- **The comet's ion tail is cut at 42 samples instead of 26.** The dust tail
  is the comet's own path recorded frame by frame and is as smooth as the
  trajectory; the ion tail is a formula, and a formula is only as smooth as it
  is cut up. It held to a fifth of a pixel from across the vault and most of
  one with the camera alongside — which is the view a comet is worth flying
  over to see. The strip was already cut for 53, so this costs the sixteen
  samples and nothing else.

- **The way between two notes.** A vault's graph is full of paths nobody
  drew: two notes that were never linked to each other are joined all the
  same, through three or four others, and which three is the interesting
  part. A graph view can show you that everything is connected; the useful
  question is *how* this is connected to that.

  **ROUTE FROM HERE**, on the inspector. Press it on one note, choose the
  other the ordinary way — from the sky, the search box or the link list, all
  three come through the same place — and the shortest way between them
  lights up while the rest of the cosmos goes down to a trace. Breadth-first,
  because every link is one step and nothing here weighs one more than
  another, and undirected, because which of two notes did the mentioning is a
  fact about the link rather than about whether you can get from one to the
  other. It says how many hops, or that there is no way at all. Escape or a
  second press puts it away.

- **A note's own properties are in the picture.** Obsidian's Properties are a
  first-class part of a vault — `status: active`, `type: project`, a client, a
  rating, whatever somebody decided to keep about their own notes — and the
  orrery read four keys out of the front matter and threw the rest away. The
  one place a vault carries the structure its owner put there by hand was the
  one place the picture could not see.

  They are on the inspector now, and in the search box: a vault that keeps
  `status: blocked` can be asked for its blocked notes in the same box
  everything else is asked for. Inside Obsidian the values come from
  Obsidian's own YAML parser rather than the engine's line-at-a-time
  fallback, so a nested value or a quoted colon comes out right. The keys the
  engine already consumes are left out, because they are shown somewhere
  better: the tags have their own row, the date is on the badge, and the
  sources are the moons.

- **Dead links are visible, and they are a job rather than a statistic.** The
  count of links that resolve to nothing has been collected on every note
  since the host metadata went in, and was never once shown. It is a row in
  the status panel now, and the names come with it: Obsidian resolves the
  whole vault and knows exactly which text failed, so the inspector lists what
  each note was reaching for instead of only how many times it missed. The
  rows are struck through and are not clickable, because there is nothing at
  the other end to click.

  The row is also the control. Clicking it filters the cosmos down to the
  notes carrying dead links, which is the question a count of ninety of them
  leaves you with and cannot answer. It multiplies with the search filter, so
  "broken, and about kimchi" is a question you can ask, and it clears when a
  vault is loaded. On a vault with none, the row says so and does nothing.

- **Every star in the vault is a star now, not just the hub.** The folder
  stars were a flat-coloured ball under a *wireframe* icosahedron with two
  rings turning over it — precisely the construction the hub was rescued from,
  and precisely what this file's own comments call the tell. One of those got
  fixed and the ten to forty in front of it did not. They compile the same
  photosphere as the hub now: limb darkening, granulation drawn as the lanes
  between the cells, supergranulation, faculae, spots that walk toward the
  equator over a cycle, and differential rotation. Which star is being drawn
  is a `#define` rather than a second design, so the two cannot drift.

  Each one carries a seed and its own temperature. The seed turns the sample
  point about the spin axis, which preserves latitude, so the physics is
  identical on every star and no two of them show the same face or sit at the
  same point of their cycle. The temperature comes from the folder's size,
  because on the main sequence a star's colour follows from its mass and
  nothing else, and it is spread over F to M weighted to the cool end. A vault
  comes out mostly amber and orange with its largest folders going
  yellow-white. The wireframe shell is a soft backside skirt instead, which is
  the construction the hub's own outer glow uses.

  Two things had to be untangled to get there. A star's colour is now what
  lights its planets, because the disc and the light have to agree or a
  planet's day side stops matching the thing lighting it. And SYSTEM GLOW used
  to arrive as the disc's *alpha*, which does not dim a star — it makes it
  see-through, and the nebula behind it comes up through the photosphere. It
  is brightness now, and alpha is left to mean what the legend needs it to.

- **Star colours are no longer encoded twice.** `blackbody()` hands back an
  sRGB triple, which is what an additive sprite wants and exactly what a
  hand-written star shader does not: it encodes its own output at the end, so
  the transfer curve was going on twice. That pulls everything toward white,
  which is why a 4500 K star that ought to be plainly orange came out a pale
  tan. The star shaders take the linear pair now, the hub included.

- **A bare surface does not scatter like a painted ball.** The full Moon looks
  like a flat disc, not a lit sphere: the limb is as bright as the middle,
  with no falloff at all. A Lambert sphere cannot do that. Rock bodies now
  obey Lommel-Seeliger, which is what single scattering through a
  semi-infinite layer of loose grains gives, and it is why every airless body
  photographs the way it does. Written as a correction to the term the
  renderer already applies, normalised so what changes is the shape across the
  disc rather than how bright the body is.

- **A giant's aurorae sit on its magnetic axis**, which is about ten degrees
  off the spin axis on Jupiter and is why its auroral ovals are visibly
  off-centre. Seeded per body, so a world's ovals are where they are every
  time the vault is opened.

- **BRIDGE, a fifth link layer.** The other four filter on the *kind* of link;
  this one keeps only the links whose ends are in different folders and drops
  every link inside one, which on most vaults is the large majority. What is
  left is the traffic between systems — with routing on, exactly the set of
  strands, with nothing else in the frame to read them against.

- **SURFACE DETAIL**, under BODIES. A world is computed rather than looked up,
  so what it costs is decided by how much of it is asked for, and at map range
  the crater field and the fine grain are being resolved to a fraction of a
  pixel and then discarded. They are now skipped once the shader can see that
  is what is happening, and the knob moves the line for a machine that would
  rather have the frame. It cannot change the shape of a world, only detail
  finer than the picture can hold.

- **A folder's name is set like a designation.** Heavier and tracked out,
  where a note's name keeps the ordinary weight of something you read rather
  than navigate by. Size and colour were carrying that distinction alone, and
  both of them are already carrying other things — size is the citation count
  and colour is the link layer's key.

- **A Genesis phase arrives rather than being swapped.** The one cue that the
  formation had moved on was a word that changed between two frames with
  nothing to mark it, which is exactly the kind of change the eye does not
  catch. The tracking now opens out and the glow comes up over a third of a
  second.

- **Every body is a world again, and it is the same world at every range.**
  Bodies wore one machined shell — a plated hull with seams and a band round
  the equator — chosen because the generated worlds before it only ever
  appeared on the one body you had flown to and everything else sampled a
  shared texture, so a planet changed character as you approached it. That
  constraint is kept and the machine is not: there are three kinds of world
  now, all computed from the sphere's own direction in the fragment shader,
  with no texture, no generation pass and no cache, and the instanced bodies
  and the high-detail mesh compile the same function. Which one a body gets
  is decided by its own size — giants for the vault's most-cited notes,
  terrestrials below that, rock for moons and the archive — and the reasoning,
  the albedos and the physics of each are in `docs/astronomy.md`. Craters have
  relief rather than being drawn as stains; giants have zonal bands, a
  long-lived storm and polar aurorae. Giants are flattened about their own
  spin axis the way a fast rotator is, oceans throw a specular glint, and a
  rock brightens sharply at full phase the way a regolith surface does.

- **The mind map is one note's neighbourhood again.** Three things had been
  drawing over it. Bodies that are not on the plate were faded to alpha zero,
  which never did what it sounded like — alpha rides the instance colour and
  the instance colour is not multiplied into a body's diffuse at all — so
  every note in the vault was still a fully lit sphere in the scene, the hub
  among them at the sun's own radius. The hub's corona, streamers and halo
  were put out when the map opened and turned straight back on by the next
  frame, so the plate was lit by a star that is not on it. And the recency
  glow is added rather than multiplied, deliberately, so it survived the
  fade: on an active vault that lit almost every note in the vault at once.
  All three are fixed, and the map is now what it claims to be.

- **The links are routed instead of ruled.** A link was the shortest line
  between its two notes, and five hundred shortest lines is a lattice: every
  one crosses every other, none shares a path with the one beside it, and
  what the picture reports is that there are a lot of links rather than where
  they go. The hub was seventy straight rays out of one point. Each end of a
  link is now drawn toward the star its own note orbits, so every link leaving
  one folder for another leaves along the same road and the two hundred of
  them braid into one visible strand. **LINK ROUTING**, under COSMOS, and at
  0.00 a link is the arc it always was, to the float — the quadratic is
  degree-elevated to a cubic, which is the same curve at the same parameter,
  so the two ends can be moved independently without the knob's zero meaning
  anything new. It is cartography and not physics, and `docs/rendering.md`
  says so. A link is only routed as far out of its way as it is long, so a
  moon reaching its own planet stays short and straight.

- **A link wears its endpoints' colours.** One flat tint per kind said what
  kind of fact a link was and nothing about which two things it joined. Each
  end now carries the colour of the body it touches — which is the honest
  reading, because the end of a link is inside that body's own glow — fading
  back to the kind's tint by the middle, so the key in the status panel stays
  true. With the routing above, a strand between two folders now runs from
  one folder's colour to the other's.

- **The orbital elements are on the inspector.** Kepler's equation has been
  solved for every body every frame since the ellipses went in, and nothing
  on screen said so. Select a note and the inspector now shows the four
  numbers the solver is using for it: the semi-major axis as drawn this
  frame, the eccentricity, the period at the current ORBIT SPEED in
  wall-clock time, and the inclination of the plane it is actually on —
  under ORBIT SHELL, its own plane. Refreshed while the note stays selected,
  because the axis breathes with ORBIT GAP and the period breathes with it.

- **The zodiacal light.** The hub's system now shows the plane it is laid
  out on the way a real one does: a sheet of dust in the plane, lit by the
  star, brightest looked at toward it and with the gegenschein opposite it.
  The radial law, the phase function and the colour are the measured ones —
  see `docs/astronomy.md`. A map-range thing, gone by the time the camera is
  inside the inner ring, on its own **ZODIACAL LIGHT** knob under COSMOS.

- **The frame meters.** A folder out on the rim with nothing bright near it
  used to be a black rectangle with some pale points in it, because every
  frame was exposed for the sun. **AUTO EXPOSURE**, under LIGHT, meters the
  frame off its brightest point and opens up when that point is dim, over
  about a second. It can only lift — with a source in frame the picture is
  the byte-for-byte one it was.

- **A planet's halo obeys the inverse square.** On top of the phase it
  already carried, a body's point of light is now brighter at periapsis than
  at apoapsis by the square of the distance ratio, which is what an ellipse
  does to the light on it and up to a factor of two at the eccentricities
  here.

- **A scale bar.** At the bottom of the frame, a round number of units sized
  to the range the camera is focused on, and a **SCALE** row in the status
  panel with the same number as units per pixel. A map with no scale is a
  picture.

## 1.13.2

- **A lost graphics context no longer looks like a working plugin.** A driver
  reset, a laptop waking from sleep, a machine under memory pressure — any of
  these can take the WebGL context away, and it is the one way the instrument
  goes off that is nobody's decision. What it leaves behind looks exactly like
  a working plugin: the panels are laid out, the vault is loaded, the keys
  respond, and the canvas is black forever. three stops drawing when that
  happens and reports it to the console, which is the one place a user is not
  looking. `lost` is now the third thing the run gate asks about, so the frame
  loop stops rather than burning a core simulating a cosmos nobody can see,
  and a toast — in all four languages — gives the black rectangle an
  explanation. Nothing in the cosmos is lost across the round trip: the
  geometries, the instance buffers and every texture are ours and were never
  on the GPU alone, so what comes back is the view you left.

- **The description leads with what you see.** The line the community list and
  the settings pane show now opens on folders becoming stars and notes
  orbiting them, rather than on a list of what is inside. It is the same
  sentence in the manifest, the package and the README, which is the only way
  three copies of a sentence stay the same sentence.

- **The page in the community browser has pictures in it.** That page is this
  repository's README rendered, and the README had no images at all: two
  placeholders sitting inside HTML comments, aimed at files that were never
  made, while the only two screenshots in `docs/screenshots` were older than
  the last release and referenced by nothing. Four images now, all of the
  cosmos as it is drawn today — the vault, one note in the inspector, the
  mind map and the link web. The six `docs/` pages the README has been
  linking to all along are committed too; until now every "the long version"
  link was a 404 for anyone who followed one.

## 1.13.1

- **The description says what the plugin is.** The line the community list
  shows — and the one in the manifest — still promised a spaceship and a
  surface mode. The ship went in 1.13.0 and the surface mode some releases
  before that; neither is what anyone installing this will find. It now says
  what is there: a lit star system, a mind map, Genesis, ambient sound, and
  nothing fetched from anywhere. The same wording is submitted to the
  community list, which keeps its own copy.

## 1.13.0

The light was all built and none of it was switched on. It is on now, and
turning it on found the reason it had never been: the film curve was lifting
the blacks instead of leaving them alone. And three things that stood between
the reader and the cosmos — a spaceship, a similarity guesser and a preset
switch — are gone, so what is left is the vault, lit.

### What is drawn

- **The picture ships lit.** BLOOM, FILM CURVE, SPLIT TONE, LENS and GRAIN
  were all written, all argued for at length in the source, and all shipped at
  zero — so the frame everybody actually saw was the one those notes were
  complaining about: a sun that is a flat white coin, folder stars that are
  pale dots, and a highlight that clips rather than rolls off. All five are on
  at the defaults now, chosen against each other rather than one at a time,
  and the frame gate is unchanged, so anyone who turns them off gets the plain
  path back exactly as before.

- **LINK GLOW opens at 0.15× and STARFIELD at 0.40×.** Both were tuned for a
  frame with no bloom in it. With the bloom on, links at 0.42× were the
  brightest thing in the picture — a web of light with a vault somewhere
  behind it — and a starfield at 1.20× competed with the systems for the eye.
  The links are now a structure you read and the sky is a place the vault
  sits in. A saved value that is the old default to the digit is moved to the
  new one once; a value somebody chose is left alone.

- **A note is never smaller than a star.** A glow sprite scales with range,
  and past a few thousand units every planet in the vault had scaled to under
  a pixel and gone: the opening frame was ten folder stars and nothing else, a
  vault of four hundred notes reading as a vault of ten. The node and star
  sprites now have a floor in pixels, the way a star in a photograph is never
  smaller than the seeing lets it be, so every note stays a point of light
  from as far as the camera goes. The sky's own points keep no floor; the sky
  is meant to fall away.

- **The opening frame is closer.** 1.25 of the fitted radius rather than 1.7.
  The percentile fit already drops the scatter; what was left was a frame
  with the vault in its middle third and black round it.

- **Each system sits in its own gas.** From across the vault a folder was a
  coloured point with a name under it and the room its orbits take up was
  black, which is a diagram's idea of a system. A cluster of young stars sits
  in the cloud it condensed out of, lit from inside by its own light, and that
  faint colour round a bright point is most of what makes a region of sky read
  as a place. So every wiki system gets three very large, very dim points in
  its own colour — a core on the star and two lobes out along an axis of the
  system's own, because gas is drawn out along whatever compressed it and a
  single gaussian is a round fog — sized to its orbits and riding ORBIT GAP
  and ORBIT SPREAD live. It is a map-range object — full from four reaches
  out, gone by a reach and a half, because up close a haze in front of the
  planets is fog over the thing you came to look at. SYSTEM GLOW scales it
  with the star.

- **The worlds are worn, and their air shows.** Two planets of one folder
  were the same planet twice. The hull plating now varies slowly over groups
  of plates as well as plate by plate, so each has weathering of its own; the
  day gradient carries more of the star's light; and the atmosphere on the
  limb — Rayleigh blue at noon, copper at the terminator, a white forward
  halo when the star is behind — is turned up to where it can be seen at the
  range a planet is actually read from.

- **The HUD steps back.** Nine seconds without a hand on the mouse or a key
  and the four panels fade to a quarter, over a couple of seconds; any input
  brings them straight back. They are most of the frame at leaf sizes, and
  the frame is what the view is for. Never while searching, in Genesis or in
  the mind map, and never to nothing.

- **The film curve was lifting the blacks, not leaving them alone.** Below the
  knee the shoulder term is zero, so the whole expression is the straight part
  — which has to be the pixel and was the knee itself. Every value under 0.72
  came out *at* 0.72 and was then mixed back toward itself, so empty space at
  rgb(3,5,12) left the composite at rgb(72,73,77): a grey sky, in a renderer
  whose entire subject is points of light on a black one. It never showed
  because the knob shipped at zero. Both halves still meet with the same
  slope, which is what the exponential was chosen for.

- **The bloom spills only what is over.** The bright pass masked rather than
  subtracted, so a mid-grey region that crossed the threshold contributed all
  of itself — and the sky is full of exactly that: the galaxy's band, a nebula
  complex, the dust disk, four thousand starfield points. None of them bright,
  all of them over, and three chained blurs spreading their sum across the
  frame. What a lens spills is the light in excess of what the sensor could
  hold, so the threshold is subtracted now. A star's core still blooms; the
  Milky Way no longer washes the frame it is in.

- **A folder's colour is computed from how many folders there are.** It was
  eleven hues in a list, taken modulo the count — so a twelfth top-level
  folder got hue number one back exactly, in the legend and in the sky, and a
  vault with twelve of them is ordinary rather than large. The list also
  spanned 82°, which is seven degrees a folder, and seven degrees at this
  saturation is a difference you can measure and cannot see. The band is 148°
  now — aqua to magenta, still one arc of the wheel, stopping short of the
  green that reads as a highlighter and of the warm end that belongs to star
  temperature and to the HUD's amber — and it is divided by the count, so
  there is no list to run out of. The order is a stride rather than a walk,
  because adjacent legend rows are what get compared, and saturation and
  lightness cycle underneath the hue so that the closest pair in any palette
  is never relying on hue alone.

- **A folder star keeps its colour at map range.** Its glow sprite was mixed
  0.62 of the way to white, and that sprite is the only thing carrying a
  system's identity from across the vault — the disc is four pixels, the ring
  is under one, and the label has usually been arbitrated away. It is 0.44
  now. The core stays white, which is what a bright source looks like.

- **The opening frame is of the vault, not of its furthest body.** fitView
  took the maximum radius over every node, and the maximum is the one
  statistic this cosmos cannot be described by: the archive shell and the far
  end of the undated spiral are a handful of bodies sitting a long way outside
  everything else, and the whole picture was being backed off until they were
  in it. The ninety-third percentile instead — every folder star and every
  planet kept, the scatter that was setting the range on its own dropped.

### What is gone

- **The spaceship.** `F` put you in a cockpit with WASD, a scanner, a radar
  bowl, a contacts list, a rear scan, a folder filter, a patrol, a heat alarm,
  a warp field, streaking stars, motion blur, camera shake and its own engine
  noise — a second application inside the first, with its own HUD, its own
  key map, its own sound and eleven hundred lines of its own. Everything it
  did that mattered to reading a vault the orrery already does from where you
  are: the inspector's travel button goes to a note, the ripple lights what a
  note is tied to, the mind map lays its neighbourhood out. What the cockpit
  added was a game over the instrument, and the two were fighting for the
  same screen. Gone with it: SHIP THRUST and SPEED FEEL, the `ship` command,
  the radar's own store key, the two cockpit passes in the composite, the
  streak arithmetic in the glow shader, the thruster, the rumble, the
  proximity alarm and the Doppler on the ping.

- **Twins.** `N` proposed notes alike but not yet linked, from shared tags and
  shared neighbours, and drew the proposals in violet across the cosmos. A
  guess, drawn in the same space as the facts, and a guess about the vault is
  the editor's question rather than the orrery's. The `twins` command and the
  inspector's button go with it.

- **Latent links.** The parser inferred a third kind of edge from tags between
  orphans and the notes that shared them, and LINK LAYER had a LATENT stop
  for it. Same reasoning: the cosmos shows what the vault says. It is ALL ·
  WIKI · SOURCE · OFF now, the violet is out of the legend, and the vault's
  edge count is the count of links that are written.

- **The look switch.** PLAIN · DEEP · CINEMA lived on the deck for the length
  of one unreleased build. Two of the three differed from each other by
  amounts that needed a pixel probe to tell apart, and a control whose
  positions cannot be seen is a control that should not be on the deck. The
  defaults are what DEEP was; PLAIN is every LIGHT knob at OFF, which they all
  reach; and CINEMA's one real difference — the orbits leaning out of the
  plane — is ORBIT TILT, which is still there.

### What is heard

- **A note comes from where it is.** Every ping is placed in the stereo field
  at its body's position on screen, through a panner made for that one voice,
  so a note on the left is heard on the left and the ones still ringing do not
  slew toward the newest.

- **The ripple is heard.** The wave already lights each note as its front
  arrives; it sounds it now too, in the note's own pitch, quieter with every
  hop in step with the light. A shell of notes reached together is queued a
  few tens of milliseconds apart rather than struck at once — an arpeggio,
  which is what a wave crossing a structure sounds like — and a shell too big
  for its moment is cut rather than compressed. Genesis borrows the same voice
  for bodies as they condense, so a replay of the formation is a melody in
  the vault's own order. **RIPPLE** under SOUND is the level, and goes to OFF.

- **The room follows the range.** The one thing the camera does all day is
  move in and out, and the sound knew nothing about it. Pulled back to take
  in the whole vault the drone closes down and the tail comes forward; in
  among the planets it opens up and dries out. Small on purpose, and slewed,
  so a zoom is a movement rather than a wobble.

### Underneath

- **The build parses what it writes.** A backtick inside a comment inside a
  GLSL template string closes the string, and everything after it becomes code
  — a syntax error a hundred lines from the character that caused it. Nothing
  here could see it: the substitutions all match, the residue scan is regexes
  over text, the call check strips template strings before it looks, and the
  smoke test never gets as far as parsing the engine. `new Function` on the
  output does, and costs nothing.

- **The harness reads the frame back off the GPU.** The curve bug was a
  pixel, and a pixel is the one thing the build and the smoke test cannot
  see. A new step resets the deck and reads the corner of the frame through
  `readPixels`, asserting that empty space is still empty and that RESET
  lands on the two defaults this release pinned. A second step asserts the
  removed modes are neither commands nor markup. The harness takes a store
  now, so what happens to settings written by an older version can be tested
  at all.

- **The new defaults reach the people who never chose the old ones.** A blob
  saved before this holds five explicit zeros for the grade, and they are
  real numbers, so the load keeps them — correctly, because overwriting a
  setting somebody chose is the one thing a load must never do. All five at
  zero is exactly what the old defaults left behind and is the only evidence
  available that nobody has been in there, so that state is moved to the lit
  defaults once, marked, and never asked about again. LINK GLOW and
  STARFIELD get the same treatment by value: the old default to the digit
  moves, anything else stays.

## 1.12.0

The mind map is not drawn on top of the cosmos any more. It is drawn *in* it.
The meteors are gone.

### What is drawn

- **The mind map is a place, not a picture of one.** It was a second renderer:
  a 2D canvas laid over the view with its own starfield, its own milky way,
  its own spiral dust and nebula, its own orbits, bodies, links and pulses —
  the same cosmos implemented a second time in miniature, in a different
  language, against a different set of bugs. Everything 1.11.0 did to it was
  work spent making the copy look more like the original.

  What opens now is the original. The note goes to the middle of the sky you
  were already looking at, its neighbours are lifted onto lanes around it, and
  the rest of the vault stays where it is and dims. Nothing is rebuilt and
  nothing is restored on the way out: the bodies keep their own orbits and
  their own mean anomalies the whole time it is open, so closing the map puts
  every one of them back exactly where the cosmos had got to, still moving.
  The starfield, the nebula, the dust and the light are the real ones, because
  they are the same ones.

- **A note's size on the plate is which ring it is on, and nothing else.** That
  is the whole claim this mode makes — structure without the hierarchy the
  cosmos draws — and it is made in three places at once, because a size is not
  the only thing that says how big something is. The radii are flattened to
  one value per hop. The halos are flattened with them: the same law, the same
  phase, the same one of the three SIZE knobs, for every body on the plate. And
  the light comes from the middle of the map rather than from whichever folder
  star each note happens to belong to, so the terminator falls the same way on
  all of them and the plate reads as one system instead of as a dozen.

- **The index note keeps its gold and loses its glare.** Its halo used to be
  drawn under the core's law — full brightness, no phase, scaled by SUN GLOW —
  while its body was collapsed to nothing for the sun to draw, and the sun is
  not drawn in here. What that came out as was a soft ball of light two lanes
  wide with nothing inside it, and a wheel of neighbours nobody could see past
  it. It is a planet like the rest of them now, and then held to half of one:
  equal alpha is not equal presence when the hues are this far apart — the
  wheel is teal against a blue-black sky and vanishes into it, the hub's gold
  is that sky's opposite and carries. Half is the setting at which it is the
  one body on the lane wearing a visible glow, which is all "this is the
  index" needs to say.

- **The lanes are wider.** They were set to the tightest arrangement that
  still read, which is not the same thing as the one that reads best: packed
  to the floor, every note sat inside the glow of the next one and the plate
  came out as a bright ring rather than as a note with things around it. The
  camera frames whatever the lanes work out to, so the extra room is spent on
  the gaps rather than taken off the screen.

- **The meteors are gone.** Not slowed further — removed. They were the one
  thing in this sky that was honestly a lie: an atmospheric event, drawn where
  there is no atmosphere, in a picture whose whole argument is that everything
  in it is either measured or says out loud that it is not. Three hundred
  lines of very good physics for something that should not have been in the
  frame. The physics is in the history if it is ever wanted back.

### What it is like to use

- **Clicking a note in the map lights that note's links.** The map used to hold
  the selection back from the links deliberately — every link in there is one
  of the things it was opened to show. At seventeen neighbours that reasoning
  breaks: each of them is crossed by a dozen links that have nothing to do with
  the one being read. So a selection dims the rest in here exactly as it does
  out in the cosmos, and the map opens with its own middle selected, which is
  the picture it was opened for.

- **The camera slides out from under the rail.** The map's panel covers the
  right of the leaf, so a system framed against the window was framed half
  underneath it. The camera now steps along its own right axis by half the
  rail's width, measured in world units at the range it is looking from —
  position only, orientation untouched. The framing the rig worked out is
  otherwise exactly kept.

- **The camera stops following a body around its lane.** Selecting a note out
  in the cosmos locks the view onto it, which in here would turn the whole
  plate under the reader every time they read something. The map holds the
  camera on the system.

- **Opening a note does not leave the map.** With FOLLOW ACTIVE NOTE on, every
  tab switch flew the camera at the newly active body — dropping the range
  onto one note and taking the plate off the edges of the leaf. A reveal is
  answered in the map's own terms now: the note is read if it is on the plate,
  and the map re-roots on it if it is not, which is the same walk the rail
  already does.

### Underneath

- **The build checks its own seam.** The generator wraps the engine in a
  preamble and an epilogue, and those two were exempt from the check that every
  call in the file resolves to something. So when the mind map's resize handler
  was deleted, the epilogue went on calling it for a build — a dead call in the
  eleven lines the checker was not looking at. Anything that ends up inside
  `createOrrery()` is code, whoever wrote it.

- **The harness runs a frame of the map.** Nothing else in the repository can:
  the mind map is a mode of the live scene now, so what it does is rewrite
  positions, radii and alphas in place and hand them all back on the way out,
  and none of that exists until something draws. The new step opens it, checks
  that bodies one hop out came out the same size, walks it, closes it, and
  asserts the cosmos got its own radii back — a radius left flattened after the
  map closes is a vault that has quietly stopped reporting citation counts.

## 1.11.0

The mind map is drawn in a different material, the meteors have slowed down,
and the view has stopped zooming into its own top-left corner.

### What is drawn

- **A note on the mind map is a shell, not a sphere.** It was a lit ball: a
  radial gradient with the highlight off to one side, a terminator across it,
  a warm limb facing the star and a cold one facing away, turned so its day
  side pointed at the middle of the plate. Accurate to the cosmos next door,
  and the wrong object here — a planet is opaque, so it deleted the links
  passing behind it; a planet is lit, so it claimed a light source the plate
  does not have; and a shaded ball with a specular dot on it is the house
  style of every 3D chart drawn since about 2004.

  What is there now is an interior faint enough to see a link through, one
  hairline at the silhouette, and a soft core. Nothing inside it: a pair of
  crossed ellipses went in first and came straight back out, because what they
  drew was not a note but the electron-shell diagram off a school chemistry
  book. Twenty-six of these on a plate should read as quiet points of light,
  and anything drawn inside one is a detail nobody is close enough to see.

- **The spokes give way to the chords.** Every first-ring note had a line to
  the star, all of them the same weight, and the proposition each one stated
  was "this note is a neighbour of the note in the middle" — which is what
  being on the first ring already says. Half the ink on the plate, carrying
  nothing, while the links that carry something — first ring to first ring,
  which is to say where the clusters are — were drawn in the same weight and
  lost inside the wheel. The spokes are faded out toward the star now: full
  weight where the line meets its note, nothing by the time it reaches the
  middle. The attachment is still legible at the end you look for it at, and
  the structure is left as the brightest thing on the plate.

- **The links are filaments.** Every one of them was about a third thicker
  than it is now and carried a dark casing nearly three pixels wider than
  itself, which at two dozen links is a plate drawn in cable. The casing still
  breaks a crossing; it no longer outlines the line. And the coloured pass is
  additive, so two dim links over each other read as a crossing rather than as
  one thicker link.

- **The plate has a near side.** Bodies are painted back to front and scaled
  by where they sit on their own ring, with the far half losing a little
  contrast to the air in between. Both cues are small — this is a disc seen
  almost face on — and together they are what stops a ring reading as a circle
  drawn on glass.

- **The meteors cross slowly.** One to two seconds is what a real grain takes
  and it is what a *streak* looks like: a scratch, over before the eye has
  finished moving to it. Three to five seconds, a ribbon two and a half times
  as long behind them, a curve biased away from zero so none of them is ruled,
  and a glow left in the air after every one rather than only after a
  fireball. The light curve keeps its climb, because a meteor really does
  brighten through most of its flight; what it loses is the cliff at the end,
  which was the grain running out modelled honestly and read as the light
  being switched off.

  The wake is teal rather than green. Green is correct — it is the forbidden
  oxygen line at 557.7 nm, and it is why a green meteor in a photograph is
  real — and it is the one hue on this palette with nothing else near it, so a
  green streak across a cyan and amber sky reads as a highlighter rather than
  as part of the sky. The physics note in the source still says what is
  actually happening in the air. This is a decision about the picture.

- **Three knobs ship where they were left.** PLANET GLOW 0.40x, SUN HALO
  1.00x, SKY VEIL 0.20x.

### What it is like to use

- **The view stops zooming into its own top-left corner.** `#gl` was given
  `inset: 0` and no width, and a canvas is a replaced element: an absolutely
  positioned one with `width: auto` takes its intrinsic size — the backing
  store, read as CSS pixels — and drops the side of the inset it cannot
  honour. So the element was sized by its own buffer. `setSize(w, h, false)`
  says "do not touch the style" and nothing else touched it either, so every
  change of pixel ratio resized the element by the same factor; and the
  adaptive supersampler changes that ratio in steps once the camera has been
  still for a moment. Each step made the canvas a sharper picture and a larger
  box at once, anchored top-left, with the overflow clipped away — the view
  jumping larger toward the top left, in stages, over the first seconds, and
  then settling once the sampler stopped climbing. Not a camera bug, a layout
  one. The other two canvases in this file were always sized explicitly; this
  was the one exception.

- **The space bar reaches the note you are typing in.** The mind map, the
  spaceship, the search box and the rest are bound on the window, and the
  window belongs to the host as much as to this view: an orrery open in a
  background tab still sees the keys typed into the note in the foreground
  one. The guard against that was a test of the target's tag name, and
  Obsidian's editor is a contenteditable div — so SPACE reached the ripple
  branch, was preventDefault-ed, and never reached the sentence being typed.
  So were `/`, `F`, `M`, `G`, `N`, `P`, `U`, `O`, `R`, `L`, `X`, `H`, Ctrl-K
  and Escape. The question is what the element is *for*, not what it is
  called, and an editing surface is anything focus can put text into.

- **The opening is not judged as a still frame.** The supersampler decides the
  frame is still by reading the camera matrix, and for the first second after
  a vault is built the camera is very nearly the only thing in the picture
  that is not moving: the range eases in and its spring is under a sixteenth
  of a pixel long before the sky has finished arriving, the gap spring opens
  every orbit underneath it and overshoots on purpose, and every material is
  still compiling the first time it is drawn. So it promoted, met a frame rate
  that was low for reasons that had nothing to do with how many pixels it was
  drawing, demoted itself and lowered its ceiling for the rest of the session.
  What has to have stopped is the cosmos, not the camera.

## 1.10.0

The picture this opens with is a different picture, and the camera has stopped
ticking.

### What is drawn

- **Every knob ships where somebody actually left it.** The defaults in the
  table were the numbers each control happened to be written with, one at a
  time, over nine versions — and a set of defaults chosen one at a time is not
  a look, it is a list. These were taken together, from a deck that had been
  flown rather than authored: ORBIT SPEED 0.10x, NODE GLOW 1.11x, LINK GLOW
  0.42x, ORBIT GAP 2.81x, LINE WIDTH 0.6 px, ORBIT TRAILS 1.00, STARFIELD
  1.20x, SHIP THRUST 0.29x, the four body sizes and the four body glows
  rebalanced around a much brighter moon, SUN RAYS 0.53x and SUN HALO 0.80x.

  The grade ships off. BLOOM, FILM CURVE, SPLIT TONE, LENS and GRAIN are all
  at zero, which is the setting the composite's own gate was written for — a
  frame that asks for none of them takes the plain path and pays for no
  full-screen pass at all. They are one drag away for anyone who wants them,
  and the note beside each one still says what it is for. What this changes is
  which of those is a decision the reader makes rather than one already made
  for them.

  Nothing moves for anyone who has used this before. The saved settings blob
  is read first and a value in it wins; these are what a fresh vault opens
  with, and what RESET goes back to.

- **MAX NODES really does ship at NO LIMIT.** It has said so in the engine
  since the ceiling became a slider, and inside Obsidian it was never true:
  the plugin's own Maximum notes setting defaulted to 3000 and is pushed into
  the view at mount, so the engine's default was one nobody had ever been
  given. The two agree now, and they agree on no ceiling — a cap that quietly
  drops half a vault answers "show me my notes" with a subset, where a slow
  first minute is at least a problem whose cause is visible.

### What it is like to use

- **The camera has stopped ticking.** A body's angle is not a function of the
  clock: it is integrated frame by frame into its own accumulator, so that
  ORBIT SPREAD and ORBIT GAP can change a period without rewriting the body's
  past. That accumulator lived in an array the layout allocates, the folder
  stars kept theirs on objects the layout builds, and a star's roll was drawn
  fresh from Math.random() every time the objects were — so every rebuild threw
  all three away and the whole sky snapped back to its opening phase.

  Inside Obsidian the cosmos re-derives a couple of seconds after every save,
  and the camera is restored across that exactly. So the symptom was not "the
  planets jumped". It was the camera appearing to tick: holding perfectly
  still while everything it was framing ran two and a half seconds forward and
  then back to the beginning, over and over, for as long as anyone was writing
  in the vault. The phases travel across a rebuild now, the way the camera
  already did — keyed by the note's path and the folder's key, because indices
  are rebuilt and name a different note by the next pass. A note that has just
  arrived starts where the layout put it, which is the only place it can.

- **The view's own controls stop being overwritten.** The plugin pushes three
  settings into an open view on every workspace layout-change, because
  Obsidian's excluded-files list can change underneath it and there is no
  event for that. It pushed them unconditionally, and two of them the view
  owns a control for — so clicking the language chip or dragging MAX NODES was
  undone by the next layout event, which is every sidebar toggle. Only a
  change to the plugin's own value is an instruction now. And "Match
  Obsidian" is a fallback rather than an override: a view already carrying a
  language somebody chose inside it keeps it.

- **RESET puts back everything it says it does.** It restored the numbers and
  told the audio graph and the tinted buffer about it, and told nothing else —
  so the four body sizes, STARFIELD, SKY VEIL and RECENT WORK went back to
  their defaults in the readout and stayed exactly where they had been dragged
  in the picture, which is the one thing RESET exists not to do. It runs every
  hook in the knob table now, so a control added later cannot be left out of
  it the same way.

- **A value with a unit in it stops breaking across two lines.** LINE WIDTH,
  ROOM SIZE, ECHO TIME and TUNING read as a number and a unit with a space
  between them, and in a narrow column that wrapped — which cost the row a
  line of height and pushed its slider out of line with every other slider on
  the shelf. The label beside it is already allowed to ellipse; the value
  giving way instead of the label was nobody's intent.

## 1.9.0

Four things about the picture and one about finding your way round it. The
structural lines are ribbons that can be as wide as you ask; the composite
finally does the grading its own source has been describing for versions; the
sky's veil stopped being nine coloured gels; and there is one box now for
every kind of thing this has a name for.

### What is drawn

- **Every structural line is a ribbon, and LINE WIDTH means pixels.** The
  links, the orbit wakes, the comet's two tails and the twins were GL lines,
  which are one device pixel wide whatever the display calls a pixel — so the
  better the monitor the fainter the structure, and width, the one channel a
  line has for saying how firm a fact is, was spent before anything could use
  it. They are strips now, two vertices a sample out of one shared buffer,
  with the profile across the width doing the antialiasing.

  And the knob tells the truth. The first profile fell through half its peak
  at thirteen per cent of the geometric half-width, so the 1.7 px default was
  drawing a visible core about a quarter of a pixel across — a hairline again,
  and thin enough to land on some pixel centres and miss others, which is why
  the links read as *broken* rather than as fine. The strip is built wider
  than the request and the profile is measured against the width that was
  asked for, so the half power lands where the knob says the edge is. The
  exposure does not move with it: the new profile integrates to what the old
  one did, and the test holds it there. Width and brightness are separate
  controls here, and LINK GLOW is still the one that does brightness.

- **The composite has the grade it has been describing.** The note above it
  has listed four things that separate a render from a photograph — the curve,
  the split, the lens, the grain — and said all four were knobs. None of them
  existed.

  The curve is the one that matters. Everything before it is additive, and
  additive light in an eight-bit buffer stops at 1.0 whether it arrived gently
  or at four times over, so a star core, a knot of links and the sun's disc
  all clipped to the same flat white — and a flat white patch is paint, not
  light. There is an exponential shoulder instead, which meets the straight
  part at the same slope so nothing pops crossing the knee, and which
  approaches 1.0 without reaching it: the clip is gone rather than moved.
  Below the knee nothing happens at all, because the dark here is empty space
  and a curve that lifts it is describing a room with the lights off.

  The split sends shadows cold and highlights warm, by multiplying rather than
  mixing toward a colour, so a fragment carrying no light gets a tint of one
  times zero and space stays black. The lens is in two halves for a physical
  reason: the colour separating toward the corners is applied to the scene
  before the bloom, because glass comes before the sensor, and the vignette is
  last, because an aperture cuts everything. The grain is a dither floor
  against banding — strongest in the shadows, where the banding is — moved by
  the wall clock rather than the orrery's own, since a paused cosmos with
  frozen grain is a dirty lens rather than film.

  Four knobs and not one, because they fail differently: a curve too strong is
  flat, a split too strong is a cast, a lens too strong is a tunnel and grain
  too strong is dirt. All four at zero take the plain path again.

- **The veil has one sky's colour instead of nine gels.** Nine curtains each
  drew a hue out of a hundred and fifty degrees and then walked it another
  hundred and twenty along their own length, so a sky could be teal and violet
  and magenta at once — which is not a place, it is a set of gels over the
  lens.

  Colour comes from two emission lines now, hydrogen alpha and doubly ionised
  oxygen, because that is where a real nebula's does and the violet between
  them is those two mixing rather than a third choice. One anchor is drawn for
  the whole vault and every curtain sits near it: forty degrees across a sky
  rather than two hundred and seventy. Saturation is down to about a fifth of
  what it was, which was the bigger half of the problem — a field that large
  keeping its colour reads as a filter in front of the lens, because distance
  takes saturation first and the eye knows it.

  Most of the curtains lean the way the galaxy does, within thirty degrees of
  the plane the band already sits in, with two left free to cross it: a sky
  organised around one plane is a sky, and nine great circles at nine
  unrelated angles is a wireframe whose crossings look like they mean
  something. And they have two things they had none of — rifts, because an
  additive sheet cannot draw a dark lane but it can be taken away where the
  dust is, which lands the same picture with two bright edges; and a bent
  envelope, because a sine put the bright part in the middle of all nine and
  gave them one silhouette between them.

### What it is like to use

- **One box for a note, a knob or an action.** There were two. Slash opened a
  note finder in the middle of the screen and the control deck had a filter of
  its own in its tab strip, and between them they answered "where is that
  note" and "where is that knob" — which is one question with two nouns in it.
  Somebody who wanted GRAIN and typed slash got a list of notes with grain in
  the title.

  The box takes all three kinds of thing this has names for, with the kind as
  a label on the row rather than a mode to be in first. A note is a place and
  is flown to, Ctrl-Enter to read it instead. A knob is a control, so it is
  put in front of you rather than moved: the drawer opens, the filter goes to
  it, the row scrolls into view and flashes once — guessing which way you
  wanted a slider pushed is not something a search box gets to do. An action
  is a verb and is performed, which is a second way in for anyone who knows
  the name of the thing but not the letter. Ctrl-K as well as slash, and it no
  longer refuses an empty vault: the notes need one, the knobs and the actions
  do not.

- **A long link list can be asked for the rest of itself.** The inspector
  printed fourteen links under a heading that said two hundred and three. It
  told you exactly how much of the answer it was keeping and gave you no way
  to ask for it. The cap stays — a hub with two hundred backlinks would push
  every button under the list off the bottom of the pane — but the rest is one
  click below it now. The heading also counts the notes it is about to list
  rather than the edges behind them: two notes can be joined twice, a written
  link and a tag resonance being different facts about the same pair, and the
  list has always shown such a pair once.

### Removed

- **FOCUS DEPTH and DEPTH CUE.** The depth-of-field pass and the aerial
  perspective are gone, and with them the depth texture attached to the scene
  target, the half-resolution defocus buffer and the four blur passes that
  filled it.

## 1.8.0

The astronomy audited against itself. Every term this view uses as a name for
something — Kepler, limb darkening, the Roche limit, Rayleigh, tidal locking —
was checked to see whether the code behind it does what the word means, and
where it did not, it does now. Nothing here is a new feature. It is the same
cosmos, telling the truth about more of itself.

The second half of it is the same audit turned on the picture rather than
the mechanics: the halo, the spikes, the bloom and the gas were all shaped
by eye, and all four have a measured shape available that is more
interesting than the one anybody would draw.

### What is drawn

- **The ice display is uneven, and it has its upside-down rainbow.** Every
  ring was a perfect annulus of constant brightness and width, and no
  photograph of a halo shows one — it shows two thirds of a ring, brighter on
  one side, with a gap, because a halo is made by whatever crystals happen to
  lie along that line of sight. One cloud field now feeds every refraction
  feature, so where the ring is thin the sun dog on that side is thin with
  it, and the two dogs are drawn separately because in a real display one is
  plainly brighter. Added: the circumzenithal arc, which is centred on the
  zenith rather than the sun so it opens upward where everything else opens
  down, and which keeps its violet because it is made by one clean prism in
  one orientation with nothing overlapping to wash the short end out. Also
  the lower tangent arc, the correct 46/22 ratio between the rings, sun dog
  tails that go white and then blue because they are different light from
  their cores, and a pillar that widens with height.

- **Diffraction spikes have fringes.** A spike is the Fraunhofer pattern of a
  straight edge — sinc squared, a bright centre and then secondary maxima
  falling off as the inverse square of their order — which is why a real
  spike is beaded rather than ruled. Drawn as fringes on a taper, because
  that is what a photograph is: the arm is grossly overexposed for most of
  its length, so the 1/u² decay reads as the taper and the interference is
  what is left to see. And the fringes are chromatic, so the arm breaks into
  colour toward its tip, exactly as in every telescope image.

- **The bloom keeps all three of its widths.** The chain computed three
  progressively wider gaussians and threw two away, and a chain of gaussians
  is a gaussian: a soft mound with nothing outside it. Real veiling glare is
  a power law, with a bright centre *and* a long tail, which no single
  gaussian has at once. Summing the three costs two render targets and no
  extra passes, and the weights sum to one so the light added is what it was
  and only its distribution moved.

- **The nebulae are filamentary and have an ionisation front.** Gas is
  threaded by field and shaped by stellar winds, so a long exposure shows
  strands and cavities rather than a gaussian ball. And an HII region is not
  one colour: close to the hot stars, oxygen stripped twice over emits at
  500.7 nm and the gas is teal — the Orion Nebula's core, and the middle of
  every planetary nebula — while further out hydrogen recombines and gives
  Hα at 656 nm. Teal core, red skirt, blended through pink rather than round
  the hue wheel through violet.

- **The meteors burn instead of sparking.** A meteor's light climbs and then
  stops — the thing setting the air alight is the air, and there is
  exponentially more of it further down — so it peaks past three quarters of
  the flight and ends abruptly rather than fading, which is the opposite of
  what it did. It flares where the grain comes apart and a bright one ends in
  a burst. Its head is the metal (magnesium blue-white, sodium yellow, iron
  gold, chosen by speed the way the Leonids and the Taurids differ) and its
  wake is atomic oxygen at 557.7 nm, the same forbidden green as the aurora —
  two different colours, where before there was one. And the bright ones now
  leave a persistent train that outlives them by seconds, spreading as it
  cools and drifting sideways in a wind.

- **The band has its star clouds, its waist and its rift.** The Milky Way was
  a strip of constant width with one gaussian bulge on it and a dust lane
  running the whole way round, and all three are things anybody who has stood
  under the band would correct first. It is lumpy: the lumps are the places
  where a sight line happens to run down the length of an arm rather than
  across it, and they have names and measured longitudes — the Great
  Sagittarius cloud, Scutum, Norma, Cygnus, Carina, here at their real
  longitudes off the core, with a fine mottle between them so the gaps are
  grainy rather than swept. It is not the same width all the way round:
  toward the core you look the long way down the disc, through the bulge, and
  it is twenty-odd degrees across, while toward the anticentre you look
  outward through the thin end of a disc and it is a narrow line. And the
  Great Rift is not a belt — it is one nearby complex of molecular cloud in
  the Orion arm, running from Cygnus down to Sagittarius and stopping, so
  drawing it right round the sky made the band symmetrical, which is the one
  thing the band is not. The population is reddened toward the core as well,
  because that sight line carries the most dust, which is why the bulge is
  orange in a photograph.

### What it is like to use

- **ORBIT GAP is no longer a second brightness control.** Turning it down drew
  the vault in and made the galaxy behind it brighter, because the dust and
  the nebulae ride that scale and packing the same fourteen thousand sprites
  into a smaller patch of sky raises the surface brightness by the square of
  the scale. The per-point alpha now rides that square back.

- **A drag turns the view the same amount on every mouse.** Sensitivity
  depended on how often the pointer reported — a property of the mouse, the
  trackpad, the monitor's refresh and whatever the browser coalesced — because
  momentum was accumulated per event and spent per frame. The same six hundred
  pixels turned the view 8.92 radians as thirty events and 5.96 as six
  hundred. Momentum is now measured per frame and spent only after release,
  so the drag is the pixel count times one gain and nothing else.

- **The deck opens small, in the top right corner**, rather than centred and
  eight hundred and eighty wide across the head of the frame. Labels too long
  for the narrow column walk to their own ends and back every thirteen
  seconds instead of being clipped, staggered so the deck reads as a rhythm
  rather than a shimmer. And the deck scrolls instead of folding itself away —
  the old rule collapsed the panel when you opened ADVANCED on it.

### What is claimed

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

- **The rings throw their shadow onto the planet.** A ring lies over its
  planet's equator with the star off to one side, so the shadow lands on the
  globe as bands — and since the rings are not uniform, neither are they. The
  Cassini Division shows up on the planet as a bright line inside a dark
  stripe, which is most of what makes a picture of Saturn read as a
  photograph. The optical depths are the ones the ring itself is drawn from,
  so the shadow agrees with the thing casting it.

- **The starfield is isotropic.** Its shell was squashed to 0.62 of its
  height, which pushes directions toward the equator, so there were visibly
  more stars round the sides than overhead. Nothing organises the field stars
  near us; what organises the real sky is the galactic plane, and that is
  drawn separately as its own band.

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

- **The corona is drawn from Baumbach's law, and it is white.** Coronal
  brightness has been measured since 1937 and is a sum of three power laws —
  0.0532 r⁻²·⁵ + 1.425 r⁻⁷ + 2.565 r⁻¹⁷ — of which the last term is the inner
  corona, the middle one the middle, and the first is not corona at all but
  sunlight scattered off interplanetary dust, which is why the glow goes on
  and on instead of stopping. Five hand-picked gradient stops cannot produce
  a curve that falls by a factor of two thousand. The colour was amber and
  should never have been: a corona is photospheric light Thomson-scattered
  off free electrons, which comes out pearl and very slightly blue. The amber
  belonged to the chromosphere, which is a different layer drawn separately.
  Streamers now thread it, growing in contrast outward the way they do.

- **The glare comes from the CIE glare equation.** 10/θ³ + 5/θ² + 0.0025,
  the published standard for disability glare, where the cube is scattering
  in the cornea and lens, the square is the retina, and the constant is the
  diffuse floor. It replaces a sum of exponentials that had been reasoned to
  after a reciprocal was tried at the wrong angular scale and blamed for
  being the wrong shape. The core saturates and the curve is compressed
  photographically, and both of those are labelled as display rather than
  optics.

- **The parked orbit feels its own altitude.** A circuit took twenty-one
  seconds whatever the body and whatever the height. The first half of that
  is right and provably so — constant density gives GM ∝ R³, a parking orbit
  at a fixed number of body radii gives r ∝ R, and the third law then makes
  the period independent of the body. The altitude was the missing half: r^3/2
  within one body, which is the piece of orbital mechanics a pilot can
  actually feel. Low passes whip round now and high ones are stately.

- **The galactic arms are logarithmic, and there are four of them.** An arm
  crosses every circle at the same angle — the pitch, ten to fourteen degrees
  for the Milky Way's major arms — which makes it a logarithmic spiral. These
  were Archimedean, so the winding stayed constant instead of tightening
  inward and the arms straightened into spokes past halfway out. And the
  Milky Way's four are two heavy and two thin rather than three even ones.

- **An arm has a dust lane, with a line of blue fire outside it.** A spiral
  arm is a standing wave and not a stream of material. Gas going round the
  disc overtakes the pattern, piles up as it enters and is shocked — and that
  shock is the dust lane, on the arm's concave side, the darkest thing in any
  photograph of a spiral galaxy. What the shock makes is stars, and the
  massive ones burn out so fast they never get far from where they formed, so
  the blue associations stand in a line just outside the lane. Warm dust
  inside, blue fire outside, a dark rule between them: that is the structure
  the eye recognises a spiral by, and one uniformly warm population has none
  of it. Which side is which is not chosen — azimuth is the arm's own normal
  here, since the ridge at azimuth a sits at r0·exp((a−arm)·tan p), so the
  lane falls on the positive offsets and the young stars on the negative ones
  for that reason and no other.

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
