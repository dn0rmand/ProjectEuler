const assert = require('assert');
const { TimeLogger, matrixSmall: Matrix } = require('@dn0rmand/project-euler-tools');

const MODULO = 1234567891;

// a(n) = 6*a(n-1) - a(n-2) for n > 1, a(0) = 0 and a(1) = 2 
function S2(N) {
  let total = 0;
  let n = 1; // Start with 1(4) but do not include it

  while (true) {
    n++;
    const b = 2 * n * (n + 1);
    const a = Math.sqrt(b + b + 1);
    const p = a + b + b + 1;
    if (p > N) {
      break;
    }
    total = (total + p) % MODULO;
  }
  return total;
}

function fastS1(power) {
  const { log10, floor } = Math;

  const logLimit = power;
  const step = log10(5.82842712474619); // approximate increase per step
  const steps = floor((logLimit - log10(12)) / step) - 2;
  const factors = [-1, 6];
  const matrix = Matrix.fromRecurrenceWithSum(factors);
  const id = new Matrix(3, 1);

  let p1 = 6 * 12 - 2;
  let p2 = 6 * p1 - 12;

  id.set(0, 0, p2);
  id.set(1, 0, p1);
  id.set(2, 0, p1 + p2);

  if (steps < 1) {
    return p1;
  }

  const m = matrix.pow(steps, MODULO);
  v = m.multiply(id, MODULO)
  const r = v.get(2, 0);
  return r;
}

function fastS2(exponent) {
  assert.strictEqual(exponent % 2, 0);

  const factors = [-1000000, 1111000, -112110, 1111];
  const matrix = Matrix.fromRecurrence(factors);
  const id = new Matrix(4, 1);
  id.set(0, 0, S2(10 ** 8)); // 3
  id.set(1, 0, S2(10 ** 6)); // 2
  id.set(2, 0, S2(10 ** 4)); // 1
  id.set(3, 0, S2(10 ** 2)); // 0 

  const power = (exponent / 2) - 1;
  let v;
  if (power === 0) {
    v = id;
  } else {
    const m = matrix.pow(power, MODULO);
    v = m.multiply(id, MODULO)
  }
  const r = v.get(3, 0);
  return r;
}

function fastS(exponent) {
  const s1 = fastS1(exponent);
  const s2 = fastS2(exponent);

  return (s1 + s2 + 12) % MODULO;
}

function solve() {
  const exponent = 1e10;
  const r = fastS(exponent, false);
  return r;
}

assert.strictEqual(fastS(2), 258);
assert.strictEqual(fastS(4), 172004);
console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer}`);
