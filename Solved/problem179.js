// Consecutive positive divisors
// Problem 179 
// Find the number of integers 1 < n < 10^7, for which n and n + 1 have the same number of positive divisors. 
// For example, 14 has the positive divisors 1, 2, 7, 14 while 15 has 1, 3, 5, 15.

const divisorCount = require('tools/divisorsCount.js');
const assert = require('assert');

assert.equal(divisorCount(14), 4);
assert.equal(divisorCount(15), 4);

let previous = 0;
let count    = 0;

for (let i = 2; i <= 10000000; i++)
{
    let divisors = divisorCount(i);
    if (divisors === previous)
        count++;
    previous = divisors;
}

console.log(count + " number of integers 1 < n < 10^7, for which n and n + 1 have the same number of positive divisors.");
console.log('done');