import assert from 'assert';
const { TimeLogger, Tracer, matrixSmall: Matrix } = require('@dn0rmand/project-euler-tools');

const MODULO = 1234567891;
const MODULO_N = BigInt(MODULO);

const MAX_M = 123456789;
const MAX_N = 987654321;

function modMul(a: number, b: number): number {
  const v = a * b;
  if (v > Number.MAX_SAFE_INTEGER) {
    return Number((BigInt(a) * BigInt(b)) % MODULO_N);
  }
  return v % MODULO;
}

type Value = 0 | 1 | 2;

class State {
  m: number;
  count: number;
  value: Value;

  constructor(m: number, value: Value = 0, count: number = 1) {
    this.m = m;
    this.count = count;
    this.value = value;
  }

  get done() {
    return this.m === 0 && this.value % 3 === 0;
  }

  getKey(): number {
    return this.m * 10 + this.value;
  }

  clone(m: number, value: Value, factor = 1): State {
    return new State(this.m - m, value, factor > 1 ? modMul(this.count, factor) : this.count);
  }

  moves(callback: (s: State) => void) {
    if (this.m > 1) {
      callback(this.clone(2, this.value));
    }
    callback(this.clone(0, this.value));

    if (this.m > 0) {
      switch (this.value) {
        case 0:
          callback(this.clone(1, 1, 2));
          break;

        case 1:
          callback(this.clone(1, 0));
          callback(this.clone(1, 2));
          break;

        case 2:
          callback(this.clone(1, 0));
          callback(this.clone(1, 1));
          break;
      }
    }
  }
}

class Engine {
  total = 0;

  states: Map<number, State>;

  constructor(start: State) {
    this.states = new Map<number, State>();

    if (start.done) {
      this.total = 1;
    } else {
      this.states.set(start.getKey(), start);
    }
  }

  add(s: State, newStates: Map<number, State>) {
    const k = s.getKey();
    const o = newStates.get(k);
    if (o) {
      o.count = (o.count + s.count) % MODULO;
    } else {
      newStates.set(k, s);
    }
  }

  execute(steps: number, trace: boolean): number {
    let newStates = new Map<number, State>();

    const tracer = new Tracer(trace);

    while (steps) {
      tracer.print(() => `${steps} - ${this.states.size}`);
      steps -= 2;
      newStates.clear();
      for (const state of this.states.values()) {
        state.moves((newState) => {
          this.add(newState, newStates);
        });
      }
      [this.states, newStates] = [newStates, this.states];
    }

    tracer.clear();

    for (const state of this.states.values()) {
      if (state.done) {
        this.total = (this.total + state.count) % MODULO;
      }
    }
    return this.total;
  }
}

function a(m: number, n: number, trace = false): number {
  if (m > n) {
    [m, n] = [n, m];
  }

  return new Engine(new State(m)).execute(m + n, trace);
}

// function b(m: number, n: number): number {
//   if (m > n) {
//     [m, n] = [n, m];
//   }

//   const M = new Matrix(3 * m, 3 * m);

//   return 0;
// }

assert.strictEqual(a(3, 3), 2);
assert.strictEqual(a(123, 321), 172633303);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => a(12345, 54321, true));
console.log(`Answer is ${answer}`);
