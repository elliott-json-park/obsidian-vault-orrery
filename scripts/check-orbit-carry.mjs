/* ============================================================================
   check-orbit-carry.mjs — part of npm test

   A body's angle is not a function of the clock. It is integrated frame by
   frame into MA[i] — see advance() — so that ORBIT SPREAD and ORBIT GAP can
   change a period without rewriting the body's past. The folder stars keep
   the same accumulator as oMA, and a star's roll is a third one.

   All three live in things the layout allocates, so every rebuild used to
   throw them away and the whole sky snapped back to its opening phase. Inside
   Obsidian the cosmos re-derives a couple of seconds after every save and the
   camera is restored exactly, so the symptom was not "the planets jumped" —
   it was the camera appearing to tick, which is a much harder thing to find.

   orbitMark/orbitRestore carry them across, keyed by path and folder key
   rather than by index, because indices are rebuilt and name a different note
   by the next pass. That keying is the whole of the correctness here and it
   has no visible failure mode — a wrong key silently means "new note", which
   looks exactly like the bug it was meant to fix. So it is tested, and the
   functions are pulled out of the engine source rather than copied, because a
   copy would keep passing after the original changed.
   ========================================================================= */
import fs from 'node:fs';
const src = fs.readFileSync(new URL('../vault-orrery-v2.html', import.meta.url), 'utf8');

const grab = (name, head) => {
  const i = src.indexOf(head);
  if (i < 0) throw new Error('not found: ' + name);
  let j = src.indexOf('{', i), depth = 0, k = j;
  for (; k < src.length; k++) {
    if (src[k] === '{') depth++;
    else if (src[k] === '}') { depth--; if (!depth) break; }
  }
  return src.slice(i, k + 1);
};

/* The engine reads MA, nodes, cats and N from module scope. `with` over a
   proxy that claims only those four gives the pair its own live module state
   without pulling the rest of a 15,000-line renderer in behind it. */
const state = { MA: null, nodes: null, cats: null, N: 0 };
const own = new Set(Object.keys(state));
const scope = new Proxy(state, {
  has: (t, k) => own.has(k),
  get: (t, k) => t[k],
  set: (t, k, v) => { t[k] = v; return true; },
});
const { orbitMark, orbitRestore } = new Function('scope',
  'with (scope) {' +
  grab('orbitMark', 'function orbitMark(') + '\n' +
  grab('orbitRestore', 'function orbitRestore(') + '\n' +
  '} return { orbitMark, orbitRestore };')(scope);

let fails = 0;
const ok = (name, cond, extra) => {
  console.log((cond ? '  ok  ' : '  FAIL ') + name + (extra ? ' -> ' + extra : ''));
  if (!cond) fails++;
};

const put = (MA, nodes, cats) => {
  state.MA = Float64Array.from(MA);
  state.nodes = nodes; state.cats = cats; state.N = nodes.length;
};

/* --- 1. a rebuild that shuffles indices, loses a note and gains one -------
   The realistic case, and the one plain index-keyed carrying gets wrong: the
   layout re-sorts, so the note at slot 0 before is at slot 2 after. */
put([12.5, 40.25, 7],
    [{ p: 'a.md' }, { p: 'b.md' }, { p: 'c.md' }],
    [{ key: 'wiki:x', oMA: 3.3, sx: .1, sy: .2, rz: 5.5 },
     { key: 'wiki:y', oMA: 1.1, sx: 0,  sy: 0,  rz: 2.2 }]);
const mark = orbitMark();

put([0, 0, 0],
    [{ p: 'c.md' }, { p: 'd.md' }, { p: 'a.md' }],
    [{ key: 'wiki:y', sx: 0, sy: 0, rz: 9.9 }, { key: 'wiki:z' }]);
orbitRestore(mark);

ok('a note keeps its phase across a reshuffle', state.MA[0] === 7 && state.MA[2] === 12.5,
   'c.md ' + state.MA[0] + ', a.md ' + state.MA[2]);
ok('a note that has just arrived starts where the layout put it', state.MA[1] === 0);
ok('a folder star keeps its orbital angle', state.cats[0].oMA === 1.1);
ok('a folder star keeps its roll rather than taking a fresh random one',
   state.cats[0].rz === 2.2);
ok('a folder that has just arrived is left alone', state.cats[1].oMA === undefined);

/* --- 2. the host path wins over the layout path ---------------------------
   The layout drops a shared root folder so paths read like the vault; fp is
   what the host knows the note by. hostPath prefers it and so must this, or
   the two disagree about which note is which. */
put([5], [{ p: 'notes/a.md', fp: 'a.md' }], []);
const m2 = orbitMark();
put([0], [{ p: 'a.md', fp: 'a.md' }], []);
orbitRestore(m2);
ok('a note is identified the way the host identifies it', state.MA[0] === 5);

/* --- 3. nothing to carry, and nothing to carry it into -------------------- */
put([], [], []);
ok('an empty cosmos marks nothing', orbitMark() === null);
put([1, 2], [{ p: 'a.md' }, { p: 'b.md' }], []);
orbitRestore(null);
ok('no mark is a no-op, not a reset', state.MA[0] === 1 && state.MA[1] === 2);

/* --- 4. the failure path -------------------------------------------------
   swapVault(EMPTY) runs from the catch of a swap that threw partway through,
   with half-built bindings still in module scope. A mark that cannot be taken
   must not take the recovery down with it. */
state.MA = null; state.nodes = null; state.cats = null; state.N = 4;
let threw = false;
try { orbitMark(); orbitRestore(mark); } catch (e) { threw = true; }
ok('a half-built cosmos neither marks nor throws', !threw);

state.MA = Float64Array.from([0, 0]); state.nodes = [{ p: 'a.md' }]; state.N = 9;
threw = false;
try { orbitRestore(mark); } catch (e) { threw = true; }
ok('a node count that outruns its arrays is clamped, not read past', !threw);

console.log(fails ? '\n' + fails + ' orbital-carry check(s) failed'
                  : '\nall orbital-carry checks pass');
process.exit(fails ? 1 : 0);
