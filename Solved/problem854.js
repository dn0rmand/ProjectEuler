const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MODULO = 1234567891;
const MAX = 1e6;

function M(n) {
  let f0 = 0n;
  let f1 = 1n;

  for (let i = 0; i < n; i++) {
    [f0, f1] = [f1, f0 + f1];
  }

  const m = f0.gcd(f1 - 1n);

  return m;
}

function P(n) {
  let f0 = 1;
  let f1 = 1;
  let f2 = 4;

  let total = 2;
  for (let i = 2; i <= n; i += 2) {
    total = total.modMul(f0, MODULO);

    const f3 = (f2.modMul(f1, MODULO) + MODULO - 1).modDiv(f0, MODULO);
    [f0, f1, f2] = [f1, f2, f3];
  }
  return total;
}

assert.strictEqual(M(18), 76n);
assert.strictEqual(P(10), 264);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => P(MAX));
console.log(`Answer is ${answer}`);