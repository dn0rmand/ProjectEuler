// Using up to one million tiles how many different "hollow" square laminae can be formed?
// ---------------------------------------------------------------------------------------
// Problem 173
// -----------

const assert = require('assert');

const MAX_TILES = 1000000;

const L = new Int32Array(MAX_TILES+1).fill(0);

function preLoad()
{
    for(let outer = 3; ; outer++)
    {
        const outer2 = outer*outer;
        let tiles = outer2 - (outer-2)*(outer-2);
        if (tiles > MAX_TILES)
            break;

        for(let inner = outer-2; inner > 0; inner -= 2) 
        {
            tiles = outer2 - inner*inner;

            if (tiles > MAX_TILES)
                break;
            
            L[tiles]++;
        }
    }
}

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
    for(let i = 0; i <= max; i++)
        total += L[i];
    return total;
}

preLoad();
assert.strictEqual(solve(100), 41);

let answer = solve(MAX_TILES);

console.log('Using up to', MAX_TILES, 'tiles,', answer, 'different square laminae can be formed');