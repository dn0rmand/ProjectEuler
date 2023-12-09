// Prime triples and geometric sequences
// -------------------------------------
// Problem 518
// -----------
// Let S(n) = Σ a+b+c over all triples (a,b,c) such that:
// a, b, and c are prime numbers.
// a < b < c < n.
// a+1, b+1, and c+1 form a geometric sequence.
// For example, S(100) = 1035 with the following triples:
// (2, 5, 11), (2, 11, 47), (5, 11, 23), (5, 17, 53), (7, 11, 17), (7, 23, 71), (11, 23, 47), (17, 23, 31),
// (17, 41, 97), (31, 47, 71), (71, 83, 97)

// Find S(1E8)

const MAX = 1E8;

const assert = require('assert');
const { primeHelper, TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

primeHelper.initialize(MAX);

function getSquares(n) {
  let squares = [];

  for (let p of primeHelper.allPrimes()) {
    if (p > n)
      break;
    if (n % p === 0) {
      let c = 1;
      n /= p;
      while (n % p === 0) {
        c++;
        n /= p;
        if (c === 2) {
          c = 0;
          squares.push(p);
        }
      }
      if (n === 1 || primeHelper.isPrime(n))
        break;
    }
  }
  return squares;
}

function* getPossibleB(max) {
  let squares = getSquares(max);

  function* makeMore(value, index) {
    var lastP = 0;

    for (let i = index; i < squares.length; i++) {
      let p = squares[i];
      if (p === lastP)
        continue;
      lastP = p;
      let v = value * p;
      if (v > max)
        break;
      yield v;
      yield* makeMore(v, i + 1);
    }
  }

  yield 1; // Always
  yield* makeMore(1, 0);
}

function S(n, progress) {
  let allPrimes = primeHelper.allPrimes();

  let total = 0;
  let percent = 0;
  let steps = Math.round(allPrimes.length / 100);
  let count = 0;
  let start = process.hrtime();

  const tracer = new Tracer(progress);
  for (let i = 0; i < allPrimes.length; i++) {
    tracer.print(_ => allPrimes.length - i);

    let a = allPrimes[i];
    if (a >= n)
      break;

    let root = Math.sqrt((n + 1) / (a + 1));
    let processed = new Set();

    for (let y of getPossibleB(a + 1)) {
      let maxX = Math.floor(y * root) + 1;
      let y2 = y * y;

      for (let x = y + 1; x < maxX; x++) {
        // Calculate b, second prime

        let b = x * (a + 1);
        if (b % y !== 0)
          continue;
        b = (b / y) - 1;

        if (b >= n || !primeHelper.isPrime(b))
          continue;

        if (processed.has(b))
          continue;
        processed.add(b);

        // Calculate c, third prime

        let c = x * x * (a + 1);
        if (c % y2 !== 0)
          continue;

        c = (c / y2) - 1;
        if (c >= n || !primeHelper.isPrime(c))
          continue;

        total += (a + b + c);
      }
    }
  }
  tracer.clear();
  return total;
}

assert.equal(S(100), 1035);
assert.equal(S(1E5), 249551109);
assert.equal(S(1E6), 17822459735);

console.log('Test passed');

const answer = TimeLogger.wrap("", _ => S(MAX, true));

console.log(`Answer is ${answer}`);
