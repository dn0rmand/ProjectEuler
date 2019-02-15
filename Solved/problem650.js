// The prime factorisation of binomial coefficients
// ------------------------------------------------
// Problem 231
// -----------
// The binomial coefficient 10C3 = 120.
// 120 = 2^3 × 3 × 5 = 2 × 2 × 2 × 3 × 5, and 2 + 2 + 2 + 3 + 5 = 14.
// So the sum of the terms in the prime factorisation of 10C3 is 14.

// Find the sum of the terms in the prime factorisation of 20000000C15000000.

const assert = require('assert');
const bigIntHelper = require('tools/bigintHelper');

const primeHelper = require('tools/primeHelper')();

const MAX_N     = 20000;
const MODULO    = 1000000007;
const MODULO_B  = BigInt(MODULO);

primeHelper.initialize(MAX_N);

// previous is B(n-1) which is a map of factors key=prime , value=count

function getNextB(n, previous)
{
    if (n === 1)
    {
        previous = new Map();
        return previous;
    }

    // n^n
    primeHelper.factorize(n, (prime, count) => {
        count *= n;
        if (previous.has(prime))
            count += previous.get(prime);
        previous.set(prime, count);
    });

    // n!
    for (let i = 2; i <= n; i++)
    {
        primeHelper.factorize(i, (prime, count) => {
            if (! previous.has(prime))
                throw "That should not be";

            let c = previous.get(prime) - count;
            if (c < 0)
                throw "That should not be either";

            if (c === 0)
                previous.delete(prime);
            else
                previous.set(prime, c);
        });
    }

    return previous;
}

function B(n)
{
    let current = undefined;

    for (let i = 1; i <= n; i++)
    {
        current = getNextB(i, current);
    }

    return current;
}

const $modInv = new Map();

function modDiv(num, divisor)
{
    if ($modInv.has(divisor))
        divisor = $modInv.get(divisor);
    else
    {
        let d = divisor.modInv(MODULO_B);
        $modInv.set(divisor, d);
        divisor = d;
    }

    return (num * divisor) % MODULO_B;
}

function D(n, bn)
{
    if (bn === undefined) // not calculated?
        bn = B(n);

    let total = 1n;

    for (let entry of bn)
    {
        let prime = BigInt(entry[0]);
        let count = BigInt(entry[1]);

        let x     = prime.modPow(count+1n, MODULO_B) - 1n;
        if (x < 0n)
            x += MODULO_B;

        x = modDiv(x, prime - 1n);

        total = (total * x) % MODULO_B;
    }

    return total;
}

function S(n)
{
    let total = 0n;
    let bn = undefined;
    let trace = 0;

    for (let x = 1; x <= n; x++)
    {
        if (++trace >= 1000)
        {
            trace = 0;
            console.log(x,'/',n);
        }

        bn = getNextB(x, bn)
        total = (total + D(x, bn)) % MODULO_B ;
    }

    return Number(total);
}

assert.equal(D(5), 5467);
assert.equal(S(5), 5736);
assert.equal(S(100), 332792866);
assert.equal(S(10), Number(141740594713218418n % MODULO_B));
console.log('Test passed');

let answer = S(20000);
console.log("Answer is", answer);