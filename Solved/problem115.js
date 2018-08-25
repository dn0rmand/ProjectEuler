// Counting block combinations II
// ------------------------------
// Problem 115
// -----------
// NOTE: This is a more difficult version of Problem 114.

// A row measuring n units in length has red blocks with a minimum length of m units placed on it,
// such that any two red blocks (which are allowed to be different lengths) are separated by at least one black square.

// Let the fill-count function, F(m, n), represent the number of ways that a row can be filled.

// For example, F(3, 29) = 673135 and F(3, 30) = 1089155.

// That is, for m = 3, it can be seen that n = 30 is the smallest value for which the fill-count function
// first exceeds one million.

// In the same way, for m = 10, it can be verified that F(10, 56) = 880711 and F(10, 57) = 1148904,
// so n = 57 is the least value for which the fill-count function first exceeds one million.

// For m = 50, find the least value of n for which the fill-count function first exceeds one million.

const assert = require('assert');

function F(m, n)
{
    const memoize = [];

    function fill(length)
    {
        if (length < 1)
            return 1;

        let total = memoize[length];
        if (total !== undefined)
            return total;

        total = 1; // No red

        if (length >= m)
        {
            total += 1; // all red

            for(let red = m; red < length; red++)
            {
                // Where ?

                for (let pos = 0; pos+red <= length; pos++)
                {
                    let left = 1; // solve(pos-1); // -1 because needs a space
                    let right= fill(length - (pos+red+1));  // +1 because needs a space

                    total += left * right;
                }
            }
        }

        memoize[length] = total;
        return total;
    }

    return fill(n);
}

function solve(size)
{
    let length = 5*size; // starting point

    let count = F(size, length);
    while (count > 1000000)
    {
        length -= size;
        count = F(size, length);
    }

    while (count < 1000000)
    {
        length++;
        count = F(size, length);
    }

    return length;
}

assert.equal(F(3, 29), 673135);
assert.equal(F(3, 30), 1089155);
assert.equal(F(10, 56), 880711);
assert.equal(F(10, 57), 1148904);

assert.equal(solve(3), 30);
assert.equal(solve(10), 57);

let answer = solve(50);
console.log('Answer is', answer);