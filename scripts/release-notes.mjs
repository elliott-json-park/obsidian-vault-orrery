/* ============================================================================
   release-notes.mjs — the body of a GitHub release, taken from CHANGELOG.md.

   A release with no description says nothing about what changed, and a
   description written into the release form by hand drifts from the one in the
   repository. Reading it from the changelog leaves one copy, and makes "this
   version has no notes" a build failure rather than something nobody notices.

   Run: node scripts/release-notes.mjs 1.0.1   ->   the section, on stdout
   ========================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const version = (process.argv[2] || '').trim().replace(/^v/, '');
if (!version) {
  console.error('release-notes: usage: node scripts/release-notes.mjs <version>');
  process.exit(1);
}

const CHANGELOG = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '..', 'CHANGELOG.md');

/* A line scan rather than a regular expression: the version is user input and
   every character that needs escaping in a pattern — the dots above all — is
   one that appears in a version number. */
const lines = fs.readFileSync(CHANGELOG, 'utf8').replace(/\r\n/g, '\n').split('\n');
const heads = lines
  .map((l, i) => [l, i])
  .filter(([l]) => l.startsWith('## '))
  .map(([l, i]) => [l.slice(3).trim(), i]);

const at = heads.findIndex(([h]) => h === version);
if (at < 0) {
  console.error(`release-notes: CHANGELOG.md has no "## ${version}" section. ` +
                `Add one before tagging.`);
  process.exit(1);
}

const from = heads[at][1] + 1;
const to   = at + 1 < heads.length ? heads[at + 1][1] : lines.length;
const body = lines.slice(from, to).join('\n').trim();

if (!body) {
  console.error(`release-notes: the "## ${version}" section is empty.`);
  process.exit(1);
}

process.stdout.write(body + '\n');
