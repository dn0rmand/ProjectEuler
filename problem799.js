const assert = require('assert');
const {
    TimeLogger,
    Tracer
} = require('@dn0rmand/project-euler-tools');

function P2N(p) {
    const D = Math.sqrt(12 * p + 1);

    if (Math.floor(D) === D) {
        const x = D + 1;
        if (x % 6 === 0) {
            return x / 6;
        }
    }
}

function P(n) {
    return n * (3 * n - 1);
}

function assertSequence(values) {
    for (let n = 1; n <= values.length; n++) {
        const p = P(n);
        assert.strictEqual(p, 2 * values[n - 1]);
    }
}

function solve(k, trace) {
    const MAX_INDEX = 5E7;
    const other = new Map();
    const values = new Uint32Array(MAX_INDEX);

    const tracer = new Tracer(trace);
    for (let n = 1; n <= MAX_INDEX; n++) {
        tracer.print(_ => MAX_INDEX - n);

        const v1 = P(n);
        values[n - 1] = v1;
        for (let i = n - 1; i > 0; i--) {
            const v0 = values[i - 1];
            const m = P2N(v1 + v0);
            if (m) {
                const count = (other.get(m) || 0) + 1;
                other.set(m, count);
                if (count === k) {
                    tracer.clear();
                    return (v1 + v0) / 2;
                }
            }
        }
    }
    tracer.clear();
    throw "NO SOLUTION";
}

assertSequence([1, 5, 12, 22, 35, 51, 70, 92]);

assert.strictEqual(solve(1), 92);
assert.strictEqual(solve(2), 3577);
assert.strictEqual(solve(3), 107602);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => solve(15, true));
console.log(`Answer is ${answer}`);