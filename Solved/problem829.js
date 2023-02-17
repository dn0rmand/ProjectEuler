const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const allPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n];

function factorize(n) {
  n = BigInt(n);
  const result = [];

  for (let p of allPrimes) {
    if (p > n) {
      break;
    }
    if (n % p === 0n) {
      let f = 0;
      while (n % p === 0n) {
        f++;
        n /= p;
      }
      result.push({ prime: p, power: f });
    }
  }

  return result;
}

const $split = new Map();

function split(n) {
  const r = $split.get(n);
  if (r !== undefined) {
    return r;
  }
  const primes = factorize(n);
  const max = n.sqrt();

  let best = 1n;
  let bestDiff = n;

  function inner(value, index) {
    let diff = n / value - value;
    if (diff < 0) {
      diff = -diff;
    }
    if (diff < bestDiff) {
      best = value;
      bestDiff = diff;
    }
    if (value >= max) {
      return;
    }
    for (let i = index; i < primes.length; i++) {
      let { prime, power } = primes[i];

      let v = value;
      while (power--) {
        v *= prime;
        inner(v, i + 1);
      }
    }
  }

  inner(1n, 0);

  const left = best;
  const right = n / best;
  if (left > right) {
    return { left: right, right: left };
  }
  $split.set(n, { left, right });
  return { left, right };
}

let minimal = true;

function buildTree(value) {
  if (allPrimes.includes(value)) {
    if (value !== 2n) {
      minimal = false;
    }
    return 'x';
  }
  const { left, right } = split(value);
  const leftNode = buildTree(left);
  const rightNode = buildTree(right);

  return `(${leftNode},${rightNode})`;
}

function doubleFactorial(n) {
  let value = 1n;

  for (let i = n; i > 1; i -= 2) {
    value *= BigInt(i);
  }

  return value;
}

function M(n) {
  const tracer = new Tracer(true);

  minimal = true;
  const factorial = doubleFactorial(n);
  const root = buildTree(factorial);
  if (minimal) {
    return factorial;
  }
  const primeCount = factorize(factorial).reduce((count, { power }) => count + power, 0);

  let primes = allPrimes.filter((p) => p < 29n && p !== 17n);
  let best = factorial;

  function inner(value, index, remaining) {
    if (value >= best) {
      return;
    }
    if (remaining === 0) {
      const tree = buildTree(value);
      if (root === tree) {
        best = value;
        tracer.print((_) => best);
      }
      return;
    }

    // tracer.print((_) => `${best} - ${value}`);

    for (let i = index; i < primes.length; i++) {
      const p = primes[i];
      let v = value * p;
      for (let c = 1; v < best && c <= remaining; c += 1, v *= p) {
        inner(v, i + 1, remaining - c);
      }
    }
  }

  tracer.print((_) => best);
  if (n === 31) {
    best = BigInt(Number.MAX_SAFE_INTEGER);
    let start = 128n * 243n * 125n;
    let used = 7 + 5 + 3;
    inner(start, 0, primeCount - used);
  } else if (n > 15) {
    primes = primes.filter((p) => p < 23);
    let start = 9n * (n === 19 ? 4n : 32n) * (n === 20 ? 1n : 5n);
    let used = 2 + (n === 19 ? 2 : 5) + (n === 20 ? 0 : 1);
    inner(start, 0, primeCount - used);
  } else {
    inner(2n, 0, primeCount - 1); // all even
  }
  tracer.clear();
  return best;
}

function solve() {
  let total = 0n;
  const tracer = new Tracer(true);

  for (let n = 2; n <= 31; n++) {
    tracer.lastPrint = undefined;
    tracer.print((_) => n);
    total += M(n);
  }

  tracer.clear();

  return total;
}

assert.strictEqual(M(9), 72n);
assert.strictEqual(M(10), 3456n);
const answer = TimeLogger.wrap('', (_) => solve());
console.log(`Answer is ${answer}`);
