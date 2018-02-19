// Square root digital expansion
// Problem 80 
// It is well known that if the square root of a natural number is not an integer, then it is irrational. 
// The decimal expansion of such square roots is infinite without any repeating pattern at all.

// The square root of two is 1.41421356237309504880..., and the digital sum of the first one hundred decimal digits is 475.

// For the first one hundred natural numbers, find the total of the digital sums of the first one hundred decimal digits for 
// all the irrational square roots.

const bigNumber = require('bignumber.js');

bigNumber.set({ 
    ROUNDING_MODE: 1,
    DECIMAL_PLACES: 110
});

let total = 0;
for (let v = 2; v <= 100; v++)
{
    let root = bigNumber(v).sqrt();
    if (root.isInteger())
        continue;

    let value = root.toString();
    let sum   = 0;
    let count = 0
    for(let c of value)
    {
        if (c === '.')
            continue;
        
        sum += +c;
        if (++count === 100)
            break;
    }
    total += sum;
}

console.log('Total of the digital sums of the first one hundred decimal digits of the irrational square roots is ' + total);