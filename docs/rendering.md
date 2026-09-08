# How the picture is made

Part of the [Vault Orrery](../README.md) documentation.

## How it is lit

The picture ships lit: BLOOM and the four grade knobs under LIGHT are on at
the defaults, chosen against each other rather than one at a time — the curve
is what stops the bloom clipping to flat white, the split is what stops the
curve reading as grey, the lens is what stops the split reading as a colour
cast, and the grain is what stops the whole thing banding in the dark. Every
one of them goes to OFF, and with all of them off the renderer takes the plain
path and the composite never runs.

Each folder's system sits in a faint, drawn-out cloud of its own colour, the
size of its orbits. It is a map-range thing — it is what a system looks like
from where you can see the whole of it, and it fades out as the camera comes
inside, so up close there is no fog over the planets you came to read. SYSTEM
GLOW scales it with the star it belongs to. Every note stays a point of light
however far out you go: the sprites have a floor in pixels, the way a star in
a photograph does.

Leave the mouse alone for nine seconds and the panels fade back to let the
picture through; any input brings them back. `H` hides them outright.

Underneath, the grade is the same four things a camera does:

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
layout is tilted about the same axis, so a system is a flat ring however far
ORBIT TILT leans it over; turn this up and each body takes an orbit plane of
its own, spread evenly over every direction. DISC at zero, SPHERE at one, and
the numbers in between are one opening into the other.

**`X`** draws a reference plane: a polar grid on the plane the systems are
actually laid out on, with rings at the radii they sit on rather than at round
numbers. Space has no floor, and without one "further out" and "further away"
look identical — which is the one thing a picture of a graph must not be vague
about. It is off until you ask for it.
