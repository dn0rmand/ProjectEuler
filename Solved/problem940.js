const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MODULO = 1123581313;

const fibs = TimeLogger.wrap('Loading Fibonacci', () => {
    const values = [0, 1];
    let f1 = 0;
    let f2 = 1;
    for (let i = 2; i <= 50; i++) {
        [f1, f2] = [f2, f1 + f2];
        values.push(f2);
    }
    return values;
});

const verticalMap = new Map();
const horizontalMap = new Map();
const coefficients = new Map();

coefficients.set(0, { av: 0, bv: 1, ah: 0, bh: 1 });

let lastKey = 0;

function populate(key) {
    if (key <= lastKey) {
        return;
    }

    let { av, bv, ah, bh } = coefficients.get(lastKey);
    let tmp;

    while (lastKey < key) {
        tmp = av;
        av = (3 * av + bv) % MODULO;
        bv = tmp;

        tmp = ah;
        ah = (ah + bh) % MODULO;
        bh = (3 * tmp) % MODULO;

        lastKey++;
    }

    coefficients.set(key, { av, bv, ah, bh });
}

const data = [[0, 1, 1], [1, 2], [3]];

function A(m, n) {
    const { ah, bh } = coefficients.get(n);
    const { av, bv } = coefficients.get(m);

    const an = av.modMul(ah + ah + bh, MODULO) + bv.modMul(ah, MODULO);

    return an % MODULO;
}

function S(max, trace) {
    const tracer = new Tracer(trace);

    for (let i = 2; i <= max; i++) {
        tracer.print(() => max - i);
        const key = fibs[i];
        populate(key);
    }

    const indexes = fibs.filter((f, i) => i >= 2 && i <= max);
    const total = indexes.reduce(
        (total, i) => indexes.reduce((total, j) => (total + A(i, j)) % MODULO, total),
        0
    );

    tracer.clear();
    return total;
}

assert.strictEqual(S(3), 30);
assert.strictEqual(S(5), 10396);
assert.strictEqual(S(20), 601029943);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => S(50, true));
console.log(`Answer is ${answer}`);
