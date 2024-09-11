const assert = require('assert');
const { TimeLogger, Tracer, primeHelper, matrix: Matrix } = require('@dn0rmand/project-euler-tools');
const Sorted = require('sorted');

const createSorted = (array) => Sorted(array, (a, b) => a.next - b.next);

const MAX = 1e8;
const MODULO = 10n ** 16n;
const MAX_INDEX = 1.4e8;

primeHelper.initialize(15e5);

class BigNumber {
    constructor(value, exp) {
        this.value = value;
        this.exp = exp;
    }

    toExponent(n) {
        const v = new BigNumber(this.value, this.exp);
        while (v.exp < n) {
            v.value /= 10;
            v.exp++;
        }
        return v;
    }

    add(v2) {
        if (this.exp < v2.exp) {
            return v2.add(this);
        }
        v2 = v2.toExponent(this.exp);
        const v = new BigNumber(this.value + v2.value, this.exp);
        while (v.value > 10) {
            v.exp++;
            v.value /= 10;
        }
        return v;
    }

    toString() {
        return `${this.value.toFixed(1)}e${this.exp}`;
    }
}

class ModuloFibonacci {
    constructor(prime) {
        this.prime = prime;
        this.modulo = BigInt(prime) ** 2n;
        this.M = new Matrix(2, 2);
        this.M.set(0, 0, 1);
        this.M.set(1, 0, 1);
        this.M.set(0, 1, 1);
        this.M.set(1, 1, 0);
        this.M = this.M.pow(prime, this.modulo);
    }

    getCycle() {
        let idx = this.prime;
        let m = this.M;
        while (m.get(1, 0)) {
            idx += this.prime;
            if (idx > MAX_INDEX) {
                return;
            }
            m = m.multiply(this.M, this.modulo);
        }
        return idx;
    }
}

const SKIPS = TimeLogger.wrap('Build Cycles', () => {
    const skips = createSorted([]);

    let primes = primeHelper.allPrimes().reverse();
    const tracer = new Tracer(true);
    for (const prime of primes) {
        tracer.print(() => prime);
        const cycle = new ModuloFibonacci(prime).getCycle();
        if (cycle) {
            skips.push({ next: cycle, cycle });
        }
    }
    tracer.clear();
    return skips.elements;
});

function* fibonacci() {
    let f0 = new BigNumber(0, 0);
    let f1 = new BigNumber(1, 0);
    let i0 = 0n;
    let i1 = 1n;

    let skip = createSorted([...SKIPS]);
    let idx = 0;

    while (true) {
        [f0, f1] = [f1, f0.add(f1)];
        [i0, i1] = [i1, (i1 + i0) % MODULO];
        idx++;

        if (skip.length > 0 && idx === skip.get(0).next) {
            while (skip.length > 0 && idx === skip.get(0).next) {
                // remove
                const { next, cycle } = skip.shift();
                // add next one
                skip.push({ next: next + cycle, cycle });
            }
        } else {
            yield { f: f0, i: i0 };
        }
    }
}

function solve(max, trace) {
    const tracer = new Tracer(trace);
    for (const { f, i } of fibonacci()) {
        tracer.print(() => max);
        if (!--max) {
            tracer.clear();
            return `${i % MODULO},${f.toString()}`;
        }
    }
}

assert.strictEqual(solve(13), '610,6.1e2');
assert.strictEqual(solve(200, true), '1608739584170445,9.7e53');

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => solve(MAX, true));
console.log(`Answer is ${answer}`);
