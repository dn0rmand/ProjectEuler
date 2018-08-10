// Generalised Hamming Numbers
// ---------------------------
// Problem 204
// ----------- 
// A Hamming number is a positive number which has no prime factor larger than 5.
// So the first few Hamming numbers are 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15.
// There are 1105 Hamming numbers not exceeding 10^8.

// We will call a positive number a generalised Hamming number of type n, if it has no prime factor larger than n.
// Hence the Hamming numbers are the generalised Hamming numbers of type 5.

// How many generalised Hamming numbers of type 100 are there which don't exceed 10^9?

const assert = require('assert');
const primeHelper = require('../tools/primeHelper')();

primeHelper.initialize(100);

function calculate(maxValue, maxPrime)
{
    let visited = [undefined, 1];
    let count = 1;

    let primes = (() =>
    {
        let primes = [];
    
        for (let p of primeHelper.primes())
        {
            if (p > maxPrime)
                break;
            primes.push(p);
        }
        return primes;
    })();

    function inner()
    {
        for (let i = 0; i < visited.length; i++)
        {
            let v = visited[i];
            if (v === undefined)
                continue;

            for(let p of primes)
            {
                v = i * p;

                if (v <= maxValue)
                {
                    if (visited[v] !== 1)
                    {
                        visited[v] = 1;
                        count++;
                    }
                }
            }
        }
    }

    inner();
    return count;
}

console.time("X");
assert.equal(calculate(100000000, 5), 1105);
console.timeEnd("X");

console.time("X");
let answer = calculate(1000000000, 100);
console.timeEnd("X");

console.log("Answer to problem 204 is", answer);