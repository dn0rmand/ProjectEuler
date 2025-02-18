const assert = require('assert');
const { TimeLogger, Tracer, primeHelper, divisors } = require('@dn0rmand/project-euler-tools');

const MAX_PRIME = 1e8;

TimeLogger.wrap('Loading primes', () => primeHelper.initialize(MAX_PRIME));

const allPrimes = primeHelper.allPrimes().filter((p) => p < 50);

const threshold = (v, max) => (v > max ? 0n : v);

const $divisors = [];

function getDivisors(value) {
    if ($divisors[value]) {
        return $divisors[value];
    }
    const divs = divisors(value)
        .filter((v) => v !== 1)
        .sort((a, b) => a - b);
    $divisors[value] = divs;
    return divs;
}

function getPrimes(value) {
    const primes = [];

    primeHelper.factorize(Number(value), (prime, power) => {
        primes.push({ prime, power, count: power + 1 });
    });

    return primes;
}

function findCount(k, max) {
    const kPrimes = getPrimes(k);
    if (kPrimes.some((p) => p.prime > 59)) {
        return 0n;
    }
    const K = BigInt(k);
    const required = [];

    kPrimes.forEach((v) => (required[v.prime] = v.count));
    allPrimes.sort((a, b) => {
        if (required[a]) {
            return required[b] ? a - b : -1;
        } else {
            return required[b] ? 1 : a - b;
        }
    });

    let min = max + 1n;

    const checkMin = (prime, divisor, value) => {
        let p = prime ** (divisor - 1);
        if (p > Number.MAX_SAFE_INTEGER || !isFinite(p)) {
            const v = BigInt(prime) ** BigInt(divisor - 1) * value;

            return v < min ? v : 0n;
        } else {
            const v = BigInt(p) * value;
            return v < min ? v : 0n;
        }
    };

    function calculate(index, value, remaining, used) {
        if (value > min) {
            return;
        }
        if (remaining === 1) {
            if (value < min && value % K === 0n) {
                min = value;
            }
            return;
        }

        if (index >= allPrimes.length) {
            return;
        }

        const firstPrime = allPrimes[index];
        const divisors = getDivisors(remaining).filter((d) => checkMin(firstPrime, d, value));
        if (!divisors.length) {
            return;
        }

        for (let i = index; i < allPrimes.length; i++) {
            const p = allPrimes[i];
            const divs = divisors.filter((d) => checkMin(p, d, value));

            if (divs.length === 0) {
                break;
            }

            const minDiv = required[p] ?? 1;
            for (const d of divs) {
                if (d > remaining) {
                    break;
                }
                if (d < minDiv) {
                    continue;
                }
                try {
                    const v = checkMin(p, d, value);
                    if (!v) {
                        break;
                    }
                    calculate(i + 1, v, remaining / d, used + 1);
                } catch {
                    break;
                }
            }
            if (minDiv > 1) {
                break;
            }
        }
    }

    calculate(0, 1n, k);
    return threshold(min, max);
}

const m0 = (k, max) => findCount(k, max);

function m(k, max) {
    max = BigInt(max ?? Number.MAX_SAFE_INTEGER);
    if (primeHelper.isPrime(k)) {
        const v = threshold(BigInt(k) ** BigInt(k - 1), max);
        return v;
    } else {
        const v = m0(k, max);
        return v;
    }
}

function M(k, trace) {
    const max = 10n ** BigInt(k);
    const maxLoop = max > 38400n ? 38400n : max;

    let total = 0n;
    let last = 0n;
    let zeroes = 0;

    const tracer = new Tracer(trace);
    for (let i = 1; i <= maxLoop; i++) {
        tracer.print(() => maxLoop - BigInt(i));
        const v = m(i, max);

        if (v) {
            last = i;
            total += v;
            zeroes = 0;
        } else {
            zeroes++;
            if (zeroes > last) {
                break;
            }
        }
    }
    tracer.clear();
    return total;
}

assert.strictEqual(m(8), 24n);
assert.strictEqual(m(12), 60n);
assert.strictEqual(m(16), 384n);

assert.strictEqual(M(3), 3189n);
assert.strictEqual(M(4), 44170n);
assert.strictEqual(M(5), 549523n);
assert.strictEqual(M(6), 9658824n);
assert.strictEqual(M(7), 145432809n);

console.log('Tests passed');
const answer = TimeLogger.wrap('', () => M(16, true));
console.log(`Answer is ${answer}`);
