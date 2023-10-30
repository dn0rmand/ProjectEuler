const assert = require('assert');
const { TimeLogger, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 1e12;
const MAX_PRIME = 1e6;
TimeLogger.wrap('Loading primes', _ => primeHelper.initialize(MAX_PRIME, true));

function Q(N) {
  let totals = new BigUint64Array(11);

  const allPrimes = primeHelper.allPrimes();
  const maxPrime = allPrimes[allPrimes.length - 1];

  function inner(value, index, count) {
    if (count > 20 || value > N) {
      return;
    }

    if (count > 1) {
      totals[count / 2] += 1n;
      if (count <= 10) {
        const maxP = Math.floor(N / value);
        if (maxP > maxPrime) {
          const primes = primeHelper.countPrimes(maxP) - allPrimes.length;
          totals[count] += BigInt(primes);
        }
      }
    }

    if (count > 10) {
      return;
    }

    for (let i = index; i < allPrimes.length; i++) {
      const p = allPrimes[i];
      let v = value * p;
      let e = 1;
      if (v > N) {
        break;
      }
      while (v <= N) {
        const c = count * (e + (e & 1));
        if (c > 20) {
          break;
        }
        inner(v, i + 1, c);
        v *= p;
        e++;
      }
    }
  }

  inner(1, 0, 1);

  return totals;
}

function Qk(k, N, trace) {
  const totals = Q(N, trace);
  return totals[k];
}

function solve(N) {
  const totals = Q(N);
  let total = 0n;
  for (let k = 2; k <= 10; k++) {
    total += totals[k];
  }
  return total;
}

// https://oeis.org/A286324
// Multiplicative with a(p^e) = e + (e mod 2)

assert.strictEqual(Qk(2, 1e2), 51n);
assert.strictEqual(TimeLogger.wrap('', _ => Qk(6, 1e6)), 6189n);
assert.strictEqual(TimeLogger.wrap('', _ => solve(1e8)), 75970072n);
console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => solve(MAX));
console.log(`Asnwer is ${answer}`);
