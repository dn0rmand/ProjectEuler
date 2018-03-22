const primes = require('./tools/primes.js');
const isNumberPrime = require('is-number-prime');
const bigInt = require('big-integer');
const assert = require('assert');

const MAX1 = 38000000; 
const MAX2 = 100000000000; 

const MAX_B = 420/4;

const primeLookup   = primes();
const cachedPrimes  = [];
const memoize       = new Map();

function *myPrimes()
{
    for(let p of memoize.keys())
    {
        yield p;
    }

    while (true)
    {
        let p = primeLookup.next().value;

        if (p === 2)
            continue;

        if ((p % 4) === 1)
            memoize.set(p, 3);
        else
            memoize.set(p, 1);

        yield p;
    }
}

function initializePrimes(max)
{
    console.log("Pre-loading primes ...");
    for (p of myPrimes())
        if (p >= max)
            break;
    console.log('... Done');
}

function calculateR2(c, primesIterator) 
{
    let B = 1;

    var x = memoize.get(c);

    if (x !== undefined) // c is Prime ?
    {
        c = 1;
        B *= x;
    }

    if (isNumberPrime(c))
    {
        if (c % 4 === 1)
            B *= 3;

        c = 1;
    }

    for(let p of primesIterator)
    {
        if (p > c)
            break;

        if (c % p === 0) 
        {
            let e = 0;
            while (c % p === 0) 
            {
                e += 2; // +2 because didn't do the square of N
                c /= p; // Remove this prime factor
            }
            
            if (p % 4 === 1) // Is it a prime congruent 4 (mod 1), raised to an odd power?
            {             
                B *= e+1;
                if (B > MAX_B)
                    return B; // Early stop                
            }            
            else if (p % 4 === 3) // Is it a prime congruent 4 (mod 3), raised to an even power?
            {
                if ((e & 1) !== 0) 
                    return 0;
            }
            else
                return 0;
    
            x = memoize.get(c);

            if (x !== undefined) // remaining is Prime ?
            {
                c = 1;
                B *= x;
                break; 
            }
            if (isNumberPrime(c))
            {
                if (c % 4 === 1)
                    B *= 3;
    
                c = 1;
                break;                
            }
        }
    }

    // If c > 1 at this point then it is another prime factor:
    
    if (c !== 1)
    {
        if (c % 4 === 1) 
        {
            return B*2;
        }
        else 
        {
            return 0;
        }
    }

    return B;
};

function r2(c, primesIterator) 
{
    if (c <= 2)
        return 0;

    // let v = memoize.get(c);
    // if (v !== undefined)
    //     return v;

    let B = calculateR2(c, primesIterator);

    //memoize.set(c, B)
    return B;
};

function f(n)
{
    // Remove even factors:
    while ((n & 1) === 0)
    {
        n >>= 1;
    }

    result = calculateR2(n, myPrimes());
    result *= 4;

    return result;
}

// initializePrimes(38000009);

assert.equal(f(359125),   420);
assert.equal(f(1328125),  180);
assert.equal(f(84246500), 420);
assert.equal(f(248431625),420);
assert.equal(f(36826114), 420);
assert.equal(f(34042177), 420);
assert.equal(f(33651449), 420);

// let sum = 0;

// for (let N = MAX; N >= 359125; N--)
// {
//     let v = f(N);
//     if (v === 420)
//     {
//         sum += N;
//     }
// }

// console.log(sum + " ( Should be 30875234922 )");

let sum = bigInt(34197965139899); // No need to start from 0

for (let N = 1138864894; N < MAX2; N++)
{
    let v = f(N);
    if (v === 420)
    {
        sum = sum.plus(N);
    }
}

console.log("Result is " + sum.toString() + " ( 271204031455541309 )");

// 3 35   = p^1 * p^17
// 5 21   = P^2 * p^10 
// 7 15   = P^3 * P^7
// 3 5 7  = P^1 * P^2 * P^3

// 105    = P^52 <- too big