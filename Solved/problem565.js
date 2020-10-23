const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

require('tools/numberHelper');

const MAX       = 1E11;
const MAX_PRIME = 1E6;
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
                callback(v-1, 1, v-1);
            }
            v += divisor;
        }
    }
}

function S(n, divisor, trace)
{
    assert.strictEqual(primeHelper.isPrime(divisor), true);

    const sumPrimeCache = {};

    function sumPrimes(to)
    {
        if (! sumPrimeCache[to])
        {
            if (to > max_prime)
                sumPrimeCache[to] = primeHelper.sumPrimes(to);
            else
                sumPrimeCache[to] = allPrimes.reduce((a, p) => a + (p <= to ? BigInt(p) : 0n), 0n);
        }
        return sumPrimeCache[to];
    }

    let total = 0n;

    const foundValues = {};

    function inner(value, primeToAvoid, index)
    {
        if (value > n)
            return;

        total += BigInt(value);

        const maxP = Math.floor(n / value);

        if (maxP > max_prime) {
            const extra = sumPrimes(maxP) - sumPrimes(max_prime);

            total += BigInt(value) * extra;
        }

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

    const tracer = new Tracer(100, trace);

    goodPrimes(n, divisor, (p, f, v) => {
        tracer.print(_ => n - p);
        inner(v, p, 0);
        foundValues[p] = f;
    });
    tracer.clear();

    return total;
}

assert.strictEqual(S(20, 7), 49n);
assert.strictEqual(timeLogger.wrap('S(1E6)', _ => S(1E6, DIVISOR)), 150850429n);
assert.strictEqual(timeLogger.wrap('S(1E9)', _ => S(1E9, DIVISOR)), 249652238344557n);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => S(MAX, DIVISOR, true));

console.log(`Answer is ${answer}`);