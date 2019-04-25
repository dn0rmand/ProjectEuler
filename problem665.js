const assert = require('assert');
const prettyTime= require("pretty-hrtime");

const MAX = 100000; // 1E7

function solve(size, trace)
{
    let   total     = 0;

    const rows      = [];
    const diagonals = [];
    const positions = [];

    function addLosing(n, m)
    {
        let d  = Math.abs(n-m);
        diagonals[d] = 1;

        rows[n]      = 1;
        rows[m]      = 1;

        if (n > 0 || m > 0)
            positions.push({n:n, m:m});

        if (n <= m && n+m <= size)
            total += (n+m);
    }

    function canReach(n, m)
    {
        if (n === m)
            return true; // in 0,0 reach
        if (n === m+m)
            return true; // in 0,0 reach
        if (n+n === m)
            return true; // in 0,0 reach

        if (rows[n] || rows[m])
            return true;

        let d = Math.abs(n-m);
        if (diagonals[d])
            return true;

        for (let {n:a, m:b} of positions)
        {
            if (a > n)
                break;

            // process a,b

            let i = m-b;
            if (i >= 0 && a+i+i === n)
                return true;
            i = n-a;
            if (i >= 0 && b+i+i === m)
                return true;

            if (a !== b)
            {
                // process b,a

                let i = m-a;
                if (i >= 0 && b+i+i === n)
                    return true;
                i = n-b;
                if (i >= 0 && a+i+i === m)
                    return true;
            }
        }

        return false;
    }

    addLosing(0, 0);
    let end = ((size|1) + 1)/2;
    let count = 0;
    for (let n = 1; n <= end; n++)
    {
        if (rows[n])
            continue;

        if (trace)
        {
            if (count === 0)
                process.stdout.write(`\r${n}`);
            if (++count >= 100)
                count = 0;
        }

        for (let m = 1; m <= size-n; m++)
        {
            if (! canReach(n, m))
            {
                addLosing(n, m);
                break; // all others on that line are winning
            }
        }
    }
    if (trace)
    {
        process.stdout.write(`\r         \r`);
        console.log(`${positions.length} positions`);
    }
    return total;
}

assert.equal(solve(10), 21);
assert.equal(solve(20), 38);
assert.equal(solve(100), 1164);
assert.equal(solve(1000), 117002);

let timer = process.hrtime();
const answer = solve(MAX, true);
timer = process.hrtime(timer);
console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));

