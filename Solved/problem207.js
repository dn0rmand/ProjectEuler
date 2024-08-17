const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

function quadratic(k) {
    let total = 0;
    let perfect = 0;

    const d = Math.sqrt(1 + 4 * k);
    const x = (1 + d) / 2;

    if (Math.floor(x) === x && x > 0) {
        const t = Math.log2(x);
        total++;
        if (Math.floor(t) === t) {
            perfect++;
        }
    }

    return { perfect, total };
}

function P(m) {
    let total = 0;
    let perfect = 0;

    const max = Math.floor(Math.sqrt(m));
    for (let n = max; n > 0; n--) {
        const k = n * (n + 1);
        if (k > m) {
            continue;
        }

        const p = quadratic(k);

        total += p.total;
        perfect += p.perfect;
    }

    return perfect / total;
}

function solve(target) {
    let min = 185;
    let max = min * 2;

    while (true) {
        const p = P(max);
        if (p < target) {
            break;
        }
        min = max;
        max *= 2;
    }

    while (min < max) {
        const m = Math.floor((min + max) / 2);
        const p = P(m);
        if (p < target) {
            max = m - 1;
        } else {
            min = m + 1;
        }
    }

    while (P(min - 1) < target) {
        min--;
    }

    while (P(min) >= target) {
        min++;
    }

    return min;
}

assert.strictEqual(P(5).valueOf(), 1);
assert.strictEqual(P(10).valueOf(), 1 / 2);
assert.strictEqual(P(15).valueOf(), 2 / 3);
assert.strictEqual(P(20).valueOf(), 1 / 2);
assert.strictEqual(P(25).valueOf(), 1 / 2);
assert.strictEqual(P(30).valueOf(), 2 / 5);
assert.strictEqual(P(180).valueOf(), 1 / 4);
assert.strictEqual(P(185).valueOf(), 3 / 13);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => solve(1 / 12345));
console.log(`Answer is ${answer}`);
