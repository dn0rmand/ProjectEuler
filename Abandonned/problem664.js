const primeHelper = require('tools/primeHelper')();
const assert = require('assert');

const MAX = 1E6;

primeHelper.initialize(MAX, true);

const allPrimes = primeHelper.allPrimes();

function F(n)
{
    if (n+1 >= allPrimes.length)
        throw "ERROR";

    let p0 = allPrimes[n];
    let p1 = allPrimes[n+1];
    let result = p0 + (1 + p1)/2;

    console.log(`F(${n}) = ${result}`);
    return result;
}

assert.equal(F(0), 4);
assert.equal(F(1), 6);
assert.equal(F(2), 9);
assert.equal(F(3), 13);
assert.equal(F(11), 58);
assert.equal(F(125), 1173);

for (let i = 0; i < 20; i++)
    F(123+i);
