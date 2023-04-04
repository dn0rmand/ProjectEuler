const assert = require('assert');
const { Tracer, TimeLogger, polynomial } = require('@dn0rmand/project-euler-tools');

const MODULO = 1234567891;

class State {
  constructor() {
    this.m = 0;
    this.n = 0;
    this.count = 1;
    this.values = [1, 2, 3];
  }

  get done() {
    return this.values[0] === 1 && this.values[1] === 2 && this.values[2] === 3;
  }

  getKey() {
    if (this.m < this.n) {
      const v = [this.values[2], this.values[1], this.values[0]];
      return `${this.n}:${this.m}:${v.join(',')}`;
    } else {
      return `${this.m}:${this.n}:${this.values.join(',')}`;
    }
  }

  clone() {
    const s = new State();
    s.m = this.m;
    s.n = this.n;
    s.count = this.count;
    s.values = this.values;
    return s;
  }

  m_move() {
    const s = this.clone();
    s.m++;
    s.values = [this.values[1], this.values[0], this.values[2]];
    return s;
  }

  n_move() {
    const s = this.clone();
    s.n++;
    s.values = [this.values[0], this.values[2], this.values[1]];
    return s;
  }
}

function a(m, n) {
  let states = new Map();
  let newStates = new Map();
  states.set(0, new State());

  let total = 0;

  const add = s => {
    const k = s.getKey();
    const o = newStates.get(k);
    if (o) {
      o.count = (o.count + s.count) % MODULO;
    } else {
      newStates.set(k, s);
    }
  }

  for (let i = m + n; i > 0; i--) {
    newStates.clear();
    for (let state of states.values()) {
      if (state.m < m) {
        add(state.m_move());
      }
      if (state.n < n) {
        add(state.n_move());
      }
    }
    [states, newStates] = [newStates, states];
  }

  for (const s of states.values()) {
    if (s.done) {
      total += s.count;
    }
  }

  return total;
}

const values = [];
for (let i = 1; i < 50; i++) {
  values.push(a(i, i));
}
console.log(values.join(', '));

assert.strictEqual(a(3, 3), 2n);
assert.strictEqual(a(123, 321), 172633303);

console.log('Tests passed');

const answer = a(1234, 4321);

console.log(`Answer is ${answer}`);