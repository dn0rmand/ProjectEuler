const assert = require('assert');
const { TimeLogger, Tracer, primeHelper, BigSet, linearRecurrence } = require('@dn0rmand/project-euler-tools');

const MAX = 1e15;
const MAX_PRIME = Math.floor(Math.sqrt(MAX)) + 2;

TimeLogger.wrap('Loading primes', _ => primeHelper.initialize(MAX_PRIME));

function getMaxSquare(value) {
  let maxSquare = 1;
  primeHelper.factorize(value, (p, f) => {
    if (f > 1) {
      f = Math.floor(f / 2);
      maxSquare *= (p ** f);
    }
  });
  return maxSquare;
}

const squareNotFree = (function squareNotFree() {
  const values = new BigSet();
  const allPrimes = primeHelper.allPrimes();

  function inner(value, index) {
    if (values.has(value)) { throw "Duplicate"; }
    values.add(value);

    for (let i = index; i < allPrimes.length; i++) {
      const p = allPrimes[i];
      if (value % p === 0) {
        continue;
      }
      let v = value * p;
      if (v > MAX) {
        break;
      }
      inner(v, i + 1);
    }
  }

  function squares(value, index) {
    if (value > 1) {
      inner(value, 0);
    }

    for (let i = index; i < allPrimes.length; i++) {
      const p2 = allPrimes[i] ** 2;
      let v = value * p2;
      if (v > MAX) { break; }
      while (v <= MAX) {
        squares(v, i + 1);
        v *= p2;
      }
    }
  }

  // squares(1, 0);

  return values;
})();

function getSum(a, b) {
  if ((b * b) % a) {
    return 0;
  }

  let c = (b * b) / a;
  if (c >= b || c < 1) {
    return 0;
  }

  let sum = a + b + c;
  while (!((c * b) % a)) {
    const c2 = (c * b) / a;
    if (c2 >= c || c < 1) {
      break;
    }
    c = c2;
    sum += c;
  }

  return sum;
}

const $maxSum = new Map();

function maxSum(a) {
  let sum = $maxSum.get(a);
  if (sum !== undefined) {
    return sum;
  }

  sum = 0;
  const square = getMaxSquare(a);
  if (square > 1) {
    for (let b = a - square; b > 0; b -= square) {
      sum = getSum(a, b);
      if (sum) {
        const ab = a % b;
        if (ab) {
          let b2 = b - ab;
          while (b2 > 1) {
            let s = getSum(a, b2);
            if (s > sum) {
              sum = s;
            }
            b2 -= ab;
          }
        }
        break;
      }
    }
  }

  $maxSum.set(a, sum);
  return sum;
}

const $S = new Map();

function S(n) {
  let max = $S.get(n);
  if (max !== undefined) {
    return max;
  }

  max = 0;
  for (let a = n; a >= 4; a--) {
    let s = $S.get(a);
    if (s !== undefined) {
      if (s > max) {
        max = s;
      }
      break;
    }
    s = maxSum(a);
    if (s > max) {
      max = s;
    }
  }
  $S.set(n, max);
  return max;
}

function T1(n, trace) {
  const tracer = new Tracer(trace);

  let total = 0;
  for (let i = 4; i <= n; i += 2) {
    tracer.print(_ => n - i);
    total += S(i);
  }
  tracer.clear();
  return total;
}

function T2(n, trace) {
  const tracer = new Tracer(trace);

  let total = 0;
  for (let i = 5; i <= n; i += 2) {
    tracer.print(_ => n - i);
    total += S(i);
  }
  tracer.clear();
  return total;
}

function T(n, trace) {
  const total = T1(n, trace) - T2(n, trace);
  return total;
}

const values = [];

let previous = 4;
let previousS = 7;
let sum = 7;

const add = (i) => {
  if (i % 2) {
    sum -= previousS;
  } else {
    sum += previousS;
  }
};

for (let i = 5; values.length < 100; i++) {
  const s = maxSum(i);
  if (s !== 0) {
    const distance = i - previous;
    if (distance % 2 === 0) {
      assert.strictEqual(sum, 0);
    } else {
      values.push(previous); // { i: previous, sum, distance });
      sum = 0;
    }
    previous = i;
    previousS = s;
    add(i);
  } else {
    add(i);
  }
}
console.log(linearRecurrence(values));
// assert.strictEqual(S(4), 7);
// assert.strictEqual(S(10), 19);
// assert.strictEqual(S(12), 21);
// assert.strictEqual(S(1000), 3439);

// assert.strictEqual(T(1000), 2268);

// console.log('Tests passed');

// const answer = TimeLogger.wrap('', _ => T(1e5, true));
// console.log(`Answer is ${answer}`);
