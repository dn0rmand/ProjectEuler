// Counting block combinations I
// -----------------------------
// Problem 114
// -----------
// A row measuring seven units in length has red blocks with a minimum length of three units placed on it,
// such that any two red blocks (which are allowed to be different lengths) are separated by at least one black square.
// There are exactly seventeen ways of doing this.

// How many ways can a row measuring fifty units in length be filled?

// NOTE: Although the example above does not lend itself to the possibility, in general it is permitted to mix
// block sizes. For example, on a row measuring eight units in length you could use red (3), black (1), and red (4).

const assert = require('assert');

const memoize = [];

function solve(length)
{
    if (length < 1)
        return 1;

    let total = memoize[length];
    if (total !== undefined)
        return total;

    total = 1; // No red

    if (length >= 3)
    {
        total += 1; // all red

        for(let red = 3; red < length; red++)
        {
            // Where ?

            for (let pos = 0; pos+red <= length; pos++)
            {
                let left = 1; // solve(pos-1); // -1 because needs a space
                let right= solve(length - (pos+red+1));  // +1 because needs a space

                total += left * right;
            }
        }
    }

    memoize[length] = total;
    return total;
}

assert.equal(solve(7), 17);

let answer = solve(50);
console.log('Answer is', answer);