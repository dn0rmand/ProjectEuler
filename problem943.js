const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 1e6;

function getSequence(a, b, N) {
    let value = a;
    const sequence = [];

    const next = () => (value = value === a ? b : a);
    const loop = (length) => {
        for (let i = 0; i < length; i++) {
            sequence.push(value);
        }
    };

    let length = a;
    let index = 0;

    while (sequence.length < N) {
        loop(length);
        next();
        length = sequence[index++];
    }
    sequence = sequence.slice(0, N);
    return sequence;
}

function T(a, b, n) {
    const sequence = getSequence(a, b, n);

    total = sequence.reduce((a, v) => a + v, 0);

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
