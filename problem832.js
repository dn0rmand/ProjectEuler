const assert = require('assert');

const MAX = 10n ** 18n;

class State {
  constructor(start, sum) {
    this.start = start || 1;
    this.offset = this.start * 2;
    this.min = this.start;
    this.paper = [];
    this.sum = sum || 0;
    this.values = [];
    this.current = 0;
  }

  isTriangle() {
    return this.paper.length + this.start === this.min;
  }

  isUsed(value) {
    return value < this.min || this.paper[value - this.start];
  }

  setUsed(value) {
    if (value < this.min) {
      throw 'Error';
    }
    this.paper[value - this.start] = 1;
    this.sum += value;

    while (this.isUsed(this.offset)) {
      this.offset++;
    }
    while (this.paper[0]) {
      this.paper.shift();
      this.min++;
      this.start++;
    }
  }

  step() {
    const a = this.min;
    this.setUsed(a);
    let first = Math.max(this.offset, a + 1);
    for (let b = first; ; b++) {
      if (this.isUsed(b)) {
        continue;
      }
      const c = a ^ b;
      if (!this.isUsed(c)) {
        this.setUsed(b);
        this.setUsed(c);
        this.values.push({ a, b, c });
        break;
      }
    }
  }
}

function triangle(m) {
  if (m & 1) {
    return ((m + 1) / 2) * m;
  } else {
    return (m / 2) * (m + 1);
  }
}

function M1(n) {
  let lastStep = 0;
  let lastMin = 0;
  //   for (let i = 1; ; i++) {
  //     const y = 4 ** i;
  //     const x = (y - 1) / 3;
  //     if (x > n) {
  //       break;
  //     }
  //     lastStep = x;
  //     lastMin = y;
  //   }

  const state = new State(lastMin, triangle(lastMin - 1));
  for (let round = lastStep + 1; round <= n; round++) {
    state.step();
  }

  //   const toBinary = (v) => {
  //     let s = v.toString(4);
  //     while (s.length < 5) {
  //       s = '0' + s;
  //     }
  //     return s;
  //   };

  //   for (const { a, b, c } of state.values) {
  //     console.log(toBinary(a), toBinary(b), toBinary(c));
  //   }
  return state.sum;
}

function M(n) {
  function getSum(index) {
    if (index === 0) {
      return 6;
    }

    let count = 4 ** index;
    let s = count * count * 6;

    count = count - count / 4;
    for (let idx = index - 1; idx >= 0; idx--) {
      s += count * 4 ** idx * 6;
    }
    return s;
  }

  function inner(remaining, index, sum) {
    if (remaining === 0) {
      return sum;
    }
    let count = 4 ** index;
    if (remaining >= count) {
      return inner(remaining - count, index + 1, sum + getSum(index));
    }
    let value = count;
    while (remaining) {
      while (remaining < count) {
        count /= 4;
        index--;
      }
      const extra = getSum(index);
      sum += extra + count * value;
      remaining -= count;
      value += 4 ** index;
    }
    return sum;
  }

  const value = inner(n, 0, 0);
  return value;
}

assert.strictEqual(M(10), 642);
assert.strictEqual(M(1000), 5432148);
console.log('Tests passed');
