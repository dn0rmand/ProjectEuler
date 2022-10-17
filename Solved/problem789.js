const assert = require('assert');
const { TimeLogger, Tracer, primeHelper, BigMap } = require('@dn0rmand/project-euler-tools');

const MAX_PRIME = 2000000011;

TimeLogger.wrap('Loading primes', (_) => primeHelper.initialize(1e7));

const allPrimes = primeHelper.allPrimes();

function solve(prime, trace) {
  let bestCost = Math.min(prime - 1 + (prime - 3) / 2, 300);
  let best = [];

  const factorization = [];

  function inner(index, value, cost) {
    if (cost >= bestCost) {
      return;
    }
    if (value === prime - 1) {
      bestCost = cost;
      best = factorization.map((f) => ({ ...f }));
    }

    const tracer = new Tracer(trace && index > 6);
    const tracer2 = new Tracer(trace && index === 6);

    for (let i = index; i >= 0; i--) {
      const p = allPrimes[i];
      if (p >= prime || p > 53) {
        continue;
      }

      let v = value;
      const offset = p - 1;
      let newCost = cost;
      const f = { p, e: 0 };
      factorization.push(f);

      for (let e = 1; e < 9; e++) {
        tracer.print((_) => `${p}^${e}`);
        tracer2.print((_) => bestCost);
        newCost += offset;
        if (newCost >= bestCost) {
          break;
        }
        v = v.modMul(p, prime);
        f.e = e;
        inner(i - 1, v, newCost);
      }
      factorization.pop();
    }
    tracer2.clear();
    tracer.clear();
  }

  inner(16, 1, 0);

  let result = 1n;
  for (const { p, e } of best) {
    result *= BigInt(p) ** BigInt(e);
  }
  return result;
}

assert.strictEqual(solve(5), 4n);
assert.strictEqual(solve(11), 10n);
assert.strictEqual(solve(13), 12n);
assert.strictEqual(solve(23), 45n);
assert.strictEqual(solve(43), 128n);
assert.strictEqual(solve(53), 105n);
assert.strictEqual(solve(73), 72n);
assert.strictEqual(solve(97), 96n);
assert.strictEqual(solve(113), 112n);

console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => solve(MAX_PRIME, true));
console.log(`Answer is ${answer}`);
