const assert = require('assert');
const { BigSet, BigMap, TimeLogger, Tracer, matrixSmall: Matrix } = require('@dn0rmand/project-euler-tools');

let MAX_VALUE = 1e4;

const badOnes = new BigSet();

class State {
  constructor(a, b, c, previous) {
    this.previous = previous;

    const n = (a < 0 ? 1 : 0) + (b < 0 ? 1 : 0) + (c < 0 ? 1 : 0);

    this.done = a === 0 || b === 0 || c === 0;
    this.bad = !this.done && (n === 3 || n === 0);

    if (n > 1) {
      a = -a;
      b = -b;
      c = -c;
    }
    [a, b, c] = [a, b, c].sort((a, b) => a - b);
    const g = Math.abs(a.gcd(b).gcd(c));
    this.a = a / g;
    this.b = b / g;
    this.c = c / g;
    this.a = a;
    this.b = b;
    this.c = c;
    this.key = `${a}:${b}:${c}`;
  }

  *next() {
    const a1 = 2 * (this.b + this.c) - this.a;
    const b1 = 2 * (this.a + this.c) - this.b;
    const c1 = 2 * (this.a + this.b) - this.c;
    const s1 = new State(a1, this.b, this.c, this);
    const s2 = new State(this.a, b1, this.c, this);
    const s3 = new State(this.a, this.b, c1, this);
    if (!s1.bad) {
      yield s1;
    }
    if (!s2.bad) {
      yield s2;
    }
    if (!s3.bad) {
      yield s3;
    }
  }
}

function f(a, b, c) {
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

const $ff = new BigMap();

function ff(state) {
  if (state.done) {
    return 1;
  }
  let result = $ff.get(state.key);
  if (result !== undefined) {
    return result;
  }
  result = 0;
  $ff.set(state.key, 0); // avoid re-entrance
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
  $ff.set(state.key, result);
  return result;
}

function f1(a, b, c) {
  const start = new State(a, b, c);
  const maxVal = (start.a + 1) * (start.b + 1) * 10;
  if (maxVal > MAX_VALUE) {
    MAX_VALUE = maxVal;
    $ff.clear();
  }
  const result = ff(start);
  return result ? result - 1 : 0;
}

function F(a, b) {
  const tracer = new Tracer(true);
  let total = 0;
  const x = f(a, b, 32);
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

function test(a, b, c) {
  const M = new Matrix(3, 3);
  let S = new Matrix(3, 3);

  M.set(0, 0, -1), M.set(0, 1, 2), M.set(0, 2, 2);
  M.set(1, 0, 2), M.set(1, 1, -1), M.set(1, 2, 2);
  M.set(2, 0, 2), M.set(2, 1, 2), M.set(2, 2, -1);

  S.set(0, 0, a), S.set(0, 1, b), S.set(0, 2, c);
  S.set(1, 0, a), S.set(1, 1, b), S.set(1, 2, c);
  S.set(2, 0, a), S.set(2, 1, b), S.set(2, 2, c);

  let steps = 0;
  while (steps < c) {
    steps++;
    S = S.multiply(M);
    if (!S.get(0, 0) || !S.get(0, 1) || !S.get(0, 2) ||
      !S.get(1, 0) || !S.get(1, 1) || !S.get(1, 2) ||
      !S.get(2, 0) || !S.get(2, 1) || !S.get(2, 2)) {
      return steps;
    }
  }
  return 0;
}

test(6, 10, 35);
assert.strictEqual(f(6, 10, 35), 3);
assert.strictEqual(f(6, 10, 36), 0);
assert.strictEqual(F(6, 10), 17);
assert.strictEqual(F(36, 100), 179);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => solve(3));
console.log(`Answer is ${answer}`);
