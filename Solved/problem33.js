// 49/98 = 4/8

let tops = 1;
let bottoms = 1;

function check(t1,t2, b1, b2, r1,r2)
{
    if (r2 === 0)
        return false;

    if (t2 === 0 && b2 === 0)
        return false;
    if (t1 === 0 && b1 === 0)
        return false;

    let result = r1 / r2;

    if (result >= 1)
        return false;

    let top    = t1*10 + t2;    
    let bottom = b1*10 + b2;

    if (top === bottom)
        return false;

    let value  = top / bottom;

    if (value === result)
    {
        console.log(top + '/' + bottom + ' = ' + r1 + '/' + r2);
        tops    *= r1;
        bottoms *= r2;
        return true;
    }
    return false;
}

for (let top = 11; top < 100; top++)
{
    let d2 = top % 10;
    let d1 = (top - d2)/10;

    for(let d3 = 1; d3 < 10; d3++)
    {
        check(d1,d2 , d1,d3, d2,d3);
        check(d1,d2 , d3,d1, d2,d3);
        check(d1,d2 , d2,d3, d1,d3);
        check(d1,d2 , d3,d2, d1,d3);
    }
}

console.log("The result is " + (bottoms/tops));