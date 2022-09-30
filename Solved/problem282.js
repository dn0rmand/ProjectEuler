const assert = require('assert');
const { TimeLogger, primeHelper } = require('@dn0rmand/project-euler-tools');

const MODULO = 14 ** 8;
const MAX_PRIME = Math.ceil(Math.sqrt(MODULO)) + 1;
const TWO = 2;

primeHelper.initialize(MAX_PRIME);
const STEP_MODULO = primeHelper.PHI(MODULO);

function hyperPower(steps) {
  let e = TWO;
  for (let i = 1; i < steps; i++) {
    e = TWO.modPow(e, STEP_MODULO);
  }
  return TWO.modPow(e, MODULO) + MODULO - 3;
}

const $A = new Map();

function A(m, n) {
  const key = `${m},${n}`;
  let v = $A.get(key);
  if (v !== undefined) {
    return v;
  }

  if (m === 0) {
    v = (n + 1) % MODULO;
  } else if (m === 1) {
    v = (n + 2) % MODULO;
  } else if (m === 2) {
    v = (TWO.modMul(n, MODULO) + 3) % MODULO;
  } else if (m === 3) {
    v = (TWO.modPow(n + 3, MODULO) + MODULO - 3) % MODULO;
  } else if (n === 0) {
    v = A(m - 1, 1) % MODULO;
  } else if (m === 4) {
    v = hyperPower(n + 2) % MODULO;
  } else {
    v = A(4, A(4, 1)) % MODULO;
  }
  $A.set(key, v);
  return v;
}

function solve(N) {
  let total = 0;

  for (let n = 0; n <= N; n++) {
    total = (total + A(n, n)) % MODULO;
  }

  return total;
}

const answer = TimeLogger.wrap('', (_) => {
  assert.strictEqual(A(1, 0), 2);
  assert.strictEqual(A(2, 2), 7);
  assert.strictEqual(A(3, 4), 125);

  return solve(6);
});

console.log(`Answer is ${answer}`);
