// Diophantine equation
// Problem 66 
// Consider quadratic Diophantine equations of the form:

// x^2 – Dy^2 = 1

// For example, when D=13, the minimal solution in x is 649^2 – 13×180^2 = 1.

// It can be assumed that there are no solutions in positive integers when D is square.

// By finding minimal solutions in x for D = {2, 3, 5, 6, 7}, we obtain the following:

// 3^2 – 2×2^2 = 1
// 2^2 – 3×1^2 = 1
// 9^2 – 5×4^2 = 1
// 5^2 – 6×2^2 = 1
// 8^2 – 7×3^2 = 1

// Hence, by considering minimal solutions in x for D ≤ 7, the largest x is obtained when D=5.

// Find the value of D ≤ 1000 in minimal solutions of x for which the largest value of x is obtained.

const assert = require('assert');
const prettyHrtime = require("pretty-hrtime");

let sqrtTime = 0;

function sqrt(root)
{
    let start = process.hrtime();
    try
    {
        if ((root & 3) != 0 && ((root-1) & 7) != 0)
            return;

        let v = Math.sqrt(root);
        if (Math.floor(v) === v)
            return v;
    }
    finally
    {
        let end = process.hrtime(start);

        sqrtTime += end[1];
    }
}

function getMinX(D)
{
    let previous;
    let value = D+1;

    // Find first Square
    while(true)
    {
        previous = sqrt(value);

        if (previous !== undefined)
            break;
        else
            value += D;
    }

    // Keep going now that we have a square
    do
    {
        let v2 = sqrt((value-1)/D);
        if (v2 !== undefined)
            return previous;

        let next, offset;

        do 
        {
            previous = previous+1;
            next     = previous*previous;
            offset   = next - value;
        }
        while ((offset % D) != 0)

        value = next;
    }
    while(true);
}

function solve(min, max)
{
    let result = min;
    let maxX   = -1;

    for(let D = min; D <= max; D++)
    {
        if (sqrt(D) !== undefined)
            continue;

        let x = getMinX(D);
        if (x > maxX)
        {
            result = D;
            maxX   = x;
        }
    }

    return result;
}

let start = process.hrtime();

assert.equal(getMinX(13), 649);
assert.equal(solve(2, 7), 5);
assert.equal(getMinX(53), 66249);

let result = solve(0, 60);

let end = process.hrtime(start);

console.log("Tests executed  in " + prettyHrtime(end, {verbose:true}));

let percent = (sqrtTime / end[1])*100;

end[0] = 0;
end[1] = sqrtTime;
console.log("Sqrt time is "+ prettyHrtime(end, {verbose:true}));
console.log("It's " + percent + " %");

// let result = solve(54,1000);

// console.log(result + " is the value of D ≤ 1000 in minimal solutions of x for which the largest value of x is obtained");