# Privacy and excluded files

Part of the [Vault Orrery](../README.md) documentation.

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
