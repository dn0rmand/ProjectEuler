const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MODULO = 100000007;
const MAX = 1E6;

const factorial = (function () {
  const f = [1, 1];
  let current = 1;
  for (let i = 2; i <= MAX; i++) {
    current = current.modMul(i, MODULO);
    f[i] = current;
  }
  return f;
})();

const twoPower = (function () {
  const f = [1];
  const maxK = MAX / 3;
  let current = 1;
  for (let i = 1; i <= maxK; i++) {
    current = current.modMul(2, MODULO);
    f[i] = current;
  }
  return f;
})();

function binomial(n, p) {
  const top = factorial[n];
  const bottom = factorial[p].modMul(factorial[n - p], MODULO);

  return top.modDiv(bottom, MODULO);
}

/*
a(n) = Sum (m+k+1)! * binomial(m+k,m) * 2^k * (k + v1v2)! * (m+k)! 
m >= 0 && k >= 0 && 2*m + 3*k = n-1-v1v2
*/

let maxK = 0;

function T(n) {
  let total = 0;
  const starts = [0, 2, 1];
  const factors = [1, 2, 1];

  for (const v1v2 of [0, 1, 2]) {
    const x = n - 1 - v1v2;
    let subTotal = 0;

    for (let m = starts[x % 3]; ; m += 3) {
      const k = (x - 2 * m) / 3;

      if (k < 0) {
        break;
      }

      maxK = Math.max(k, maxK);

      const a = factorial[m + k + 1];
      const b = binomial(m + k, m, MODULO);
      const c = twoPower[k];
      const d = factorial[k + v1v2];
      const e = factorial[m + k];

      const t = a.modMul(b, MODULO).modMul(c, MODULO).modMul(d, MODULO).modMul(e, MODULO);

      subTotal = (subTotal + t) % MODULO;
    }

    total = (total + subTotal * factors[v1v2]) % MODULO;
  }

  return total;
}

assert.strictEqual(T(10), 61632);
assert.strictEqual(T(20), 23658834);
assert.strictEqual(T(100), 70811360);
assert.strictEqual(T(1000), 47255094);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => T(MAX));
console.log(`Answer is ${answer}`);

