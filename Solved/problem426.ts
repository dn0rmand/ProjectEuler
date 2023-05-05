import assert from 'assert';
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 10_000_000;

function* sequence(size: number): IterableIterator<number> {
  if (size <= 0) {
    yield 2;
    yield -2;
    yield 2;
    yield -1;
    yield 2;
  } else {
    let s0 = 290797;
    let factor = 1;
    size++;
    while (size--) {
      yield ((s0 % 64) + 1) * factor;
      s0 = s0 * s0;
      s0 %= 50515093;
      factor = -factor;
    }
  }
}

class Chain {
  data: Int32Array;
  length = 0;
  replaced = 0;

  constructor(data: Int32Array) {
    this.data = data;
  }

  get done() {
    return this.length === 0;
  }

  add(value: number) {
    if (this.length === 0) {
      if (value > 0) {
        this.data[0] = value;
        this.length = 1;
      }
      return;
    }

    if (value < 0) {
      this.replaced++;
      value += 1;
      if (!--this.data[this.length - 1]) {
        if (!--this.length) {
          return;
        }
      }
      if (value === 0) {
        return;
      }
    }
    if ((this.data[this.length - 1] < 0 && value < 0) || (this.data[this.length - 1] > 0 && value > 0)) {
      this.data[this.length - 1] += value;
    } else {
      this.data[this.length++] = value;
    }
  }

  finalize(): void {
    if (this.length && this.data[this.length - 1] > 0) {
      this.replaced++;
      if (!--this.data[this.length - 1]) {
        this.length = Math.max(0, this.length - 2);
      }
    }
  }

  reset() {
    this.length = 0;
    this.replaced = 0;
  }
}

function solve(length: number, trace = false): number {
  let data: Int32Array = new Int32Array(sequence(length));
  let chain = new Chain(data);
  let maxReplaced = 0;

  chain.length = data.length;

  const replaced = new Uint32Array((data.length + 3) / 2);

  const tracer = new Tracer(trace);

  while (!chain.done) {
    const length = chain.length;
    chain.reset();

    tracer.print(() => length);

    for (let i = 0; i < length; i++) {
      chain.add(chain.data[i]);
    }
    chain.finalize();
    for (let i = 1; i <= chain.replaced; i++) {
      replaced[i]++;
    }
    maxReplaced = Math.max(maxReplaced, chain.replaced);
  }

  tracer.clear();

  let total = 0;
  for (let i = 1; i <= maxReplaced; i++) {
    let value = replaced[i];
    total += value * value;
  }

  return total;
}

assert.strictEqual(solve(0), 14);
assert.strictEqual(solve(10), 8912);
assert.strictEqual(solve(100), 170376);
console.log('Tests passed');

const answer = TimeLogger.wrap('', () => solve(MAX, true));
console.log(`Answer is ${answer}`);
