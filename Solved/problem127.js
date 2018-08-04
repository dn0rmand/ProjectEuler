// abc-hits
// --------
// Problem 127
// ----------- 
// The radical of n, rad(n), is the product of distinct prime factors of n. 
// For example, 504 = 2^3 × 3^2 × 7, so rad(504) = 2 × 3 × 7 = 42.

// We shall define the triplet of positive integers (a, b, c) to be an abc-hit if:

// GCD(a, b) = GCD(a, c) = GCD(b, c) = 1
// a < b
// a + b = c
// rad(abc) < c
// For example, (5, 27, 32) is an abc-hit, because:

// GCD(5, 27) = GCD(5, 32) = GCD(27, 32) = 1
// 5 < 27
// 5 + 27 = 32
// rad(4320) = 30 < 32
// It turns out that abc-hits are quite rare and there are only thirty-one abc-hits for c < 1000, with ∑c = 12523.

// Find ∑c for c < 120000.

const MAX = 120000;

const assert = require('assert');
const primeHelper = require('./tools/primeHelper')(120000);
const allPrimes = primeHelper.allPrimes();

function solve(max)
{
    let MAXA = max / 2;
    let PRIMES_A = [];

    function verify(a, b, rad)
    {
        if (a >= b)
            return false;

        let c = a+b;
        if (c >= max)
            return false;

        if (rad >= c)
            return false;

        if (c === 1 || primeHelper.isPrime(c))
        {
            rad *= c;
        }
        else
        {
            let v = c;
            for (let p of primeHelper.primes())
            {
                if (p > v)
                    break;
                if (v % p === 0)
                {
                    rad *= p;
                    if (rad >= c)
                        return false;
                    while (v % p === 0)
                        v /= p;
                    
                    if (v === 1)
                        break;

                    if (primeHelper.isPrime(v))
                    {
                        rad *= v;
                        break;
                    }
                }
            }
        }

        return rad < c;
    }

    function *processB(a, rad)
    {
        let MAXB = max - a;

        function *generateB(value, rad, index)
        {            
            if (rad > max)
                return;

            if (value > MAXB)  
                return;
    
            if (value > a)
            {
                yield {value: value, rad:rad};
            }

            for (let i = index ; i < allPrimes.length; i++)
            {
                let p = allPrimes[i]; 
                if (PRIMES_A[p] === 1) // Cannot use same prime as for a
                    continue;

                let v = value * p;
                if (v > MAXB)
                    break;
    
                if (value % p !== 0)
                {
                    let r1 = rad * p;
                    if (r1 > max)
                        break;

                    yield *generateB(v, r1, i);
                }
                else
                {
                    yield *generateB(v, rad, i);   
                }
            }
        }
    
        for (let e of generateB(1, rad, 0))
        {
            let b = e.value;
            if (verify(a, b, e.rad))
            {
                yield a+b;
            }
        }
    }

    function *processA()
    {
        function *generateA(value, rad, index)
        {
            if (rad > max)
                return;

            if (value > MAXA)  
                return;
    
            yield {value:value, rad:rad} ;
    
            for (let i = index ; i < allPrimes.length; i++)
            {
                let p = allPrimes[i];            
                let v = value * p;
                if (v > MAXA)
                    break;
    
                if (value % p !== 0)
                {
                    let r1 = rad * p;

                    if (r1 > max)
                        break;

                    PRIMES_A[p] = 1;
                    yield *generateA(v, r1, i);
                    PRIMES_A[p] = 0;
                }
                else
                {
                    yield *generateA(v, rad, i);   
                }
            }
        }    
    
        for (let e of generateA(1, 1, 0))
        {
            yield *processB(e.value, e.rad);
        }
    }   

    let total = 0;
    
    for (let c of processA())
    {
        total += c;
    }
    return total;
}

assert.equal(solve(1000), 12523);

console.time(127);
let answer = solve(MAX, true);
console.timeEnd(127);

console.log('Answer is', answer);