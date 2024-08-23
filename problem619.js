const assert = require('assert');
const { primeHelper, Tracer } = require('@dn0rmand/project-euler-tools');

primeHelper.initialize(1234568);
const allPrimes = primeHelper.allPrimes();

const MODULO = 1000000007;

class PreciseNumber {
    static One = new PreciseNumber(1);

    constructor(v) {
        this.primes = new Map();
        this.$key = undefined;
        if (typeof v === 'number') {
            primeHelper.factorize(v, (p, e) => {
                this.primes.set(p, e & 1 ? 1 : 2);
            });
        } else {
            this.primes = new Map(v.primes);
        }
    }

    isOne() {
        return this.primes.size === 0;
    }

    toString() {
        return this.key;
    }

    getPower(prime) {
        return this.primes.get(prime) || 0;
    }

    get key() {
        if (!this.$key) {
            const items = [];

            this.primes.forEach((power, prime) => {
                if (power & 1) {
                    items.push(allPrimes.indexOf(prime));
                }
            });
            items.sort((a, b) => a - b);
            this.$key = items.join(':');
        }

        return this.$key;
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
        const value = new PreciseNumber(this); // clone it
        v.primes.forEach((power, prime) => {
            let e = this.getPower(prime) + power;
            if (e) {
                e = e & 1 ? 1 : 2;
            }
            value.primes.set(prime, e);
        });
        return value;
    }

    valueOf() {
        let value = 1;
        this.primes.forEach((power, prime) => (value *= prime ** power));
        return value;
    }

    get minPrime() {
        if (this.primes.size === 0) {
            return 1;
        }
        if (!this.$minPrime) {
            this.$minPrime = [...this.primes.keys()].sort((a, b) => a - b)[0];
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

function C(a, b) {
    const allNumbers = [];
    let answer = 0;
    let minPrime = allPrimes[allPrimes.length - 1];
    let maxPrime = 0;

    for (let v = a; v <= b; v++) {
        const x = new PreciseNumber(v);
        minPrime = Math.min(minPrime, Math.max(0, allPrimes.indexOf(x.minPrime)));
        maxPrime = Math.max(maxPrime, allPrimes.indexOf(x.maxPrime));
        allNumbers.push(x);
    }

    function getPrimeKey(pIndex, value) {
        return `${value.key}-${pIndex}`;
    }

    function getProductKey(prime, numbers, index, value) {
        let k = getPrimeKey(allPrimes.indexOf(prime), value);
        return `${k}-${index}`;
    }

    const $innerMemoize = new Map();

    function innerProduct(prime, numbers, index, value, callback) {
        if (index >= numbers.length) {
            return 0;
        }
        const key = getProductKey(prime, numbers, index, value);

        let total = $innerMemoize.get(key);
        if (total !== undefined) {
            return total;
        }

        total = 0;
        for (let i = index; i < numbers.length; i++) {
            const v = value.times(numbers[i]);
            if ((v.getPower(prime) & 1) === 0) {
                total += callback(v);
            }
            total = (total + innerProduct(prime, numbers, i + 1, v, callback)) % MODULO;
        }

        $innerMemoize.set(key, total);
        return total;
    }

    function innerPrime(pIndex, value, deep) {
        const key = getPrimeKey(pIndex, value);
        let total = $innerMemoize.get(key);
        if (total !== undefined) {
            return total;
        }
        total = 0;
        const tracer = new Tracer(deep < 10);
        for (let i = pIndex; i < allPrimes.length; i++) {
            const prime = allPrimes[i];
            if (prime > b) {
                break;
            }
            tracer.print(() => prime);
            const numbers = allNumbers.filter((v) => v.minPrime === prime);
            if (numbers.length > 0) {
                total += innerProduct(prime, numbers, 0, value, (v) => {
                    return v.isSquare() + innerPrime(i + 1, v, deep + 1);
                });
                total %= MODULO;
                if ((value.getPower(prime) & 1) !== 0) {
                    break; // Hopeless
                }
            }
        }
        tracer.clear();
        $innerMemoize.set(key, total);
        return total;
    }

    answer += innerPrime(minPrime, PreciseNumber.One, 0);
    return answer;
}

assert.strictEqual(C(5, 10), 3);
assert.strictEqual(C(40, 55), 15);
assert.strictEqual(C(1000, 1234), 975523611);
console.log('Tests passed');
