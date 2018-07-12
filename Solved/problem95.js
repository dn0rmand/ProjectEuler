const assert = require('assert');
const isPrime= require('./tools/isPrime.js');

let MILLION = 1000000;
let memoize = new Map();

function *getDivisors(value)
{
    yield 1;

    if (isPrime(value))
        return;

    let max = Math.ceil(Math.sqrt(value));

    for(let i = 2; i < max; i++)
    {
        if ((value % i) == 0)
        {
            yield i;

            let res = value / i;
            if (res < max)
                max = res;

            if (res !== i)
                yield res;
        }
    }
}

function getNext(value)
{
    let result = memoize.get(value);
    if (result !== undefined)
        return result
        
    result = 0;

    for(let divisor of getDivisors(value))
        result += divisor;

    memoize.set(value, result);

    return result;
}

function getChainSize(value)
{
    let current = getNext(value);
    let size    = 1;
    let visited = new Map();

    while (current !== value)
    {
        if (visited.has(current))
            return -1;
            
        visited.set(current, 1);
        size++;
        current = getNext(current);
        if (current >= MILLION)
            return -1; // BAD
    }

    return size;
}

assert.equal(getNext(220), 284);
assert.equal(getNext(284), 220);

assert.equal(getNext(12496), 14288);
assert.equal(getNext(14288), 15472);
assert.equal(getNext(15472), 14536);
assert.equal(getNext(14536), 14264);
assert.equal(getNext(14264), 12496);

assert.equal(getChainSize(220), 2);
assert.equal(getChainSize(12496), 5);

console.log('All tests passed ... now lets do the serious stuff');

let maxSize = -1;
let minValue= -1;

for(let value = 1; value < MILLION; value++)
{
    let size = getChainSize(value);
    if (size > maxSize)
    {
        maxSize = size;
        minValue = value;
    }
}

console.log('Ssmallest member of the longest amicable chain with no element exceeding one million is ' + minValue);
console.log(minValue + ' has a chain of size ' + maxSize);