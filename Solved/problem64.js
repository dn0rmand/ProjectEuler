const assert = require('assert');
const squareRoot = require('../tools/squareRoot.js');

function getPeriod(n, length)
{
    let values = [];
    let fractions = squareRoot(n);
    for(let d of fractions)
    {
        values.push(d);
        if (values.length >= length)
            break;
    }
    if (values.length !== length)
        return 0;

    // Find period length
    for (let l = 1; l < length; l++)
    {
        let ok = true;
        for (let i = l; i < length; i++)
        {
            if (values[i-l] !== values[i])
            {
                ok = false;
                break;
            }
        }
        if (ok)
            return l;
    }

    return -1;
}

const digit_count = 250;

assert.equal(getPeriod(2, digit_count), 1);
assert.equal(getPeriod(3, digit_count), 2);
assert.equal(getPeriod(5, digit_count), 1);
assert.equal(getPeriod(6, digit_count), 2);
assert.equal(getPeriod(7, digit_count), 4);
assert.equal(getPeriod(8, digit_count), 2);
assert.equal(getPeriod(10, digit_count), 1);
assert.equal(getPeriod(11, digit_count), 2);
assert.equal(getPeriod(12, digit_count), 2);
assert.equal(getPeriod(13, digit_count), 5);

let count = 0;

for (let x = 1; x <= 10000; x++)
{
    let period = getPeriod(x, digit_count);
    if (period === -1)
    {
        console.log('BAD');
        break;
    }
    if ((period & 1) === 1)
        count++;
}

console.log(count + " odd periods")