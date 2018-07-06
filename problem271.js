// Modular Cubes, part 1
// ---------------------
// Problem 271 
// -----------
// For a positive number n, define S(n) as the sum of the integers x, for which 1<x<n and
// x^3≡1 mod n.

// When n=91, there are 8 possible values for x, namely : 9, 16, 22, 29, 53, 74, 79, 81.
// Thus, S(91)=9+16+22+29+53+74+79+81=363.

// Find S(13082761331670030)

const assert = require('assert');
const bigInt = require('big-integer');
const MAX = bigInt("13082761331670030");

// 2 , 3 , 5 , 7 , 11 , 13 , 17 , 19 , 23 , 29 , 31 , 37 , 41 , 43

function S(max, primes)
{
    function solve(p)
    {
        let values = [];

        for (let i = 1; i < p; i++)
        {
            let i3 = i*i*i;
            if (i3 % p === 1)
                values.push(i);
        }

        return values;
    }

    let solutions = {};

    for (let p of primes)
        solutions[p] = solve(p);
    
    // Get Special values

    let cs = {};

    for (let p of primes)
    {
        let v = bigInt.one;
        for (let p2 of primes)
        {
            if (p2 === p)
                continue;
            v = v.times(p2);
        }

        let v2 = v.modInv(p);

        v = v.times(v2).mod(max);

        cs[p] = v;
    }

    // Build solutions

    let total = bigInt.zero;

    function inner(value, pIndex)
    {
        if (pIndex < primes.length)
        {
            let p = primes[pIndex];
            let c = cs[p];
            let sols = solutions[p];

            for(let s of sols)
            {
                let v = c.times(s);
                inner(value.plus(v), pIndex+1);
            }
        }
        else
        {
            value = value.mod(max);
            if (value.gt(1))
                total = total.plus(value);
        }
    }

    inner(bigInt.zero, 0);

    return total.toString();
}

assert.equal(S(91, [7, 13]), 363);

let answer = S(MAX, [2 , 3 , 5 , 7 , 11 , 13 , 17 , 19 , 23 , 29 , 31 , 37 , 41 , 43]);

console.log('answer is (4617456485273129588)', answer);
console.log('Done');
