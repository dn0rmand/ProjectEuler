// Expressing an integer as the sum of triangular numbers
// ------------------------------------------------------
// Problem 621
// -----------
// Gauss famously proved that every positive integer can be expressed as the sum of three triangular numbers (including 0 as the lowest triangular number). In fact most numbers can be expressed as a sum of three triangular numbers in several ways.

// Let G(n) be the number of ways of expressing n as the sum of three triangular numbers, regarding different
// arrangements of the terms of the sum as distinct.

// For example, G(9)=7, as 9 can be expressed as: 3+3+3, 0+3+6, 0+6+3, 3+0+6, 3+6+0, 6+0+3, 6+3+0.
// You are given G(1000)=78 and G(1E6)=2106.

// Find G(17526×1E9).

const assert = require('assert');

const MAX = 17526 * 1E9;

const triangles = new Set();
let triangleNumbers ;

function loadTriangles()
{
    triangles.add(0);

    let current = 0;
    let l = 1;
    while (true)
    {
        current = current+l;
        if (current > MAX)
            break;
        l = l+1;

        triangles.add(current);
    }

    triangleNumbers = [...triangles.keys()];
}

function solve(max)
{
    let total = 0;

    function inner(value, index, count)
    {
        if (count === 1)
        {
            if (triangles.has(value))
            {
                // ABC, ACB, BAC, BCA, CAB, CBA -> 6 possibilities
                total += 6;
            }
            return;
        }

        for (let i = index; i < triangleNumbers.length; i++)
        {
            let t = triangleNumbers[i];
            if (t+t > value)
                break;

            if(count === 3 && max === MAX)
                process.stdout.write('\r' + t);

            let v = value-t;
            if (v > t)
                inner(value - t, i+1, count-1);
        }
    }

    // Check case AAA

    if (max % 3 === 0)
    {
        let m = max / 3;
        if (triangles.has(m))
        {
            total += 1;
        }
    }

    let M = Math.floor(max / 3);

    // Check cases ABB or AAB
    for (let i = 0; i < triangleNumbers.length; i++)
    {
        let t = triangleNumbers[i];
        if (t > M)
            break;

        let t2 = (max - t);

        // try ABB
        if ((t2 & 1) === 0)
        {
            t2 /= 2;
            if (t2 > t && triangles.has(t2))
            {
                total += 3;
                continue;
            }
        }
        // try AAB
        t2 = (max - t - t);
        if (t2 > t && triangles.has(t2))
        {
            total += 3;
        }
    }

    // Now ABC different

    if (max === MAX)
        process.stdout.write(triangleNumbers[triangleNumbers.length-1]+'\r\n');

    for (let i = 0; i < triangleNumbers.length; i++)
    {
        let t1 = triangleNumbers[i];
        if (t1 > M)
            break;

        if (max === MAX)
            process.stdout.write('\r' + t1);

        let v1 = max - t1;
        for (let j = i+1; i < triangleNumbers.length; j++)
        {
            let t2 = triangleNumbers[j];
            let v2 = v1 - t2;
            if (v2 <= t2)
                break;
            if (triangles.has(v2))
            {
                total += 6;
            }
        }
    }

    return total;
}

loadTriangles();

assert.equal(solve(9), 7);
assert.equal(solve(1000), 78);
assert.equal(solve(1E6), 2106);

console.log('Test passed');

let answer = solve(MAX);
console.log('Answer is', answer);