const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MAX = 7 ** 17;

const POWERS = (function () {
    const powers = [];
    for (let p = 1; p <= 2 + MAX; p *= 2) {
        powers.push(p);
    }
    return powers;
})();

function LL(k) {
    k = Math.floor(k);
    if (k === 0) {
        return 0n;
    } else {
        const v = LL(k / 2) + BigInt(k);

        return v + v;
    }
}

function L(n) {
    let total = 0n;
    let k = (n & 1 ? n + 1 : n) / 2;

    const i = POWERS.findIndex((value, index) => value <= k && POWERS[index + 1] > k) + 1;

    while (k) {
        const p = POWERS.find((value, index) => value <= k && POWERS[index + 1] > k);
        k -= p;
        total += LL(p);
    }

    return total - BigInt(i);
}

assert.strictEqual(L(7), 21n);
assert.strictEqual(L(15), 60n);
assert.strictEqual(L(31), 155n);
assert.strictEqual(L(7 ** 2), 221n);
assert.strictEqual(L(7 ** 3), 2512n);

console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => L(MAX));
console.log(`Answer is ${answer}`);
