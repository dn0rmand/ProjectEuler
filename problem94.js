// Almost equilateral triangles
// Problem 94 
// It is easily proved that no equilateral triangle exists with integral length sides and integral area. 
// However, the almost equilateral triangle 5-5-6 has an area of 12 square units.

// We shall define an almost equilateral triangle to be a triangle for which two sides are equal and the third differs 
// by no more than one unit.

// Find the sum of the perimeters of all almost equilateral triangles with integral side lengths and area and whose 
// perimeters do not exceed one billion (1,000,000,000).

const assert = require('assert');
const bigInt = require('big-integer');

const BILLION=1000000000;
const MAX_SIZE=333333334;
const MAX_SQUAREROOT= bigInt("48112522432468814");

function isPerfectSquare(n)
{
    if (n.equals(1))
        return true;
       
    if (n.isEven())
    {
        if (! n.and(3).isZero())
            return false;
    }
    else
    {
        if (! n.add(1).and(7).isZero())
            return false;
    }

    let a = n.next().shiftRight(1);

    if (a.greaterOrEquals(MAX_SQUAREROOT))
         a = MAX_SQUAREROOT;
        
    while(true)
    {
        let square = a.square();
        if (square.equals(n))
            return true;
        else if (square.greater(n))
            a = n.divide(a).add(a).shiftRight(1);
        else
            return false;
    }
}

function almostEquilateralTriangle(a, b, c)
{
    if ((a+b) <= c)
        return;
/*
    a + b > c

    use 2 * s
    S = s(s-2a)(s-2b)(s-2c) 
    S needs to be a square multiple of 16
*/

    let s  = a+b+c;
    let sa = s - a - a;
    let sb = s - b - b;
    let sc = s - c - c;

    let S  = bigInt(s).multiply(sa).multiply(sb).multiply(sc);

    if (S.isZero())
        return false;

    if (S.and(0x0F).isZero())
        return isPerfectSquare(S);
    else 
        return false;
}

assert.ok(almostEquilateralTriangle(5, 5, 6));

let total = bigInt(0);
let previous = 0;

for(let i = 1; i <= MAX_SIZE; i++)
{
    let found = false;
    if (almostEquilateralTriangle(i, i, i+1))
    {
        found = true;
        let perimeter = i + i + (i+1);
        if (perimeter <= BILLION)
        {
            total = total.add(perimeter);
        }
    }
    else if (almostEquilateralTriangle(i, i+1, i+1))
    {
        found = true;
        let perimeter = i + (i+1) + (i+1);
        if (perimeter <= BILLION)
        {
            total = total.add(perimeter);
        }
    }
    if (found)
    {
        if (i > 250)
        {
            let j = i-previous;
            previous = i;
            i = j * 5;
        }
        else
            previous = i;
    }
}

console.log("Sum of the perimeters of all almost equilateral triangles whose perimeters do not exceed one billion is "+total.toString());
