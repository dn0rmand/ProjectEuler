const assert = require('assert');
const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 100000000;

TimeLogger.wrap('Loading primes', (_) => primeHelper.initialize(1e4));

// https://oeis.org/A216453
// a(n) = 6 * ( C(n+1 , 2) - Sum_{i=1..n} phi(i) )
function H(n, trace) {
  let c = 1n;
  let p = 1;

  const tracer = new Tracer(trace);
  for (let i = 2, b = 1n, t = 3n; i <= n; i++, b++, t++) {
    tracer.print((_) => n - i);
    c *= t;
    c /= b;
    p += primeHelper.PHI(i);
  }

  tracer.clear();
  const result = 6n * (c - BigInt(p));
  return result;
}

assert.strictEqual(H(5), 30n);
assert.strictEqual(H(10), 138n);
assert.strictEqual(H(1000), 1177848n);
console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => H(MAX, true));
console.log(`Answer is ${answer}`);
