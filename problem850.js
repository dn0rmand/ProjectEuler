const assert = require('assert');
const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 33557799775533;
const MODULO = 977676779;

const MAX_PRIME = 5792909;
const MAX_POWER = 45;

primeHelper.initialize(MAX_PRIME);

const allPrimes = primeHelper.allPrimes();

function triangle(n) {
  if (n & 1) {
    return n.modMul((n + 1) / 2, MODULO);
  } else {
    return (n / 2).modMul(n + 1, MODULO);
  }
}

/* Multiplicative function */
const FK = k => {
  if (k === 1) {
    return _ => 1;
  }

  const powers = [0, 0];
  let current = 0;
  while (powers.length <= MAX_POWER) {
    powers.push(++current);
    if (!(current % (k - 1))) {
      powers.push(current);
    }
  }

  return (p, e) => p.modPow(powers[e], MODULO);
};

function F(k, N) {
  const fk = FK(k);

  let total = 0;

  function inner(index, value, H) {
    if (index > 0) {
      const G = Math.floor(N / value) % MODULO;
      const s = G.modMul(H, MODULO);
      total = (total + s) % MODULO;
    }

    for (let i = index; i < allPrimes.length; i++) {
      const p = allPrimes[i];
      let v = value * (p * p);
      if (v > N) {
        break;
      }

      let e = 2;
      let f1 = fk(p, 1);
      while (v <= N) {
        const f0 = f1;
        f1 = fk(p, e);
        const h = (f1 + MODULO - f0);
        if (h) {
          inner(i + 1, v, H.modMul(h, MODULO));
        }
        v *= p;
        e++;
      }
    }
  }

  if (k > 1) {
    inner(0, 1, 1);
  }

  total = (total + N) % MODULO;
  total = (triangle(N) + MODULO - total) % MODULO;

  return total;
}

function S(N, trace) {
  const tracer = new Tracer(trace);

  let previous = -1;
  let total = 0;

  for (let k = 1; k <= N; k += 2) {
    tracer.lastPrint = undefined;
    tracer.print(_ => k);
    const subTotal = F(k, N);
    total = (total + subTotal) % MODULO;

    if (subTotal === previous) {
      const count = Math.floor((N - k) / 2);
      total = (total + count.modMul(previous, MODULO)) % MODULO;
      break;
    } else {
      previous = subTotal;
    }
  }

  tracer.clear();
  total = total.modDiv(2, MODULO);
  return total;
}

assert.strictEqual(TimeLogger.wrap('', _ => S(1000, true)), 123687804);
assert.strictEqual(TimeLogger.wrap('', _ => S(2000, true)), 16124795);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => S(MAX, true));
console.log(`Answer is ${answer}`);
