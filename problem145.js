// How many reversible numbers are there below one-billion?
// --------------------------------------------------------
// Problem 145 
// -----------
// Some positive integers n have the property that the sum [ n + reverse(n) ] consists entirely of odd (decimal) digits. 
// For instance, 36 + 63 = 99 and 409 + 904 = 1313. We will call such numbers reversible; 
// so 36, 63, 409, and 904 are reversible. Leading zeroes are not allowed in either n or reverse(n).

// There are 120 reversible numbers below one-thousand.

// How many reversible numbers are there below one-billion (10^9)?

const assert = require('assert');

const MAX = 1000000000;

function reverse(n)
{
    let rev = 0;

    while (n > 0)
    {
        let d = n % 10;

        n = (n-d) / 10;
        rev = (rev * 10) + d
    }

    return rev;
}

function isReversible(n)
{
    if ((n % 10) === 0)
        return false;

    let r = reverse(n);

    let v = n+r;
    
    while(v > 0)
    {
        let d = v % 10;
        if ((d & 1) === 0)
            return false;
        v = (v-d)/10;
    }

    return true;
}

function solve(max)
{
    let total = 0;
    for(let i = 1; i < max; i++)
        if (isReversible(i))
            total++;

    return total;
}

assert.equal(isReversible(36), true);
assert.equal(isReversible(63), true);
assert.equal(isReversible(409), true);
assert.equal(isReversible(904), true);

assert.equal(solve(1000), 120);
console.time("145");
let answer = solve(MAX);
console.timeEnd("145");
console.log("There are", answer, "reversible numbers are there below one-billion");