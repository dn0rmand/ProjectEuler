const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MAX = 300;

const scores = (function () {
  const scores = [0];

  const scoreOdd = n => {
    const v = (n - 1) / 2;
    if (v & 1) {
      return scores[v] * 2 + 1;
    } else {
      return scores[v] === 0 ? 1 : 0;
    }
  };

  const scoreEven = n => {
    const v = (n - 2) / 2;
    if (!(v & 1)) {
      return scores[v] * 2 - 1;
    } else {
      return scores[v] === 0 ? -1 : 0;
    }
  };

  for (let i = 1; i <= MAX; i += 2) {
    scores[i] = scoreOdd(i);
    scores[i + 1] = scoreEven(i + 1);
  }

  return scores;
})();

class Memoize {
  static keyOffset = 91000;
  static size = 27315750 - Memoize.keyOffset;
  static multiplier = 2 ** 31;
  static mask = Memoize.multiplier - 1;

  constructor() {
    this.used = new Uint8Array(Memoize.size);
    this.data1 = new Uint32Array(Memoize.size);
    this.data2 = new Uint16Array(Memoize.size);
  }

  static makeKey(remaining, current, score) {
    return (remaining * 90601 + current * 451 + score + 150) - Memoize.keyOffset;
  }

  get(key) {
    if (this.used[key]) {
      const v1 = this.data1[key];
      const v2 = this.data2[key];
      if (v2) {
        return v2 * Memoize.multiplier + v1;
      } else {
        return v1;
      }
    }
  }

  set(key, value) {
    this.used[key] = 1;
    const v1 = value & Memoize.mask;
    this.data1[key] = v1;
    if (v1 !== value) {
      const v2 = (value - v1) / Memoize.multiplier;
      this.data2[key] = v2;
    }
  }

  clear() {
    this.used.fill(0);
    this.data1.fill(0);
    this.data2.fill(0);
  }
}

const memoize = new Memoize();

function calculate(remaining, current, score) {
  if (remaining === 0) {
    return score <= 0 ? 1 : 0;
  }
  if (current > remaining) {
    current = remaining;
  }

  const key = Memoize.makeKey(remaining, current, score);

  let total = memoize.get(key);
  if (total !== undefined) {
    return total;
  }
  total = 0;
  for (let i = 1; i <= current; i++) {
    total += calculate(remaining - i, i, score + scores[i]);
  }
  memoize.set(key, total);
  return total;
}

function C(n) {
  memoize.clear();
  const total = calculate(n, n, 0);
  return total;
}

assert.strictEqual(C(5), 2);
assert.strictEqual(C(16), 64);
assert.strictEqual(C(25), 488);
assert.strictEqual(C(60), 205482);

console.log('tests passed');

const answer = TimeLogger.wrap(`C(${MAX})`, _ => C(MAX));
console.log(`Answer is ${answer}`);