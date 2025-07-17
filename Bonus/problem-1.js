const assert = require('assert');
require('@dn0rmand/project-euler-tools');

function triangle(v) {
    return (v * (v + 1n)) / 2n;
}

function solve(max) {
    max = BigInt(max) - 1n;
    const m3 = triangle(max / 3n) * 3n;
    const m5 = triangle(max / 5n) * 5n;
    const m35 = triangle(max / (3n * 5n)) * (3n * 5n);
    return m3 + m5 - m35;
}

assert.strictEqual(solve(10), 23n);
assert.strictEqual(solve(1000), 233168n);

console.log('Tests passed');
