const assert = require('assert');
const { primeHelper, TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

primeHelper.initialize(1e5);

const allPrimes = primeHelper.allPrimes();

const MODULO = 999676999;
const MODULO_N = BigInt(MODULO);

const MAX = 50000;

function modMul(a, b) {
  const v = a * b;
  if (v > Number.MAX_SAFE_INTEGER) {
    const V = (BigInt(a) * BigInt(b)) % MODULO_N;
    return Number(V);
  }
  return v % MODULO;
}

const $D = TimeLogger.wrap('Initialize $D', () => {
  const $D = new Int32Array(MAX + 1);
  $D.fill(-1);
  $D[0] = 0;
  $D[1] = 1;
  for (const prime of allPrimes) {
    $D[prime] = 1;
  }

  function D(n) {
    if ($D[n] !== -1) {
      return $D[n];
    }

    for (let p of allPrimes) {
      if (p > n) {
        break;
      }
      if (n % p === 0) {
        const m = n / p;
        const v = (m + modMul(p, D(m))) % MODULO;
        $D[n] = v;
        return v;
      }
    }
    throw "Error";
  }

  for (let i = 1; i <= MAX; i++) {
    D(i);
  }

  return $D;
});

function S(n, trace) {
  const buckets = new Uint32Array(n + 1);
  const tracer = new Tracer(trace);

  for (let value = 2; value <= n; value++) {
    tracer.print(_ => n - value);
    const d = $D[value];
    buckets[value] = (d + buckets[value]) % MODULO;
    for (let from = 2; from + value <= n; from++) {
      const to = from + value;
      buckets[to] = (modMul(buckets[from], d) + buckets[to]) % MODULO;
    }
  }
  tracer.clear();

  const total = buckets.reduce((a, v, i) => (a + modMul(v, n + 1 - i)) % MODULO, n);
  return total;
}

assert.strictEqual(S(10), 396);
assert.strictEqual(S(1000), 308568181);
console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => S(MAX, true));
console.log(`Answer is ${answer}`);