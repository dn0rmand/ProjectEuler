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
const timeLog = require('@dn0rmand/project-euler-tools/src/timeLogger');

const MAX = 17526000000000;

const   triangles = new Set();
const   triangleNumbers = [] ;
let     _lastTriangle = undefined;
let     _lastSize = undefined;

function loadTriangles(max)
{
    if (_lastTriangle === undefined)
    {
        triangles.add(0);
        triangleNumbers.push(0);
        _lastTriangle = 0;
        _lastSize = 1;
    }

    while (true)
    {
        let current = _lastTriangle + _lastSize;
        if (current > max)
            break;

        _lastTriangle = current;
        _lastSize++;

        triangles.add(current);
        triangleNumbers.push(current);
    }
}

function solve(max, trace)
{
    loadTriangles(max);

    let total = 0;

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

    if (trace)
        process.stdout.write(M+'\r\n');

    for (let i = 0; i < triangleNumbers.length; i++)
    {
        let t1 = triangleNumbers[i];
        if (t1 > M)
            break;

        if (trace)
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
    if (trace)
        console.log('\r');
    return total;
}

// USE FORMULAS:
//    T(3^(2λ+1)*n + (19×3^(2λ) − 3)/8)=(2*3^λ − 1)*T(3n+2)
function SOLVE_BIG(max)
{
    function check(power)
    {
        let A = 3 ** (2*power+1);
        let B = ((19*(3 ** (2*power))) - 3) / 8;
        if (Math.floor(B) !== B)
            return undefined;

        // A*n + B = max
        let n = (max - B) / A;
        if (n < 1)
            return false;
        if (Math.floor(n) !== n)
            return undefined;

        let factor = 2*(3**power) - 1;
        let m      = 3*n + 2;

        return { value: m, factor: factor};
    }

    let current = {factor:1, value: max};

    for (let power = 1; ; power++)
    {
        let v = check(power);
        if (v === false)
            break;
        if (v !== undefined)
        {
            if (v.value < current.value)
                current = v;
        }
    }

    let t = solve(current.value, true);
    return t * current.factor;
}

timeLog("Problem 621", () => {

assert.equal(solve(9), 7);
assert.equal(solve(1000), 78);
assert.equal(solve(1E6), 2106);

console.log('Test passed');

let answer = SOLVE_BIG(MAX);
console.log('Answer is', answer);

});
