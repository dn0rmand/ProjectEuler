const assert = require('assert');

function calculate(values)
{
    let t = 1;
    let m = values.length;
    for (let p = 1; p <= m; p++)
    {
        t *= (values[p-1] ** p);
    }

    return t;
}

function round(value, precision)
{
    return value;//+(value.toFixed(precision));
}

function removeOffset(value, offset, precision)
{
    return value - offset; // +((value - offset).toFixed(precision));
}

function P(m)
{
    const values = Array(m).fill(1);

    const PRECISION   = 9;
    const SPEED_INDEX = 4;
    const SPEED       = Math.pow(10, SPEED_INDEX);

    const OFFSET = Math.pow(10, -PRECISION);

    let max = 1;
    for (let i = 0; i < m-1; i++)
    {
        let j = m-1-i;
        if (i >= j)
            break;

        let factor = SPEED;
        let fixed  = PRECISION-SPEED_INDEX;

        while (factor > 1)
        {
            factor /= 10;
            fixed++;

            const offset = round(OFFSET * factor, fixed);

            let maxB = removeOffset(values[j], offset, fixed);
            let maxA = removeOffset(2, maxB, fixed);

            values[i] = maxA;
            values[j] = maxB;
            max = calculate(values);

            while (true)
            {
                let A = removeOffset(values[i], offset, fixed);
                let B = removeOffset(2, A, fixed);

                assert.equal(A+B, 2);

                values[i] = A;
                values[j] = B;

                let p = calculate(values);
                if (p < max)
                {
                    values[i] = maxA;
                    values[j] = maxB;
                    break;
                }
                else
                {
                    max   = p;
                    maxA  = values[i];
                    maxB  = values[j];
                }
            }
        }
    }

    return Math.floor(max);
}

function solve(min, max)
{
    let total = 0;
    for (let m = 2; m <= max; m++)
    {
        let p = P(m);
        console.log(m,'->',p);
        total += p;
    }
    return total;
}

console.log('P(15) =', P(15));

assert.equal(P(10), 4112);

let answer = solve(2, 15);

console.log('Answer is', answer, '(371048293)');

/*
2 -> 1
3 -> 1
4 -> 2
5 -> 6
6 -> 15
7 -> 46
8 -> 169
9 -> 759
10 -> 4112
11 -> 26998
12 -> 214912
13 -> 2074180
14 -> 24273250
15 -> 344453842

2 -> 1
3 -> 1
4 -> 2
5 -> 6
6 -> 15
7 -> 46
8 -> 169
9 -> 759
10 -> 4112
11 -> 26998
12 -> 214912
13 -> 2074179
14 -> 24273249
15 -> 344453832
*/