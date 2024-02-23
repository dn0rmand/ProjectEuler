const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

function X(n) {
  n = BigInt(n);

  let total = 0n;
  for (let a = 0n, b = 3n; b <= n;) {
    total = total ^ b;
    const next = (b + b) ^ a;
    a = b;
    b = next;
  }

  return total;
}

assert.strictEqual(X(10), 5n);
console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => X(10n ** 18n));
console.log(`Answer is ${answer}`);