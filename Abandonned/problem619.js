'use strict';

const assert = require('assert');
const { primeHelper, Tracer } = require('@dn0rmand/project-euler-tools');

primeHelper.initialize(1234568);

const MODULO = 1000000007;

class PreciseNumber {
    static One = new PreciseNumber(new Map());

    constructor(primes) {
        this.primes = primes ? new Map(primes) : new Map();
    }

    clone() {
        return new PreciseNumber(this.primes);
    }

    static create(value, inUse) {
        const primes = new Map();

        primeHelper.factorize(value, (p, e) => {
            const idx = primeHelper.allPrimes().indexOf(p);
            inUse[idx] = true;
            primes.set(idx, e & 1 ? 1 : 2);
        });

        return new PreciseNumber(primes);
    }

    isOne() {
        return this.primes.size === 0;
    }

    toString() {
        const items = [];
        this.primes.forEach((power, prime) => {
            items.push({ prime, power });
        });
        if (items.length === 0) {
            return 'One';
        }
        items.sort((a, b) => a.prime - b.prime);
        return items.map(({ prime, power }) => `${prime}:${power}`).join(' ');
    }

    getPower(prime) {
        return this.primes.get(prime) || 0;
    }

    get key() {
        const keys = [...this.primes.keys()].sort((a, b) => a - b);
        const max = keys[keys.length - 1];
        const items = new Uint8Array(max + 1);
        for (const key of keys) {
            const p = this.getPower(key);
            items[key] = p;
        }
        return items.join('');
    }

    isSquare() {
        if (this.primes.size === 0) {
            return 0;
        }

        for (const power of this.primes.values()) {
            if (power & 1) {
                return 0;
            }
        }
        return 1;
    }

    hasMinPrime(p) {
        if (!this.primes.has(p)) {
            return false;
        }
        for (const prime of this.primes.keys()) {
            if (prime < p) {
                return false;
            }
        }
        return true;
    }

    times(v) {
        const value = this.clone();

        v.primes.forEach((power, prime) => {
            let e = this.getPower(prime) + power;
            if (e) {
                e = e & 1 ? 1 : 2;
            }
            value.primes.set(prime, e);
        });

        return value;
    }

    get minPrime() {
        if (this.primes.size === 0) {
            return 1;
        }
        if (!this.$minPrime) {
            const primes = [...this.primes.keys()].sort((a, b) => a - b);
            if (primes[0] !== 0) {
                this.$minPrime = primes[0];
            } else {
                this.$minPrime = primes[1] || Number.MAX_SAFE_INTEGER;
            }
        }
        return this.$minPrime;
    }

    get maxPrime() {
        if (this.primes.size === 0) {
            return 1;
        }
        if (!this.$maxPrime) {
            this.$maxPrime = [...this.primes.keys()].sort((a, b) => b - a)[0];
        }
        return this.$maxPrime;
    }
}

function generateNumbers(a, b) {
    const allNumbers = [];
    const inUse = [];

    for (let v = a; v <= b; v++) {
        allNumbers.push(PreciseNumber.create(v, inUse));
    }

    while (inUse[inUse.length - 1] !== true) {
        inUse.pop();
    }

    let maxPrime = inUse.length - 1;

    if (inUse.some((v) => v !== true)) {
        let k = 0;
        let map = [];

        for (let i = 0; i < inUse.length; i++) {
            if (inUse[i] === true) {
                map[i] = k++;
            }
        }

        // Remap
        for (const number of allNumbers) {
            const newPrimes = new Map();
            number.primes.forEach((power, prime) => {
                const p = map[prime];
                newPrimes.set(p, power);
            });
            number.primes = newPrimes;
            number.$maxPrime = number.$minPrime = undefined;
        }

        maxPrime = k - 1;
    }

    allNumbers.sort((a, b) => a.toString().localeCompare(b.toString()));

    return { maxPrime, allNumbers };
}

function getPrimeKey(pIndex, value) {
    return `${value.key}-${pIndex}`;
}

function getProductKey(pIndex, index, value) {
    let k = getPrimeKey(pIndex, value);
    return `${k}-${index}`;
}

