const assert = require('assert');

require('@dn0rmand/project-euler-tools');

function LL(min, max) {
    if (max - min > 50n) {
        const middle = (max + min) / 2n
        const A = LL(min, middle);
        const B = LL(middle + 1n, max);

        return A.lcm(B);
    } else {
        let lcm = min;
        for (let i = min + 1n; i <= max; i++) {
            lcm = lcm.lcm(i);
        }
        return lcm;
    }
}

function L(n) {
    n = BigInt(n);
    return LL(1n, BigInt(n));
}

function H(n) {
    let total = 0;

    function inner(index, lcm) {
        if (lcm == n) {
            total++;
        }

        if (lcm > n) {
            return;
        }

        for (let i = index + 1; i <= n; i++) {
            inner(i, lcm.lcm(i));
        }
    }

    inner(0, 1);

    return total;
}

assert.strictEqual(L(4), 12n);
assert.strictEqual(L(6), 60n);
assert.strictEqual(L(10), 2520n);
assert.strictEqual(L(20), 232792560n);

assert.strictEqual(H(6), 10);
assert.strictEqual(H(12), 44);

console.log('Tests passed');

const values = [];

for (let i = 2; i < 7; i++) {
    values.push(H(L(i)));
}

console.log(values.join(', '));