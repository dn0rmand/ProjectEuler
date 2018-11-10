const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const sieve = require('tools/sieve-offset');

const MAXPRIME = 1E9;
console.log('Loading primes');
primeHelper.initialize(MAXPRIME, true);
console.log('Primes loaded');

const MAX    = 20820182018;
const MODULO = 1E9;

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

    for (let i = 0; i < allPrimes.length; i++)
    {
        let P = allPrimes[i];
        lastP = P;
        if (P > n)
            break;
        if (trace)
            process.stdout.write('\r'+P);
        inner(P, 0, P);
    }

    while(lastP < n)
    {
        let max = lastP+1E8;
        if (max > n)
            max = n;

        for (let P of sieve(lastP+1, max))
        {
            if (P > n)
                break;
            lastP = P;
            if (trace)
                process.stdout.write('\r'+P);
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

let answer = F(201820182018, true);
console.log('Answer is', answer);

// gpf(n)=if(n<4, n, n=factor(n)[, 1]; n[#n]);
// a(n)=sum(k=2, n, Mod(gpf(k), 1000000000))
// a(10000)
// a(201820182018)