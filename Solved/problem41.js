// https://projecteuler.net/problem=41
//
// Pandigital prime
// Problem 41 

// We shall say that an n-digit number is pandigital if it makes use of all the digits 1 to n exactly once. 
// For example, 2143 is a 4-digit pandigital and is also prime.

// What is the largest n-digit pandigital prime that exists?

const isPrime = require('@dn0rmand/project-euler-tools/src/isPrime.js');

function combinaisons(max)
{
    let used    = [];
    let maxPrime= 0;

    function innerCombinaisons(current, length)
    {
        if (length >= max)
        {
            if (current > maxPrime && isPrime(current))
                maxPrime = current; // The first one we find should be IT
            return;
        }

        for(let i = 0; maxPrime === 0 && i < max; i++)
        {
            let d = max-i;
            if (used[d])
                continue;

            used[d] = 1;
            innerCombinaisons(current*10 + d, length+1)
            used[d] = 0;
        }
    }

    innerCombinaisons(0, 0);

    return maxPrime;
}

for (let i = 9; i > 3; i--) // 3 because we know 4 has 2143
{
    let maxPrime = combinaisons(i);
    if (maxPrime !== 0)
    {
        console.log('The largest n-digit pandigital prime is ' + maxPrime);
        break;
    }
}

