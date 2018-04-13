// Prime cube partnership
// Problem 131 
// There are some prime values, p, for which there exists a positive integer, n, such that the expression n^3 + n^2*p is a 
// perfect cube.

// For example, when p = 19, 83 + 82×19 = 123.

// What is perhaps most surprising is that for each prime with this property the value of n is unique, and there are only 
// four such primes below one-hundred.

// How many primes below one million have this remarkable property?

// FAST
// p = (i+1)^3 - i^3
// BRUTE
// n^3 + n^2*p = x^3
// p = (x^3-n^3)/n^2 = x^3/n^2 - n
// p = n * (x^3/n^3 - 1) = n*(x^3 - n^3)/n^2
//
// p is Prime so either n = 1 and (x^3-1) is Prime or n is Prime and (x^3/n^3 - 1)=1
// 
// n = 1 and (x^3/n^3-1) is Prime => x^3-1 is Prime and less than MAX
//
// n is Prime and (x^3/n^3 - 1) = 1 => (x^3 - n^3) = n^3 => x^3 = 2*n^3
// => 2*n^3 is a CUBE

const primes = require("./tools/primes.js");
const bigInt = require('big-integer');
const assert = require('assert');

const MILLION = 1000000

const primeList = new Map();

function loadPrimes()
{
    for(let p of primes())
    {
        if (p >= MILLION)
            break;
        primeList.set(p, 1);
    }
}

function isPrime(p)
{
    return primeList.has(p);
}

function bruteForce(max)
{
    let found = new Map();
    let count = 0;
    let duplicates = 0;

    for(let n = 1; n < max; n++)
    for(let x = n+1; x < max; x++)
    {
        let p;
        let n2 = n*n;

        if (x > 208063)
        {
            // need to use bigInt
            let x3 = bigInt(x).times(x).times(x);
        
            p = x3.divide(n2).minus(n).valueOf();

            if (p >= max)
                break;

            let m = x3.mod(n2);
        
            if (! m.isZero())
                continue;
        }
        else
        {
            let x3 = x*x*x;            

            p = (x3 / n2)-n;

            if (p >= max)
                break;

            if ((x3 % n2) != 0)
                continue;
        }

        if (isPrime(p))
        {
            if (found.has(p))
            {
                duplicates++;
                continue;
            }

            count++;
            found.set(p, 1);
        }
    }

    if (duplicates !== 0)
        console.log(duplicates);
    return count;
}

function solve(max)
{
    let count = 0;
    for (let i = 1;; i++)
    {
        let value = i+1;
        value = (value*value*value) - (i*i*i);
        if (value >= max)
            break;
        if (isPrime(value))
            count++;
    }
    return count;
}

loadPrimes();

assert.equal(bruteForce(100), 4);
let r1 = bruteForce(MILLION);
console.log(r1 + " primes below one million have this remarkable property");

assert.equal(solve(100), 4);
let result = solve(MILLION);
console.log(result + " primes below one million have this remarkable property");