class State {
    constructor(value, count) {
        this.value = value;
        this.count = count || 1;
        this.key = this.value.key;
        this.isOne = count === undefined;
    }

    getKey() {
        if (this.isOne) {
            return 'X';
        }
        const k1 = this.value.key;
        return k1;
    }

    times(value) {
        const newValue = this.value.times(value);
        return new State(newValue, this.count);
    }
}

function C(a, b, trace) {
    const { maxPrime, allNumbers } = generateNumbers(a, b);

    let states = new Map();
    let newStates = new Map();

    const add = (state) => {
        const key = state.getKey();
        const o = newStates.get(key);
        if (o) {
            o.count = (o.count + state.count) % MODULO;
        } else {
            newStates.set(key, state);
        }
    };

    add(new State(PreciseNumber.One));

    [states, newStates] = [newStates, states];

    const cleanup = (prime) => {
        // Clear all bad ones and consolidate good ones ( also count squares)
        newStates.clear();
        for (const state of states.values()) {
            if (state.value.getPower(prime) & 1) {
                continue; // Bad one
            }
            state.value.primes.delete(prime);
            add(state);
        }
        [states, newStates] = [newStates, states];
    };

    const processNumber = (number) => {
        newStates.clear();
        for (const state of states.values()) {
            add(state);
            add(state.times(number));
        }
        [states, newStates] = [newStates, states];
    };

    const tracer = new Tracer(trace);

    for (let prime = 1; prime <= maxPrime; prime++) {
        const numbers = allNumbers.filter((v) => v.minPrime === prime);
        for (let n = 0; n < numbers.length; n++) {
            tracer.print(() => `${maxPrime - prime}: ${numbers.length - n}: ${states.size}`);
            processNumber(numbers[n]);
        }

        cleanup(prime);
    }

    // Process powers of 2

    const powersOfTwo = allNumbers.filter((v) => v.maxPrime === 0);
    for (let n = 0; n < powersOfTwo.length; n++) {
        tracer.print(() => `${powersOfTwo.length - n}: ${states.size}`);
        processNumber(powersOfTwo[n]);
    }

    cleanup(0);

    tracer.clear();

    return states.get('')?.count || 0;
}

function C1(a, b) {
    const { maxPrime, allNumbers } = generateNumbers(a, b);

    const $innerMemoize = new Map();

    function innerProduct(pIndex, numbers, index, value, callback) {
        if (index >= numbers.length) {
            return 0;
        }

        const key = getProductKey(pIndex, index, value);

        let total = $innerMemoize.get(key);
        if (total !== undefined) {
            return total;
        }

        total = 0;

        for (let i = index; i < numbers.length; i++) {
            const v = value.times(numbers[i]);
            if ((v.getPower(pIndex) & 1) === 0) {
                total += callback(v);
            }
            total = (total + innerProduct(pIndex, numbers, i + 1, v, callback)) % MODULO;
        }

        $innerMemoize.set(key, total);
        return total;
    }

    function innerPrime(pIndex, value) {
        const key = getPrimeKey(pIndex, value);
        let total = $innerMemoize.get(key);
        if (total !== undefined) {
            return total;
        }

        total = 0;

        const tracer = new Tracer(pIndex < 5);

        for (let i = pIndex; i <= maxPrime; i++) {
            tracer.print(() => i);

            const numbers = allNumbers.filter((v) => v.minPrime === i);

            if (numbers.length > 0) {
                const v2 = value.clone(); // Clone it
                for (let j = 0; j < i; j++) {
                    v2.primes.delete(j);
                }
                total += innerProduct(i, numbers, 0, v2, (v) => {
                    return v.isSquare() + innerPrime(i + 1, v);
                });
                total %= MODULO;
            }

            if ((value.getPower(i) & 1) !== 0) {
                break; // Hopeless
            }
        }

        tracer.clear();

        $innerMemoize.set(key, total);
        return total;
    }

    const answer = innerPrime(0, PreciseNumber.One);
    return answer;
}

assert.strictEqual(C(5, 10), 3);
assert.strictEqual(C(40, 55), 15);
assert.strictEqual(C(1000, 1234, true), 975523611);
console.log('Tests passed');
