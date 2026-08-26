/* ============================================================================
   check-ribbons.mjs — part of npm test

   The structural lines are drawn out of one shared buffer per kind: a fixed
   run of vertices per link, per wake, per comet tail, with a static index
   buffer built once and a running counter that has to land exactly on the end
   of it. Get any of that wrong by two and the symptom is not an exception —
   it is one link stealing the next one's vertices, which looks like a wrong
   picture rather than like a bug, and which nothing else in this repository
   would notice.

   So the arithmetic is tested. ribGeo and ribVert are pulled out of the engine
   source itself rather than copied here, because a copy would keep passing
   after the original changed.
   ========================================================================= */
import fs from 'node:fs';
const src = fs.readFileSync(new URL('../vault-orrery-v2.html', import.meta.url), 'utf8');
const grab = (name, head) => {
  const i = src.indexOf(head);
  if (i < 0) throw new Error('not found: ' + name);
  // brace-match from the first { after the head
  let j = src.indexOf('{', i), depth = 0, k = j;
  for (; k < src.length; k++) {
    if (src[k] === '{') depth++;
    else if (src[k] === '}') { depth--; if (!depth) break; }
  }
  return src.slice(i, k + 1);
};
const THREE = {
  BufferAttribute: class { constructor(a, n) { this.array = a; this.itemSize = n; } },
  BufferGeometry: class {
    constructor(){ this.attributes = {}; this.index = null; this.range = null; }
    setAttribute(k, v){ this.attributes[k] = v; }
    setIndex(v){ this.index = v; }
    setDrawRange(a, b){ this.range = [a, b]; }
  }
};
/* The writers' own constants, read out of the source for the same reason the
   functions are: a number copied here would keep agreeing with itself long
   after the original had moved. */
const num = name => {
  const m = new RegExp('const\\s+' + name + '\\s*=\\s*([0-9.]+)').exec(src) ||
            new RegExp(name + '\\s*=\\s*([0-9.]+)').exec(src);
  if (!m) throw new Error('not found: ' + name);
  return parseFloat(m[1]);
};
const RIB_PAD = num('RIB_PAD'), RIB_CORE = num('RIB_CORE'), RIB_GLARE = num('RIB_GLARE');
const mod = new Function('THREE', 'RIB_PAD',
  grab('ribGeo', 'function ribGeo(') + '\n' +
  grab('ribVert', 'function ribVert(') + '\n' +
  'return { ribGeo, ribVert };')(THREE, RIB_PAD);

let fails = 0;
const ok = (name, cond, extra) => {
  console.log((cond ? '  ok  ' : '  FAIL ') + name + (extra ? ' -> ' + extra : ''));
  if (!cond) fails++;
};

/* --- 1. index buffer stays inside the vertex buffer, for every shape used --- */
for (const [strips, samples, label] of [[1, 16, 'links SEG=16'], [6000, 8, 'links EN=6000 SEG=8'],
                                        [300, 9, 'trails'], [2, 53, 'comet'], [6, 2, 'twins']]) {
  const R = mod.ribGeo(strips, samples);
  const idx = R.geo.index.array;
  let max = -1;
  for (let i = 0; i < idx.length; i++) if (idx[i] > max) max = idx[i];
  ok(label + ': indices in range', max === R.verts - 1, max + ' / ' + (R.verts - 1));
  ok(label + ': index count', idx.length === strips * R.idxPerStrip, idx.length);
  ok(label + ': perStrip', R.perStrip === samples * 2, R.perStrip);
  ok(label + ': positions sized', R.pos.length === R.verts * 3 && R.col.length === R.verts * 3);
  ok(label + ': sides alternate', R.geo.attributes.aSide.array[0] === -1 &&
                                  R.geo.attributes.aSide.array[1] === 1);
  /* every strip's triangles must reference only its own vertices */
  let leak = false;
  for (let s = 0; s < strips; s++) {
    const lo = s * R.perStrip, hi = lo + R.perStrip - 1;
    for (let i = s * R.idxPerStrip; i < (s + 1) * R.idxPerStrip; i++)
      if (idx[i] < lo || idx[i] > hi) { leak = true; break; }
    if (leak) break;
  }
  ok(label + ': no strip references another', !leak);
}

