const assert = require('assert');
const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 1234567;

primeHelper.initialize(MAX);

function S(m, n) {
  const modulo = m + n;
  let t1 = (2 * n + m);
  let t2 = (m + 1);
  if (t2 & 1) {
    t1 /= 2;
  } else {
    t2 /= 2;
  }
  const t = t1 * t2;
  if (t > Number.MAX_SAFE_INTEGER) {
    return Number((BigInt(t1) * BigInt(t2)) % BigInt(modulo));
  } else {
    return t % modulo;
  }
}

function getDivisors(n, callback) {
  const primes = [];
  primeHelper.factorize(n * (n - 1), (p, f) => {
    primes.push({ prime: p, power: f });
  });

  function inner(value, index) {
    if (value > n) {
      callback(value);
    }

    for (let i = index; i < primes.length; i++) {
      const { prime, power } = primes[i];
      let v = value;
      for (let p = 1; p <= power; p++) {
        v *= prime;
        inner(v, i + 1);
      }
    }
  }

  inner(1, 0);
}

function T(n) {
  let total = 0;

  getDivisors(n, divisor => {
    const m = divisor - n;
    if (S(m, n) === 0) {
      total += m;
    }
  });

  return total;
}

function U(N, trace) {
  let total = 0;
  let extra = 0n;

  const tracer = new Tracer(trace);

  let start = N;

  for (let n = start; n >= 3; n--) {
    tracer.print(_ => n);
    const t = T(n);
    const subTotal = t + total;
    if (subTotal < Number.MAX_SAFE_INTEGER) {
      total = subTotal;
    } else {
      extra += BigInt(total) + BigInt(t);
      total = 0;
    }
  }
  tracer.clear();

  if (extra) {
    return extra + BigInt(total);
  } else {
    return total;
  }
}

assert.strictEqual(T(10), 148);
assert.strictEqual(T(100), 21828);
assert.strictEqual(U(100), 612572);
assert.strictEqual(U(1000), 656827957);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => U(MAX, true));
console.log(`Answer is ${answer} `);
