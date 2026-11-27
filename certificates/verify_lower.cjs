// Node.js, standard library. All inequalities are checked with integer arithmetic.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { gunzipSync } = require('node:zlib');
const assert = require('node:assert/strict');

function balls(radius) {
  const result = [new Set([0])];
  for (let r = 1; r <= radius; r++) {
    const previous = result[r - 1];
    const reached = new Set(previous);
    for (const x of previous) {
      for (const step of [-10, -7, 7, 10]) reached.add(x + step);
    }
    result.push(reached);
  }
  return result;
}
const ball = balls(20);

// Bit j records that a past placement forbids using this color j positions ahead.
// State numbers are breadth-first, with the vacancy transition visited first.
function automaton(color) {
  let imprint = 0n;
  for (const d of ball[color]) {
    if (d > 0) imprint |= 1n << BigInt(d - 1);
  }
  const masks = [0n], byMask = new Map([[0n, 0]]);
  function number(mask) {
    if (!byMask.has(mask)) {
      byMask.set(mask, masks.length);
      masks.push(mask);
    }
    return byMask.get(mask);
  }
  const skip = [], place = [];
  for (let i = 0; i < masks.length; i++) {
    const mask = masks[i], shifted = mask >> 1n;
    skip.push(number(shifted));
    place.push((mask & 1n) === 0n ? number(shifted | imprint) : -1);
  }
  return { skip, place, size: masks.length };
}

function checkCombined() {
  const [a, b, c] = [1, 2, 4].map(automaton);
  const plane = a.size * b.size;
  const raw = gunzipSync(fs.readFileSync(path.join(__dirname, 'potential-124.u16le.gz')));
  assert.equal(raw.length, 2 * plane * c.size);
  assert.equal(new Uint8Array(new Uint16Array([1]).buffer)[0], 1, 'little-endian host required');
  const h = new Uint16Array(raw.buffer, raw.byteOffset, raw.length / 2);
  const absent = 65535;
  assert.notEqual(h[0], absent);
  let states = 0, arcs = 0, index = 0;
  for (let z = 0; z < c.size; z++) {
    for (let y = 0; y < b.size; y++) {
      const skipBC = b.skip[y] * a.size + c.skip[z] * plane;
      const placeB = b.place[y] * a.size + c.skip[z] * plane;
      const placeC = b.skip[y] * a.size + c.place[z] * plane;
      for (let x = 0; x < a.size; x++, index++) {
        const here = h[index];
        if (here === absent) continue;
        states++;
        const ceiling = here + 67;
        let v = h[a.skip[x] + skipBC];
        if (v === absent || v > ceiling) throw Error('Vacancy transition at ' + index);
        arcs++;
        if (a.place[x] >= 0) {
          v = h[a.place[x] + skipBC];
          if (v === absent || v + 102 > ceiling) throw Error('Color 1 at ' + index);
          arcs++;
        }
        if (b.place[y] >= 0) {
          v = h[a.skip[x] + placeB];
          if (v === absent || v + 102 > ceiling) throw Error('Color 2 at ' + index);
          arcs++;
        }
        if (c.place[z] >= 0) {
          v = h[a.skip[x] + placeC];
          if (v === absent || v + 102 > ceiling) throw Error('Color 4 at ' + index);
          arcs++;
        }
      }
    }
  }
  console.log('Joint density <= 67/102.', { states, arcs, initialPotential: h[0] });
}

// Compute a potential for each of the four small, single-color machines.
function checkIndividual(color, p, q) {
  const a = automaton(color);
  let h = new Int32Array(a.size);
  for (let round = 0; round <= a.size; round++) {
    const next = h.slice();
    let changed = false;
    for (let i = 0; i < a.size; i++) {
      next[i] = Math.max(h[i], h[a.skip[i]] - p);
      if (a.place[i] >= 0) next[i] = Math.max(next[i], h[a.place[i]] + q - p);
      if (next[i] !== h[i]) changed = true;
    }
    if (!changed) return;
    h = next;
  }
  throw Error('No potential for color ' + color);
}

checkCombined();
const terms = [[67, 102], [2, 17], [2, 45], [2, 55], [1, 34]];
for (const [j, color] of [3, 5, 6, 7].entries()) checkIndividual(color, ...terms[j + 1]);
for (let c = 8; c <= 20; c++) {
  const gap = 10 * c - 14;
  for (let d = 1; d < gap; d++) assert(ball[c].has(d));
  terms.push([1, gap]);
}
function gcd(a, b) { return b === 0n ? a : gcd(b, a % b); }
let num = 0n, den = 1n;
for (const [p, q] of terms) {
  num = num * BigInt(q) + den * BigInt(p);
  den *= BigInt(q);
  const g = gcd(num, den);
  num /= g;
  den /= g;
}
assert(num < den);
console.log('Density cap for colors 1..20 = ' + num + '/' + den + '. Lower bound 21 verified.');

