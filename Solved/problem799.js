const assert = require('assert');
const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

primeHelper.initialize(1e6);

const MAX_INDEX = 2.71e7;

function sqrt(p) {
  const x = 12 * p + 1;
  if (x > Number.MAX_SAFE_INTEGER) {
    const target = 12n * BigInt(p) + 1n;
    let root = BigInt(Math.floor(Math.sqrt(x)));
    while (root * root < target) {
      root++;
    }
    if (root * root === target) {
      return Number(root);
    }
  } else {
    const root = Math.sqrt(x);
    if (root === Math.floor(root)) {
      return root;
    }
  }
}

function P2N(p) {
  const D = sqrt(p);

  if (D) {
    const x = D + 1;
    if (x % 6 === 0) {
      return x / 6;
    }
  }
}

function P(n) {
  return n * (3 * n - 1);
}

function assertSequence(values) {
  for (let n = 1; n <= values.length; n++) {
    const p = P(n);
    assert.strictEqual(p, 2 * values[n - 1]);
  }
}

const SPEED = 0.05;
const DELTA = Math.ceil(MAX_INDEX * SPEED);

const MAX_N1 = (function () {
  const maxP = P(MAX_INDEX - 1);

  for (let n1 = 1; n1 <= MAX_INDEX; n1++) {
    if (P(n1) + P(n1 + 1) > maxP) {
      return n1;
    }
  }
})();

function* next(tracer) {
  const counts = new Uint32Array(MAX_INDEX);
  const maxP = P(MAX_INDEX - 1);
  let maxCount = 0;
  let maximumCount = 0;
  for (let n1 = 1; n1 <= MAX_N1; n1++) {
    const v1 = P(n1);
    let count = counts[n1];
    if (count > maxCount) {
      maxCount = count;
      yield { value: v1 / 2, count: count };
    }
    let max = DELTA;
    for (let n2 = n1 + 1; n2 < max; n2++) {
      tracer.print((_) => `${MAX_N1 - n1} - ${max - n2} - ${maximumCount}`);
      const v2 = P(n2);
      const v3 = v1 + v2;
      if (v3 > maxP) {
        break;
      }
      const n3 = P2N(v3);
      if (n3) {
        max += DELTA;
        if (max > MAX_INDEX) {
          max = MAX_INDEX;
        }
        const c = ++counts[n3];
        maximumCount = Math.max(maximumCount, c);
      }
    }
  }
}

function solve1(k, trace) {
  const tracer = new Tracer(trace);
  for (const { value, count } of next(tracer)) {
    tracer.clear();
    console.log(count, value);
    if (count === 1) {
      assert.strictEqual(value, 92);
    } else if (count === 2) {
      assert.strictEqual(value, 3577);
    } else if (count === 3) {
      assert.strictEqual(value, 107602);
    }
    if (count >= k) {
      tracer.clear();
      return value;
    }
  }

  tracer.clear();
  return 'No Solution';
}

function solve(target) {
  const tracer = new Tracer(true);

  let maxCount = 0;

  let delta = Math.ceil(MAX_INDEX / 2000);
  let start = Math.floor(MAX_INDEX / 2);
  while (start % 5 !== 3) {
    start++;
  }
  const limits = [delta, delta * 15, delta * 40, MAX_INDEX + 1];
  const minCounts = [1, 2, 5, 0];

  let step = 1;
  for (let n = start; n < MAX_INDEX; n += step, step = step === 1 ? 4 : 1) {
    tracer.print((_) => MAX_INDEX - n);

    const vn = P(n);
    let count = 0;
    let limitIndex = 0;
    for (let a = 1; a <= n - 1; a++) {
      if (a > limits[limitIndex]) {
        if (count < minCounts[limitIndex]) {
          // No point persisting
          break;
        }
        limitIndex++;
      }

      const va = P(a);
      const vb = vn - va;
      const b = P2N(vb);
      if (b) {
        count++;
        if (count > maxCount) {
          maxCount = count;
        }
        if (count >= target) {
          tracer.clear();
          console.log(n);
          return vn / 2;
        }
      }
    }
  }
  tracer.clear();
  return 'No Solution';
}

assertSequence([1, 5, 12, 22, 35, 51, 70, 92]);

const answer = TimeLogger.wrap('', (_) => solve(101, true));
console.log(`Answer is ${answer}`);
