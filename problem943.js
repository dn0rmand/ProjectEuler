const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 1e6;

function getSequence(a, b, minSum) {
    let value = a;
    let sum = 0;
    const sequence = [];
    const lengths = [];

    const next = () => (value = value === a ? b : a);
    const loop = (length) => {
        for (let i = 0; i < length; i++) {
            lengths.push(value);
            sum += value;
            minSum -= value;
        }
    };

    let length = a;
    let index = 0;

    while (minSum > 0) {
        loop(length);
        next();
        if (value === a) {
            sequence.push(sum);
            sum = 0;
        }
        length = lengths[++index];
    }

    return { lengths, sequence };
}

function T(a, b, n) {
    const { lengths, sequence } = getSequence(a, b, n);

    let total = 0;

    for (const l of lengths) {
        if (l > n) {
            total += n * a;
            break;
        } else {
            total += l * a;
            n -= l;
        }
        [a, b] = [b, a];
    }

    return total;
}

function solve(max, trace) {
    const tracer = new Tracer(trace);
    for (let n = 0; n < max; n++) {
        tracer.print(() => max - n);
    }
    tracer.clear();
    return max;
}

assert.strictEqual(T(2, 3, 10), 25);
assert.strictEqual(T(4, 2, 1e4), 30004);
assert.strictEqual(T(5, 8, 1e6), 6499871);

console.log('Tests passed');

// const answer = TimeLogger.wrap('', () => solve(MAX));
// console.log(`Answer is ${answer}`);
