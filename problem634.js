// Numbers of the form a^2*b^3
// ---------------------------
// Problem 634 
// -----------
// Define F(n) to be the number of integers x≤n that can be written in the form x=a^2b^3, where a and b
// are integers not necessarily different and both greater than 1.

// For example, 32=2^2×2^3 and 72=3^2×2^3 are the only two integers less than 100 that can be written in this form. 
// Hence, F(100)=2
// Further you are given F(2×10^4)=130 and F(3×10^6)=2014
// Find F(9×10^18)

const primeHelper = require('tools/primeHelper')();
const assert = require('assert');

const MAX = 3E6;
const MAX_PRIME = MAX; // Math.floor(Math.sqrt(MAX));

primeHelper.initialize(MAX_PRIME);

const primes = primeHelper.allPrimes();

function isValid(value)
{
    for (let a = 2; ; a++)
    {
        let a2 = a*a;
        let a3 = a*a2;

        if (a2*a3 > value)
            break;
        
        if (a2 * a3 === value)
            return true;

        for (let b = a+1; ; b++)
        {
            let b2 = b*b;
            let b3 = b*b2;
            let done = true;

            let v1 = a2 * b3;
            let v2 = a3 * b2;

            if (v1 === value || v2 === value)
                return true;
            if (v1 > value && v2 > value)
                break;
        }
    }
    return false;
}

function $isValid(value)
{
    let n = value;

    if (primeHelper.isPrime(value))
        return false;

    let a = false;
    let b = false;
    let c = false;

    for (let p of primes)
    {
        if (p > n)
            break;
        if (n % p === 0)
        {
            let c = 0;
            while (n % p === 0)
            {
                n /= p;
                c++;
            }

            if (c % 5 === 0)
            {
                a = b = true;
            }
            else if (c % 3 === 0)
            {
                b = true;
                let c1 = 0;
                while (c % 3 === 0)
                {
                    c1++;
                    c /= 3;
                }
                if (c1 % 2 === 0) // || c % 2 === 0)
                    a = true;
            }
            else if (c % 2 === 0)
            {
                a = true;

                let c1 = 0;
                while (c % 2 === 0)
                {
                    c1++;
                    c /= 2;
                }
                if (c1 % 3 === 0) // || c % 3 === 0)
                    b = true;
            }
            else
            {
                while (c >= 5)
                {
                    c -= 5;
                    a = b = true;
                }
                while (c >= 3)
                {
                    c -= 3;
                    b = true;
                }
                while (c >= 2)
                {
                    c -= 2;
                    a = true;
                }
                if (c !== 0)
                    return false;
            }

            if (n === 1)
                break;

            if (primeHelper.isPrime(n))
                return false;            
        }
    }
    return n === 1 && a && b;
}

function F(max)
{
    let total = 0;
    for (let n = 2; n <= max; n++)
    {
        let v1 = isValid(n);

        if (v1)
        {
            console.log(v1);
            total++;
        }
    }   
    return total;
}

function $F(max)
{
    let total = 0;
    
    for (let i = 0; i < primes.length; i++)
    {
        let a = primes[i];

        let a2 = a*a;
        if (a2 > max)
            break;

        let a3 = a2*a;

        if (a2 * a3 <= max)
            total++;
        else
            break;

        for (let j = i+1; j < primes.length; j++)
        {
            let b = primes[j];
            let b2 = b * b;
            let b3 = b * b2;

            let done = true;
            
            if (a2 * b3 <= max)
            {
                done = false;
                total++;
            }
            if (a3 * b2 <= max)
            {
                done = false;
                total++;
            }
            if (done)
                break;
        }
    }

    return total;
}

// assert.equal(isValid(576), isValid2(576));
// assert.equal(isValid(64),  isValid2(64));
// assert.equal(isValid(128), true);
// assert.equal(isValid(432), true);
// assert.equal(isValid(256), true);
// assert.equal(isValid(1728), isValid2(1728));

// assert.equal(F(100), 2);
assert.equal(F(2E4), 130);
// assert.equal(F(3E6), 2014);

console.log('Done');