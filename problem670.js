const assert = require('assert');

function solve(n)
{
    // x * 2 + y * 3 + rest = n;
    // x*2 + y*3 <= n;

    let total = 0;

    for(let x = 0; 2*x <= n; x++)
    {
        let rest = n - 2*x;
        for (let y = 0; 3*y <= rest; y++)
        {
            total++;
        }
    }

    return total;
}

assert.equal(solve(3), 3);
assert.equal(solve(7), 37);
assert.equal(solve(10), 328);