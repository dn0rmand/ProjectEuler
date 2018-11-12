const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const sieve = require('tools/sieve-offset');
const announce = require('tools/announce');

const MAX        = 201820182018;
const MODULO     = 1E9;
const PRIME_SIZE = 1E9;

let MAX_PRIME = Math.max(PRIME_SIZE, Math.floor(Math.sqrt(MAX)));

console.log('Loading primes');
primeHelper.initialize(MAX_PRIME, true);
console.log('Primes loaded');

const allPrimes = primeHelper.allPrimes();

function F(n, trace)
{
    function inner(P, index, value)
    {
        total = (total + P) % MODULO;

        for (let i = index; i <= allPrimes.length; i++)
        {
            let prime = allPrimes[i];
            if (prime > P)
                break;

            let v = value * prime;
            if (v > n)
                break;
            while (v <= n)
            {
                inner(P, i+1, v);
                v *= prime;
            }
        }
    }

    let total = 0;
    let lastP = 0;
    let traceCount = 0;

    for (let i = 0; i < allPrimes.length; i++)
    {
        let P = allPrimes[i];
        lastP = P;
        if (P > n)
            break;
        if (trace)
        {
            if (traceCount === 0)
                process.stdout.write('\r'+P);
            traceCount++;
            if (traceCount >= 100)
                traceCount = 0;
        }
        inner(P, 0, P);
    }

    while(lastP < n)
    {
        if (trace)
        {
            traceCount = 0;
            process.stdout.write('\rloading    ');
        }
        let max = lastP+PRIME_SIZE;

        for (let P of sieve(lastP+1, max))
        {
            lastP = P;

            if (P > n)
                break;
            if (trace)
            {
                if (traceCount === 0)
                    process.stdout.write('\r'+P);
                traceCount++;
                if (traceCount >= 100)
                    traceCount = 0;
            }
            inner(P, 0, P);
        }
    }

    if (trace)
        console.log('');
    return total;
}
assert.equal(F(10), 32);
assert.equal(F(100), 1915);
assert.equal(F(10000), 10118280);

console.log('Tests passed');

console.time(642);
let answer = F(MAX, true);
console.timeEnd(642);
announce(642, 'F('+MAX+')=' + answer);

// gpf(n)=if(n<4, n, n=factor(n)[, 1]; n[#n]);
// a(n)=sum(k=2, n, Mod(gpf(k), 1000000000))
// a(10000)
// a(201820182018)