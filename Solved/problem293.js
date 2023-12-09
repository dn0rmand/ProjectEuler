// Pseudo-Fortunate Numbers
// ------------------------
// Problem 293 
// -----------
// An even positive integer N will be called admissible, if it is a power of 2 or its distinct 
// prime factors are consecutive primes.
// The first twelve admissible numbers are 2,4,6,8,12,16,18,24,30,32,36,48.

// If N is admissible, the smallest integer M > 1 such that N+M is prime, will be called the 
// pseudo-Fortunate number for N.

// For example, N=630 is admissible since it is even and its distinct prime factors are the 
// consecutive primes 2,3,5 and 7.
// The next prime number after 631 is 641; hence, the pseudo-Fortunate number for 630 is M=11.
// It can also be seen that the pseudo-Fortunate number for 16 is 3.

// Find the sum of all distinct pseudo-Fortunate numbers for admissible numbers N less than 1000000000.

const assert = require('assert');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper.js');

const MAX = 1000000000;

primeHelper.initialize(Math.floor(Math.sqrt(MAX)));

function admissible(n) {
  if ((n & 1) !== 0)
    return false;

  if (n === 2)
    return true;

  for (let p of primeHelper.allPrimes()) {
    if (p > n)
      break;

    if (n % p !== 0)
      return false;

    while ((n % p) === 0)
      n /= p;

    if (n === 1)
      break;
  }

  return n === 1;
}

function pseudoFortunate(n) {
  let m = n + 3;
  while (!primeHelper.isPrime(m))
    m += 2;
  return m - n;
}

function* getAdmissible(max) {
  for (let n = 2; n < max; n += 2) {
    if (admissible(n))
      yield n;
  }
}

assert.equal(pseudoFortunate(630), 11);

let used = new Map();
let total = 0;

for (let a of getAdmissible(MAX)) {
  let m = pseudoFortunate(a);
  if (!used.has(m)) {
    used.set(m);
    total += m;
  }
}

console.log("The sum of all distinct pseudo-Fortunate numbers for admissible numbers N less than 1000000000 is " + total);