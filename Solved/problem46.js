// Goldbach's other conjecture
// Problem 46 
// It was proposed by Christian Goldbach that every odd composite number can be written as the sum of a prime and 
// twice a square.

//  3 =  2
//  9 =  7 + 2×1^2
// 15 =  7 + 2×2^2
// 21 =  3 + 2×3^2
// 25 =  7 + 2×3^2
// 27 = 19 + 2×2^2
// 33 = 31 + 2×1^2

// It turns out that the conjecture was false.

// What is the smallest odd composite that cannot be written as the sum of a prime and twice a square?

const isPrime = require('tools/isPrime.js');

let primes= [];

function isOK(value)
{
    for (let i = primes.length; i > 0; i--)
    {
        let p = primes[i-1];
        let v = (value - p)/2;
        v = Math.sqrt(v);
        if (Math.floor(v) === Math.ceil(v))
            return true;
    }
    return false;
}

for (let i = 1; i < 33; i++)
{
    if (isPrime(i))
    {
        primes.push(i);
    }
}

for (let value = 33; ; value += 2)
{
    if (isPrime(value))
    {
        primes.push(value);
        continue;
    }
    if (! isOK(value))
    {
        console.log(value + " is the smallest odd composite that cannot be written as the sum of a prime and twice a square");
        break;
    }
}

