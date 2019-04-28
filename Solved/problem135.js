const assert = require('assert');

function calculateSolutions(max, trace)
{
    let solutions = new Uint32Array(max);
    let count = 0;

    for (let a = 1; a < max; a++)
    {
        if (trace)
        {
            if (count === 0)
                process.stdout.write(`\r${a}`);
            if (++count >= 1000)
                count = 0;
        }

        let min = Math.ceil(a/4);
        for (let b = min; b < a; b++)
        {
            let v = a * (4*b - a);
            if (v >= max)
                break;
            solutions[v]++;
            if (v > max)
                break;
        }
    }

    if (trace)
        process.stdout.write('\r         \r');

    return solutions;
}

function solve(max, trace)
{
    if (trace)
        console.log('Loading solutions');

    let solutions = calculateSolutions(max, trace);

    if (trace)
        console.log('Counting solutions');

    let total = 0;
    let count = 0;

    for (let n = 1; n < max; n++)
    {
        if (trace)
        {
            if (count === 0)
                process.stdout.write(`\r${n}`);
            if (++count >= 1000)
                count = 0;
        }
        if (solutions[n] === 10)
            total++;
    }
    if (trace)
        process.stdout.write('\r         \r');
    return total;
}

assert.equal(solve(1156), 1);

let answer = solve(1000000, true);
console.log('Answer is', answer);
