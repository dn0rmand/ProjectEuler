const assert = require('assert');
const prettyTime= require("pretty-hrtime");

const MAX = 1E7;

function solve(size, trace)
{
    let   total     = 0;

    const size2     = size+size;
    const rows      = new Uint32Array(size);
    const diagonals = new Uint32Array(size);
    const position1 = new Uint32Array(size+size2);
    const position2 = new Uint32Array(size+size2);

    const end       = Math.floor((size + 1)/2);

    const RANGE     = 2000;

    function add(array, index)
    {
        if (! array[index])
        {
            let offset = (array[index+1] || 0)+1;
            array[index] = offset;
            let i = 1;
            index--;
            while (index >= 0 && i < RANGE && array[index])
            {
                array[index] += offset;
                i++;
                index--;
            }
        }
    }

    function addLosing(n, m)
    {
        add(diagonals, Math.abs(n-m));
        add(rows, n);
        add(rows, m);

        let k1 = (m - 2*n) + size2;
        let k2 = (n - 2*m) + size2;

        add(position1, k1);
        add(position2, k2);

        if (n <= m && n+m <= size)
            total += (n+m);
    }

    function canReach(n, m)
    {
        let k11 = (m - 2*n) + size2;
        let k12 = (n - 2*m) + size2;

        let d = Math.max(diagonals[Math.abs(n-m)], rows[n], rows[m], position1[k11], position2[k11]);
        if (d)
            return d;

        if (position1[k12] || position2[k12])
        {
            let off = 1;
            k12 -= 2;
            while (off <= RANGE && (position1[k12] || position2[k12]))
            {
                k12 -= 2;
                off++;
            }
            return off;
        }
        return 0;
    }

    addLosing(0, 0);

    let count = 0;
    const ZONE = 700;

    for (let n = 1; n <= end; n++)
    {
        if (rows[n])
        {
            n += rows[n]-1;
            continue;
        }

        if (trace)
        {
            if (count === 0)
                process.stdout.write(`\r${n}`);
            if (++count >= 100)
                count = 0;
        }

        let from1 = Math.max(n, Math.floor(1.4778 * n) - ZONE);
        let to1   = Math.min(size-n, from1 + ZONE+ZONE);

        let from2 = Math.max(n, Math.floor(2.2478 * n) - ZONE);
        let to2   = Math.min(size-n, from2 + ZONE+ZONE);

        for (let m = from1; m <= to2;)
        {
            if (m > to1 && m < from2)
                m = from2;

            let offset = canReach(n, m);
            if (offset === 0)
            {
                addLosing(n, m);
                break; // all others on that line are winning
            }
            m += offset;
        }
    }
    if (trace)
    {
        process.stdout.write(`\r         \r`);
    }
    return total;
}

assert.equal(solve(10), 21);
assert.equal(solve(20), 38);
assert.equal(solve(100), 1164);
assert.equal(solve(1000), 117002);
assert.equal(solve(10000), 11579519);
assert.equal(solve(100000), 1155283827);

let timer = process.hrtime();
const answer = solve(MAX, true);
timer = process.hrtime(timer);

if (answer < 11541685709674)
    console.log('Missing', 11541685709674-answer);
else if (answer > 11541685709674)
    console.log(answer-11541685709674, 'too many');

console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));

