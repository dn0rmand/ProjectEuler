// Cyclic numbers
// --------------
// Problem 358
// -----------
// A cyclic number with n digits has a very interesting property:
// When it is multiplied by 1, 2, 3, 4, ... n, all the products have exactly the same digits, in the same order,
// but rotated in a circular fashion!

// The smallest cyclic number is the 6-digit number 142857 :
// 142857 × 1 = 142857
// 142857 × 2 = 285714
// 142857 × 3 = 428571
// 142857 × 4 = 571428
// 142857 × 5 = 714285
// 142857 × 6 = 857142

// The next cyclic number is 0588235294117647 with 16 digits :
// 0588235294117647 × 1 = 0588235294117647
// 0588235294117647 × 2 = 1176470588235294
// 0588235294117647 × 3 = 1764705882352941
// ...
// 0588235294117647 × 16 = 9411764705882352

// Note that for cyclic numbers, leading zeros are important.

// There is only one cyclic number for which, the eleven leftmost digits are 00000000137 and the five rightmost
// digits are 56789 (i.e., it has the form 00000000137...56789 with an unknown number of digits in the middle).
// Find the sum of all its digits.

const assert = require('assert');
const primeHelper = require('tools/primeHelper')();

const MAX_PRIME = 8E8;
primeHelper.initialize(MAX_PRIME, true);

function checkPrime(p)
{
    let v = 56789 * p;
    if (v % 100000 === 99999)
    {
        v = Math.floor(1E11/p);
        if (v === 137)
            return true;
    }
    return false;
}

function solve()
{
    let allPrimes = primeHelper.allPrimes();
    let prime     = -1;

    for (let i = allPrimes.length; i > 0; i--)
    {
        let p = allPrimes[i-1];

        if (checkPrime(p))
        {
            prime = p;
            break;
        }
    }

    assert.notEqual(prime, -1);

    let total    = 0;
    let numerator= 1;
    for (let i = 1; i < prime; i++)
    {
        numerator *= 10;
        let digit = Math.floor(numerator / prime);
        numerator = numerator - digit*prime;
        total += digit;
    }

    return total;
}

let answer = solve();
assert.equal(answer, 3284144505);
console.log('Answer is', answer);

