const assert = require('assert');
//const bigNum = require('bignumber.js');
const bigInt = require('big-integer');

const BILLION=1000000000;
const MAX_SIZE=333333334;
const MAX_SQUAREROOT= bigInt("48112522432468814");

function isPerfectSquare(n)
{
    if (n.isZero())
        return false;
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
/*
    a + b > c

    use 2 * s
    S = s(s-2a)(s-2b)(s-2c) 
    S needs to be a square multiple of 16
*/

    let s  = (a+b+c) / 2;
    let sa = s - a;
    let sb = s - b;
    let sc = s - c;
    let S  = bigInt(s).multiply(sa).multiply(sb).multiply(sc);

    return isPerfectSquare(S);
}

//assert.ok(almostEquilateralTriangle(5, 5, 6));

//console.log(682737235+4+5+7);

let total = bigInt(0);

for(let i = 1; i <= MAX_SIZE; i++)
{
    if (almostEquilateralTriangle(i, i, i+1))
    {
        let perimeter = i + i + (i+1);
        if (perimeter <= BILLION)
        {
            total = total.add(perimeter);
        }
    }
    if (almostEquilateralTriangle(i, i+1, i+1))
    {
        let perimeter = i + (i+1) + (i+1);
        if (perimeter <= BILLION)
        {
            total = total.add(perimeter);
        }
    }
}

console.log(total.toString() + ' NOT 682737235, 682737251, 156265903821851400, 156265903712058780');