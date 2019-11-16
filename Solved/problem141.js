const assert = require('assert');
const timeLog = require('tools/timeLogger');

const MAX = 1E12;

const squares = (function()
{
    const squares = [0];

    for(let i = 1; ;i++)
    {
        let s = i*i;
        if (s >= MAX)
            break;
        squares.push(s);
    }
    return squares;
})();

function isProgressive(n, idx)
{
    if (! idx)
        idx = Math.sqrt(n);

    let start = Math.floor(idx/2);

    for (let q1 = start, q2 = start+1; q1 > 0 || q2 < idx ; q1--, q2++)
    {
        if (q1 > 0)
        {
            let r = n % q1;
            if (r !== 0)
            {
                let d = (n - r)/q1;

                if (d*r === squares[q1])
                    return true;
            }
        }

        if (q2 < idx)
        {
            let r = n % q2;
            if (r !== 0)
            {
                let d = (n - r)/q2;

                if (d*r === squares[q2])
                    return true;
            }
        }
    }

    return false;
}

function solve(max, trace)
{
    let total = 0;
    let count = squares.length;

    for(let i = 1; ; i++)
    {
        let s = squares[i];
        if (s >= max)
            break;

        if (trace)
            process.stdout.write(`\r${count--} `);

        if (isProgressive(s, i))
            total += s;
    }
    if (trace)
        process.stdout.write('\r \r');
    return total;
}

assert.equal(isProgressive(9), true);
assert.equal(isProgressive(10404), true);

assert.equal(solve(100000), 124657);

console.log('Tests passed');

let answer = timeLog.wrap('', () => solve(MAX, true));
console.log("Answer is", answer);