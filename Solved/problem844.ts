import assert from 'assert';
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MODULO = 1405695061n;
const MAX = 10n ** 18n;

let maxiK = 500;
let maxiMax = 0n;

function squareSum(k: bigint): number {
  const v = k * (k + 1n) * (2n * k + 1n);

  return Number((v / 6n) % MODULO);
}

function triangle(k: bigint): number {
  let v;
  if (k & 1n) {
    v = k * ((k + 1n) / 2n);
  } else {
    v = (k / 2n) * (k + 1n);
  }
  return Number((v - 3n) % MODULO);
}

function $M(k: number, max: bigint): number {
  if (maxiMax !== max) {
    maxiK = 5000;
    maxiMax = max;
  }
  const found = new Set<bigint>();

  const K = BigInt(k);

  function jump(values: bigint[], product: bigint) {
    const last = values[k - 1] || 1n;
    if (found.has(last)) {
      return;
    }
    if (last < max) {
      found.add(last);
      if (found.size >= maxiK) {
        return;
      }
      let previous = 0n;
      for (let i = 0; i < k; i++) {
        const x = values[i] || 1n;
        if (x === previous) {
          continue;
        }
        previous = x;
        const y = K * (product / x) - x;
        values[i] = last;
        values[k - 1] = y;
        const p = (product / x) * y;
        jump(values, p);
        values[i] = x;
        values[k - 1] = last;
        if (found.size >= maxiK) {
          break;
        }
      }
    }
  }

  if (maxiK === 2) {
    return Number(K % MODULO);
  }

  if (max === MAX && maxiK === 4) {
    const sum = K ** 3n - 3n * K;
    return Number(sum % MODULO);
  } else if (max === MAX && maxiK === 6) {
    const v1 = K ** 3n - 3n * K;
    const v2 = K ** 4n - K ** 3n - 3n * K ** 2n + 2n * K + 1n;
    const v3 = K ** 4n - 2n * K ** 3n + K - 1n;
    if (v2 > MAX && v3 > MAX) {
      maxiK = 4;
    }

    const sum = v1 + (v2 <= MAX ? v2 : 0n) + (v3 <= MAX ? v3 : 0n);
    return Number(sum % MODULO);
  }

  const start = new Array(k);
  jump(start, 1n);

  // if (max === MAX) {
  maxiK = found.size;
  // }

  found.delete(1n);
  found.delete(K - 1n);
  let sum = 0n;
  found.forEach((value) => (sum = (sum + value) % MODULO));
  return Number(sum);
}

function M(k: number, max: bigint): number {
  maxiK = 5000;
  const v = ($M(k, max) + k) % Number(MODULO);

  return v;
}

function S(K: bigint, max: bigint): number {
  maxiK = 5000;

  let total = triangle(K);

  const modulo = Number(MODULO);

  let maxK = K < 1e6 ? Number(K) : 1e6;

  for (let k = 3; k <= maxK; k++) {
    total = (total + $M(k, max)) % modulo;
  }

  if (K > 1e6) {
    maxK = K < 1e9 ? Number(K) : 1e9;

    const addk = (triangle(BigInt(maxK)) + modulo - triangle(BigInt(1e6))) % modulo;
    const add1 = maxK - 1e6;
    const squares = squareSum(BigInt(maxK)) + modulo - (squareSum(BigInt(1e6)) % modulo);

    total = (total + squares) % modulo;
    total = (total + modulo - add1) % modulo;
    total = (total + modulo - addk) % modulo;
  }

  return total;
}

assert.strictEqual(M(3, 10n ** 3n), 2797);
assert.strictEqual(M(8, 10n ** 8n), 131493335);
assert.strictEqual(S(4n, 100n), 229);
assert.strictEqual(S(10n, 10n ** 8n), Number(2383369980n % MODULO));

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => S(MAX, MAX));
console.log(`Answer is ${answer}`);
