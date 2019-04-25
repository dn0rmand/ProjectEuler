const assert = require('assert');
const prettyTime= require("pretty-hrtime");

const MAX = 10000; // 1E7

function solve(size, trace)
{
    let   total  = 0;
    const losing = [];
    const columns= [];
    const diagonals = [];

    function isLosing(n, m)
    {
        let i = losing[n];
        if (i !== undefined)
            return i.has(m);
        else
            return false;
    }

    function addLosing(n, m)
    {
        let d = Math.abs(n-m);
        diagonals[d] = 1;
        columns[m]   = 1;

        let i = losing[n];
        if (i === undefined)
        {
            i = new Set();
            losing[n] = i;
        }
        i.add(m);

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

        if (losing[n] || columns[m])
            return true;

        let d = Math.abs(n-m);
        if (diagonals[d])
            return true;

        if (isLosing(n, m))
            return true;

        let [n2, m2] = [n-2, m-1];
        let [n3, m3] = [n-1, m-2];

        let done = false;
        while (! done)
        {
            done = true;

            if (n2 >= 0 && m2 >= 0)
            {
                if (isLosing(n2, m2))
                    return true;
                done = false;
                n2 -= 2;
                m2--;
            }
            if (n3 >= 0 && m3 >= 0)
            {
                if (isLosing(n3, m3))
                    return true;
                done = false;
                n3--;
                m3 -= 2;
            }
        }

        return false;
    }

    addLosing(0, 0);
    let end = ((size|1) + 1)/2;
    let count = 0;
    for (let n = 1; n <= end; n++)
    {
        if (losing[n])
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
                addLosing(m, n);
                break; // all others on that line are winning
            }
        }
    }
    if (trace)
        process.stdout.write(`\r         \r`);
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
