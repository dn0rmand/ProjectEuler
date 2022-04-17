const assert = require('assert');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');

require('@dn0rmand/project-euler-tools/src/numberHelper');

const MAX_A = 1E9;
const MAX_B = 1E5;
const MAX_K = 1E5;

const MAX_PRIME = MAX_A + MAX_B;

const primes = timeLogger.wrap('Loading Primes', _ => {
    primeHelper.initialize(MAX_PRIME, true);

    return primeHelper.allPrimes();
});

function D(a, b, k)
{
    let total = 0;

    for(const p of primes)
    {
        if (p < a)
            continue;
        if (p >= a+b)
            break;

        total += (k-1).modInv(p);
    }
    return total;
}

assert.strictEqual(D(101, 1, 10), 45);
assert.strictEqual(D(1E3, 1E2, 1E2), 8334);
assert.strictEqual(timeLogger.wrap('1E6', _ => D(1E6, 1E3, 1E3)), 38162302);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => D(MAX_A, MAX_B, MAX_K, true)) ;

console.log(`Answer is ${answer}`);