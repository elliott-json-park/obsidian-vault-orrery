/* ============================================================================
   check-sky.mjs — part of npm test

   STARFIELD is one knob over six layers of sky, and the order they come in
   is the whole of what makes it read as a sky rather than as fog: stars
   first, then the band, then the dome, then the gas and the dust, each
   diffuse layer under a ceiling. That order lives in skyGains, and nothing
   on screen fails loudly if it slips — a ceiling raised by a careless edit
   is just a frame that has gone pale again, which is the bug the staging was
   written to fix (2.1.0). So the shape of the curve is checked here, pulled
   out of the engine source rather than copied.
   ========================================================================= */
import fs from 'node:fs';
const src = fs.readFileSync(new URL('../vault-orrery-v2.html', import.meta.url), 'utf8');

const grab = (head) => {
  const i = src.indexOf(head);
  if (i < 0) throw new Error('not found: ' + head);
  let j = src.indexOf('{', i), depth = 0, k = j;
  for (; k < src.length; k++) {
    if (src[k] === '{') depth++;
    else if (src[k] === '}') { depth--; if (!depth) break; }
  }
  return src.slice(i, k + 1);
};
const line = head => {
  const i = src.indexOf(head);
  if (i < 0) throw new Error('not found: ' + head);
  return src.slice(i, src.indexOf('\n', i));
};

const { skyGains } = new Function(
  line('const clamp') + '\n' + line('const ramp') + '\n' +
  grab('function skyGains(') + '\nreturn { skyGains };')();

let fails = 0;
const ok = (name, cond, extra) => {
  console.log((cond ? '  ok  ' : '  FAIL ') + name + (extra ? ' -> ' + extra : ''));
  if (!cond) fails++;
};

const LAYERS = ['stars', 'limit', 'band', 'dome', 'gas', 'dust', 'motes'];
const off = skyGains(0);
ok('OFF is a black sky: every layer at zero', LAYERS.every(k => off[k] === 0),
   JSON.stringify(off));

let mono = true;
for (let s = 0; s <= 2.0001; s += 0.05) {
  const a = skyGains(s), b = skyGains(s + 0.05);
  if (s + 0.05 <= 2.0001 && LAYERS.some(k => b[k] < a[k] - 1e-9)) { mono = false; break; }
}
ok('turning the knob up never takes any layer down', mono);

const low = skyGains(0.2);
ok('the first notches are stars and nothing diffuse',
   low.stars > 0.5 && low.band === 0 && low.dome === 0 && low.gas === 0 && low.dust === 0,
   JSON.stringify(low));

/* the order the layers arrive in, read as the knob value where each first
   passes a tenth of its own top */
const top = skyGains(2);
const arrives = k => { for (let s = 0; s <= 2; s += 0.01) if (skyGains(s)[k] > top[k] * 0.1) return s; return 9; };
ok('stars, then the band, then the dome, then the gas',
   arrives('stars') < arrives('band') && arrives('band') <= arrives('dome') && arrives('dome') < arrives('gas'),
   ['stars', 'band', 'dome', 'gas'].map(k => k + '@' + arrives(k).toFixed(2)).join(' '));

/* the gas rides a gain of up to three on a wide ORBIT GAP, and past about a
   tenth on screen it whitens the middle of the frame */
ok('the gas stays under its ceiling at full travel', top.gas * 3 <= 0.3, 'gas ' + top.gas);
ok('the dome and the dust stay under theirs', top.dome <= 0.7 && top.dust <= 0.6,
   'dome ' + top.dome + ', dust ' + top.dust);
ok('at the shipped value the stars are out and most of the field is shown',
   skyGains(0.6).stars > 0.7 && skyGains(0.6).limit > 0.7);

if (fails) { console.log(fails + ' failed'); process.exit(1); }
