const assert = require('assert');
const { Tracer, TimeLogger, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 1E6;
primeHelper.initialize(MAX);

const $factorize = [];

function factorize(n) {
  if ($factorize[n]) {
    return $factorize[n];
  }
  const primes = [];
  primeHelper.factorize(n, p => primes.push(p));
  $factorize[n] = primes;
  return primes;
}

function countPrimes(numbers) {
  let counts = [];

  for (const n of numbers) {
    for (const p of factorize(n)) {
      counts[p] = (counts[p] || 0) + 1;
    }
  }

  counts = counts.map((count, prime) => ({ prime, count }));
  counts.sort((a, b) => b.count - a.count);
  return counts;
}

function f(N) {
  let log = 0;
  let numbers = [];
  const primes = [];
  for (let n = 3; n <= N; n += 10) {
    if (primeHelper.isKnownPrime(n)) {
      primes.push(n);
      log += Math.log(n);
    } else if (!primes.some(p => n % p === 0)) {
      numbers.push(n);
    }
  }

  // Process others
  let counts = countPrimes(numbers);

  while (numbers.length > 0) {
    let counts = countPrimes(numbers);
    const prime = counts[0].prime;
    log += Math.log(prime);
    numbers = numbers.filter(n => n % prime !== 0);
  }

  return log.toFixed(6);
}

assert.strictEqual(f(40), "6.799056");
assert.strictEqual(f(2800), "715.019337");

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => f(MAX));
console.log(`Answer is ${answer}`);