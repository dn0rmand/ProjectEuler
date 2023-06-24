const assert = require('assert');
const { TimeLogger, linearRecurrence, matrix: Matrix } = require('@dn0rmand/project-euler-tools');

const MODULO = 10n ** 9n;

const $inner = new Map();

function f(n) {
  n = BigInt(n);

  function inner(remaining) {
    if (remaining === 0n) {
      return { count: 1n, sum: 0n };
    }
    let r = $inner.get(remaining);
    if (r) {
      return r;
    }
    let s = 0n;
    let c = 0n;

    for (let d = 1n; d < 10n; d++) {
      if (d > remaining) { break; }
      const { count, sum } = inner(remaining - d);
      c += count;
      s += (10n * sum + d * count);
    }

    r = { sum: s, count: c };
    $inner.set(remaining, r);
    return r;
  }

  const { sum } = inner(n);
  return sum;
}

function buildMatrix() {
  const values = [];
  for (let i = 13; values.length < 40; i += 13) {
    values.push(f(i));
  }
  const l = linearRecurrence(values, false);
  const matrix = Matrix.fromRecurrence(l.factors);
  const identity = new Matrix(matrix.rows, 1);
  for (let r = 0; r < matrix.rows; r++) {
    values[r] %= MODULO;
    identity.set(matrix.rows - r - 1, 0, values[r]);
  }

  return { matrix, identity };
}

function solve() {
  const { matrix, identity } = buildMatrix();

  let total = identity.get(identity.rows - 1, 0);
  let power = 0n;
  for (let i = 2; i <= 17; i++) {
    power++;
    const M = matrix.pow(13n ** power - 1n, MODULO);
    const I = M.multiply(identity, MODULO);

    const v = I.get(I.rows - 1, 0);

    total += v;
  }

  return total % MODULO;
}


assert.strictEqual(f(5), 17891n)

console.log('Test passed');

const answer = TimeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer}`);

