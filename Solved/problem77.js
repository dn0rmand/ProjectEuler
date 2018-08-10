const primes = require('../tools/primes.js')();
const assert = require('assert');

const allPrimes = [];
let   maxPrime  = 0;

function fillPrimes(n)
{
    while (maxPrime < n)
    {
        let p = primes.next().value;
        allPrimes.push(p);
        maxPrime = p;
    }
}

function WaysToWrite(v, usedPrimes)
{
    let count   = 0;
    let missed  = 0;
    let visited = {};

    function innerWaysToWrite(value, minPrime, usedPrimes)
    {
        if (value === 0)
        {
            let k = Array.from(usedPrimes);
            k.sort((a, b) => { return a-b; });
            let key = k.join('-');
            if (visited[key] === undefined)
            {
                visited[key] = 1;
                count++;
            }
            else   
                missed++;
            return;
        }

        for(let p of allPrimes)
        {
            if (p < minPrime)
                continue;

            if (p > value) 
                break; // Don't even try primes bigger than n
            usedPrimes.push(p);
            innerWaysToWrite(value-p, p, usedPrimes);
            usedPrimes.pop(p);
        }
    }

    fillPrimes(v);
    innerWaysToWrite(v, 1, []);
    return count;
} 

assert.equal(WaysToWrite(10), 5);

for (let i = 11; i < 200; i++)
{
    let count = WaysToWrite(i);
    if (count > 5000)
    {
        console.log(i + " is the first value which can be written as the sum of primes in over five thousand different ways");
        break;
    }
}

console.log('Done');