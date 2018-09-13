// Number Rotations
// ----------------
// Problem 168
// -----------
// Consider the number 142857. We can right-rotate this number by moving the last digit (7) to the front of it, giving us 714285.
// It can be verified that 714285=5×142857.
// This demonstrates an unusual property of 142857: it is a divisor of its right-rotation.

// Find the last 5 digits of the sum of all integers n, 10 < n < 10^100, that have this property.

const bigInt = require('big-integer');
const MODULO = 100000;

function sumSameDigit(digit)
{
    let value = digit*10 + digit;
    let total = 0;

    for (let i = 2; i <= 100; i++)
    {
        total = (total + value) % MODULO;

        value = ((value * 10) + digit) % MODULO;
    }

    return total;
}

function specialSum()
{
    let total = 0;

    for (let power = 1; power < 100; power++)
    {
        let C = bigInt("1E"+power);

        for (let factor = 2; factor < 10; factor++)
        {
            let A = C.minus(factor);
            let B = 10*factor - 1;

            for (let digit = 1; digit < 10; digit++)
            {
                let x = A.times(digit);
                if (x.mod(B).isZero())
                {
                    x = x.divide(B);

                    let v1 = x.times(10).plus(digit);
                    let v2 = x.plus(C.times(digit));

                    if (v2.greater(v1) && v1.toString().length === v2.toString().length)
                    {
                        v1 = v1.mod(MODULO).valueOf();
                        total = (total + v1) % MODULO;
                    }
                }
            }
        }
    }

    return total;
}

function solve()
{
    let total = 0;

    for (let digit = 1; digit <= 9; digit++)
        total = (total + sumSameDigit(digit)) % MODULO;

    total = (total + specialSum()) % MODULO;

    return total;
}

let total = solve();
console.log('Answer', total);
