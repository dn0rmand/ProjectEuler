// Largest integer divisible by two primes
// ---------------------------------------
// Problem 347 
// -----------
// The largest integer ≤ 100 that is only divisible by both the primes 2 and 3 is 96, as 96=32*3=2^5*3. 
// For two distinct primes p and q let M(p,q,N) be the largest positive integer ≤N only divisible by both 
// p and q and M(p,q,N)=0 if such a positive integer does not exist.

// E.g. M(2,3,100)=96.
// M(3,5,100)=75 and not 90 because 90 is divisible by 2 ,3 and 5.
// Also M(2,73,100)=0 because there does not exist a positive integer ≤ 100 that is divisible by both 2 and 73.

// Let S(N) be the sum of all distinct M(p,q,N). S(100)=2262.

// Find S(10 000 000).

const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');
const assert = require("assert");

const MAX = 10000000

primeHelper.initialize(MAX);

function M(p, q, N)
{
    let P = 1;
    let max = 0;

    while (true)
    {
        P = P * p;

        if (P * q > N)
            break;

        let Q = 1;
        while (true)
        {
            Q = Q * q;

            let v = P*Q;

            if (v > N)
                break;
            if (max < v)
                max = v;
        }
    }

    return max;
}

function S(N)
{
    let primes = primeHelper.allPrimes();
    let total  = 0;

    for (let i = 0; i < primes.length; i++)
    {
        let p = primes[i];

        if (p*p > N)
            break;

        for (let j = i+1; j < primes.length; j++)
        {
            let q = primes[j];

            if (p*q > N)
                break;

            total += M(p, q, N);
        }
    }

    return total;
}

assert.equal(M(2,3,100), 96);
assert.equal(M(3,5,100), 75);
assert.equal(M(2,73,100), 0);

assert.equal(S(100), 2262);

console.log("S(10 000 000) = " + S(MAX));