const isNumberPrime = require('is-number-prime');
const primes = require('tools/primes.js')

function solve(maxValue)
{
    let primeIterator = primes();

    let p   = primeIterator.next().value; 
    let sum = 0;

    while (p < maxValue)
    {
        sum += p;      
        p    = primeIterator.next().value; 
    }

    console.log("Sum of the primes < " + maxValue + " is " + sum);
}

solve(10);
solve(2000000);