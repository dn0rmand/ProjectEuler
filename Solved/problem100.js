// Disc count = T
// Blue Discs = X

/*
1/2 = (X/T)*(X-1/T-1)
    = X(X-1) / T(T-1)

1   = 2X(X-1) / T(T-1)

2X(X-1) = T(T-1)
2X^2 - 2X - T(T-1) = 0


2X(X-1) = T(T-1)
2X^2 - T^2 - 2X + T = 0

Xn+1 = 3*Xn + 2*Yn - 2
Yn+1 = 4*Xn + 3*Yn - 3

x = 3x + 2y – 2
y = 4x + 3y – 3
*/

const assert = require('assert');
const bigInt = require('big-integer');
const MAX    = bigInt(10).pow(12);

function FastButCheat()
{
    function getNext(v)
    {
        let X = v.x.multiply(3).add(v.y.multiply(2)).subtract(2);
        let Y = v.x.multiply(4).add(v.y.multiply(3)).subtract(3);

        return {x:X, y:Y};
    }

    let v = { x:bigInt(15), y:bigInt(21) };
    
    v = getNext(v);

    assert.equal(v.y, 120)
    assert.equal(v.x, 85)

    while (v.y.leq(MAX))
    {
        v = getNext(v);
    }

    console.log(v.y.toString() + " total discs in the box");
    return v.x.toString();
}

function SlowButMine()
{
    function squareRoot(n)
    {
        if (n.equals(1))
            return true;
        
        if (n.isEven())
        {
            if (! n.and(3).isZero())
                return;
        }
        else
        {
            if (! n.subtract(1).and(7).isZero())
                return;
        }

        let a = n.next().shiftRight(1);

        // if (a.greaterOrEquals(MAX_SQUAREROOT))
        //      a = MAX_SQUAREROOT;
            
        while(true)
        {
            let square = a.square();
            if (square.equals(n))
                return a;
            else if (square.greater(n))
                a = n.divide(a).add(a).shiftRight(1);
            else
                break;
        }
    }

    function solve(T)
    {
        let C     = T.multiply(T.prev());
        let delta = C.multiply(2).next();
        
        delta = squareRoot(delta); 
        if (delta === undefined)
            return;

        let x1 = delta.next();
        if (x1.isEven())
            return x1.shiftRight(1);
    }

    // assert.equal(solve(bigInt(21)), 15);
    // assert.equal(solve(bigInt(85+35)), 85);

    let start = bigInt(1000041722002); // MAX;                        
    let discs = solve(start);
    while (discs === undefined)
    {
        start = start.next();
        discs = solve(start);
    }

    return discs.toString();
}

//console.log('The box would contain ' + FastButCheat() + " blue discs");
console.log('The box would contain ' + SlowButMine() + " blue discs");
