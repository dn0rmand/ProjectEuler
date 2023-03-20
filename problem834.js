const assert = require('assert');
const { TimeLogger, Tracer, primeHelper, BigSet } = require('@dn0rmand/project-euler-tools');

const MAX = 1234567;

primeHelper.initialize(MAX);

function getIndexes(n, primes, max, callback) {
  const visited = new BigSet();

  const sequence = m => ((m + 1) * (2 * n + m) / 2) % (m + n);

  for (let { prime, power } of primes) {
    const start = prime === 2 ? prime ** (power + 1) : prime;
    const step = prime === 2 ? prime ** (power + 1) : prime;

    for (let m = start; m <= max; m += step) {
      if (!visited.has(m)) {
        const seq = sequence(m);
        // const seq2 = sequence(m+2);
        // const k = 2 - (seq2 % (n + m + 2)) + (seq % (n + m));
        // if (k === 0 || k === 1) {
        //   break;
        // }

        if (seq === 0) {
          callback(m);
        }
        visited.add(m);
      }
    }
  }
}

function T(n, trace) {
  let total = 0;

  const primes = [];

  let max = n * n;

  primeHelper.factorize(n, (prime, power) => {
    primes.push({ prime, power });
  });

  const tracer = new Tracer(trace);

  getIndexes(n, primes, max, m => {
    tracer.print(_ => max - m);
    total += m;
  });
  tracer.clear();
  return total;
}

function U(N, trace) {
  let total = 0;
  let extra = 0n;

  const tracer = new Tracer(trace);

  for (let n = N; n >= 3; n--) {
    tracer.print(_ => n);
    const v = T(n, trace);
    const t = total + v;
    if (t > Number.MAX) {
      extra += BigInt(total) + BigInt(v);
      total = 0;
    } else {
      total = t;
    }
  }
  tracer.clear();
  if (extra) {
    return BigInt(total) + extra;
  } else {
    return total;
  }
}

assert.strictEqual(T(10), 148);
assert.strictEqual(T(100), 21828);
assert.strictEqual(U(100), 612572);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => U(1000, true));
console.log(`Answer is ${answer} `);


/*
(2*n * (m + 1) + m * (m + 1)) / 2
((m+1) * (2*n + m)) / 2
*/