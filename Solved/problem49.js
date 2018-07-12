// Prime permutations
// Problem 49 
// The arithmetic sequence, 1487, 4817, 8147, in which each of the terms increases by 3330, 
// is unusual in two ways: (i) each of the three terms are prime, and, (ii) each of the 4-digit numbers are 
// permutations of one another.

// There are no arithmetic sequences made up of three 1-, 2-, or 3-digit primes, exhibiting this property, 
// but there is one other 4-digit increasing sequence.

// What 12-digit number do you form by concatenating the three terms in this sequence?

const isPrime = require('./tools/isPrime.js');

function sameDigits(v1, v2, v3)
{
    v1 = +(v1.toString().split('').sort().join(''));
    v2 = +(v2.toString().split('').sort().join(''));
    v3 = +(v3.toString().split('').sort().join(''));
    return v1 === v2 && v1 === v3;
}

function *findSolutions()
{
    for(let p1 = 1000; p1 <= 9999; p1++)
    {
        if (p1 === 1487) // Ignore this one since that's not the one we're looking for
            continue;

        if (isPrime(p1))
        {
            let p2 = p1 + 3330;
            let p3 = p2 + 3330;
            
            if (sameDigits(p1, p2, p3))
            {
                if (isPrime(p2) && isPrime(p3))
                    yield p1 + '' + p2 + '' + p3;
            }
        }
    }
}

let solutions = findSolutions();

for (let solution = solutions.next(); ! solution.done; solution = solutions.next())
{
    console.log('The 12-digit number formed by concatenating the three terms is ' + solution.value);
}
