// Restricted Factorisations
// -------------------------
// Problem 636
// -----------
// Consider writing a natural number as product of powers of natural numbers with given exponents,
// additionally requiring different base numbers for each power.

// For example, 256 can be written as a product of a square and a fourth power in three ways such that
// the base numbers are different. That is, 256 = 1^2 × 4^4 = 4^2 × 2^4 = 16^2 × 1^4
// Though 4^2 and 2^4 are both equal, we are concerned only about the base numbers in this problem.
// Note that permutations are not considered distinct, for example 16^2×1^4 and 1^4×16^2 are considered to be the same.

// Similary, 10! can be written as a product of one natural number, two squares and three cubes in two ways
// (10! = 42 × 5^2 × 4^2 × 3^3 × 2^3 × 1^3 = 21 × 5^2 × 2^2 × 4^3 × 3^3 × 1^3) whereas 20! can be given the same
// representation in 41680 ways.

// Let F(n) denote the number of ways in which n can be written as a product of one natural number, two squares,
// three cubes and four fourth powers.

// You are given that F(25!) = 4933, F(100!) mod 1000000007 = 693952493 and F(1000!) mod 1000000007 = 6364496.

// Find F(1000000!) mod 1000000007

const {
  primeHelper
} = require('@dn0rmand/project-euler-tools');

const MAX = 1000000;

primeHelper.initialize(MAX);

function prepare(max) {
  let table = new Map();

  function add(prime, factor) {
    let old = table.get(prime) || 0;
    table.set(prime, old + factor);
  }

  function factorize(n) {
    if (primeHelper.isPrime(n)) {
      add(n, 1);
      return;
    }

    for (let p of primeHelper.allPrimes()) {
      if (p > n)
        break;

      let factors = 0;

      while (n % p === 0) {
        factors++;
        n /= p;
      }
      if (factors > 0)
        add(p, factors);
      if (n === 1)
        return;

      if (primeHelper.isPrime(n)) {
        add(n, 1);
        return;
      }
    }

    if (n > 1)
      add(n, 1);
  }

  for (let n = 2; n <= max; n++) {
    factorize(n);
  }

  let trimed = new Map();

  for (let entry of table) {
    if (entry[1] > 1)
      trimed.set(entry[0], entry[1]);
  }

  return trimed;
}

function solve(max) {
  let map = prepare(max);

  for (let entry of map) {
    console.log(entry[0], '^', entry[1]);
  }
  console.log('');
}

solve(1);
solve(2);
solve(3);
solve(4);
solve(5);
solve(6);
solve(7);
solve(8);
solve(9);
solve(10);

solve(25);

/*
2 ^ 22 => 11 squares , 7 cubes, 5 fourth
3 ^ 10 =>  5 squares , 3 cubes, 2 fourth
5 ^  6 =>  3 squares,  2 cubes, 1 fourth
7 ^  3 =>  1 square ,  1 cubes, 0 fourth
11^  2 =>  5 squares,  3 cubes, 2 fourth

12*6*4*2*6  = 3456 squares
 8*4*3*2*4  =  768 cubes
 6*3*2*1*3  =  108 fourth
*/