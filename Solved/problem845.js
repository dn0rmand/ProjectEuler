const assert = require('assert');

const { TimeLogger, primeHelper } = require('@dn0rmand/project-euler-tools');

primeHelper.initialize(1e4);

const isPrime = primeHelper.isPrime;

function D(n) {
  n = BigInt(n);

  const $inner = [];

  function inner(remaining, sum) {
    if (remaining === 0) {
      return isPrime(sum) ? 1n : 0n;
    }

    const k = remaining * 10000 + sum;

    let total = $inner[k];
    if (total !== undefined) {
      return total;
    }
    total = 0n;
    for (let i = 0; i < 10; i++) {
      total += inner(remaining - 1, sum + i);
    }
    $inner[k] = total;
    return total;
  }

  function findSize() {
    for (let size = 1; ; size++) {
      const count = inner(size, 0);
      if (count === n) {
        throw "Not expected :(";
      }
      if (count > n) {
        return size;
      }
    }
  }

  let size = findSize();

  let count = 0n;
  let value = 0n;
  let sum = 0;
  while (size) {
    for (let d = 0; d < 10; d++) {
      const c = inner(size - 1, sum + d);
      if (c + count < n) {
        count += c;
      } else if (c + count === n) {
        sum += d;
        count = n;
        value = value * 10n + BigInt(d);
        value *= 10n ** BigInt(size - 1);
        if (size > 1) {
          for (let i = 1n; i <= c; i++) {
            while (!isPrime(sum)) {
              value++;
              sum++;
            }
            if (i !== c) {
              sum++;
              value++
            }
          }
        }
        size = 0;
        break;
      } else {
        sum += d;
        value = value * 10n + BigInt(d);
        size--;
        break;
      }
    }
  }
  if (count !== n) {
    throw "No solution";
  }
  if (!isPrime(sum)) {
    throw "Digit sum is not prime????";
  }
  return value;
}

assert.strictEqual(D(61), 157n);
assert.strictEqual(D(1e8, true), 403539364n);
console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => D(10n ** 16n));
console.log(`answer is ${answer}`);