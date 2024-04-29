const assert = require('assert');
const { BigSet, BigMap, TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

let MAX_VALUE = 1e4;

const badOnes = new BigSet();

class State {
  constructor(a, b, c) {
    const n = (a < 0 ? 1 : 0) + (b < 0 ? 1 : 0) + (c < 0 ? 1 : 0);
    if (n > 1) {
      a = -a;
      b = -b;
      c = -c;
    }
    [a, b, c] = [a, b, c].sort((a, b) => a - b);
    const g = Math.abs(a.gcd(b).gcd(c));
    if (g !== 1) {
      this.a = a / g;
      this.b = b / g;
      this.c = c / g;
    } else {
      this.a = a;
      this.b = b;
      this.c = c;
    }
    this.key = `${a}:${b}:${c}`;
  }

  get done() {
    return this.a === 0 || this.b === 0 || this.c === 0;
  }

  *next() {
    const a1 = 2 * (this.b + this.c) - this.a;
    const b1 = 2 * (this.a + this.c) - this.b;
    const c1 = 2 * (this.a + this.b) - this.c;
    if (this.b && this.c && a1 <= MAX_VALUE) {
      yield new State(a1, this.b, this.c);
    }
    if (this.a && this.c && b1 <= MAX_VALUE) {
      yield new State(this.a, b1, this.c);
    }
    if (this.a && this.b && c1 <= MAX_VALUE) {
      yield new State(this.a, this.b, c1);
    }
  }
}

function f0(a, b, c) {
  const start = new State(a, b, c);
  if (badOnes.has(start.key)) {
    return 0;
  }

  MAX_VALUE = (start.a + 1) * (start.b + 1) * 20;

  let states = new Map();
  let newStates = new Map();
  let visited = new Set();
  let steps = 0;
  states.set(start.key, start);
  visited.add(start.key);

  while (states.size) {
    steps++;
    newStates.clear();
    for (const state of states.values()) {
      for (const newState of state.next()) {
        if (newState.done) {
          return steps;
        }
        if (badOnes.has(newState.key)) {
          continue;
        }
        if (!visited.has(newState.key)) {
          visited.add(newState.key);
          newStates.set(newState.key, newState);
        }
      }
    }
    [states, newStates] = [newStates, states];
  }
  visited.forEach(k => badOnes.add(k));
  return 0;
}

const $f = new BigMap();

function ff(state) {
  if (state.done) {
    return 1;
  }
  let result = $f.get(state.key);
  if (result !== undefined) {
    return result;
  }
  result = 0;
  $f.set(state.key, 0); // avoid re-entrance
  let values = [...state.next()];
  if (values.some(s => s.done)) {
    result = 2;
  } else {
    values = values.map(s => ff(s)).filter(v => v > 0).sort((a, b) => a - b);
    if (values.length) {
      result = values[0] + 1;
    } else {
      result = 0
    }
  }
  $f.set(state.key, result);
  return result;
}

function f(a, b, c) {
  const start = new State(a, b, c);
  const maxVal = (start.a + 1) * (start.b + 1) * 10;
  if (maxVal > MAX_VALUE) {
    MAX_VALUE = maxVal;
    $f.clear();
  }
  const result = ff(start);
  return result ? result - 1 : 0;
}

function F(a, b) {
  const tracer = new Tracer(true);
  let total = 0;
  const max = (a + 1) * (b + 1);
  for (let c = max; c; c--) {
    tracer.print(_ => c);
    const s = f(a, b, c);
    total += s;
  }
  tracer.clear();
  return total;
}

function solve(maxPower) {
  const tracer = new Tracer(true);

  let total = 0;
  for (let p = 1; p <= maxPower; p++) {
    tracer.print(_ => maxPower + 1 - p);

    const subTotal = F(6 ** p, 10 ** p);
    total += subTotal;
  }
  tracer.clear();
  return total;
}

assert.strictEqual(f(6, 10, 35), 3);
assert.strictEqual(f(6, 10, 36), 0);
assert.strictEqual(F(6, 10), 17);
assert.strictEqual(F(36, 100), 179);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => solve(3));
console.log(`Answer is ${answer}`);