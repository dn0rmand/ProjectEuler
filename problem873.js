const assert = require('assert');
const { Tracer, TimeLogger, linearRecurrence, polynomial } = require('@dn0rmand/project-euler-tools');

const MODULO = 1000000007n

const MAX_A = BigInt(1E6 + 1)

const LETTERS = {
  a: 1n,
  b: 2n,
  c: 3n,
  max: 4n
};

class State {
  static converter = { a: 'b', b: 'a', c: 'c' };

  constructor(a, b, c, l0 = 'c', l1 = 'c', count = 1n) {
    this.l0 = l0;
    this.l1 = l1;
    this.a = a;
    this.b = b;
    this.c = c;
    this.count = count;
  }

  getKey() {
    let key = 0n;
    const addValue = (value, factor) => {
      key = (key * factor) + BigInt(value);
    };

    if (this.l0 === 'c' && this.l1 === 'c') {
      addValue(this.c, 0n);
      addValue(Math.min(this.a, this.b), MAX_A);
      addValue(LETTERS[this.l0], LETTERS.max);
      addValue(LETTERS[this.l1], LETTERS.max);
      return key;
    }

    addValue(this.c, 0n);
    addValue(this.a, MAX_A);
    addValue(LETTERS[this.l0], LETTERS.max);
    addValue(LETTERS[this.l1], LETTERS.max);

    return key;
  }

  get done() {
    return (!this.a && !this.b && !this.c);
  }

  get dead() {
    if (this.c < 2 && this.a > 0 && this.b > 0) {
      return true;
    }

    if (this.a === 0 && this.b > 0) {
      if (this.l0 !== 'a' && this.l1 !== 'a') {
        return false;
      }
      if (this.l0 === 'a') {
        return this.l1 === 'a' ? this.c < 2 : this.c < 1;
      }
      return this.l1 === 'a' ? this.c < 2 : false;
    }

    if (this.b === 0 && this.a > 0) {
      if (this.l0 !== 'b' && this.l1 !== 'b') {
        return false;
      }
      if (this.l0 === 'b') {
        return this.l1 === 'b' ? this.c < 2 : this.c < 1;
      }
      return this.l1 === 'b' ? this.c < 2 : false;
    }

    return false;
  }

  addA() {
    if (this.a > 0 && this.l1 !== 'b' && this.l0 !== 'b') {
      return new State(this.a - 1, this.b, this.c, this.l1, 'a', this.count);
    }
  }

  addB() {
    if (this.b > 0 && this.l1 !== 'a' && this.l0 !== 'a') {
      return new State(this.a, this.b - 1, this.c, this.l1, 'b', this.count);
    }
  }

  addC() {
    if (this.c > 0) {
      return new State(this.a, this.b, this.c - 1, this.l1, 'c', this.count);
    }
  }
}

function W(a, b, c, trace) {
  let states = new Map();
  let newStates = new Map();

  const add = state => {
    if (!state || state.dead) {
      return;
    }
    const key = state.getKey();
    const old = newStates.get(key);
    if (old) {
      state.count = (old.count + state.count);// % MODULO;
    }
    newStates.set(key, state);
  }

  states.set(0, new State(a, b, c));

  const tracer = new Tracer(trace);

  let total = 0n;

  for (let count = a + b + c; count > 0; count--) {
    tracer.print(_ => `${count}: ${states.size}`);

    newStates.clear();
    for (const state of states.values()) {
      if (state.a === 0 && state.b === 0) {
        // only c left so dead
        total = (total + state.count);// % MODULO;
      } else {
        add(state.addA());
        add(state.addB());
        add(state.addC());
      }
    }
    [states, newStates] = [newStates, states];
  }

  tracer.clear();

  states.forEach(state => total = (total + state.count));// % MODULO);

  return total;
}

assert.strictEqual(W(2, 2, 4), 32n);
assert.strictEqual(W(4, 4, 44), 13908607644n);
console.log('Tests passed');

const values = [];

for (let a = 2; a < 50; a++) {
  values.push(W(a, a, a));
}
console.log(linearRecurrence(values, true));

// // const answer = TimeLogger.wrap('', _ => W(1E2, 1E3, 1E4, true));
// // console.log(`Answer is ${answer}`);

// a = b = 2 :                   1,  -5,  10,  -10,    5
// a = b = 3 :                0, 1,  -7,  21,  -35,   35,   -21,     7
// a = b = 4 :             0, 0, 1,  -9,  36,  -84,  126,  -126,    84,    -36,     9
// a = b = 5 :          0, 0, 0, 1, -11,  55, -165,  330,  -462,   462,   -330,   165,    -55,    11
// a = b = 6 :       0, 0, 0, 0, 1, -13,  78, -286,  715, -1287,  1716,  -1716,  1287,   -715,   286,    -78,   13 
// a = b = 7 :    0, 0, 0, 0, 0, 1, -15, 105, -455, 1365, -3003,  5005,  -6435,  6435,  -5005,  3003,  -1365,  455,  -105,  15
// a = b = 8:  0, 0, 0, 0, 0, 0, 1, -17, 136, -680, 2380, -6188, 12376, -19448, 24310, -24310, 19448, -12376, 6188, -2380, 680, -136, 17

// a(n) = 2*n + 1.
// a(n) = n*(2*n + 1)
// a(n) = n*(4*n^2 - 1)/3
// https://oeis.org/A122366