const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 1e5;
const memoize = new Array(MAX + 1).fill(0n); // Reuse buffer

const SQUARE_MASK = (function () {
    let max = 2e15 + 1;
    let mask1 = 1n;
    while (mask1 < max) {
        mask1 <<= 2n;
        mask1 |= 1n;
    }
    return mask1;
})();

function solvePart1(max, trace) {
    class State {
        constructor() {
            this.p0 = 8n;
            this.p1 = 32n;
            this.n = 1n;
            this.count = 2n;
        }

        next() {
            this.n++;
            this.p0 = this.p1;
            this.p1 = 2n ** (2n * this.n + 3n);
            this.count = (2n ** this.n - 1n) * 2n;
        }

        getCount(b) {
            if (b < this.p0) {
                return 0n;
            } else if (b < this.p1) {
                return this.count;
            } else {
                this.next();
                return this.count;
            }
        }
    }

    const tracer = new Tracer(trace, 'Part 1');

    let total = 0n;

    const state = new State();
    const values = [0n];

    for (let n = 1; ; n++) {
        const b = n & 1 ? 4n * values[(n - 1) / 2] + 2n : 4n * values[n / 2];

        if (b > max) {
            break;
        }
        values[n] = b;
        tracer.print(() => max - b);

        const _2b = 2n * b;

        const exists = (_2b & SQUARE_MASK) === _2b;
        if (exists) {
            const count = 1n + state.getCount(b);
            total += count;
        }
    }
    tracer.clear();
    return total;
}

function solvePart2(max, trace) {
    class State {
        constructor() {
            this.n = 0n;
            this.a = 0n;
        }

        next() {
            this.n++;
            this.a = this.a | this.n;
            return this.a;
        }
    }

    function toBinary(value) {
        let v = value.toString(2);
        while (v.length < 20) {
            v = ' ' + v;
        }
        return v;
    }

    function processB(b, _2b) {
        memoize[1] = _2b;

        let total = 0n;
        for (let a = 2; a < b - 1n; a += 2) {
            const _2ba0 = 2n * memoize[a / 2];
            const _2ba1 = _2b ^ _2ba0;

            memoize[a] = _2ba0;
            memoize[a + 1] = _2ba1;

            if ((_2ba0 & SQUARE_MASK) === _2ba0) {
                total++;
            } else if ((_2ba1 & SQUARE_MASK) === _2ba1) {
                total++;
            }
        }
        return total;
    }

    const tracer = new Tracer(trace, 'Part 2');
    let total = 0n;

    const state = new State();
    for (let b = max - 1n; b >= 3n; b -= 2n) {
        tracer.print(() => b);

        const _2b = 2n * b;

        const exists = (_2b & SQUARE_MASK) === _2b - 2n;
        if (exists) {
            continue;
        }

        if ((b & SQUARE_MASK) === b) {
            const c = 2n * state.next();
            total += c;
        } else {
            const t2 = processB(b - 1n, _2b - 2n);
            const t1 = processB(b, _2b);

            total += t1 + t2;
        }
    }

    if (max > 10) {
        total += processB(max, 2n * max);
    }
    tracer.clear();
    return total;
}

function solve(max, trace) {
    max = BigInt(max);
    return max + 1n + solvePart1(max, trace) + solvePart2(max, trace);
}

assert.strictEqual(solve(10), 21n);
assert.strictEqual(solve(100), 282n);
assert.strictEqual(
    TimeLogger.wrap('', () => solve(1e4)),
    49935n
);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => solve(MAX, true)); // 1e5 => 613501
console.log(`Answer is ${answer}`);
