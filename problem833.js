const assert = require('assert');

const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

primeHelper.initialize(1e6);

const MAX = 10n ** 35n;

function T(a) {
  return (a * (a + 1n)) / 2n;
}

function factors(value) {
  const f = [];
  primeHelper.factorize(Number(value), (p, n) => {
    if (n === 1) {
      f.push(`${p}`);
    } else {
      f.push(`${p}^${n}`);
    }
  })
  return f.join(' * ');
}

function S(n) {
  const tracer = new Tracer(true);
  n = BigInt(n);
  const n2 = n * n;

  let total = 0n;
  const values = [];

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
        total += c;
        values.push({ c, bb: b, cc: factors(c) });
      }
    }
  }
  tracer.clear();
  values.sort((v1, v2) => Number(v1.c - v2.c));
  return total;
}

console.log(S(1e5));

const values = [0n];
let previous = 0n;
for (let i = 1n; previous <= 10n ** 35n; i++) {
  previous = previous + i;
  values.push(previous);
}

console.log(values.join(', '));

process.exit(0);

assert.strictEqual(S(1E5), 1479802n);
assert.strictEqual(S(1E9), 241614948794n);

console.log('Tests passed');