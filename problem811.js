const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MODULO = 1000062031n;

const MAX_T = BigInt(1e14 + 31);
const MAX_R = 62;

const $b = new Map();

function b(n) {
  if (n < 2 || (n & 1n) !== 0n) {
    return 1n;
  }
  n /= 2n;
  const k = n;
  let r = $b.get(k);
  if (r !== undefined) {
    return r;
  }
  r = 2n;
  while (n > 0n && (n & 1n) === 0n) {
    n /= 2n;
    r *= 2n;
  }
  $b.set(k, r);
  return r;
}

const $A = new Map();

function A(n) {
  if (n === 0n || n === 1n) {
    return 1n;
  }
  while (n & 1n) {
    n = (n - 1n) / 2n;
  }
  if (n === 0n) {
    return 1n;
  }

  let r = $A.get(n);
  if (r !== undefined) {
    return r;
  }
  const m = n / 2n;
  const a1 = A(m);
  const x = b(m);
  const n2 = n - x;
  //   console.log(n.toString(2));
  //   console.log(n2.toString(2));
  const a2 = A(n2);
  r = 3n * a1 + 5n * a2; // % MODULO;
  $A.set(n, r);
  return r;
}

const $AA = new Map();

function AA(value, mask, zeros) {
  const k = value;
  let r = $AA.get(k);
  if (r !== undefined) {
    return r;
  }
  if (!mask || mask <= 1) {
    while ((value & 1) === 1) {
      value = (value - 1) / 2;
    }
    if (!value) {
      return 1;
    }
    if (value !== k) {
      r = $AA.get(value);
      if (r !== undefined) {
        return r;
      }
    }
    mask = 1;
    zeros = 0;
    while (mask < value) {
      if (value & mask) {
        break;
      }
      mask *= 2;
      zeros++;
    }
  } else {
    assert.notStrictEqual(value & mask, 0);
  }

  if (mask === value) {
    // only 1 digit
    const v = 8 ** zeros;
    $AA.set(value, v);
    $AA.set(k, v);
    return v;
  }

  r = 3 * AA(value / 2, mask / 2, zeros - 1) + 5 * AA(value - mask + mask / 2, mask / 2, zeros - 1);
  if (k !== value) {
    $AA.set(value, r);
  }
  $AA.set(k, r);
  return r;
}

function H(t, r) {
  const n = (2n ** t + 1n) ** r;
  const v = A(n);
  return v;
}

function A2(bits) {
  const n = BigInt(parseInt(bits, 2));
  const v1 = A(n);
  return v1;
}

console.log(A2('1010'));
console.log(A2('10110'));
console.log(A2('101110'));
console.log(A2('1011110'));

// one 0 => 8,43,218,1093 => 5a(n-1)+3 - a(0) = 1
console.log(TimeLogger.wrap('', (_) => A2('10101000')));

// const v1 = '1101000';

// console.log(
//   A2(v1),
//   3n ** 3n * A2('110') + 3n ** 2n * 5n * A2('1100') + 3n * 5n * A2('110010') + 5n * A2('1100100')
// );
// console.log(A2('110100'), 3n * A2('11010') + 5n * A2('110010'));
// console.log(A2('11010'), 3n * A2('1101') + 5n * A2('11001'));

assert.strictEqual(b(24n), 8n);
assert.strictEqual(A(81n), 636056n);
assert.strictEqual(H(3n, 2n), 636056n);

console.log('Tests passed');
