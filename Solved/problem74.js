// Digit factorial chains
// Problem 74 
// The number 145 is well known for the property that the sum of the factorial of its digits is equal to 145:

// 1! + 4! + 5! = 1 + 24 + 120 = 145

// Perhaps less well known is 169, in that it produces the longest chain of numbers that link back to 169; it turns out that 
// there are only three such loops that exist:

// 169 → 363601 → 1454 → 169
// 871 → 45361 → 871
// 872 → 45362 → 872

// It is not difficult to prove that EVERY starting number will eventually get stuck in a loop. For example,

// 69 → 363600 → 1454 → 169 → 363601 (→ 1454)
// 78 → 45360 → 871 → 45361 (→ 871)
// 540 → 145 (→ 145)

// Starting with 69 produces a chain of five non-repeating terms, but the longest non-repeating chain with a starting number 
// below one million is sixty terms.

// How many chains, with a starting number below one million, contain exactly sixty non-repeating terms?

const assert = require('assert');

let memoize = [];

function factorial(n)
{
    if (n < 2)
        return 1;

    let result = memoize[n];
    if (result !== undefined)
        return result;

    result = n * factorial(n-1);
    memoize[n] = result;
    return result;
}

function digitFactorial(n)
{
    let result = 0;

    while (n > 0)
    {
        let d = n % 10;
        n = (n-d)/10;
        result += factorial(d);
    }
    return result;
}

function hasLoopSize(value, size)
{
    let visited = new Map();
    let index   = 0;

    while (! visited.has(value))
    {
        visited.set(value, index++);
        value = digitFactorial(value);
        if (index > size)
            return false;
    }
    return index === size;
}

assert.equal(digitFactorial(145), 145);
assert.equal(digitFactorial(169), 363601);
assert.equal(digitFactorial(363601), 1454);
assert.equal(digitFactorial(1454), 169);

assert.ok(hasLoopSize(69, 5));

let count = 0;
for (let i = 1; i < 1000000; i++)
{
    if (hasLoopSize(i, 60))
        count++;
}

console.log(count + " chains, with a starting number below one million, contain exactly sixty non-repeating terms");
