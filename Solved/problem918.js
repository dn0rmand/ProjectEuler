const assert = require('assert');
const { TimeLogger, Tracer, linearRecurrence } = require('@dn0rmand/project-euler-tools');

const MAX = 1e12;

const $a = [];

function a(n) {
    if (n === 1) {
        return 1;
    }
    let r = $a[n];
    if (r !== undefined) {
        return r;
    }
    if (n & 1) {
        const m = (n - 1) / 2;
        r = a(m) - 3 * a(m + 1);
    } else {
        r = 2 * a(n / 2);
    }
    $a[n] = r;
    return r;
}

function solve(max) {
    let total = 2 + a(2) + a(max);
    total -= 3 * a(max / 2);

    return total;
}

assert.strictEqual(solve(10), -13);
assert.strictEqual(solve(20), -30);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => solve(MAX));
console.log(`Answer is ${answer}`);
