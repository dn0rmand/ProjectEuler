// Divisibility of factorials
// Problem 549 
// The smallest number m such that 10 divides m! is m=5.
// The smallest number m such that 25 divides m! is m=10.

// Let s(n) be the smallest number m such that n divides m!.
// So s(10)=5 and s(25)=10.
// Let S(n) be ∑s(i) for 2 ≤ i ≤ n.
// S(100)=2012.

// Find S(10^8).

const bigInt        = require('big-integer');
const assert        = require('assert');
const primes        = require('../tools/primes.js');
const isNumberPrime = require('../tools/isPrime.js');

const primeCache    = new Map();
const primeLookup   = primes();
let maxPrimeCached  = 0;

function *nextPrime()
{
    while (true)
    {
        let p = primeLookup.next().value;

        yield p;
    }
}

function *getPrimes()
{
    for(let p of primeCache.keys())
        yield p;

    for(let p of nextPrime())
    {
        primeCache.set(p, 1);
        maxPrimeCached = p;
        yield p;
    }
}

function isPrime(n)
{
    if (n === 2 || n === 3 || n === 5 || n === 7)
        return true;
    if ((n & 1) === 0)
        return false;

    if (primeCache.has(n))
        return true;
    if (n < maxPrimeCached)
        return false;

    return isNumberPrime(n);
}

//
// Returns a list a factors,count
// for example, 80 -> [2, 3, 5, 1] ( 3 times factor 2 and once factor 5 ) 
function getFractions(value)
{
    if (isPrime(value))
        return [value, 1];

    let factors = [];
    for (let p of getPrimes())
    {
        if ((value % p) === 0)
        {
            factors.push(p);
            let count = 0;
            while ((value % p) === 0)
            {
                count++;
                value /= p;

                if (value <= 1)
                {
                    factors.push(count);
                    return factors;
                }
            }
            factors.push(count);
            if (isPrime(value))
            {
                factors.push(value);
                factors.push(1);
                break;
            }
        }
    }

    return factors;
}

function s(n)
{
    let fractions = getFractions(n);
    let min = 1, length = fractions.length;

    for(let i = 0; i < length; i += 2)
    {
        let f = fractions[i];
        let c = fractions[i+1];

        if (c > 1)
        {
            let x = f;
            let count = 1;
            c--;
            while (c > 0)
            {
                x += f;
                count++;
                c--;
                if ((count % f) === 0)
                {
                    let z = count;
                    while ((z % f) === 0)
                    {
                        z /= f;
                        c--;
                    }
                }
            }
            f = x;
        }

        if (f > min)
            min = f;
    }
    return min;
}

function S(n)
{
    // Let S(n) be ∑s(i) for 2 ≤ i ≤ n.

    let sum = 0;
    for (let i = 2; i <= n; i++)
        sum += s(i);

    return sum;
}

function validate(factor, value)
{
    function factorial(n)
    {
        if (n < 2)
            return bigInt(1);
    
        return factorial(n-1).times(n);
    }
    
    let f = factorial(value);
    assert.ok(f.mod(factor).isZero());
    
    f = bigInt(1);
    for (let v = 2; v < value; v++)
    {
        f = f.times(v);
        assert.ok(! f.mod(factor).isZero());
    }
}

assert(s(1024), 12);
assert(S(1024), 143397);

assert.equal(s(128), 8);

assert.equal(s(123456), 643);
assert.equal(s(32), 8);
assert.equal(s(10), 5);
assert.equal(s(25), 10);
assert.equal(S(100), 2012);

assert.equal(S(1000), 136817);
assert.equal(S(500), 38225);

// validate(32, 8);
// validate(25, 10)
// validate(10, 5)

// //validate(123456, 643)


let sum = S(100000000);

console.log('Problem answer is '+sum+' (476001479068717)');
console.log('Done');