# Contributing

Bug reports, feature requests and pull requests are all welcome. This file is
the short version of what will make any of them go smoothly.

## Reporting a bug

Open an issue at
[github.com/elliott-json-park/obsidian-vault-orrery/issues](https://github.com/elliott-json-park/obsidian-vault-orrery/issues).

If the view is blank or drawing wrongly, run **Show render diagnostics** from
the command palette and paste what it prints. It reports the leaf's box, the
canvas buffer size, whether the WebGL context is alive, what element is on top
at the centre of the leaf, and the state of the run gate — which between them
separate almost every cause of "it does not draw", and none of which can be
guessed from the outside.

Otherwise, the useful things are: your Obsidian version, your OS, roughly how
many notes are in the vault, and what you did immediately before it happened.

## Suggesting a feature

Say what you were trying to do, not only what you would like added. A lot of
the design here comes from someone describing the task rather than the button.

Two things are deliberately out of scope, so it saves time to say so:

- **Anything that reaches the network.** No telemetry, no update check, no
  remote assets, no online sharing. This is a hard constraint, not a
  preference; see [docs/privacy.md](docs/privacy.md).
- **Mobile.** The renderer needs WebGL and a pointer, and the manifest says
  `isDesktopOnly`.

## Pull requests

### The one thing to know first

`vault-orrery-v2.html` in the repository root **is** the engine — a real page
you can open by double-clicking it. `src/engine.generated.js` and `styles.css`
are build output, overwritten on every build. Editing either of them by hand
means your change is gone the next time anyone runs `npm run build`.

Everything else — the Obsidian side — is hand-written TypeScript in `src/`:
`main.ts` (plugin lifecycle, commands, settings plumbing), `view.ts` (the leaf,
the host bridge, keeping up with the vault) and `settings.ts`.

### Setting up

```bash
npm install
npm run vendor    # copy three.js into vendor/
npm run build     # engine -> typecheck -> bundle to main.js
npm test          # build, then the policy gates and the smoke test
npm run dev       # rebuild on change
npm run harness   # serve harness.html — mount the engine and actually draw
```

### Before you open the PR

1. **`npm test` passes.** It builds, typechecks, runs three static gates
   (no remote code, ribbon integrity, orbital carry) and a smoke suite against
   a stubbed Obsidian.
2. **You have looked at it in the harness.** `npm test` never renders anything,
   and it has passed while the engine threw on every frame. `npm run harness`
   mounts the exact module the plugin loads; add `?shim=1` to drive the loop
   from timers and see what a frame threw.
3. **You have not committed build output you did not mean to.** `main.js`,
   `styles.css` and `src/engine.generated.js` are all generated. Committing a
   rebuild of them alongside a source change is fine and expected; committing
   *only* a rebuild is not a change.
4. **Comments say why, not what.** This codebase explains the reasoning behind
   decisions that are not obvious from the code — especially the ones that
   were arrived at by getting them wrong first. Please match that; a change
   with a surprising shape and no note about why is the hardest kind to keep.

### Commit messages

A sentence in the imperative that says what the change does for the user:
"Stop the sky snapping back to its opening phase on every rebuild". Not
"fix bug" and not a conventional-commits prefix.

## Releases

Maintainer only. `git tag <version> && git push origin <version>` — the
workflow in `.github/workflows/release.yml` builds `main.js` and `styles.css`
from the tag, attaches them, and mints a provenance attestation so anyone can
verify with `gh attestation verify` that the assets were built by that workflow
from this repository rather than uploaded by hand. `manifest.json` and
`versions.json` are bumped in the commit that the tag points at.

## License

By contributing you agree that your contribution is licensed under the MIT
licence, the same as the rest of the project. See [LICENSE](LICENSE).
