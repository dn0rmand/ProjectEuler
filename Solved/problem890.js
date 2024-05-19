const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MODULO = 1e9 + 7;
const MODULO_N = BigInt(MODULO);
const MAX = 7n ** 777n;
const DIV2 = (2).modInv(MODULO);

class BigArray {
  static SIZE = 102400;

  constructor(init) {
    this.arrays = [init || []];
  }

  get length() {
    if (this.arrays.length === 0) {
      return 0;
    }
    const a = this.arrays[this.arrays.length - 1];
    const l = (this.arrays.length - 1) * BigArray.SIZE + a.length;
    return l;
  }

  get(index) {
    const idx = index % BigArray.SIZE;
    const a = (index - idx) / BigArray.SIZE;
    const ar = this.arrays[a] || [];
    return ar[idx];
  }

  set(index, value) {
    const idx = index % BigArray.SIZE;
    const a = (index - idx) / BigArray.SIZE;
    let ar = this.arrays[a];
    if (!ar) {
      this.arrays[a] = ar = [];
    }
    ar[idx] = value;
  }
}

class PreciseNumber {
  constructor(numerator, divisor, n, d) {
    this.numerator = numerator;
    this.divisor = divisor;

    this.n = n || Number(numerator % MODULO_N);
    this.d = d || Number(divisor % MODULO_N);
  }

  get isZero() {
    return this.numerator === 0n;
  }
  get negative() {
    return this.numerator < 0;
  }

  lessThan(n) {
    const x = BigInt(n) * this.divisor;
    return this.numerator < x;
  }

  minusOne() {
    return new PreciseNumber(
      this.numerator - this.divisor,
      this.divisor,
      (this.n + MODULO - this.d) % MODULO,
      this.d
    );
  }

  half() {
    return new PreciseNumber(this.numerator, this.divisor / 2n, this.n, this.d.modMul(DIV2, MODULO));
  }

  get(map) {
    if (map) {
      map = map.get(this.d);
    }
    if (map) {
      return map.get(this.n);
    }
  }

  set(map, value) {
    if (!map) {
      map = new Map();
    }

    let m2 = map.get(this.d);
    if (!m2) {
      m2 = new Map();
      map.set(this.d, m2);
    }

    m2.set(this.n, value);
    return map;
  }
}

const $C = [];

function binomial(n, p) {
  if (n < p) {
    return 0;
  }

  if (p === 0 || p === n) {
    return 1;
  }
  if (p === 1 || p === n - 1) {
    return n;
  }

  const middle = n / 2;

  if (p > middle) {
    p = n - p;
  }

  if ($C[n] && $C[n][p]) {
    return $C[n][p];
  }

  let result = n;

  if (!$C[n]) {
    $C[n] = [1, n];
  }

  for (let p2 = 1; p2 < middle; p2++) {
    result = result.modMul(n - p2, MODULO).modDiv(p2 + 1, MODULO);
    $C[n][p2 + 1] = result;
  }

  return $C[n][p];
}

// 2 * a(n) = a(n+1) + a(n-1) if n is even
// a(n+1) = 2*a(n) - a(n-1)
// a(n) = a(n-1) + a(floor(n/2))

const $g = [];
const $get = (b, n) => {
  if (b.negative) {
    return 0;
  }
  if (b.isZero || n === 0) {
    return 1;
  }
  return b.get($g[n]);
};

const $set = (b, n, value) => {
  $g[n] = b.set($g[n], value);
};

function g(b, n) {
  let result = $get(b, n);

  if (result !== undefined) {
    return result;
  }

  if (!b.lessThan(n)) {
    result = 0;
    let sign = -1;
    let b2 = b;
    for (let t = 1; t <= n + 1; t++) {
      b2 = b2.minusOne();
      sign = -sign;
      const v1 = binomial(n + 1, t);
      const v2 = g(b2, n);
      const v3 = v1.modMul(v2, MODULO) * sign;
      result = (result + MODULO + v3) % MODULO;
    }
  } else {
    const b1 = b.minusOne();
    const b2 = b.half();
    result = (g(b1, n) + g(b2, n - 1)) % MODULO;
  }

  $set(b, n, result);
  return result;
}

function a(n) {
  let d = 2n;
  let t = 2;
  while (d * 2n < n) {
    d *= 2n;
    t++;
  }

  const r = g(new PreciseNumber(n, d), t);
  return r;
}

function p(n) {
  const x = BigInt(n) / 2n;
  return a(x);
}

assert.strictEqual(p(7), 6);
assert.strictEqual(
  TimeLogger.wrap('', (_) => p(7 ** 7)),
  144548435
);

console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => p(MAX));
console.log(`Answer is ${answer}`);
