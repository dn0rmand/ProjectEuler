// Totient maximum
// Problem 69 
// Euler's Totient function, φ(n) [sometimes called the phi function], is used to determine the number of numbers less 
// than n which are relatively prime to n. For example, as 1, 2, 4, 5, 7, and 8, are all less than nine and relatively prime 
// to nine, φ(9)=6.

// n	Relatively Prime	φ(n)	n/φ(n)
// 2	1	                1       2
// 3	1,2	                2	    1.5
// 4	1,3	                2       2
// 5	1,2,3,4	            4       1.25
// 6	1,5	                2	    3
// 7	1,2,3,4,5,6	        6	    1.1666...
// 8	1,3,5,7	            4	    2
// 9	1,2,4,5,7,8	        6	    1.5
// 10	1,3,7,9 	        4	    2.5
// It can be seen that n=6 produces a maximum n/φ(n) for n ≤ 10.

// Find the value of n ≤ 1,000,000 for which n/φ(n) is a maximum.

const assert = require("assert");
const isPrime = require("./tools/isPrime.js");

const primes = [];
const primeTable = new Map();

function generatePrimes()
{
    for (let n = 1; n <= 1000000; n++)
    {
        if (isPrime(n))
        {
            primes.push(n);
            primeTable.set(n,1);
        }
    }
}

function PHI(n)
{
    function isPrime(value)
    {
        return (primeTable.has(value));
    }

    if (n === 1)
        return 1;

    if (isPrime(n))
        return n-1;
    let pIndex    = 0;
    let p         = primes[0];
    let value     = n;
    let phi       = 1;
    let numerator = 1;
    let divisor   = 1;
    
    while (value > 1)
    {
        if ((value % p) === 0)
        {
            let c = 0;
            while ((value % p) === 0)
            {
                c++;
                value = value / p;
            }
            phi *= (p-1);
            if (c > 1)
            {
                numerator= n;
                divisor *= p;
            }
            if (value === 1)
                break;

            if (isPrime(value))
            {
                phi *= (value-1);
                break;
            }

            p = primes[++pIndex];
        }
        else
            p = primes[++pIndex];
    }

    return phi * numerator / divisor;
}

function Test()
{
    assert.equal(PHI(2), 1);
    assert.equal(PHI(3), 2);
    assert.equal(PHI(4), 2);
    assert.equal(PHI(5), 4);
    assert.equal(PHI(6), 2);
    assert.equal(PHI(7), 6);
    assert.equal(PHI(8), 4);
    assert.equal(PHI(9), 6);
    assert.equal(PHI(10),4);
}

generatePrimes();
Test();

let max = 0;
let nMax = 0;

for (let n = 1; n <= 1000000; n++)
{
    let phi = PHI(n);
    let value = n / phi;
    if (value > max)
    {
        max = value;
        nMax = n;
    }
}

console.log("The value of n ≤ 1,000,000 for which n/φ(n) is a maximum is "+nMax);