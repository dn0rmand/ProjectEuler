const assert = require('assert');
const { primeHelper } = require('@dn0rmand/project-euler-tools');

primeHelper.initialize(100100);

function factorize(n) {
  const primes = {};

  primeHelper.factorize(n, (p, f) => {
    primes[p] = f;
  });

  return primes;
}

function factorial(n) {
  const primes = {};
  for (let k = 2; k <= n; k++) {
    const primes2 = factorize(k);
    for (const p in primes2) {
      primes[p] = (primes[p] || 0) + primes2[p];
    }
  }

  return primes;
}

const primes = factorial(43);
console.log(primes);
