const assert = require('assert');
const { Tracer, TimeLogger, linearRecurrence } = require('@dn0rmand/project-euler-tools');

const MODULO = 1000000007

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
// assert.strictEqual(W(4, 4, 44), 13908607644 % MODULO);

console.log('Tests passed');

const values = [];
let a, b, c;
a = b = c = 1;

while (values.length < 100) {
  if (a < b) {
    a = a + 1;
  } else if (b < c) {
    b = b + 1;
  } else {
    c = c + 1
  }
  values.push(W(a, b, c));
}
// console.log(values.join(', '));
console.log(linearRecurrence(values, true));

// const answer = TimeLogger.wrap('', _ => W(1E2, 1E3, 1E4, true));
// console.log(`Answer is ${answer}`);
