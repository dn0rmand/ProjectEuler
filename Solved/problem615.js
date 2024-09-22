const assert = require('assert');
const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');
const Tree = require('bintrees').RBTree;

class TreeArray {
    static compare = (a, b) => {
        const v = a - b;
        return v < 0 ? -1 : v > 0 ? 1 : 0;
    };

    constructor(maxLength, tracer) {
        this.tree = new Tree(TreeArray.compare);
        this.maxLength = maxLength;
        this.tracer = tracer || new Tracer(false);
    }

    get length() {
        return this.tree.size;
    }

    includes(value) {
        return !!this.tree.find(value);
    }

    get max() {
        return this.tree.max();
    }

    canAdd(value) {
        if (this.length < this.maxLength) {
            return true;
        }
        return value < this.max;
    }

    add(value) {
        if (!this.canAdd(value)) {
            return false;
        }

        if (this.length >= this.maxLength) {
            this.tree.insert(value);
            this.tree.remove(this.max);
            this.tracer.print(() => this.max);
        } else {
            this.tree.insert(value);
            this.tracer.print(() => this.length);
        }
        return true;
    }

    toArray() {
        const a = new Array(this.size);
        let index = 0;
        this.tree.each((v) => {
            a[index++] = v;
        });
        return a;
    }
}

const MAX = 1_000_000;
const MAX_PRIMES = MAX;
const MODULO = 123454321n;
const MAX_2_PRIMES = 28;

primeHelper.initialize(MAX_PRIMES);
const allPrimes = primeHelper.allPrimes();

function solve(max) {
    const tracer = new Tracer(true);
    const min2Primes = Math.min(max, MAX_2_PRIMES);

    const values = new TreeArray(max, tracer);

    function inner(value, primes, index) {
        if (primes.length === min2Primes) {
            return;
        }

        for (let i = index; i < allPrimes.length; i++) {
            let p = BigInt(allPrimes[i]);
            let e = min2Primes - primes;
            let v = value * p ** BigInt(e);

            if (!values.add(v)) {
                break;
            }

            while (e > 1) {
                v /= p;
                e--;
                inner(v, primes + e, i + 1);
            }
        }
    }

    inner(1n, 0, 0);

    const items = values.toArray();
    for (let i = items.length; i > 0; i--) {
        let v = items[i - 1] * 2n;
        while (v < values.max) {
            if (!values.includes(v)) {
                values.add(v);
            }
            v *= 2n;
        }
    }

    tracer.clear();

    const result = 2n.modPow(max - min2Primes, MODULO).modMul(values.max, MODULO);
    return Number(result);
}

assert.strictEqual(solve(5), 80);
assert.strictEqual(solve(1000), 71935394);
console.log('Tests passed');

const answer = TimeLogger.wrap('', () => solve(MAX));
console.log(`Answer is ${answer}`);
