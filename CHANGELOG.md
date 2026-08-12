# Changelog

Each version's section here becomes that release's description on GitHub —
`.github/workflows/release.yml` reads it when the tag is pushed, and refuses to
publish a version that has no section.

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
