const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MAX = 10n ** 18n;
const MODULO = 1000000007n;

const MIN = (a, b) => a < b ? a : b;

function M(n) {

  const $getSum = [];

  function get(bit, count) {
    const a = $getSum[bit];
    if (a) {
      return a.get(count);
    }
  }

  function set(bit, count, value) {
    let a = $getSum[bit];
    if (!a) {
      a = new Map();
      $getSum[bit] = a;
    }
    a.set(count, value);
  }

  function getSum(bit, count) {
    if (count < 1 || bit < 0) {
      return 0n;
    }
    if (bit === 0) {
      return 6n * (count - 1n);
    }

    const keyCount = count;

    let sum = get(bit, keyCount);
    if (sum !== undefined) {
      return sum;
    } else {
      sum = 0n;
    }

    let subCount = 4n ** BigInt(bit);
    const value = subCount.modMul(6n, MODULO);

    // bit value = 0
    subCount = MIN(subCount, count);
    sum = getSum(bit - 1, subCount);
    count -= subCount;

    if (count) {
      // bit value = 1
      subCount = MIN(subCount, count);
      sum = (sum + subCount.modMul(value, MODULO) + getSum(bit - 1, subCount)) % MODULO;
      count -= subCount;
    }
    if (count) {
      // bit value = 2
      subCount = MIN(subCount, count);
      sum = (sum + subCount.modMul(value, MODULO) + getSum(bit - 1, subCount)) % MODULO;
      count -= subCount;
    }
    if (count) {
      // bit value = 3
      subCount = MIN(subCount, count);
      sum = (sum + subCount.modMul(value, MODULO) + getSum(bit - 1, subCount)) % MODULO;
    }
    set(bit, keyCount, sum);
    return sum;
  }

  let remaining = n;
  let sum = 0n;

  for (let bit = 0; remaining; bit++) {
    let count = 4n ** BigInt(bit);

    if (remaining >= count) {
      const value = count.modMul(count, MODULO).modMul(6n, MODULO);
      sum = (sum + value + getSum(bit - 1, count)) % MODULO;
      remaining -= count;
    } else {
      const value = remaining.modMul(count, MODULO).modMul(6n, MODULO);
      sum = (sum + value + getSum(bit - 1, remaining)) % MODULO;
      remaining = 0n;
    }
  }

  return sum;
}

assert.strictEqual(M(10n), 642n);
assert.strictEqual(M(1000n), 5432148n);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => M(MAX));
console.log(`Answer is ${answer}`);
