const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

function isPandigital8(value) {
    const MASK = 2 ** 3 - 1;
    const used = [];
    let count = 0;
    while (value) {
        const d = value & MASK;
        if (!used[d]) {
            used[d] = 1;
            count++;
            if (count === 8) break;
        }
        value = (value - d) / 8;
    }
    return count === 8;
}

function isPandigital(value, base) {
    const used = [];
    let count = 0;
    while (value) {
        const d = value % base;
        if (!used[d]) {
            used[d] = 1;
            count++;
            if (count === base) break;
        }
        value = (value - d) / base;
    }
    return count === base;
}

function solve(base) {
    let total = 0;
    let found = 0;

    function add(value) {
        if (!isPandigital8(value)) {
            return;
        }
        const bases = base === 12 ? [11, 10, 9, 7, 6] : [9, 7, 6, 5, 4, 3, 2];
        for (const b of bases) {
            if (!isPandigital(value, b)) {
                return;
            }
        }
        total += value;
        found += 1;
    }

    const tracer = new Tracer(base !== 10);

    const used = [];
    let count = 0;

    function inner(value) {
        if (count === base) {
            tracer.print(() => `${found}: ${value.toString(base)}`);
            add(value);
            return;
        }

        for (let digit = count === 0 ? 1 : 0; found < 10 && digit < base; digit++) {
            if (used[digit]) {
                continue;
            }
            used[digit] = 1;
            count++;
            inner(value * base + digit);
            count--;
            used[digit] = 0;
        }
    }

    inner(0);
    tracer.clear();
    return total;
}

assert.strictEqual(isPandigital(978, 2), true);
assert.strictEqual(isPandigital(978, 3), true);
assert.strictEqual(isPandigital(978, 4), true);
assert.strictEqual(isPandigital(978, 5), true);

assert.strictEqual(solve(10), 20319792309);
console.log('Tests passed');

const answer = TimeLogger.wrap('', () => solve(12));
console.log(`Answer is ${answer}`);
