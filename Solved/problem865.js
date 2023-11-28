const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MAX = 1e4;
const MODULO = 998244353;

function generateKey(count, debt, remaining) {
  const expect = debt + 3 - (count ? count : 3);
  if (expect > remaining) {
    return -1;
  } else {
    return expect * MAX + remaining;
  }
}

const memoize = new Int32Array(70000000);

function T(N) {
  memoize.fill(-1);

  function inner(count, debt, remaining) {
    if (remaining === 0) {
      return count + debt === 0 ? 1 : 0;
    }

    const key = generateKey(count, debt, remaining);
    if (key === -1) {
      return 0;
    }

    let total = memoize[key];
    if (total >= 0) {
      return total;
    }

    total = count + debt ? 0 : 1;
    if (count === 2) {
      total = (total + inner(0, debt, remaining - 1)) % MODULO;
    } else if (count === 1) {
      total = (total + inner(count + 1, debt, remaining - 1)) % MODULO;
    }
    const subTotal = inner(1, debt + (count ? 3 - count : 0), remaining - 1);
    total = (total + subTotal.modMul(count ? 9 : 10, MODULO)) % MODULO;

    memoize[key] = total;
    return total;
  }

  const total = inner(1, 0, N - 1).modMul(9, MODULO);

  return total;
}

assert.strictEqual(T(6), 261);
assert.strictEqual(T(9), 9504);
assert.strictEqual(T(12), 395154);
assert.strictEqual(T(30), 229231010); // 5576195181577716 MODULO;

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => T(MAX));
console.log(`Answer is ${answer}`);
