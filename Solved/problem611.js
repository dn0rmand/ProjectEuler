const assert = require('assert');
const { BitArray, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 1E12;
const SECTION_SIZE = (2 ** 32 - 1) * 8;

function smallF(min, max, trace) {
  const values = BitArray(max + 1 - min);
  const tracer = new Tracer(trace);

  let total = 0;
  for (let i = 1; ; i++) {
    const i2 = i * i;
    if (i2 + i2 >= max) {
      break;
    }
    tracer.print(_ => max - i2 - i2);
    const minJ = Math.max(i + 1, min > i2 ? Math.ceil(Math.sqrt(min - i2)) : i + 1);
    for (let j = minJ; ; j++) {
      const j2 = j * j;
      const n = i2 + j2;
      if (n < min) {
        continue;
      }
      if (n > max) {
        break;
      }

      total += values.toggle(n - min);
    }
  }
  tracer.clear();
  return total;
}

function F(max, trace) {
  const tracer = new Tracer(trace);

  let total = 0;

  for (let min = 0; min <= max; min += SECTION_SIZE) {
    tracer.print(_ => max - min);
    const upper = Math.min(min + SECTION_SIZE - 1, max);

    total += smallF(min, upper, trace);
  }

  tracer.clear();
  return total;
}

assert.strictEqual(F(5), 1);
assert.strictEqual(F(100), 27);
assert.strictEqual(F(1000), 233);
assert.strictEqual(F(1E6), 112168);

console.log('Tests passed');

const answer = F(MAX, true);
console.log(`Answer is ${answer}`);

//  1073782640
// 49283233900