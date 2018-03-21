const primes = require('./tools/primes.js');
const bigInt = require('big-integer');
const assert = require('assert');

const MAX   = 38000000; // 100000000000;
const MAX_B = 420/4;

const cachedPrimes  = [];
const memoize       = new Map();

function slowF(N)
{
    const bigNumber = require('bigNumber.js');

    function round(v)
    {
        if (v < 0)
            return Math.ceil(v)
        else   
            return Math.floor(v);
    }
    
    let center = N/2;
    let NN = bigNumber(N).times(N);
    let N4 = bigNumber(N).times(4);

    function intersect(x)
    {
        let delta = NN.plus(N4.times(x)).minus(bigNumber(x).times(x).times(4));
        delta = delta.squareRoot();
        let result = delta.isInteger();

        return result;
    }

    let count = 0;

    for(let x = round(center); x <= N; x++)
    {
        if (intersect(x))
        {
            count++;
        }
    }

    return count*8 - 4;
}

function fastF(N)
{
    function buildPrimeCache()
    {
        console.log("Initializing Primes ...");
        let max = 37999991;

        for(let p of primes())
        {
            if (p === 2)
                continue;

            if ((p % 4) === 1)
                memoize.set(p, 2);
            else
                memoize.set(p, 0);

            cachedPrimes.push(p);

            if (p >= max)
                break
        }
        console.log('... Done');
    }

    function *myPrimes()
    {
        if (cachedPrimes.length === 0)
            buildPrimeCache();

        for(let p of cachedPrimes)
        {        
            yield p;
        }
        throw "Didn't cache enough primes";
    }

    function calculateR2(c, primesIterator) 
    {
        // Find prime factors

        let B = 1;

        for(let p of primesIterator)
        {
            if (p > c)
                break;

            if (c % p === 0) 
            {
                // Determine exponent e of p in c:
                let e = 0;
                while (c % p === 0) 
                {
                    e += 2; // +2 because didn't do the square of N
                    c /= p; // Remove this prime factor
                }
                
                if (p % 4 === 1) // Is it a prime congruent 4 (mod 1), raised to an odd power?
                {             
                    B *= e+1;
                }            
                else if (p % 4 === 3) // Is it a prime congruent 4 (mod 3), raised to an even power?
                {
                    if ((e & 1) !== 0) 
                        return 0;
                }
                else
                    return 0;

                var x = memoize.get(c);
                if (x !== undefined)
                {
                    B *= x;
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

        let v = memoize.get(c);
        if (v !== undefined)
            return v;

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

        result = r2(n, myPrimes());
        result *= 4;

        return result;
    }

    return f(N);
}

let f = fastF;

assert.equal(f(359125),   420);
assert.equal(f(84246500), 420);
assert.equal(f(1328125),  180);
assert.equal(f(248431625),420);

let sum = 0;

for (let N = MAX; N >= 359125; N--)
{
    let v = fastF(N);
    if (v === 420)
    {
        sum = sum.plus(N);
    }
}

console.log(sum + " ( Should be 30875234922 )");