const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MAX_K = 1e11;

class U {
  constructor(n) {
    this.seed = new Uint16Array(2 ** 24);
    this.previous = [];
    this.length = 0;
    this.add(2);
    this.add(2 * n + 1);
    this.n = n;
    this.last = 2 * n + 1;
    this.count = 2;
    this.offset = 1;
    this.even = undefined;
  }

  add(value) {
    if (this.even) {
      this.seed[value + 2]++;
      this.seed[value + this.even]++;
    } else {
      for (const v1 of this.previous) {
        const v2 = value + v1;
        this.seed[v2]++;
      }
      this.previous.push(value);
    }
  }

  calculateNext() {
    for (let value = this.last + this.offset; value < this.seed.length; value += this.offset) {
      if (this.seed[value] === 1) {
        this.add(value);
        return value;
      }
    }
    throw 'Error';
  }

  next() {
    this.count++;
    const value = this.calculateNext();
    const diff = value - this.last;
    this.last = value;

    if (this.offset === 1 && (value & 1) === 0) {
      this.even = value;
      this.offset = 2;
      this.last--; // to offset the offset :)
    }
    return diff;
  }

  findMarker(callback) {
    let idx = 0;
    const dummy = () => {};
    callback = callback || dummy;

    while (idx !== this.n + 1) {
      const v = this.next();
      callback(v);
      if (v === 4) {
        idx++;
      } else {
        idx = 0;
      }
    }
  }
}

class Sequence {
  constructor(start, index) {
    this.sums = new Uint32Array(1e7);
    this.length = 0;
    this.start = start;
    this.index = index;
  }

  add(value) {
    this.sums[this.length + 1] = value + this.sums[this.length];
    this.length++;
  }

  getAt(k) {
    let index = k - this.index;
    if (index < 0) {
      throw 'Error';
    }
    let skips = Math.floor(index / this.length);
    let value = this.start + skips * this.sums[this.length];
    index = index - skips * this.length;
    if (index > 0) {
      value += this.sums[index];
    }
    if (value > Number.MAX_SAFE_INTEGER) {
      throw 'Too Big';
    }
    return value;
  }
}

function getAt(n, k) {
  const u = new U(n);

  u.findMarker();

  const sequence = new Sequence(u.last, u.count);

  u.findMarker((v) => {
    sequence.add(v);
  });

  return sequence.getAt(k);
}

function solve(max, k) {
  let total = 0;
  for (let n = 2; n <= max; n++) {
    total += getAt(n, k);
    if (total > Number.MAX_SAFE_INTEGER) {
      throw 'sum too big';
    }
  }
  return total;
}

assert.strictEqual(getAt(2, 50000), 196855);
assert.strictEqual(getAt(3, 50000), 242289);
assert.strictEqual(getAt(4, 50000), 200151);
assert.strictEqual(getAt(5, 50000), 199793);
assert.strictEqual(getAt(6, 50000), 199855);
assert.strictEqual(getAt(7, 50000), 318701);

console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => solve(10, MAX_K));
console.log(`Answer is ${answer}`);
