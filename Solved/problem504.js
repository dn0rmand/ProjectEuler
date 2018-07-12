// Square on the Inside
// --------------------
// Problem 504 
// -----------
// Let ABCD be a quadrilateral whose vertices are lattice points lying on the coordinate axes as follows:

// A(a, 0), B(0, b), C(−c, 0), D(0, −d), where 1 ≤ a, b, c, d ≤ m and a, b, c, d, m are integers.

// It can be shown that for m = 4 there are exactly 256 valid ways to construct ABCD. 
// Of these 256 quadrilaterals, 42 of them strictly contain a square number of lattice points.

// How many quadrilaterals ABCD strictly contain a square number of lattice points for m = 100?

const assert = require('assert');
const PRECISION = 9;
const PREC = Math.pow(10, PRECISION);

function round(value)
{
    let p = Math.round(value * PREC)/PREC;
    return p;
}

function area(p1, p2, p3, p4)
{
    function distance(p1, p2)
    {
        let x = (p2.x - p1.x);
        let y = (p2.y - p1.y);

        d = Math.sqrt(x*x + y*y);

        return d;
    }

    function getArea(p1, p2, p3)
    {
        let a = distance(p1, p2);
        let b = distance(p2, p3);
        let c = distance(p3, p1);

        let s = (a+b+c)/2;

        let A = Math.sqrt(s*(s-a)*(s-b)*(s-c));

        return A;
    }

    let A1 = getArea(p1, p2, p3);
    let A2 = getArea(p1, p4, p3);

    return A1+A2;
}

function outerLattice(p1, p2, p3, p4)
{
    function latticeOnLine(p1, p2)
    {
        if (p1.x > p2.x)
        {
            let p = p1;
            p1 = p2;
            p2 = p;
        }

        // Y = a X + b

        let d = p2.x - p1.x;
        let total = 0;

        if (d === 0)
        {
            if (p1.y > p2.y)
            {
                let p = p1;
                p1 = p2;
                p2 = p;                
            }
            for (let y = p1.y+1; y < p2.y; y++)
                total++;
        }
        else
        {
            let a = (p2.y - p1.y) / d;
            let b = (p1.y * p2.x - p1.x * p2.y) / d;

            for (let x = p1.x+1; x < p2.x; x++)
            {
                y = x * a + b;
                y = round(y);
                if (Math.floor(y) === y)
                    total++;
            }
        }
        return total;
    }

    let result = 4 + latticeOnLine(p1, p2) + latticeOnLine(p2, p3) + latticeOnLine(p3, p4) + latticeOnLine(p4, p1);

    return result;
}

function innerLattice(A, b)
{
    // A = i + b/2 - 1;
    let i = A + 1 - b/2;

    if (i <= 0)
        return 0;

    i = round(i);
    let r = Math.sqrt(i);

    if (r === Math.floor(r))
        return r;

    return 0;
}

function getABCD(m, trace)
{
    let total = 0;

    for (let a = 1; a <= m; a++)
    {
        for (let b = 1; b <= m; b++)
        for (let c = 1; c <= m; c++)
        for (let d = 1; d <= m; d++)
        {
            let p1 = {x:  a, y: 0};
            let p2 = {x:  0, y: b};
            let p3 = {x: -c, y: 0};
            let p4 = {x:  0, y:-d};
            
            let A = area(p1, p2, p3, p4);
            let B = outerLattice(p1, p2, p3, p4);
            let i = innerLattice(A, B);

            if (i !== 0)
                total++;
        }
        if (trace === true)
            console.log(((a*100)/m).toFixed(0) + "%");
    }
    return total;
}

function runTest()
{
    assert.equal(getABCD(4), 42);
    assert.equal(getABCD(5), 88);
    assert.equal(getABCD(6), 156);
    assert.equal(getABCD(7), 220);
    assert.equal(getABCD(8), 376);
    assert.equal(getABCD(9), 566);
    assert.equal(getABCD(10), 862);
    assert.equal(getABCD(11), 1082);
    assert.equal(getABCD(12), 1378);
    assert.equal(getABCD(13), 1656);
    assert.equal(getABCD(14), 1992);
    assert.equal(getABCD(15), 2392);
    assert.equal(getABCD(16), 2926);
    assert.equal(getABCD(17), 3342);
    assert.equal(getABCD(18), 4046);
    assert.equal(getABCD(19), 4774);
    assert.equal(getABCD(20), 5582);
    assert.equal(getABCD(30), 19281);
    assert.equal(getABCD(40), 45655);
    assert.equal(getABCD(50), 88013);

    console.log('All test passed');
}

let answer = getABCD(100, true);//694687

console.log(answer + " quadrilaterals ABCD strictly contain a square number of lattice points for m = 100");