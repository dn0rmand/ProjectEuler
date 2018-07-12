// Darts
// -----
// Problem 109
// -----------

const assert = require('assert');

let memoize = {};

function checkout(score)
{
    function dart1()
    {
        let total = 0;
        for (let value1 = 1; value1 <= 20; value1++)
        {
            total += dart2(  value1, value1+'S'); // Single
            total += dart2(2*value1, value1+'D'); // Double
            total += dart2(3*value1, value1+'T'); // Triple
        }

        total += dart2(25, '25S'); // Bull's Eye
        total += dart2(50, '25D'); // Double Bull's Eye

        return total;
    }

    function dart2(value1, key1)
    {
        let left = score - value1;
        if (left === 0 && key1.endsWith('D'))
        {
            if (memoize[key1] === undefined)
            {
                memoize[key1] = 1;
                return 1;
            }
            else
                return 0;
        }
        if (left <= 0)
            return 0;

        let total = 0;
        for (let value2 = 1; value2 <= 20; value2++)
        {
            total += dart3(value1,   value2, key1, value2 + 'S'); // Single
            total += dart3(value1, 2*value2, key1, value2 + 'D'); // Double
            total += dart3(value1, 3*value2, key1, value2 + 'T'); // Triple
        }

        total += dart3(value1, 25, key1, '25S'); // Bull's Eye
        total += dart3(value1, 50, key1, '25D'); // Double Bull's Eye

        return total;
    }

    function dart3(value1, value2, key1, key2)
    {
        let left = score - value2 - value1;

        if (left === 0 && key2.endsWith('D'))
        {
            let k = key1+key2;
            if (memoize[k] === undefined)
            {
                memoize[k] = 1;
                return 1;
            }
            else
                return 0;
        }

        if (left <= 0)
            return 0;
        if ((left & 1) !== 0) // Cannot finish with a double
            return 0;
        
        if (left <= 40)
        {
            let k = [key1, key2].sort().join('') + (left/2)+'D';
            if (memoize[k] === undefined)
            {
                memoize[k] = 1;
                return 1;
            }
        }

        if (left === 50)
        {
            let k = [key1, key2].sort().join('') + '25D';

            if (memoize[k] === undefined)
            {
                memoize[k] = 1;
                return 1;
            }
        }

        return 0;
    }

    return dart1();
}

function solve(max)
{
    memoize = {}; // Reset cache

    let total = 0;
    for (let score = max-1; score > 0; score--)
    {
        total += checkout(score);
    }
    return total;
}

assert.equal(checkout(6), 11);

const MAX = 100;

let answer = solve(MAX);
console.log(answer, 'distinct ways a player can checkout with a score less than', MAX);