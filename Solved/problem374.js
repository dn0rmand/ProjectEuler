const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MODULO = 982451653;
const MODULO_N = BigInt(MODULO);
const MAX = 1E14;

const $f = new Map();

function f(n) {
  const min = (a, b) => a > b ? b : a;

  function b(n, i) {
    if (n === 0) {
      return { product: 1n, count: 0 };
    }

    const k = `${n}:${i}`;
    let r = $f.get(k);
    if (r !== undefined) {
      return r;
    }

    if (i * (i + 1) / 2 < n) {
      r = { product: 0n, count: 0 };
    } else {
      const x1 = b(n, i - 1);
      const x2 = b(n - i, min(n - i, i - 1));
      const p = x2.product * BigInt(i);
      if (x1.product > p) {
        r = x1;
      } else {
        r = { product: p, count: x2.count + 1 };
      }
    }

    $f.set(k, r);
    return r;
  }

  const r = b(n, n);
  return Number(r.product % MODULO_N);
}

const $b = new Uint32Array(14200000);
function modDiv(a, b) {
  if ($b[b] === 0) {
    $b[b] = b.modInv(MODULO);
  }
  return a.modMul($b[b], MODULO);
}

function solve(max, trace) {
  const tracer = new Tracer(trace);

  let total = 10;
  let top = 4;
  let bottom = 3;
  let length = 4;
  let start = 5;

  let A = 2;
  let B = 3;
  let C = 4;
  let k = 1;

  const TWO = (2).modInv(MODULO);

  while (start + length <= max) {
    tracer.print(_ => max - start);
    k++;
    B = (A + B).modMul(k + 2, MODULO);
    A = A.modMul(k + 1, MODULO);
    C = A.modMul(k + 3, MODULO).modMul(TWO, MODULO);

    const subTotal = (A + B + C) % MODULO;
    total = (total + subTotal.modMul(length - 2, MODULO)) % MODULO;

    const old = top;
    top = bottom + 2;
    bottom = old;

    start += length++;
  }

  // finish up
  if (start <= max) {
    k++;
    A = A.modMul(k + 1, MODULO);
    start++;

    let product = A;
    let subTotal = product;

    for (let i = 1; i < length && start <= max; i++, start++) {
      tracer.print(_ => max - start);
      product = modDiv(top.modMul(product, MODULO), bottom);
      top--;
      bottom--;
      subTotal = (subTotal + product) % MODULO;
    }

    total = (total + subTotal.modMul(length - 2, MODULO)) % MODULO;
  }

  tracer.clear();
  return Number(total);
}

assert.strictEqual(f(5), 6);
assert.strictEqual(f(10), 30);
assert.strictEqual(solve(100), 1683550844462 % MODULO);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => solve(MAX, true));
console.log(`Answer is ${answer}`);
