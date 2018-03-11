// Cuboid route
// Problem 86 
// A spider, S, sits in one corner of a cuboid room, measuring 6 by 5 by 3, and a fly, F, sits in the opposite corner. 
// By travelling on the surfaces of the room the shortest "straight line" distance from S to F is 10 and the path is shown 
// on the diagram: https://projecteuler.net/project/images/p086.gif

// However, there are up to three "shortest" path candidates for any given cuboid and the shortest route doesn't always have integer length.

// It can be shown that there are exactly 2060 distinct cuboids, ignoring rotations, with integer dimensions, up to a maximum size of M by M by M, for which the shortest route has integer length when M = 100. This is the least value of M for which the number of solutions first exceeds two thousand; the number of solutions when M = 99 is 1975.

// Find the least value of M such that the number of solutions first exceeds one million.

const assert = require('assert');

function isPerfectSquare(n)
{
    let s = Math.sqrt(n);
    return Math.floor(s) === s;
}

function shortestPath(l, w, h)
{
    let distance1 = /*Math.sqrt*/((l*l) + (w+h)*(w+h));
    let distance2 = /*Math.sqrt*/((l+w)*(l+w) + (h*h));
    let distance3 = /*Math.sqrt*/((l+h)*(l+h) + (w*w));

    let result = Math.min(distance1, distance2, distance3);

    return result;
}

function countIntegerPath(M, previous)
{
    let count = previous;

    for(let w = 1; w <= M; w++)
    for(let h = w; h <= M; h++)
    {
        let path = shortestPath(M, w, h);
        if (isPerfectSquare(path))
            count++;
    }

    return count;
}

assert.equal(countIntegerPath(100, 1975), 2060);

// let start    = 1383;
// let previous = 563268;

let start    = 100;
let previous = 2060;

for (let M = start+1; ; M++)
{
    previous = countIntegerPath(M, previous);
    if (previous > 1000000)
    {
        console.log(M + " is the first value for which the number of solutions exceeds one million");
        break;
    }
}