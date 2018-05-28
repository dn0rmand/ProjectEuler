// Migrating ants
// --------------
// Problem 393 
// -----------
// An n×n grid of squares contains n2 ants, one ant per square.
// All ants decide to move simultaneously to an adjacent square (usually 4 possibilities, except for ants on the edge of 
// the grid or at the corners).
// We define f(n) to be the number of ways this can happen without any ants ending on the same square and without any 
// two ants crossing the same edge between two squares.

// You are given that f(4) = 88.
// Find f(10).

const assert = require('assert');
const prettyHrtime = require("pretty-hrtime");
const bigInt = require('big-integer');

// let x = 112398351350823112;
// if (Number.MAX_SAFE_INTEGER < x)
//     throw "Big Integer required";

let memoize = {};

function get(visited)
{
    const reducerL = (accumulator, currentValue) => accumulator + currentValue;
    const reducer1 = (accumulator, currentValue) => accumulator + currentValue.reduce(reducerL, '');

    let k1 = visited.reduce(reducer1, '');

    let v = memoize[k1];

    return v;
}

function set(visited, total)
{
    let width = visited[0].length;

    const reducerL = (accumulator, currentValue) => accumulator + currentValue;
    const reducerR = (accumulator, currentValue) => currentValue + accumulator;

    const reducer1 = (accumulator, currentValue) => accumulator + currentValue.reduce(reducerL, '');
    const reducer3 = (accumulator, currentValue) =>  accumulator + currentValue.reduce(reducerR, '');
    const reducer2 = (accumulator, currentValue) =>  currentValue.reduce(reducerR, '') + accumulator;
    const reducer4 = (accumulator, currentValue) =>  currentValue.reduce(reducerL, '') + accumulator;

    let prefix = '';

    let k1 = visited.reduce(reducer1, prefix);
    let k2 = visited.reduce(reducer2, prefix);
    let k3 = visited.reduce(reducer3, prefix);
    let k4 = visited.reduce(reducer4, prefix);

    memoize[k1] = total;
    memoize[k2] = total;
    memoize[k3] = total;
    memoize[k4] = total;
}

let skipped = 0;
let shortcut = 0;

function processHoles(visited, width, height)
{
    let total = get(visited);

    if (total !== undefined)
    {
        skipped++;
        return total;
    }

    total = execute(visited, width, height);

    set(visited, total);
    return total;
}

function execute(visited, width, height)
{
    let startX = -1;
    let startY = -1;
    let SIZE = 0;

    for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
    {
        if (visited[y][x] !== 1)
        {
            if (SIZE === 0)
            {
                startX = x;
                startY = y;
            }
            SIZE++;
        }
    }

    if (SIZE <= 3)
        return bigInt.zero;
    
    let maxCount = 50;

    return inner(startX, startY, 0);

    function inner(x, y, count)
    {
        if (count > maxCount)
        {
            maxCount = count;
            console.log(count);
        }

        if (x < 0 || x >= width || y < 0 || y >= height)
            return bigInt.zero;

        if (x === startX && y === startY && count > 3)
        {
            if (count === SIZE)
                return bigInt(1);

            return processHoles(visited, width, height);
        }

        if (visited[y][x] === 1)
            return bigInt.zero;

        let distance = Math.abs(x - startX) + Math.abs(y - startY);

        if (SIZE-count < distance)
        {
            shortcut++;
            return bigInt.zero; // Won't make it!
        }

        visited[y][x] = 1;

        let result;

        if (count === 0)
        {
            result = inner(x+1, y, count+1).times(2);
        }
        else
        {
            let v1 = inner(x, y+1, count+1);
            let v2 = inner(x, y-1, count+1);
            let v3 = inner(x+1, y, count+1);
            let v4 = inner(x-1, y, count+1);
            
            result = v1.plus(v2).plus(v3).plus(v4);
        }

        visited[y][x] = 0;

        return result;
    }
}

function f(size)
{
    let visited = [];

    for(let y = 0; y < size; y++)
    {
        let r = new Array(size);
        r.fill(0, 0, size);
        visited.push(r);
    }

    skipped = 0;

    let start = process.hrtime();
    let total = execute(visited, size, size);
    let end = process.hrtime(start);

    console.log('f(' + size + ') executed in ' + prettyHrtime(end, {verbose:true}));
    console.log(skipped + ' calculation skipped - used ' + shortcut + ' shortcut');            
    return total;
}

assert.equal(f(4).valueOf(), 88);
assert.equal(f(6).valueOf(), 207408);
// console.log(f(8));
// console.log(f(10));
