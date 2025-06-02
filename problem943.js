const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const STEPS = 223;
const MODULO = 2233222333;
const LENGTH = 22332223332233;

function getSequence(a, b, minSum) {
    let value = a;
    const lengths = [];

    let length = a;
    let index = 0;

    while (minSum > 0) {
        const s = length * value;
        if (s >= minSum) {
            length = Math.ceil(minSum / value);
        }
        minSum -= length * value;
        for (let i = 0; i < length; i++) {
            lengths.push(value);
        }

        value = value === a ? b : a;
        length = lengths[++index] ?? value;
    }

    return lengths;
}

function T(a, b, n) {
    const lengths = getSequence(a, b, n);

    let index = true;
    let count = 0;
    let length = n;

    for (const l of lengths) {
        if (l > n) {
            if (index) {
                count += n;
            }
            break;
        } else {
            if (index) {
                count += l;
            }
            n -= l;
        }
        index = !index;
    }

    const total = (a.modMul(count, MODULO) + b.modMul(length - count, MODULO)) % MODULO;

    return { count, total };
}

function solve(length, trace) {
    const tracer = new Tracer(trace);

    let total = 0;
    let triangle = (STEPS * (STEPS + 1)) / 2;
    for (let a = 1; a <= STEPS; a++) {
        tracer.print(() => STEPS - a);

        let subTotal = 0;
        let c1s = [];
        let c2s = [];
        let p1 = 0;
        let p2 = 0;
        for (let b = a + 1; b <= STEPS; b++) {
            const { count: c1 } = T(a, b, length);
            const { count: c2 } = T(b, a, length);

            const s2 = (a - b + MODULO).modMul(c1 - c2 + MODULO, MODULO);

            subTotal = (subTotal + s2) % MODULO;
        }
        const s = (STEPS - a) * a + triangle - (a * (a + 1)) / 2;

        total = (total + subTotal + length.modMul(s, MODULO)) % MODULO;
    }
    tracer.clear();
    return total;
}

assert.strictEqual(T(2, 3, 10).total, 25);
assert.strictEqual(T(4, 2, 10000).total, 30004);
assert.strictEqual(T(5, 8, 1000000).total, 6499871);

assert.strictEqual(solve(2233), 1279510795);

console.log('Tests passed');

// const answer2 = TimeLogger.wrap('', () => solve(LENGTH, true));
// console.log(`Answer is ${answer2}`);
