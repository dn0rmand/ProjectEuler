const assert = require('assert');

function *solve1(n)
{
    let N = n * n;

    for (let x = 1; x <= n; x++)
    {
        let y = N / x;
        if (Math.floor(y) !== y)
            continue;

        yield { x: x+n, y: y+n };
    }
}

function solve2(n)
{
    let N = n * n;
    if (N > Number.MAX_SAFE_INTEGER)
        throw "Need bigint";
        
    let count = 0;

    for (let x = 1; x <= n; x++)
    {
        let y = N / x;
        if (Math.floor(y) !== y)
            continue;

        count++;
    }
    return count;
}

for (let r of solve1(4))
{ 
    console.log("x =", r.x, " - y =", r.y);
}

assert.equal(solve2(4), 3);

let n = 5;
let max = 0;

while (true)
{
    let total = solve2(n);
    if (total > max)
    {
        max = total;
        console.log(max);
        if (total > 1000)
        {
            console.log("The answer to problem 108 is", n);
            break;
        }
    }
    n++;
}