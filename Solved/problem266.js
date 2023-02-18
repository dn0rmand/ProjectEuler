const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const delta = (a, b) => {
  const d = a - b;
  if (d < 0) {
    return -d;
  } else {
    return d;
  }
};

const MAX_PRIME = 190;
const MODULO = 10n ** 16n;

primeHelper.initialize(MAX_PRIME, true);
const allPrimes = primeHelper.allPrimes().map((p) => BigInt(p));

function getNumbers(max, primes) {
  const numbers = [];

  function inner(value, index) {
    if (value > max) {
      return;
    }
    numbers.push(value);
    for (let i = index; i < primes.length; i++) {
      const v = value * primes[i];
      if (v > max) {
        break;
      }
      inner(v, i + 1);
    }
  }

  inner(1n, 0);

  return numbers.sort(compare);
}

function quickSearch(values, value) {
  let min = 0;
  let max = values.length - 1;
  while (min < max) {
    const middle = Math.floor((min + max) / 2);
    const v = values[middle];
    if (v === value) {
      return middle;
    }
    if (v < value) {
      min = middle + 1;
    } else {
      max = middle - 1;
    }
  }
  return Math.max(min, max);
}

function findBest(target, primes) {
  const middle = Math.floor(primes.length / 2);
  const pLeft = primes.slice(0, middle);
  const pRight = primes.slice(middle);

  let tracer = new Tracer(true, 'Loading Set 1');
  const set1 = getNumbers(target, pLeft);
  tracer.clear();
  tracer = new Tracer(true, 'Loading Set 2');
  const set2 = getNumbers(target, pRight);
  tracer.clear();

  let best = 1;
  let bestDiff = target;

  const process = (v1, i) => {
    const v2 = set2[i];
    const b = v1 * v2;
    const d = delta(target, b);
    if (d < bestDiff) {
      best = b;
      bestDiff = d;
      tracer.lastPrint = undefined; // force print
      tracer.print((_) => bestDiff);
    }
  };

  tracer = new Tracer(true, 'Calculating best');
  for (const v1 of set1) {
    const max = target / v1;
    const i = quickSearch(set2, max);
    process(v1, i);
  }
  tracer.clear();
  return best;
}

function PSR(primes) {
  const product = primes.reduce((a, p) => a * p);
  const max = product.sqrt();

  const best = findBest(max, primes);
  if (best > max) {
    best = product / best;
  }
  return best % MODULO;
}

const answer = TimeLogger.wrap('', (_) => PSR(allPrimes));
console.log(`Answer is ${answer}`);
