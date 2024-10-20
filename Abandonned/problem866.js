const assert = require('assert');
const { TimeLogger, Tracer, BigMap, polynomial } = require("@dn0rmand/project-euler-tools");

const MODULO = 987654319

const PRODUCT = k => k.modMul(2 * k - 1, MODULO);

const collect = typeof (global.gc) === 'function' ? global.gc : () => { };

class State {
  constructor(segments, product, count) {
    this.segments = segments || [];
    this.product = product || 1;
    this.count = count || 1;
  }

  get key() {
    const subKey = this.segments.reduce((a, count, length) => {
      if (count === 1) {
        a.push(`${length}`);
      } else if (count) {
        a.push(`${length}x${count}`);
      }
      return a;
    }, []);
    return `${this.segments.join(',')}`;
  }

  *splitSegment(length) {
    const count = this.count.modMul(this.segments[length], MODULO);

    for (let i = 1; i <= length; i++) {
      let left = i - 1;
      let right = length - i;

      const p1 = PRODUCT(left) || 1;
      const p2 = PRODUCT(right) || 1;
      const p = p1.modMul(p2, MODULO);

      const newSegments = [...this.segments];

      newSegments[0]++;
      newSegments[length]--;
      if (left) {
        newSegments[left]++;
      }
      if (right) {
        newSegments[right]++;
      }

      yield new State(newSegments, this.product.modMul(p, MODULO), count);
    }
  }

  *removePiece() {
    for (let length = 1; length < this.segments.length; length++) {
      const count = this.segments[length];
      if (!count) { continue; }

      yield* this.splitSegment(length);
    }
  }
};

function solve1(N, trace) {
  let states = new BigMap();
  let newStates = new BigMap();
  const start = new State([], PRODUCT(N), 1);
  for (let i = 0; i < N; i++) {
    start.segments[i] = 0;
  }
  start.segments[N] = 1;
  states.set(start.key, start);

  let sum = 0;
  let count = 0;
  let step = N;

  const tracer = new Tracer(trace);
  while (states.size) {
    newStates.clear();
    collect();
    let size = states.size;
    for (const state of states.values()) {
      tracer.print(_ => `${step}: ${states.size}: ${size} - ${newStates.size}`);
      size--;
      if (state.segments[0] === N) {
        sum = (sum + state.product.modMul(state.count, MODULO)) % MODULO;
        count = (count + state.count) % MODULO;
        continue;
      }
      for (const newState of state.removePiece()) {
        const k = newState.key;
        const o = newStates.get(k);
        if (o) {
          const p1 = o.count.modMul(o.product, MODULO);
          const p2 = newState.count.modMul(newState.product, MODULO);
          const c = (o.count + newState.count) % MODULO;
          const p = (p1 + p2).modDiv(c, MODULO);
          o.count = c;
          o.product = p;
          // o.count = (o.count + newState.count) % MODULO;
        } else {
          newStates.set(k, newState);
        }
      }
    }
    [states, newStates] = [newStates, states];
    step--;
  }
  tracer.clear();
  sum = sum.modDiv(count, MODULO);
  return sum;
}

function solve(N) {
  function inner(size) {
    if (size === 0) { return { product: 0, ways: 1 } };
    if (size === 1) { return { product: 1, ways: 1 } };

    let k = size * (2 * size - 1);
    let product = 0;
    let ways = 0;

    for (let i = 1; i <= size; i++) {
      const left = i - 1;
      const right = size - i;

      const { product: p1, ways: w1 } = inner(left);
      const { product: p2, ways: w2 } = inner(right);

      product += (p1 * w1 + p2 * w2);
      ways += w1 * w2;
    }

    product = (product * k);
    return { product: product / ways, ways };
  }

  const { product } = inner(N);
  return product;
}

assert.strictEqual(solve(3), 65);
assert.strictEqual(solve(4), 994);
console.log('Test passed');

const answer = TimeLogger.wrap("", _ => solve(100, true));
console.log(`Answer is ${answer}`);
