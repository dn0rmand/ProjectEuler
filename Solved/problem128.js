const primeHelper = require('tools/primeHelper')();
const assert = require('assert');

const TARGET = 2000;

primeHelper.initialize(1E6);

const isPrime = primeHelper.isPrime;

let count = 0;
let answer = 0;

function addValue(value)
{
    count++;

    // console.log(count,':',value);

    if (count === 10)
        assert.equal(value, 271)

    if (count === TARGET)
    {
        answer = value;
        return true;
    }

    return false;
}

function solve()
{
    addValue(1);
    addValue(2);

    let value = 8;

    for (let layer = 12; count < TARGET; layer += 6)
    {
        if (isPrime( layer - 1) &&
            isPrime( layer + 1) &&
            isPrime( layer + layer + 5))
        {
            if (addValue(value))
                break;
        }

        value = value + layer;

        if (isPrime(layer - 1) &&
            isPrime(layer + layer - 7) &&
            isPrime(layer + 5))
        {
            if (addValue(value-1))
                break;
        }
    }
}

solve();
console.log('Answer is', answer);