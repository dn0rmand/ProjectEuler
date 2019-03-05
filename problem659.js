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

console.log('Primes loaded');

function getMaxFactor(value)
{
    function gcd(m, n)
    {
        let r;

        if (m < n)
        {
            r = m;
            m = n;
            n = r;
        }

        r = m % n;
        while (r !== 0)
        {
            m = n;
            n = r;
            r = m % n;
        }

        return n;
    }

    function prho(n)
    {
        if (n % 2 === 0)
            return n === 2 ? false : 2;
        if (primeHelper.isPrime(n))
            return false;

        const g = (x) => { return (x * x) + 1; };

        let x = 2;
        let y = 2;
        let d = 1;

        while (d === 1)
        {
            x = g(x);
            y = g(g(y));
            d = gcd(Math.abs(x - y), n);
        }

        return d === n ? false : d;
    }

    let d = prho(value);
    if (! d)
        return n;

    let max = d;
    let n = value / d;

    while (n > max)
    {
        d = prho(n);
        if (! d)
            max = n;
        else
            n /= d;
    }

    return max;
}

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
console.log('Done');