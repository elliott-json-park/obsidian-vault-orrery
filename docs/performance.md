# Performance on large vaults

Part of the [Vault Orrery](../README.md) documentation.

A spring simulation over several thousand instanced bodies is not free. There
is a **MAX NODES** ceiling for that, on the control panel and in settings, and
it runs from 500 up to 10 000.

**It ships off.** A cap that quietly drops half a vault answers "show me my
notes" with a subset, and the user cannot see which half went; a slow first
minute is at least a problem whose cause is visible, and the slider is right
there. So the default is no ceiling, and the ceiling is what you reach for when
the vault turns out to be too big for the machine.

When a ceiling you have set truncates a vault, it says so — "Loaded 3000 of
7412 notes" — rather than presenting a partial cosmos as if it were the whole
thing.

**Rendering stops when you are not looking at it.** The render loop, the physics
clock and the audio context are all suspended when the view's leaf is hidden or
the window is in the background, and resume where they left off. An orrery in a
background tab costs nothing. The same gate catches a lost WebGL context — a
GPU driver reset or a laptop waking from sleep — so the loop stops instead of
simulating a cosmos that cannot be drawn, and the view says what happened
rather than going quietly black.

**The surface grain is fixed.** There was a knob for a slow machine that would
rather have the frame than the grain; it came off the deck in 1.15.0, because
the shader already does the cheap thing on its own. A world is computed
rather than looked up, so what it
costs is decided by how much of it is asked for — and at map range the two
expensive parts, the crater field and the fine grain over every surface, are
being resolved to a fraction of a pixel and then thrown away. They are skipped
once the shader can see that is happening. What it
can never do is change the *shape* of a world: a body has to look the same
from four pixels away as from four hundred, which is the rule the whole
surface design is built on.

If a large vault still runs slowly, the first thing to try is the **FAST**
preset at the head of the control deck. It sets BLOOM, SUN RAYS, LENS FLARE,
SUN HALO, FILM CURVE, ZODIACAL LIGHT, STARFIELD and SKY VEIL to OFF in one
click, which puts the renderer back on the path it takes when nothing has been
asked for; **BALANCED** keeps a little of the glow, and **CINEMA** is the
shipped look. The first time a vault of 600 notes or more opens, the frame rate
is sampled for four seconds once it has settled, and if it averages under 26
the orrery applies FAST itself — once, ever, with a line saying so. After that, the
cheapest wins are lowering **LINK GLOW**, turning **STARFIELD** down, and
reducing **MAX NODES**.

Keeping up with the vault re-reads every note each time it rebuilds, debounced
so that writing a note costs one rebuild rather than one per save. On a vault
large enough for that to be felt, turn **Keep up with the vault** off in
settings; the *Reload vault* command then does it when you ask.
