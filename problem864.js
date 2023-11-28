const assert = require('assert');
const { primeHelper, TimeLogger, BigSet, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX_X = 123567101;//113;
const MAX_PRIME = 13e8;
const EXTRA_PRIME = 44560482149;

const allPrimes = TimeLogger.wrap('Loading 4k+1 primes', _ => {
  primeHelper.initialize(MAX_PRIME, true);
  const allPrimes = primeHelper.allPrimes().filter(p => (p % 4) === 1);
  allPrimes.push(EXTRA_PRIME);
  return allPrimes;
});

function tonelliShanks(n, p) {
  const legendre = (a, p) => a.modPow((p - 1) / 2, p);

  if (legendre(n, p) != 1) {
    // not a square (mod p)
    return;
  }

  let q = p - 1;
  let s = 0;
  while (q % 2 == 0) {
    q /= 2;
    s += 1;
  }
  if (s == 1) {
    return n.modPow(n, (p + 1) / 4, p);
  }

  let z = 2;
  for (; z < p; z++) {
    if ((p - 1) == legendre(z, p)) {
      break;
    }
  }

  let c = z.modPow(q, p);
  let r = n.modPow((q + 1) / 2, p);
  let t = n.modPow(q, p);
  let m = s;

  while ((t - 1) % p) {
    let t2 = t.modMul(t, p);
    let i = 1;
    for (; i < m; i++) {
      if ((t2 - 1) % p == 0) {
        break;
      }
      t2 = t2.modMul(t2, p);
    }
    const pow1 = 2 ** (m - i - 1);
    const pow2 = 1 << (m - i - 1);
    if (pow1 !== pow2) {
      throw "Error";
    }
    b = c.modPow(pow1, p);
    r = r.modMul(b, p);
    c = b.modMul(b, p);
    t = t.modMul(c, p);
    m = i;
  }
  return r;
}

function Hensel(v, p) {
  p = BigInt(p);
  v = BigInt(v);
  p2 = p * p;

  const f = x => (x + x) % p;
  const F = x => (x.modMul(x, p2) + 1n) % p2;
  const f1 = x => (x + x).modInv(p);

  if (F(v) === 0n || f(v) === 0n) {
    return v;
  }
  const a2 = (v + p2 - F(v).modMul(f1(v), p2)) % p2;
  return a2;
}

function C(n, trace) {
  const visited = new BigSet();
  let total = n;

  const add = (v, p) => {
    if (!v) {
      return;
    }

    const p2 = BigInt(p) * BigInt(p);

    let x1 = BigInt(v);
    let x2 = p2 - x1;
    let x = x1 > x2 ? x2 : x1;

    const tracer2 = new Tracer(trace);
    while (x <= n) {
      tracer2.print(_ => n - Number(x));
      if (x1 <= n && !visited.has(x1)) {
        total--;
        visited.add(x1);
      }
      if (x2 <= n && !visited.has(x2)) {
        total--;
        visited.add(x2);
      }
      x += p2;
      x1 += p2;
      x2 += p2;
    }
    tracer2.clear();
  };

  const tracer = new Tracer(trace);
  const primes = allPrimes.filter(p => p <= n);
  primes.reverse();
  for (const p of primes) {
    if (p > n) {
      break;
    }
    tracer.print(_ => p);
    const sol = tonelliShanks(p - 1, p);
    if (sol !== undefined) {
      const x1 = Hensel(sol, p);

      add(x1, p);
    }
  }
  tracer.clear();
  return total;
}

assert.strictEqual(C(10), 9);
assert.strictEqual(C(1000), 895);
console.log('Tests passed');
const answer = TimeLogger.wrap('', _ => C(MAX_X, true));
console.log(`Ansswer is ${answer}`);