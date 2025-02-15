const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 16;

function getSquares(max, callback) {
    for (let n = 2; ; n++) {
        let s = n * n;
        if (s > Number.MAX_SAFE_INTEGER) {
            break;
        }
        if (s >= max) {
            break;
        }
        if (s % 9 <= 1) {
            callback(s);
        }
    }
}

function is2025(value) {
    const ZERO = 0;
    const ONE = 1;
    const TEN = 10;

    let left = value;
    let right = ZERO;
    let p = ONE;

    while (left > ZERO) {
        const d = left % TEN;
        right = right + d * p;
        left = (left - d) / TEN;
        p *= TEN;
        if (right && left && d) {
            const v = right + left;
            if (v * v === value) {
                return true;
            }
        }
    }
    return false;
}

function solve(max, trace) {
    max = Math.min(Number.MAX_SAFE_INTEGER, 10 ** max);

    let total = 0n;

    const tracer = new Tracer(trace);
    getSquares(max, (square) => {
        tracer.print(() => max - square);
        if (is2025(square)) {
            total += BigInt(square);
        }
    });
    tracer.clear();
    return total;
}

assert.strictEqual(solve(4), 5131n);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => solve(MAX, true));
console.log(`Answer is ${answer}`);
