// Investigating the primality of numbers of the form 2n^2-1

// Problem 216
// Consider numbers t(n) of the form t(n) = 2n^2-1 with n > 1.
// The first such numbers are 7, 17, 31, 49, 71, 97, 127 and 161.
// It turns out that only 49 = 7*7 and 161 = 7*23 are not prime.
// For n ≤ 10000 there are 2202 numbers t(n) that are prime.

// How many numbers t(n) are prime for n ≤ 50,000,000 ?

const assert = require('assert');
const isMillerRabinPrime = require('@dn0rmand/project-euler-tools/src/millerRabin');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');
const prettyTime= require("pretty-hrtime");

const MAX = 50000000;
const MAX_PRIME = 10000;//Math.ceil(Math.sqrt(2*MAX*MAX-1));

console.log('Loading primes');
primeHelper.initialize(MAX_PRIME);
console.log('Primes loaded');

function solve(max, trace)
{
    let total = 0;
    let count = 0;
    let visited = [];

    for (let n = 2; n <= max; n++)
    {
        if (trace)
        {
            if (count-- === 0)
            {
                count = 1234;
                process.stdout.write(`\r${max-n}  `);
            }
        }
        if (visited[n])
            continue;

        let p = 2*n*n - 1;
        let isPrime = isMillerRabinPrime(p);
        if (isPrime)
        {
            total++;

            let x = n+p;
            while (x <= max)
            {
                visited[x] = 1
                x += p;
            }
        }
        else
        {
            primeHelper.factorize(p, (prime) => {
                let x = n+prime;
                while (x <= max)
                {
                    visited[x] = 1
                    x += prime;
                }
            });
        }
    }

    if (trace)
        process.stdout.write(`\r        \r`);
    return total;
}

assert.equal(solve(10000), 2202);
console.log('Test passed');

let timer = process.hrtime();
const answer = solve(MAX, true);
timer = process.hrtime(timer);
console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));
console.log('Should be 5437849');