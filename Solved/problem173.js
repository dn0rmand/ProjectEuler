// Using up to one million tiles how many different "hollow" square laminae can be formed?
// ---------------------------------------------------------------------------------------
// Problem 173
// -----------

const assert = require('assert');

const MILLION = 1000000;

function formSquare(tiles, n)
{
    if (n < 2)
        return tiles;

    let left = tiles - 4*n;

    if (left > 0)
        left = formSquare(left, n-2);

    return left;
}

function countSquare(tiles)
{
    let total = 0;
    let maxN  = Math.floor(tiles/4);

    for (let n = maxN; n > 1; n--)
    {
        let left = formSquare(tiles, n);

        if (left === 0)
            total++;
        else if (left > 0)
            break;
    }

    return total;
}

function solve(max)
{
    let total = 0;
    let percent = '';
    
    max = max - (max % 4);

    for (let n = max; n >= 8; n -= 4)
    {
        let t = countSquare(n);
        total += t;
        let p = ((n * 100)/max).toFixed(0);
        if (p !== percent)
        {
            percent = p;
            console.log(percent);
        }
    }
    return total;
}

assert.equal(countSquare(32), 2);

let answer = solve(MILLION);

console.log('Using up to', MAX, 'tiles,', answer, 'different square laminae can be formed?');