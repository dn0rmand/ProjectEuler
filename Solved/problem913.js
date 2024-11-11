const assert = require('assert');
const { TimeLogger, Tracer, primeHelper, divisors } = require('@dn0rmand/project-euler-tools');

// https://en.wikipedia.org/wiki/In-place_matrix_transposition#Properties_of_the_permutation

const MAX_PRIME = 1e8;

primeHelper.initialize(MAX_PRIME);

const allPrimes = primeHelper.allPrimes().map((p) => BigInt(p));

function factorize(value) {
    if (typeof value === 'number') {
        throw 'Use BigInt Luke';
    }

    if (typeof value === 'bigint') {
        if (value > 10n ** 16n) {
            throw 'Too big';
        }

        const primes = [];
        let v = value;

        for (const prime of allPrimes) {
            if (prime > v) {
                break;
            }
            if (v % prime === 0n) {
                let power = 0n;
                while (v % prime === 0n) {
                    power++;
                    v /= prime;
                }
                primes.push({ prime, power });
            }
        }

        if (v > 1n) {
            primes.push({ prime: v, power: 1n });
        }
        return { primes, value };
    } else {
        return { primes: value };
    }
}

class FactorizedNumber {
    static ONE = new FactorizedNumber(1n);

    constructor(v) {
        const { primes, value } = factorize(v);
        this.primes = primes;
        this.$value = value;
    }

    static create(value) {
        if (value === 1n) {
            return FactorizedNumber.ONE;
        }
        return new FactorizedNumber(value);
    }

    get value() {
        if (this.$value === undefined) {
            this.$value = this.primes.reduce((v, { power, prime }) => {
                const m = prime ** power;
                return v * m;
            }, 1n);
        }
        return this.$value;
    }

    forDivisors(withMobius, callback) {
        const min = FactorizedNumber.create(
            withMobius
                ? this.primes
                      .map(({ prime, power }) => (power <= 1n ? undefined : { prime, power: power - 1n }))
                      .filter((x) => x)
                : []
        );
        const primes = !withMobius ? this.primes : this.primes.map(({ prime }) => ({ prime, power: 1n }));

        function inner(val, index) {
            callback(val);

            for (let i = index; i < primes.length; i++) {
                const { prime, power } = primes[i];
                let v = val.clone();
                for (let p = 1n; p <= power; p++) {
                    v.addPrime(prime, 1n);
                    inner(v, i + 1);
                }
            }
        }

        inner(min, 0);
    }

    getCopy(withIndexes) {
        const newPrimes = this.primes.map(({ prime, power }) => ({ prime, power }));
        if (withIndexes) {
            const indexes = newPrimes.reduce((a, p) => {
                a[p.prime] = p;
                return a;
            }, []);
            return { newPrimes, indexes };
        } else {
            return newPrimes;
        }
    }

    clone() {
        const newPrimes = this.getCopy(false);
        const c = FactorizedNumber.create(newPrimes);
        c.$value = this.$value;
        return c;
    }

    addPrime(prime, power = 1n) {
        const p = this.primes.find((p) => p.prime === prime);
        if (p) {
            p.power += power;
        } else {
            this.primes.push({ prime, power });
        }

        if (this.$value !== undefined) {
            this.$value *= prime ** power;
        }
    }

    divideMobius(divisor) {
        const indexes = divisor.primes.reduce((a, p) => {
            a[p.prime] = p;
            return a;
        }, []);

        const m = this.primes.reduce((m, { prime, power }) => {
            if (!indexes[prime] || indexes[prime].power < power) {
                return -m;
            } else {
                return m;
            }
        }, 1n);

        return m;
    }

    times(other) {
        const { newPrimes, indexes } = this.getCopy(true);
        other.primes.forEach(({ power, prime }) => {
            if (indexes[prime]) {
                indexes[prime].power += power;
            } else {
                newPrimes.push({ prime, power });
            }
        });

        return FactorizedNumber.create(newPrimes);
    }

    get mobius() {
        if (this.primes.some((p) => p.power > 1)) {
            return 0n;
        }

        const m = this.primes.length & 1 ? -1n : 1n;
        return m;
    }

    get totient() {
        const primes = this.primes
            .map(({ prime, power }) => ({ prime, power: power - 1n }))
            .filter((p) => p.power);

        const phi = this.primes.reduce((phi, { prime }) => {
            const other = FactorizedNumber.create(prime - 1n);
            return phi.times(other);
        }, FactorizedNumber.create(primes));
        return phi;
    }
}

function cycleCount(k, cols, length) {
    let sum = 0n;

    k.forDivisors(true, (d) => {
        const m = k.divideMobius(d);
        if (m) {
            const nd = (cols.modPow(d.value, length.value) + length.value - 1n) % length.value;
            const g = length.value.gcd(nd);
            sum += g * m;
        }
    });

    if (sum <= 0) {
        return 0n;
    }
    sum /= k.value;
    return sum;
}

function minSwapsToSort(cols, length) {
    let total = 0n;
    let maxLength = length.totient;

    if (maxLength === undefined) {
        return total;
    }

    maxLength.forDivisors(false, (cycleSize) => {
        if (cycleSize.primes.length) {
            const count = cycleCount(cycleSize, cols, length);
            if (count) {
                total += count * (cycleSize.value - 1n);
            }
        }
    });

    return total;
}

function S(cols, rows, power) {
    cols = BigInt(cols);
    rows = BigInt(rows);

    if (rows === cols) {
        if (power) {
            rows **= 4n;
        }
        const swaps = (rows * (rows - 1n)) / 2n;
        return swaps;
    }

    const generate = () => {
        cols = cols ** 2n;
        rows = rows ** 2n;

        const v1 = FactorizedNumber.create(rows * cols - 1n);
        const v2 = FactorizedNumber.create(rows * cols + 1n);
        const x = v1.times(v2);

        cols *= cols;
        rows *= rows;
        return x;
    };

    const length = power ? generate() : FactorizedNumber.create(rows * cols - 1n);

    const swaps = minSwapsToSort(cols, length);

    return swaps;
}

const normalAction = (rows, cols) => S(cols, rows, false);
const problemAction = (rows, cols) => S(rows, cols, true);

function solve(max, action = normalAction, trace = false) {
    let total = 0n;

    const tracer = new Tracer(trace);
    for (let rows = max; rows >= 2; rows--) {
        for (let cols = rows; cols >= 2; cols--) {
            tracer.print(() => `${rows} - ${cols}`);
            total += action(rows, cols);
        }
    }

    tracer.clear();
    return total;
}

assert.strictEqual(S(3, 4, false), 8n);
assert.strictEqual(S(4, 3, false), 8n);

assert.strictEqual(solve(100, normalAction), 12578833n);
assert.strictEqual(solve(10, problemAction), 320054592n);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => solve(100, problemAction, true));
console.log(`Answer is ${answer}`);