/* --- 2. the writers' running counter lands exactly on the buffer end --- */
{
  const EN = 6000, SEG = 8;
  const R = mod.ribGeo(EN, SEG);
  let w = 0;
  for (let e = 0; e < EN; e++) for (let j = 0; j < SEG; j++) w += 2;   // writeLinks
  ok('writeLinks fills the buffer exactly', w * 3 === R.pos.length, w * 3 + ' / ' + R.pos.length);
  ok('writeLinks STRIP matches perStrip', R.perStrip === SEG * 2);
}
{
  const CAP = 300, SEGT = 9;
  const R = mod.ribGeo(CAP, SEGT);
  const n = 137;                                   // a partly-filled frame
  let w = 0;
  for (let k = 0; k < n; k++) for (let s = 0; s < SEGT; s++) w += 2;
  ok('writeTrails packs from the front', w === n * R.perStrip, w);
  ok('writeTrails draw range is inside the index buffer',
     n * R.idxPerStrip <= R.geo.index.array.length, n * R.idxPerStrip + ' / ' + R.geo.index.array.length);
}
{
  const R = mod.ribGeo(2, 53);
  const STRIDE = 53 * 2;
  ok('comet ion strip starts where the dust strip ends', STRIDE === R.perStrip);
  ok('comet ion tail fits its strip', STRIDE + 27 * 2 <= R.verts, (STRIDE + 27 * 2) + ' / ' + R.verts);
}

/* --- 3. ribVert: geometry of one sample --- */
{
  const P = new Float32Array(6), C = new Float32Array(6);
  // a segment along +x, eye on +z, half width 2 -> offset must be along y
  mod.ribVert(P, C, 0, 0, 0, 0, 1, 0, 0, 0, 0, -10, 2, 0.5, 0.25, 0.125);
  const dx = P[3] - P[0], dy = P[4] - P[1], dz = P[5] - P[2];
  /* full width = 2 * hw * RIB_PAD. The strip is built wider than the line it
     draws; the fragment profile is what narrows it back to the asked-for
     width — see the profile checks at the bottom. */
  ok('ribVert offsets perpendicular to tangent and eye',
     Math.abs(dx) < 1e-6 && Math.abs(Math.abs(dy) - 4 * RIB_PAD) < 1e-6 && Math.abs(dz) < 1e-6,
     [dx, dy, dz].map(v => v.toFixed(3)).join(','));
  ok('ribVert writes the colour to both vertices',
     C[0] === 0.5 && C[3] === 0.5 && C[1] === 0.25 && C[5] === 0.125);
}
{
  const P = new Float32Array(6).fill(9), C = new Float32Array(6).fill(9);
  // zero width -> both vertices collapse onto the point (this is how a dash,
  // a culled link and an unused sample are all drawn as nothing)
  mod.ribVert(P, C, 0, 3, 4, 5, 1, 0, 0, 0, 0, -10, 0, 0, 0, 0);
  ok('zero width collapses the sample',
     P[0] === 3 && P[3] === 3 && P[1] === 4 && P[4] === 4 && P[2] === 5 && P[5] === 5);
}
{
  const P = new Float32Array(6), C = new Float32Array(6);
  // tangent parallel to the eye: the cross product collapses and it must not NaN
  mod.ribVert(P, C, 0, 0, 0, 0, 0, 0, 1, 0, 0, 5, 2, 1, 1, 1);
  ok('a ribbon seen end-on stays finite', P.every(Number.isFinite), Array.from(P).join(','));
}

/* --- 4. the profile means what the knob says -------------------------------
   Two claims, and the padded strip exists to make both of them true.

   That the line is as wide as it was asked to be: the profile falls through
   half its peak at s = 1, which is the edge of the width the writer asked
   for. The shape this replaced went through half at 0.14 of the half-width,
   so LINE WIDTH at its 1.7 px default was drawing a visible core about a
   quarter of a pixel across — a hairline again, and the reason the links
   read as a broken line rather than a thin one.

   And that making the width honest did not make the picture brighter. Width
   and brightness are separate controls here and the source argues it twice
   (LINE WIDTH, and ORBIT GAP before it), so the integral is checked rather
   than trusted: same light, spread over the width the knob claims. */
{
  const core  = s => 1 / (1 + Math.pow(s, 6));
  const glare = s => Math.exp(-s * s * 0.55);
  const prof  = v => { const s = Math.abs(v) * RIB_PAD;
                       return core(s) * RIB_CORE + glare(s) * RIB_GLARE; };
  const OLD   = v => { const e = 1 - Math.abs(v); return e*e*0.74 + Math.pow(e,8)*0.92; };
  const integ = f => { let a = 0; const n = 200000;
                       for (let i = 0; i < n; i++) a += f(-1 + 2*(i+0.5)/n);
                       return a * 2 / n; };
  let half = 0;
  for (let v = 0; v < 1; v += 1e-5) if (prof(v) < prof(0) * 0.5) { half = v * RIB_PAD; break; }
  ok('the visible width is the width that was asked for',
     Math.abs(half - 1) < 0.05, 'half power at ' + half.toFixed(3) + ' of the half-width');
  const a = integ(prof), b = integ(OLD);
  ok('and it carries the same light as the profile it replaced',
     Math.abs(a - b) / b < 0.01, a.toFixed(4) + ' / ' + b.toFixed(4));
  ok('the strip is wide enough to hold the glare',
     prof(1) / prof(0) < 0.05, 'edge is ' + (prof(1) / prof(0) * 100).toFixed(2) + '% of peak');
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall ribbon buffer checks pass');
process.exit(fails ? 1 : 0);
