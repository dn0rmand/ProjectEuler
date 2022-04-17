const assert = require('assert');

const {
    primeHelper
} = require('@dn0rmand/project-euler-tools');

const MAX = 10n ** 36n;
const MAX_PRIME = 1E7;
const SIX = 6n;
const TWO = 2n;
const ONE = 1n;
const ZERO = 0n;

primeHelper.initialize(MAX_PRIME);

const allPrimes = primeHelper.allPrimes();

class FactorArray {
    constructor() {
        this.$factors = [];
        this.$length = 0;
    }

    length() {
        return this.$length;
    }

    setLength(value) {
        if (value < 0)
            value = 0;
        if (value < this.$length)
            this.$length = value;
    }

    push(value) {
        this.$factors[this.$length] = value;
        this.$length++;
    }

    pop() {
        if (this.$length > 0)
            this.$length--;
    }

    get(index) {
        if (index >= 0 && index < this.$length)
            return this.$factors[index];
    }

    set(index, value) {
        if (index >= 0 && index < this.$length)
            return this.$factors[index] = value;
    }
}

function $solve(size) {
    let total = 1;
    let factors = new FactorArray();
    let processed = new Set();

    let maxPower = (function () {
        let max = 1;

        for (let p of allPrimes) {
            let pp = BigInt(p - 1);

            if ((TWO ** pp) > size)
                break;
            max = p;
        }

        return max;
    })();

    function pass1() {
        for (let prime of allPrimes) {
            let p = BigInt(prime);
            let factor = p ** SIX;

            p = factor;

            if (p > size)
                break;

            while (p < size) {
                total++;
                processed.add(p);
                p *= factor;
            }
        }
    }

    function pass3(powers) {
        const usedPrimes = [];

        let pows = powers;
        let done = [];

        function makePowers(callback) {
            let ps = [];

            function inner(index) {
                if (index >= pows.length()) {
                    if (ps.length > 1)
                        callback(ps);
                    return;
                }

                let f = BigInt(pows.get(index));

                if (index > 0) {
                    for (let i = 0; i < ps.length; i++) {
                        let x1 = ps[i];
                        if (x1 % f == 0)
                            continue;
                        let x2 = x1 * f;
                        if (x2 <= maxPower && !done[x2]) {
                            ps[i] = x2;
                            done[x2] = 1;
                            inner(index + 1);
                            ps[i] = x1;
                        }
                    }
                }

                ps.push(f);
                inner(index + 1);
                ps.pop();
            }

            inner(0);
        }

        function inner(value, index) {
            if (value >= size)
                return;
            if (index >= powers.length) {
                if (!processed.has(value)) {
                    total++;
                    processed.add(value);
                }
                return;
            }

            let power = powers[index];
            for (let p of allPrimes) {
                if (usedPrimes.includes(p))
                    continue;

                let pn = BigInt(p);
                let f = value * (pn ** power);

                if (f >= size)
                    break;

                usedPrimes.push(p);
                inner(f, index + 1);
                usedPrimes.pop();
            }
        }

        makePowers((pws) => {
            powers = pws;
            inner(ONE, 0);
        });
    }

    function pass2() {
        function inner(value, index) {
            if (factors.length() > 1 && value % SIX === ONE) {
                pass3(factors);
            }

            let c = factors.length();

            for (let i = index; i < allPrimes.length; i++) {
                let prime = allPrimes[i];
                if (prime > maxPower)
                    break;

                let primen = BigInt(prime);
                let v = value * primen;

                if (v > size)
                    break;

                while (v <= size && ((v % SIX) !== ZERO)) {
                    factors.push(prime - 1);
                    inner(v, i + 1);
                    v *= primen;
                }

                factors.setLength(c);
            }
        }

        inner(ONE, 2);
    }

    pass1();
    pass2();

    // let x = [ONE, ...processed.keys()].sort((a,b) => { return a-b; });
    // console.log(...x);
    return total;
}

function solve(size) {
    let dice = new Uint8Array(size);

    dice.fill(1);

    function dump() {
        let values = [];
        for (let i = 0; i < size; i++) {
            if (dice[i] === 1) {
                let s = '';
                primeHelper.factorize(i + 1, (p, f) => {
                    s += `${p}^${f}  `
                });
                console.log(s);
            }
        }
    }

    let count = size;
    for (let i = 2; i < size; i++) {
        let x = i - 1;
        while (x < size) {
            let v1 = dice[x];
            let v2 = (v1 % 6) + 1;
            dice[x] = v2;
            x += i;

            if (v1 === 1)
                count--;
            else if (v2 === 1)
                count++;
        }
    }

    // dump();

    return count;
}

function analyze() {
    let values = [];
    let current = undefined;
    let max = 10000;
    for (let i = 1;; i++) {
        let v = solve(i);
        if (current === undefined || current.value != v) {
            if (i > max)
                break;
            current = {
                value: v,
                count: 1
            };
            values.push(current);
        } else
            current.count++;
    }
    console.log(values);
    process.exit(0);
}

analyze();

assert.equal(solve(100), 2);
assert.equal(solve(1E7), 36);
assert.equal(solve(1E8), 69);
// assert.equal(solve(1E12), 740);

console.log('Tests passed');

let answer = solve(MAX);

console.log('done', answer)