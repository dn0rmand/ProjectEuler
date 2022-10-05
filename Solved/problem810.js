const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const LIMIT = 2 ** 27;
const MAX_SAFE = 2 ** 31 - 1;

// Switch to BigInt when a is too big for bitwise operation
function xor(a, b) {
  let result = 0;

  while (b > 0) {
    if (b & 1) {
      result ^= a;
      if (result < 0) {
        throw 'Error';
      }
      b--;
      if (b === 0) {
        return result;
      }
    }
    b /= 2;
    const aa = a * 2;
    if (aa > MAX_SAFE) {
      a = BigInt(a) << 1n;
      result = BigInt(result);
      break;
    } else {
      a = aa;
    }
  }

  while (b > 0) {
    if (b & 1) {
      result ^= a;
      b--;
    }
    b /= 2;
    a <<= 1n;
  }

  return result > LIMIT ? LIMIT : Number(result);
}

function sieve() {
  const values = new Uint8Array(LIMIT);
  values[0] = 1;

  const tracer = new Tracer(true);

  let p = 2;
  for (let a = 2; a < LIMIT; a++) {
    tracer.print((_) => LIMIT - a);
    if (values[a]) {
      continue;
    }
    if (a === p) {
      for (let b = a + a; b < LIMIT; b += a) {
        values[b] = 1;
      }
      p *= 2;
    } else {
      for (let b = a; b < LIMIT; b++) {
        const v = xor(b, a);
        if (v >= LIMIT) {
          break;
        }
        values[v] = 1;
      }
    }
  }
  tracer.clear();
  const goodValues = values.reduce((a, v, index) => {
    if (!v) {
      a.push(index);
    }
    return a;
  }, []);

  return goodValues;
}

assert.strictEqual(xor(7, 3), 9);

const values = TimeLogger.wrap('', (_) => sieve());

assert.strictEqual(values[1], 2);
assert.strictEqual(values[2], 3);
assert.strictEqual(values[3], 7);
assert.strictEqual(values[4], 11);
assert.strictEqual(values[5], 13);
assert.strictEqual(values[10], 41);

console.log('Tests passed');

const TARGET = 5000000;

if (values.length < TARGET) {
  throw `${values.length} < ${TARGET} - missing ${TARGET - values.length} items`;
}

const answer = values[TARGET];
console.log(`Answer is ${answer}`);
