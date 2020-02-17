const assert      = require('assert');
const primeHelper = require('tools/primeHelper')();
const timeLogger  = require('tools/timeLogger');

const MAX = 150000000;

timeLogger.wrap('Loading Primes', () => { primeHelper.initialize(MAX, true); });

const allPrimes = (function() {
    const primes = primeHelper.allPrimes();

    for(let i = 0; i < primes.length; i++)
        primes[i] = BigInt(primes[i]);

    return primes;
})();

const others = [5n, 11n, 15n, 17n, 19n, 21n, 23n, 25n];

function isPrime(value)
{
    let n2 = BigInt(value)*BigInt(value);
    let v1 = n2 + 1n;
    let v3 = n2 + 3n;
    let v7 = n2 + 7n;
    let v9 = n2 + 9n;
    let v13 = n2 + 13n;
    let v27 = n2 + 27n;

    for(let p of allPrimes)
    {
        if (p > value+1)
            break;

        if (v1 % p === 0n)
            return false;
        if (v3 % p === 0n)
            return false;
        if (v7 % p === 0n)
            return false;
        if (v9 % p === 0n)
            return false;
        if (v13 % p === 0n)
            return false;
        if (v27 % p === 0n)
            return false;
    }

    for(let o of others)
    {
        let v = n2 + o;
        for(let p of allPrimes)
        {
            if (p > value+1)
                return false;

            if (v % p === 0n)
                break;
        }
    }

    return true;
}

function solve(max, trace)
{
    let total = 10;

    let traceCount = 0;
    for(let n = 315410; n < max; n += 10)
    {
        if (trace)
        {
            if (traceCount === 0)
                process.stdout.write(`\r${max-n}  `);
            if (++traceCount >= 100000)
                traceCount = 0;
        }
        if (isPrime(n))
        {
            total += n;
        }
    }

    return total;
}

assert.equal(solve(1000000, false), 1242490);
console.log("Test passed");

const answer = timeLogger.wrap('', () => solve(MAX, true));

console.log(`Answer is ${answer}`);

