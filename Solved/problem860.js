const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 9898;
const MODULO = 989898989;

class State {
  constructor(a, b, c, d, count) {
    this.a = a; // GG
    this.b = b; // SS
    this.c = c; // GS
    this.d = d; // SG

    this.simplify();
    this.count = count;
  }

  simplify() {
    const cc = (this.c - this.c % 4) / 4;
    if (cc && this.a) {
      this.c = this.c % 4 + 4 * (cc - Math.min(this.a, cc));
      this.a -= Math.min(this.a, cc);
    }
    const dd = (this.d - this.d % 4) / 4;
    if (dd && this.b) {
      this.d = this.d % 4 + 4 * (dd - Math.min(this.b, dd));
      this.b -= Math.min(this.b, dd);
    }
    if (this.a > this.b) {
      this.a -= this.b;
      this.b = 0;
    } else {
      this.b -= this.a;
      this.a = 0;
    }
    if (this.c > this.d) {
      this.c -= this.d;
      this.d = 0;
    } else {
      this.d -= this.c;
      this.c = 0;
    }

    if (this.a > this.b || (this.a === this.b && this.c > this.d)) {
      const [a, c] = [this.a, this.c];
      this.a = this.b;
      this.b = a;
      this.c = this.d;
      this.d = c;
    }
  }

  get fair() {
    return this.a === this.b && this.c === this.d;
  }

  get key() {
    return (this.b - this.a) * 1e6 + (this.c - this.d);
  }

  add(remaining, callback) {
    const delta = Math.abs(this.a - this.b) + (Math.abs(this.c - this.d) / 4) - 1;
    const dead = delta > remaining;
    if (dead) {
      return;
    }
    callback(new State(this.a + 1, this.b, this.c, this.d, this.count));
    callback(new State(this.a, this.b + 1, this.c, this.d, this.count));
    callback(new State(this.a, this.b, this.c + 1, this.d, this.count));
    callback(new State(this.a, this.b, this.c, this.d + 1, this.count));
  }
}

function F(n, trace) {
  let states = new Map();
  let newStates = new Map();

  states.set(0, new State(0, 0, 0, 0, 1));

  const tracer = new Tracer(trace);

  for (let i = 0; i < n; i++) {
    tracer.print(_ => `${n - i}: ${states.size}`);
    newStates.clear();
    for (const state of states.values()) {
      state.add(n - i, newState => {
        const k = newState.key;
        const o = newStates.get(k);
        if (o) {
          o.count = (o.count + newState.count) % MODULO;
        } else {
          newStates.set(k, newState);
        }
      });
    }
    [states, newStates] = [newStates, states];
  }

  let total = 0;
  states.forEach(state => {
    if (state.fair) {
      total = (total + state.count) % MODULO;
    }
  });
  tracer.clear();
  return total;
}

assert.strictEqual(F(2), 4);
assert.strictEqual(F(10), 63594);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => F(MAX, true));
console.log(`Answer is ${answer}`);