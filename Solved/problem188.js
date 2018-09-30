// The hyperexponentiation of a number
// -----------------------------------
// Problem 188
// -----------
// The hyperexponentiation or tetration of a number a by a positive integer b, denoted by a↑↑b or ba,
// is recursively defined by:

// a↑↑1 = a,
// a↑↑(k+1) = a↑(a↑↑k).

// Thus we have e.g. 3↑↑2 = 3↑3 = 27, hence 3↑↑3 = 3↑27 = 7625597484987 and 3↑↑4 is roughly 10↑3.6383346400240996E12.

// Find the last 8 digits of 1777↑↑1855.

const bigInt = require('big-integer');
const assert = require('assert');

const MODULO = 1E8;

function hyperexponentiation(value, power)
{
    let result = 1;

    value = bigInt(value);

    while (power-- > 0)
    {
        result = value.modPow(result, MODULO).valueOf();
    }

    return result;
}


assert.equal(hyperexponentiation(3, 3), 97484987);
assert.equal(hyperexponentiation(3, 4), 739387);
assert.equal(hyperexponentiation(3, 20), 64195387);

assert.equal(hyperexponentiation(177, 185), 51550897);

console.log('Test passed');

let answer = hyperexponentiation(1777, 1855);

console.log('Answer is', answer);
