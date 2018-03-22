const assert = require('assert');
const fraction = require('fraction.js');

const MINUS_ONE = fraction(-1);
const TWO       = fraction(2);
const ONE       = fraction(1);
const FOUR      = fraction(4);
const MINUS_FOUR= fraction(-4);

let line = 
{
    a: fraction(-197).div(14), 
    c: fraction(101).div(10),
    x: fraction(0), 
    y: fraction(101).div(10)
};

function getIntersection(line)
{
    let A = FOUR.add(line.a.mul(line.a));
    let B = TWO.mul(line.a).mul(line.c);
    let C = line.c.mul(line.c).sub(100);

    let delta = B.mul(B).sub(FOUR.mul(A).mul(C));
    if (delta.s < 0)
        throw "No Solutions";
    delta = fraction(Math.sqrt(delta.valueOf())); // This NEEDS WORK

    let x;
    let x1 = delta.sub(B).div(TWO.mul(A));
    let x2 = delta.mul(MINUS_ONE).sub(B).div(TWO.mul(A));

    let v1 = x1.valueOf();
    let v2 = x2.valueOf();

    if ((v1 < -5 || v1 > 5) && (v2 < -5 || v2 > 5))
        throw "Invalid Solutions";

    let diff1 = Math.abs(line.x.valueOf() - v1);
    let diff2 = Math.abs(line.x.valueOf() - v2);
    if (diff1 > diff2)
        x = x1;
    else
        x = x2;

    if (line.x.equals(x))
        throw "Invalid Solutions";

    let y = x.mul(line.a).add(line.c);

    return {x: x, y: y};
}

function getLine(point)
{
    let m = MINUS_FOUR.mul(point.x).div(point.y);
    let c = point.y.sub(m.mul(point.x));

    return {a: m, c: c, x:point.x, y:point.y};
}

function getNewLine(line1, line2)
{
    let A = line1.a.mul(MINUS_ONE);
    let C = line1.c;

    let D = line2.a.mul(MINUS_ONE);
    let F = line2.c;

    let k = C.sub(F).div(A.sub(D));
    let h = C.mul(D).sub(A.mul(F)).div(D.sub(A));

    let coef = ONE.sub(D.mul(D)).add(A.mul(D).mul(TWO));
    
    coef = A.mul(A).sub(A.mul(A).mul(D).mul(D)).sub(D.mul(TWO)).div(coef);

    let c = h.sub(k.mul(coef));

    return {
        a: coef,
        c: c,
        x: line2.x,
        y: line2.y
    };
}

let count = 0;
while (true)
{
    let point = getIntersection(line);
    let v1 = point.x.compare(-0.01);
    let v2 = point.x.compare( 0.01);

    if (! point.y.s < 0 && (v1 > 0 && v2 <= 0))
    {
        console.log("Found the exit after " + count + " rebounds");
        break;
    }
    let mirror= getLine(point);
    line = getNewLine(line, mirror);
    count++;
}

