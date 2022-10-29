const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MODULO = 998244353;

class State {
  static getStart(start, a, b) {
    if (start) {
      return start;
    }
    return {
      a: a === 'B' ? 1 : 0,
      b: b === 'B' ? 1 : 0,
    };
  }

  constructor(a, b, screams, count, start) {
    this.start = State.getStart(start, a, b);
    this.a = a === 'F' ? 1 : 0;
    this.b = b === 'F' ? 1 : 0;
    this.screams = screams;
    this.count = count;

    this.$key = undefined;
  }

  get key() {
    if (this.$key === undefined) {
      const k = this.a * 8 + this.b * 4 + this.start.a * 2 + this.start.b;
      this.$key = this.screams * 16 + k;
    }
    return this.$key;
  }

  finishUp() {
    if (this.a && this.start.b) {
      this.screams += 2;
    }
    if (this.b && this.start.a) {
      this.screams += 2;
    }
  }

  next(callback) {
    // across+across
    callback(new State('*', '*', this.screams + 2, this.count, this.start));
    // across+forward
    callback(new State('*', 'F', this.screams, this.count, this.start));
    // across+back
    callback(new State('*', 'B', this.screams + this.b * 2, this.count, this.start));

    // back+across
    callback(new State('B', '*', this.screams + this.a * 2, this.count, this.start));
    // back+forward
    callback(new State('B', 'F', this.screams + this.a * 2, this.count, this.start));
    // back+back
    callback(new State('B', 'B', this.screams + this.a * 2 + this.b * 2, this.count, this.start));

    // forward+across
    callback(new State('F', '*', this.screams, this.count, this.start));
    // forward+forward
    callback(new State('F', 'F', this.screams, this.count, this.start));
    // forward+back
    callback(new State('F', 'B', this.screams + this.b * 2, this.count, this.start));
  }
}

function S(n, trace) {
  const half = 2 * n;

  let states = new Map();
  let newStates = new Map();
  let remaining = half;

  const addState = (state) => {
    if (state.screams > half) {
      return;
    }
    if (state.screams + (remaining * 2 + 4) < half) {
      return;
    }
    const old = newStates.get(state.key);
    if (old) {
      old.count = (old.count + state.count) % MODULO;
    } else {
      newStates.set(state.key, state);
    }
  };

  const tracer = new Tracer(trace);
  const start = new State('*', '*', 0, 1);
  start.start = undefined;
  states.set(0, start);

  for (let p = 0; p < half; p++) {
    tracer.print((_) => `${half - p}: ${states.size}`);
    newStates.clear();

    for (const state of states.values()) {
      state.next(addState);
    }

    [states, newStates] = [newStates, states];
    remaining--;
  }

  let total = 0;
  for (const state of states.values()) {
    state.finishUp();
    if (state.screams === half) {
      total = (total + state.count) % MODULO;
    }
  }
  tracer.clear();

  return total;
}

assert.strictEqual(S(1), 48);
assert.strictEqual(
  TimeLogger.wrap('', (_) => S(5)),
  446447808
);
assert.strictEqual(
  TimeLogger.wrap('', (_) => S(7)),
  210769359
);
assert.strictEqual(
  TimeLogger.wrap('', (_) => S(10)),
  420121075
);

console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => S(1e3, true));
console.log(`Answer is ${answer}`);
