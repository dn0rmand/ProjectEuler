const assert = require('assert');
const { TimeLogger, Tracer, BigMap, primeHelper } = require('@dn0rmand/project-euler-tools');

const MODULO = 83456729;

const DIGITS = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 26, 30, 33, 34];

primeHelper.initialize(34);

function getSimilar(value) {
  if (value === 23 || value === 29 || value === 31) {
    return 19;
  }
  let same = 1;
  primeHelper.factorize(value, p => same *= p);
  return same;
}

function makePairs(values) {
  const pairs = [];
  pairs[1] = [];

  const add = (i, j) => {
    if (pairs[i] === undefined) {
      pairs[i] = [j];
    } else {
      pairs[i].push(j);
    }
  };

  for (let i = 0; i < values.length; i++) {
    if (values[i] === 0) {
      continue;
    }
    const x = i & 1;
    if (x === 0) {
      pairs[1].push(i);
    }
    for (let j = i + 1; j < values.length; j++) {
      if (values[j] === 0) {
        continue;
      }
      if ((j & 1) !== x && i.gcd(j) === 1) {
        add(i, j);
        add(j, i);
      }
    }
  }

  return pairs;
}

function makeKey(used, last) {
  let key = 0;

  for (const d of DIGITS) {
    const c = used[d];
    key = key * 6 + c;
  }
  key = key * 35 + last;
  return key;
}

function generateValues(n) {
  const values = [0, 0];
  for (let i = 2; i <= n; i++) {
    const s = getSimilar(i);
    values[i] = 0;
    values[s] = values[s] + 1;
  }
  return values;
}

function P(n, trace) {
  const values = generateValues(n);
  const allPairs = makePairs(values);
  const memoize = new BigMap();

  function inner(used, last, count) {
    if (count === n) {
      return 1;
    }

    const k = makeKey(used, last);

    let total = memoize.get(k);
    if (total !== undefined) {
      return total;
    }

    total = 0;

    const tracer = new Tracer(trace && count < (values.length / 4));

    const pairs = allPairs[last];

    for (const i of pairs) {
      if (used[i] < values[i]) {
        tracer.print(_ => i);
        used[i]++;
        const subTotal = inner(used, i, count + 1);
        used[i]--;
        total = (total + subTotal.modMul(values[i] - used[i], MODULO)) % MODULO;
      }
    }

    tracer.clear();

    memoize.set(k, total);
    return total;
  }

  const total = inner(new Uint8Array(35), 1, 1);
  return total;
}

assert.strictEqual(P(4), 2);
assert.strictEqual(P(10), 576);
assert.strictEqual(P(16), 8515584);
assert.strictEqual(P(20), 9726493);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => P(34, true));
console.log(`Answer is ${answer}`);
