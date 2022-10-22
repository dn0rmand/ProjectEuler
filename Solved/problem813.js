const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MODULO = BigInt(1e9 + 7);

const MAX_POWER = 8n ** 12n * 12n ** 8n;
const ELEVEN = [0n, 1n, 3n];

function xor(a, b) {
  if (b === undefined) {
    return a.map((x) => x + x);
  }
  let r = new Set();

  if (a.length < b.length) {
    [a, b] = [b, a];
  }
  for (const bit of b) {
    const c = a.map((x) => {
      const newBit = x + bit;
      if (r.has(newBit)) {
        r.delete(newBit);
      } else {
        r.add(newBit);
      }
    });
  }
  r = [...r.values()];
  return r;
}

function power(value, exp) {
  exp = BigInt(exp);
  let r = [0n];
  let base = value;

  while (exp > BigInt.ZERO) {
    if ((exp & BigInt.ONE) == BigInt.ONE) {
      r = xor(base, r);
    }
    exp = exp >> BigInt.ONE;
    if (exp) {
      base = xor(base);
    }
  }

  return r;
}

function P(n) {
  const value = power(ELEVEN, n);

  const TWO = 2n;

  let result = 0n;
  for (const i of value) {
    result = (result + TWO.modPow(i, MODULO)) % MODULO;
  }
  return result;
}

assert.strictEqual(P(2), 69n);

const answer = TimeLogger.wrap('', (_) => P(MAX_POWER));
console.log(`Answer is ${answer}`);
