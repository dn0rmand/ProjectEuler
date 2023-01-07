const assert = require('assert');
const { TimeLogger, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 1e4;
const MAX_M = 1e16;
const MODULO = 1234567891;

primeHelper.initialize(MAX);

class Value {
  constructor(value) {
    if (Array.isArray(value)) {
      value.sort((a, b) => a - b);
      this.primes = value;
    } else {
      this.primes = [];
      primeHelper.factorize(value, (p, f) => {
        while (f--) {
          this.primes.push(p);
        }
      });
    }
  }

  reduce() {
    return this.primes.shift();
  }

  get isOne() {
    return this.primes.length === 0;
  }

  getValue() {
    return this.primes.reduce((a, p) => a.modMul(p, MODULO), 1);
  }
}

function updateDiagonals(diagonals, m, steps) {
  steps = BigInt(m) + 1n - BigInt(steps);

  for (const diagonal of diagonals) {
    let remaining = steps % BigInt(diagonal.length);
    while (remaining--) {
      diagonal.push(diagonal.shift());
    }
  }
}

function diagonalsToValues(diagonals) {
  const values = [];
  for (let i = 1; i <= diagonals[0].length; i++) {
    let v = [];
    for (const d of diagonals) {
      const idx = d.length - i;
      if (idx >= 0 && d[idx] > 1) {
        v.push(d[idx]);
      }
    }
    if (v.length > 0) {
      values.push(new Value(v));
    }
  }
  return values;
}

function valuesToDiagonals(values) {
  const diagonals = [];
  for (let i = 0; i < values.length; i++) {
    const d = [];
    for (let x = 0; x < values.length - i; x++) {
      d.push(values[i + x].primes[x] || 1);
    }
    diagonals.push(d);
  }
  return diagonals;
}

function doProcess(values) {
  const newValue = [];
  for (let i = 0; i < values.length; i++) {
    newValue.push(values[i].reduce());
  }
  values = values.filter((v) => !v.isOne);
  values.push(new Value(newValue));
  return values;
}

function S(n, m, expected) {
  const expectedSteps = expected ** 2;

  let values = [];
  for (let i = 2; i <= n; i++) {
    values.push(new Value(i));
  }
  let step = 1;
  for (; step <= expectedSteps && step <= m; step++) {
    values = doProcess(values);
  }
  for (; step <= m && values.length !== expected; step++) {
    values = doProcess(values);
  }

  if (step <= m) {
    const diagonals = valuesToDiagonals(values);
    updateDiagonals(diagonals, m, step);
    values = diagonalsToValues(diagonals);
  }

  const answer = values.reduce((a, v) => (a + v.getValue()) % MODULO, 0);
  return answer;
}

assert.strictEqual(S(100, 1e8, 22), 105957327);
assert.strictEqual(S(5, 3, 10), 21);
assert.strictEqual(S(10, 100, 6), 257);
console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => S(MAX, MAX_M, 253));
console.log(`Answer is ${answer}`);
