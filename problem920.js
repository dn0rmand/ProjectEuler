const assert = require('assert');
const { TimeLogger, Tracer, primeHelper, polynomial } = require('@dn0rmand/project-euler-tools');

const MAX = 10 ** 10;
const MAX_PRIME = Math.ceil(Math.sqrt(MAX)) + 1;

primeHelper.initialize(MAX_PRIME);
const allPrimes = primeHelper.allPrimes().map((p) => BigInt(p));

function divisorCount(value) {
    let count = 1;
    primeHelper.factorize(value, (p, e) => {
        count *= e + 1;
    });
    return count;
}

function m0(k) {
    const tracer = new Tracer(true, `${k}`);
    for (let n = k; ; n += k) {
        tracer.print(() => n);
        if (divisorCount(n) === k) {
            tracer.clear();
            return n;
        }
    }
}

function m(k) {
    if (k < 11) {
        const v = m0(k);
        if (primeHelper.isKnownPrime(k)) {
            const v2 = k ** (k - 1);
            assert.strictEqual(v2, v);
        }
        return v;
    } else if (primeHelper.isPrime(k)) {
        return k ** (k - 1);
    } else {
        return m0(k);
    }
}

function M(k) {
    k = 10 ** k;
    let total = 0;
    for (let i = 1; i < k; i++) {
        total += m(i);
    }
    return total;
}

function solve(max, trace) {
    max = 10n ** BigInt(max);

    let total = 0n;
    const visited = [];

    function inner(value, divisors, index) {
        if (divisors > max) {
            return false;
        }
        if (value % divisors === 0n) {
            if (!visited[divisors]) {
                visited[divisors] = value;
                total += divisors;
            } else if (visited[divisors] > value) {
                visited[divisors] = value;
            }
        }

        if (divisors * 2n <= max) {
            for (let i = index; i < allPrimes.length; i++) {
                const p = allPrimes[i];
                let t = 2n;
                let v = value * p;
                while (true) {
                    if (!inner(v, divisors * t, i + 1)) {
                        break;
                    }
                    t++;
                    v *= p;
                }
            }
        }
        return true;
    }

    inner(1n, 1n, 0);
    return total;
}

assert.strictEqual(m(8), 24);
assert.strictEqual(m(12), 60);
assert.strictEqual(m(16), 384);

assert.strictEqual(M(3), 3189);

console.log('Tests passed');

// const answer = TimeLogger.wrap('', () => solve(MAX));
// console.log(`Answer is ${answer}`);
