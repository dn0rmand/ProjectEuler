const assert = require('assert');
const bigInt = require('big-integer');
const RADIX = 14;

function isSteady(value, modulo)
{
    let square = value.square().mod(modulo);

    if (square.eq(value))
    {
        // console.log(n.toString(RADIX));
        return true;
    }
    else
        return false;
}

function sumDigits(value)
{
    let total = 0;

    while (! value.isZero())
    {
        let digit = value.mod(RADIX);
        value = value.minus(digit).divide(RADIX);
        total += digit;
    }

    return total;
}

function innerSolve(max, start)
{
    let total = 0;

    let modulo  = bigInt(RADIX);
    let current = bigInt(start);

    if (isSteady(current, modulo))
        total += start;

    for (let len = 2; len <= max; len++)
    {
        let factor = modulo;
        modulo = modulo.times(RADIX);
        let found = false;
        for (let digit = 1; digit < RADIX; digit++)
        {
            let next = current.plus(factor.times(digit));
            if (isSteady(next, modulo))
            {
                found = true;
                current = next;
                total += sumDigits(current);
                break;
            }
        }
    }

    return total;
}

function solve(max)
{
    let total = 1;

    total += innerSolve(max, 7); // 304015089
    total += innerSolve(max, 8);

    return total;
}

assert.equal(solve(9), 582);

let value = solve(10000);

console.log("Result is " + value.toString(RADIX));