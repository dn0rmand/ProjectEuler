// Strong Repunits
// ---------------
// Problem 346 
// -----------
// The number 7 is special, because 7 is 111 written in base 2, and 11 written in base 6 
// (i.e. 710 = 116 = 1112). In other words, 7 is a repunit in at least two bases b > 1.

// We shall call a positive integer with this property a strong repunit. 
// It can be verified that there are 8 strong repunits below 50: {1,7,13,15,21,31,40,43}. 
// Furthermore, the sum of all strong repunits below 1000 equals 15864.

// Find the sum of all strong repunits below 10^12.

const assert = require('assert');
const bigInt = require('big-integer');

const MAX = 1000000000000;

function solve(max, trace)
{
    let MAXBASE = Math.ceil(Math.sqrt(max));

    let extra = bigInt(1);  // 1 is a strong repunit
    let total = 0;
    let counted = new Set();

    for(let base = 2; base < MAXBASE; base++)
    {
        let value = 1 + base + base*base;

        while (value < max)
        {
            if (!counted.has(value))
            {
                counted.add(value);

                if(Number.MAX_SAFE_INTEGER < (total+value))
                {
                    extra = extra.plus(total).plus(value);
                    total = 0;
                }
                else
                    total += value;
            }
            value = value*base + 1;
        }
    }

    return extra.plus(total).toString();
}
 
assert.equal(solve(1000), "15864");
assert.equal(solve(10000), "450740");
assert.equal(solve(100000), "12755696");
assert.equal(solve(1000000), "372810163");
assert.equal(solve(10000000), "11302817869");

console.log("Test passed");

let answer = solve(MAX, true);

console.log("Answer is", answer);
