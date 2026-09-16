# How the picture is made

Part of the [Vault Orrery](../README.md) documentation.

## How it is lit

The picture ships lit: BLOOM and FILM CURVE under LIGHT are on at the
defaults, and the rest of the grade — the split, the lens, the grain and the
meter — is fixed, chosen against the two of them rather than one at a time:
the curve is what stops the bloom clipping to flat white, the split is what
stops the curve reading as grey, the lens is what stops the split reading as
a colour cast, and the grain is what stops the whole thing banding in the
dark. They were knobs once and came off the deck in 1.15.0, because a set of
values that only makes sense together is not four settings.

**The meter** is the one thing a camera does that the grade does not: it
meters. The frame used to be exposed for the sun whatever was in it, so a
folder out on the rim with nothing bright near it was a black rectangle with
some pale points in it. Now the frame is metered off its brightest point, and
opens up when that point is dim — over about a second, the way an iris does.
It can only lift: with a source in frame the gain is one and the picture is
the byte-for-byte one it was.

**The nebula is a volume, not a sheet.** Each of the sixteen clouds is one
quad, and the quad's shader marches a ray through the ellipsoid the cloud
occupies — eight steps, a tileable noise texture read twice a step — and
integrates the gas along it, emitting and absorbing. That is why a strand in
front of a star dims the star, why the clouds hold up from inside as well as
from the map range, and why there is nothing in them to resolve however
close the camera comes. A cloud the eye is inside fades to nothing rather
than tinting the frame: what is seen is always the gas beyond, which is what
a nebula looks like from a planet inside one. The ionisation structure is
the one the sprites carried — teal inside the front, Hα red outside — and
the strands are a ridged term in the density field rather than points laid
along a line.

**Behind the stars is the continuum**, a dome with the Milky Way's
unresolved light on it: the band, narrower toward the anticentre and lumpy
along its length, the bulge, the rift down one side, and six galaxies far
enough away to be smudges. Additive, so it can only put light where there
was none. **And in front of everything is dust** — a few hundred motes in a
box that follows the camera and wraps through it, biggest when nearest, so
that moving the camera moves something a few units from the lens against
everything else. Both under STARFIELD, and both gone at zero.

**The last pass is FXAA.** A render target has no multisampling, so the
composite path drew every link and spike on a fixed grid whenever the camera
moved, and only the still-frame supersample softened them. One pass on the
finished frame, after the grade and the grain, reading luma and blending
along the edge it finds; a pixel whose neighbourhood does not contrast is
left alone.

**The composite works in half float.** The scene used to be drawn into an
eight-bit buffer, so every additive light stopped at 1.0 before the bloom
saw it, and a star's core, the sun's disc and a knot of links all arrived at
the same flat white. On WebGL2 the buffer keeps the excess: the bright pass
spills each source by its own excess, and a second shoulder in the composite
— high and always on, with slope one where it joins — folds it back under
1.0 with the order kept. Nothing under 0.86 is touched, so the plain path
and the composite still agree on everything that was never bright.

Each folder's system sits in a faint, drawn-out cloud of its own colour, the
size of its orbits. It is a map-range thing — it is what a system looks like
from where you can see the whole of it, and it fades out as the camera comes
inside, so up close there is no fog over the planets you came to read. SYSTEM
GLOW scales it with the star it belongs to. Every note stays a point of light
however far out you go: the sprites have a floor in pixels, the way a star in
a photograph does.

The hub's system has its own light in its plane: the **ZODIACAL LIGHT**, the
sheet of dust a star's planets never swept up, lit by the star. It is what
says which plane the vault is laid out on without a grid being switched on,
and it is drawn from the real thing — see [the astronomy](astronomy.md). Like
the systems' haze it is a map-range thing, gone by the time the camera is
inside the inner ring.

Leave the mouse alone for nine seconds and the panels fade back to let the
picture through; any input brings them back. `H` hides them outright.

A scale bar sits at the bottom of the frame — a round number of units, sized
to the range the camera is focused on — and the **SCALE** row in the status
panel is the same number as units per pixel. A perspective picture has no
single scale, so this is the one at the middle of the frame, which is what
"how big is that" means.

Underneath, the grade is the same four things a camera does:

- **the lens flare** is the reflections between the elements: four ghosts and
  a halo on the axis from the source through the middle of the frame, the
  anamorphic streak across it, colour separating on the widest spill, and
  smudges on the front element that catch the spill. LENS FLARE is all of
  it, because a lens is one object.
- **the bloom** is veiling glare. It spills only the light *in excess* of what
  the frame could hold, so a star's core throws light across the picture and
  the Milky Way behind it does not.
- **the curve** is the shoulder a sensor has and eight bits do not. Above the
  knee each further photon moves the value less, so a star core, a dense knot
  of links and the sun's own disc stop clipping to the same flat white. Below
  the knee it does nothing at all: the dark here is empty space, not
  underexposure, and a curve that greys it out is describing a room with the
  lights off.
- **the split** puts the shadows cold and the highlights warm, which every
  emulsion does and which the eye reads as depth. It multiplies, so it cannot
  add light to something that has none.
- **the lens** is a vignette and colour separating toward the corners, and
  **the grain** is a floor of noise that stops a dark gradient banding.

---

## The links are routed, and that is a map's choice

