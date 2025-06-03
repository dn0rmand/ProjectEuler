const assert = require('assert');
const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 1e8;
const MAX_PRIME = 1e5;

primeHelper.initialize(MAX_PRIME, true);
const allPrimes = primeHelper.allPrimes();

class AState {
    constructor() {
        this.remaining = 0;
        this.idx = -1;
        this.a = 2;
    }

    get current() {
        return this.a;
    }

    next() {
        if (this.remaining === 0) {
            this.remaining = allPrimes[++this.idx];
            this.a = 1;
        } else if (--this.remaining === 0) {
            this.a = 2;
        }
    }
}

class BState {
    constructor() {
        this.x = new AState();
        this.a = 3;
        this.b = 2;
        this.c = 2;
        this.d = 3;
    }

    next() {
        while (true) {
            const { a, b, c, d } = this;
            if (c === 0 && d === 0) {
                return 0;
            }
            if (c !== 0 && d !== 0) {
                const n = Math.floor(a / c);
                const m = Math.floor(b / d);
                if (n === m) {
                    this.a = c;
                    this.b = d;
                    this.c = a - c * n;
                    this.d = b - d * n;

                    return n;
                }
            }

            const p = this.x.current;
            this.x.next();
            this.a = b;
            this.b = a + b * p;
            this.c = d;
            this.d = c + d * p;
        }
    }
}

function solve(max, trace) {
    const tracer = new Tracer(trace);
    const state = new BState();

    let total = 0;
    for (let i = max; i > 0; i--) {
        tracer.print(() => i);
        total += state.next();
    }
    tracer.clear();
    return total;
}

assert.strictEqual(solve(10), 75);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => solve(MAX, true));
console.log(`Answer is ${answer}`);
