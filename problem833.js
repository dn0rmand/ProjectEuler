const assert = require('assert');

const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 10n ** 35n;
const MODULO = 136101521n;

function T(a) {
  return (a * (a + 1n)) / 2n;
}

function S(n) {
  const tracer = new Tracer(true);
  n = BigInt(n);
  const n2 = n * n;

  let total = 0n;

  for (let b = 2n; ; b++) {
    const tb = T(b);
    if (tb > n2) {
      break;
    }

    tracer.print(_ => n2 - tb);

    for (let a = 1n; a < b; a++) {
      const ta = T(a);
      const c2 = ta * tb;
      if (c2 > n2) {
        break;
      }
      const c = c2.sqrt();
      if (c * c === c2) {
        total = (total + c) % MODULO;
      }
    }
  }
  tracer.clear();
  return total;
}

assert.strictEqual(S(1E5), 1479802n);
assert.strictEqual(S(1E9), 241614948794n % MODULO);

console.log('Tests passed');