const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const timeLogger = require('tools/timeLogger');

require('tools/numberHelper');

const MAX       = 1E11;
const MAX_PRIME = 1E9;
const DIVISOR   = 2017;

timeLogger.wrap('Loading primes', _ => primeHelper.initialize(MAX_PRIME, true));

const allPrimes = primeHelper.allPrimes();
const max_prime = allPrimes[allPrimes.length-1];

function goodPrimes(n, divisor, callback)
{
    // Check low primes

    for(let p of allPrimes)
    {
        if (p > n)
            break;

        let s = 1;
        let f = 1;
        let v = p;
        let r = p;

        while(v <= n)
        {
            s = (s + r) % divisor;
            if (s === 0) {
                callback(p, f, v);
            }
            r = (r * p) % divisor;
            v *= p;
            f++;
        }
    }

    // look for a big prime

    if (primeHelper.countPrimes(n) > allPrimes.length)
    {
        let v = divisor;
        while (v-1 <= n)
        {
            if (v-1 > max_prime && primeHelper.isPrime(v-1)) {
                callback(v-1, v-1);
            }
            v *= divisor;
        }
    }
}

function S(n, divisor)
{
    assert.strictEqual(primeHelper.isPrime(divisor), true);

    const sumPrimeCache = {};

    function sumPrimes(to)
    {
        if (! sumPrimeCache[to])

        if (to > max_prime)
            sumPrimeCache[to] = primeHelper.sumPrimes(to);
        else
            sumPrimeCache[to] = allPrimes.reduce((a, p) => a + (p <= to ? p : 0));

        return sumPrimeCache[to];
    }

    let total = 0n;

    const foundValues = {};

    function inner(value, primeToAvoid, index)
    {
        if (value > n)
            return;

        total += BigInt(value);

        // const maxP = Math.floor(n / value);

        // if (maxP > max_prime) {
        //     const extra = sumPrimes(maxP) - sumPrimes(max_prime);

        //     total += BigInt(value) * BigInt(extra);
        // }

        for(let i = index; i < allPrimes.length; i++)
        {
            const p = allPrimes[i];
            if (p === primeToAvoid)
                continue;

            let v = value * p;
            let f = 1;
            if (v > n)
                break;

            while (v <= n)
            {
                if (foundValues[p] !== f)
                    inner(v, primeToAvoid, i+1);
                v *= p;
                f++;
            }
        }
    }

    goodPrimes(n, divisor, (p, f, v) => {
        inner(v, p, 0);
        foundValues[p] = f;
    });

    return total;
}

function S1(n, d)
{
    let total = 0n;

    for(let i = 1; i <= n; i++) 
    {
        let sum = 1;
        primeHelper.factorize(i, (p, k) => {
            const x = ( (p ** (k+1)) - 1 ) / (p - 1);

            sum = sum.modMul(x, d);
            if (sum === 0)
                return false; // can stop now
        });
        if (sum === 0)
            total += BigInt(i);
    }

    return total;
}

assert.strictEqual(S(20, 7), 49n);
assert.strictEqual(timeLogger.wrap('S(1E6)', _ => S(1E6, DIVISOR)), 150850429n);
assert.strictEqual(timeLogger.wrap('S(1E9)', _ => S(1E9, DIVISOR)), 249652238344557n);

console.log('Tests passed');