A link used to be the shortest line between its two notes. Five hundred
shortest lines over a vault is a lattice — every one crossing every other, no
two sharing a path — and what a lattice reports is that there are a great many
links, not where any of them goes. The hub was the worst of it: seventy
straight rays out of one point.

**LINK ROUTING** draws each end of a link toward the star its own note orbits
before the link sets off across the vault. Every link leaving one folder for
another then leaves along the same road, and two hundred of them braid into a
strand you can see and follow. The strand is the fact worth having — *these two
folders talk to each other* — and it is exactly the fact a lattice buries.

**This is cartography, not physics, and the difference is worth saying out
loud** in a plugin that spends [a whole page](astronomy.md) insisting on it.
Nothing out there bends a straight path because other paths are near it. What
stays honest is that the endpoints are exact, the route between them is the
only thing drawn as a choice, and the choice is one knob wide: at 0.00 a link
is the arc it always was, to the float. A link is also only routed as far out
of its way as it is long, so a moon reaching the planet it orbits stays the
short straight thing it is rather than looping out to a star a thousand units
away.

**A routed link never doubles back on itself.** Nothing above says the star
is anywhere near the line between the two notes, and often it is behind one of
them — in which case that end's control point lands behind its own note, the
curve leaves in the wrong direction, and it has to turn round to get where it
is going. What that draws is a hairpin with a point on it. On a 263-note vault
it was one link in seven at the shipped setting and two in five with the knob
at the top, which is why the strands looked spiky exactly where the routing
was working hardest. Each control is now held inside its own third of the
span, along the chord only — the sideways pull is the routing and is left
alone — and a control polygon that advances is a curve that cannot reverse.

**And it is cut finely enough to be a curve.** How many straight pieces an arc
is drawn in is decided per link, per frame, from how much the curve bends on
screen, to a third of a pixel. That measurement used to be taken on how far
the arc left its own chord, which is the same number on a symmetric arch and
the wrong one on a routed link: routing pulls the two ends toward two
different stars, so the halves lean opposite ways and cancel in the chord
measurement while doubling the bending there is to follow. Links were asking
for four pieces and needing nine. Measuring the curve's own bending instead
holds every link under half a pixel of error, costs about seventy per cent
more samples on the links that were wrong, and leaves the unrouted arch on
exactly the count it had.

**The resting shape is an arch.** ARC HEIGHT rests at 0.60× and LINK TENSION
at 0.70. Flat and taut, the old pair, drew straight spokes from the range the
vault opens at, because a small bow on a short link is not a visible curve and
routing only bends the ends. FLAT and 1.00 are still on the sliders.

**BRIDGE** is the one link layer that is not a filter on the *kind* of link.
It keeps only the links whose two ends are in different folders and drops
every link inside one, which on most vaults is the large majority. What is
left is the traffic between systems — and with routing on, that is exactly the
set of strands, with nothing else in the frame to read them against.

**Each end of a link wears the colour of the body it touches**, fading back to
the link type's own tint by the middle. That much is not a choice: the end of a
link sits inside its body's own glow, and a cyan thread ending inside an amber
halo is the one part of the picture that could not happen. The middle stays
exactly the tint, so the key in the status panel stays true — every wiki link
is cyan where it crosses the space between systems, every source link amber.

## Three kinds of world, and the same world at every range

Every body used to wear one machined shell: a plated hull with seams and a
heavier band round the equator. It was chosen for a good reason — the
generated worlds before it only ever appeared on the *one* body you had flown
to, and everything else sampled a patch of a shared texture, so a planet
changed its whole character as you approached it.

That constraint is kept and the machine is not. There are three kinds of world
now — a giant, a terrestrial, a rock — and all three are computed from the
sphere's own direction in the fragment shader. No texture, no generation pass,
no cache, and the instanced bodies and the high-detail mesh compile the same
function, which is what makes a world identical at four pixels and at four
hundred. Which one a body gets comes out of its own size, and
[the astronomy page](astronomy.md) has the reasoning, the albedos and the
physics of each.

The relief on a rock is a real bend in the surface normal rather than a change
of colour, because a crater seen only as a stain is not what anybody
recognises — the shading on a bowl is. It is taken from the screen-space
gradient of the height field, which is the one way to bump a surface that is a
function rather than a texture, and it is the only GL extension any of this
needs.

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
for these on. Start with ORBIT GAP. It runs to 12.00× and SPREAD to 8.00×,
which is headroom for a vault of a hundred-odd folders rather than a new look:
both defaults are where they were.

**SUN SIZE**, **SYSTEM SIZE**, **PLANET SIZE** and **MOON SIZE** scale a whole
class of body at once. They never change the *ratios* between notes — a body's
radius is its citation count and that is worth reading — so what moves is how
big the whole class is drawn. Four controls rather than one because the
complaint is never "everything is too small": it is a hub that swallows its
inner ring on a vault with one enormous folder, or moons that are specks up
close. Orbits widen with the body they stand off from, so nothing turned up
ends up with its satellites inside it.

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
layout is tilted about the same axis, so a system is a flat ring; turn this
up and each body takes an orbit plane of its own, spread evenly over every
direction. DISC at zero, SPHERE at one, and
the numbers in between are one opening into the other.

**`X`** draws a reference plane: a polar grid on the plane the systems are
actually laid out on, with rings at the radii they sit on rather than at round
numbers. Space has no floor, and without one "further out" and "further away"
look identical — which is the one thing a picture of a graph must not be vague
about. It is off until you ask for it.
