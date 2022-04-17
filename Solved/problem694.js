const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

MAX_POW = 18;
MAX = 10n ** BigInt(MAX_POW);
MAX_PRIME = 10 ** (MAX_POW / 3 + 1);

const allprimes = (function () {
    process.stdout.write('Loading primes ..');

    const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');

    primeHelper.initialize(MAX_PRIME, true);
    const primes = primeHelper.allPrimes();

    for (let i = 0; i < primes.length; i++)
        primes[i] = BigInt(primes[i]);

    process.stdout.write('.. done\n');
    return primes;
})();

function calculate(max, callback) {
    function makeCubes(value, index) {
        if (value > max)
            return;

        for (let i = index; i <= allprimes.length; i++) {
            let p = allprimes[i];
            let v = value * (p * p * p);
            if (v > max)
                break;

            while (v <= max) {
                callback(max / v);
                makeCubes(v, i + 1);
                v *= p;
            }
        }
    }

    makeCubes(1n, 0);
}

function s(n) {
    let total = 1n;

    for (let p of allprimes) {
        if (p > n)
            break;
        if (n % p === 0n) {
            let f = 0n;
            while (n % p === 0n) {
                n /= p;
                f++;
            }
            if (f >= 3) {
                let s = 2n + f - 3n;
                total *= s;
            }
        }
    }

    return total;
}

function S(n) {
    let total = n;

    calculate(n, (count) => {
        total += count;
    });

    return total;
}

assert.equal(s(16n), 3n);
assert.equal(s(432n), 6n);
assert.equal(s(216n), 4n);

assert.equal(S(16n), 19n);
assert.equal(S(100n), 126n);
assert.equal(S(10000n), 13344n);
assert.equal(S(10n ** 8n), 133976753n);
console.log('Tests passed');

answer = timeLogger.wrap('', () => S(MAX));

console.log(`Answer is ${ answer }`);