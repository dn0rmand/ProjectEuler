// Consecutive prime sum
// Problem 50 
// The prime 41, can be written as the sum of six consecutive primes:

// 41 = 2 + 3 + 5 + 7 + 11 + 13
// This is the longest sum of consecutive primes that adds to a prime below one-hundred.

// The longest sum of consecutive primes below one-thousand that adds to a prime, contains 21 terms, and is equal to 953.

// Which prime, below one-million, can be written as the sum of the most consecutive primes?

const primes = require('@dn0rmand/project-euler-tools/src/primes.js');
const isPrime = require('@dn0rmand/project-euler-tools/src/isPrime.js');

let allPrimes = [];

// Preload all primes below 1 million

let iterator = primes();
for (let p = iterator.next(); ! p.done; p = iterator.next())
{
    if (p.value >= 1000000)
        break;
    allPrimes.push(p.value);
}

let indexMin = 0, indexMax = 0;
let sum;

function makeSum()
{
    sum = 0;
    indexMin = indexMax = 0;
    for (let i = 0; i < allPrimes.length ; i++)
    {
        let n = sum + allPrimes[i];
        if (n < 1000000)
        {
            indexMax = i;
            sum = n;
        }
        else
            break;
    }
}

makeSum();

while (! isPrime(sum))
{
    let s = sum - allPrimes[indexMin];
    if (isPrime(s))
    {
        sum = s;
        indexMin++;
        break;
    }
    s = sum - allPrimes[indexMax];
    if (isPrime(s))
    {
        sum = s;
        indexMax--;
        break;
    }
    sum -= allPrimes[indexMin++];
}

console.log(sum + ' is a prime made of the sum of ' + (indexMax-indexMin) + ' consecutive primes');