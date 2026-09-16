# The hub, and hearing the vault

Part of the [Vault Orrery](../README.md) documentation.

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

## Hearing it

`U` switches the sound on; it is off by default and nothing is built until it
is. What it plays is the vault: every note has a pitch of its own, taken from
a scale you choose, and selecting one sounds it. Three things on top of that:

- **Notes come from where they are.** A ping is placed in the stereo field
  where its body sits on screen, so a note on the left is heard on the left.
- **The ripple is heard, as drops on glass.** `SPACE` sends a wave out along
  the links from the selected note, and each note it reaches sounds as the
  front arrives. Not the selection ping at a lower level, which is what it
  used to be — a wave through forty notes in that voice was a pad. It is a
  drop: a four-millisecond click, a pitch that rises for fifty milliseconds
  as the cavity the drop made in the water closes, and two glass modes at
  2.76 and 5.40 times the note that die faster than the note does, because
  that is how glass rings. An octave above the note's own pitch, quieter with
  every hop, and a shell of notes reached together lands as a run of drops
  rather than a chord. Genesis borrows the same voice for bodies as they
  condense, so a replay of the vault's formation is a melody in its own
  order. **RIPPLE** under SOUND is how loud that is, and goes to OFF.
- **The room follows the range.** Pulled back to take in the whole vault the
  bed closes down and the tail comes forward; in among the planets it
  opens up and dries out. Moving the camera is heard as moving — a dark
  band of noise whose level is the eye's own speed against its range — and
  stopping is heard as the sound going.
- **The bed is a place, not a hum.** Under **AMBIENT**: a sub, a root, two
  detuned fifths that beat against each other, an octave above them and a
  shimmer four octaves up at almost nothing, each breathing on its own
  clock, the filter opening and closing over most of a minute, and a wind
  of filtered noise that wanders and swells beneath. It comes up over a
  second and a half and ships at 0.35×; OFF is still on the slider.
- **The mind map has a sound.** A sweep up through the room and a note an
  octave over the one in the middle as it opens, a faint hum while it is
  up, the sweep reversed as it closes. Genesis opens on the low boom the
  supernova ends on.

---

## The sky's events

Two things happen in the sky, and each one is the vault doing something.
Neither is decoration: a comet without a note under it or a supernova with
nothing destroyed would each be a picture of nothing, which is what the sky
is careful never to be.

- **A comet lands on the note you just touched.** The plugin re-derives the
  cosmos every time a file is written, and the difference between the cosmos
  before and after is a list of notes whose file time moved. Each one gets a
  comet that falls in from the edge of the frame — on its own clock rather
  than the orbital one, because it is an event and not a body — and comes
  down on the note, and the strike sends the ripple out along its links. The
  first load sends one to the most recently touched note, if that was within
  a fortnight, so a vault opens with the place you were last working on
  being pointed at. The wandering comet is still there underneath, with its
  two tails, on its slow random cadence.
- **A note deleted while you watch goes out as a supernova.** A body that was
  in the previous cosmos and is not in this one flashes white where it was,
  throws off a shell that thins as it spreads over four seconds, and is
  named once in the toast. With sound on it lands as a low boom panned to
  where it stood, under the RIPPLE level, because it is the same kind of
  thing — the vault answering — at a larger size. A rename is not a death:
  the file keeps its creation time across one, and a new body carrying a
  vanished body's ctime is the same note.

Both need file times, which the plugin has for every note. A folder dropped
on the standalone page has them too; the demo's generated vault carries
invented ones so that both have something to show.

## What a body is, in words

The shader has always decided whether a note is drawn as a gas giant, a
terrestrial or a rock — from its citations and its length, see [the
astronomy](astronomy.md) — and the star's temperature has always decided its
colour. The inspector now says so: the path line ends with the world's kind,
whether it is ringed, and the spectral type and temperature of the star it
orbits, *F-type star · 7000 K*. The STAR SYSTEMS panel carries the letter
beside each folder's count, and its tooltip has the temperature. F, G, K and
M, because that is the range the folder stars span: the busiest folder in a
vault is its hottest star, and the rest run amber and orange, which is what
a real neighbourhood looks like.
