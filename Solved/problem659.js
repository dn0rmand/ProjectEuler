const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const prettyTime= require("pretty-hrtime");

const MAX_K = 10000000;
const MODULO = 1000000000000000000n

console.log('Loading primes');

const MAX_VALUE = (4*(MAX_K*MAX_K) + 1);
if (!Number.isSafeInteger(MAX_VALUE))
    throw "MAX_VALUE too big";

const MAX_PRIME = Math.floor(Math.sqrt(MAX_VALUE))+1;
primeHelper.initialize(MAX_PRIME);

let newPrimes = [];
for (let n = 1; ; n++)
{
    let p = 4*n + 1;
    if (p > MAX_PRIME)
        break;
    if (primeHelper.isPrime(p))
        newPrimes.push(p);
}

primeHelper.factorize = function(n, callback)
{
    if (n === 1)
        return;

    if (primeHelper.isPrime(n))
    {
        callback(n, 1);
        return;
    }

    let max = Math.floor(Math.sqrt(n))+1;

    for(let p of newPrimes)
    {
        if (p > n)
            break;
        if (p > max)
            break;

        if (n % p === 0)
        {
            n /= p;
            while (n % p === 0)
            {
                n /= p;
            }

            callback(p);

            if (n === 1)
                break;
            if (primeHelper.isPrime(n))
                break;
        }
    }

    if (n !== 1)
        callback(n);
}

console.log('Primes loaded');

function largestPrime(k2)
{
    let value = (4 * k2) + 1;
    let maxPrime = 1;

    primeHelper.factorize(value, (prime) =>
    {
        maxPrime = prime;
    });

    return maxPrime;
}

function S(max, trace)
{
    let extra = 0n;
    let total = 0;
    let count = 0;
    for (let k = 1; k <= max; k++)
    {
        if (trace)
        {
            if (count === 0)
            {
                let p = ((k * 100)/max).toFixed(0);
                process.stdout.write(`\r${p}%`);
            }
            if (count++ > 100000)
                count = 0;
        }

        let maxPrime = largestPrime(k*k);
        let t = total + maxPrime;
        if (! Number.isSafeInteger(t))
        {
            extra = (extra + BigInt(total) + BigInt(maxPrime)) % MODULO;
            total = 0;
        }
        else
            total = t;
    }
    if (trace)
        process.stdout.write(`\r100%\n`);

    return (BigInt(total) + extra) % MODULO;
}

assert.equal(largestPrime(3), 13);
assert.equal(largestPrime(9*9), 13);
assert.equal(largestPrime(16*16), 41);
assert.equal(S(100), 433752);

let timer = process.hrtime();
let answer = S(MAX_K, true);
timer = process.hrtime(timer);

console.log("Answer is", answer, "calculated in ", prettyTime(timer, {verbose:true}));
console.log("should be 238518915714422000");
console.log('Done');