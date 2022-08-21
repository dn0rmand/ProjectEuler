const assert = require('assert');
const { Tracer, TimeLogger } = require('@dn0rmand/project-euler-tools');

const MAX_BOUND = 1e8;

let currentBound = MAX_BOUND;
let mCut = Math.floor(MAX_BOUND / 200);

// From Murray
// // observation - highest denominator that produced an in-range half point was actually < m/200
// // incorrect! found higher ones in the 0.. range
function setMaxBound(bound) {
  currentBound = bound;
  mCut = Math.floor(bound / 200);
}

class State {
  constructor(n, d, left, right) {
    this.numerator = n;
    this.denominator = d;

    this.left = left;
    this.right = right;
  }

  valueOf() {
    return { numerator: this.numerator, denominator: this.denominator };
  }

  mergeWithNode(n2, left, right) {
    if (left.numerator * 100 >= left.denominator) {
      // left > MIN => useless
      return;
    }

    const d = this.denominator + n2.denominator;
    const n = this.numerator + n2.numerator;

    if (d <= mCut) {
      return new State(n, d, left, right);
    } else if (d < currentBound && left.numerator === 0) {
      return new State(n, d, left, right);
    }
  }

  toLeft() {
    return this.mergeWithNode(this.left, this.left, this.valueOf());
  }

  toRight() {
    return this.mergeWithNode(this.right, this.valueOf(), this.right);
  }

  checkAmbiguous(other) {
    const n = this.numerator * other.denominator + other.numerator * this.denominator;
    const d = 2 * this.denominator * other.denominator;

    if (n > 0 && n < d && d <= currentBound && 100 * n < d) {
      return 1;
    } else {
      return 0;
    }
  }

  ambiguous() {
    return this.checkAmbiguous(this.left) + this.checkAmbiguous(this.right);
  }
}

function solve(max, trace) {
  setMaxBound(max);
  let total = 0;

  const tracer = new Tracer(trace);
  const state = new State(1, 2, { numerator: 0, denominator: 1 }, { numerator: 1, denominator: 1 });
  let states = [];

  states.push(state);

  while (states.length > 0) {
    tracer.print((_) => states.length);

    const state = states.pop();
    const l = state.toLeft();
    const r = state.toRight();

    if (l) {
      total += l.ambiguous();
      states.push(l);
    }

    if (r) {
      total += r.ambiguous();
      states.push(r);
    }
  }

  tracer.clear();
  return total;
}

assert.strictEqual(solve(1e4), 4950);
assert.strictEqual(solve(2.1e4), 10452);
assert.strictEqual(solve(1e5), 50271);
assert.strictEqual(solve(1e6), 509763);

console.log('Test passed');

const answer = TimeLogger.wrap('', (_) => solve(MAX_BOUND, true));
console.log(`Answer is ${answer}`);
