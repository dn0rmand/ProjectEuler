const assert = require('assert');

function $hasOneSolution(n, trace)
{
    const SIZE = 1000;

    let minA = Math.floor(Math.sqrt(n)/2);
    let maxA = minA+SIZE;
    let solution = undefined;

    for (let a = minA; a < maxA ; a++)
    {
        let x = 4*a*a - n;
        if (x <= 0)
            continue;

        if (!Number.isSafeInteger(x))
            break;

        let X = Math.sqrt(x);
        if (Number.isInteger(X))
        {
            if (X*X === x)
            {
                maxA = a + SIZE;
                let Z1 = a - X;
                let Z2 = a + X;

                if (Z1 <= 0 || Z1 === Z2)
                {
                    let Y2 = Z2+a;
                    let X2 = Y2+a;
                    let NN = X2*X2 - (Y2*Y2) - (Z2*Z2);
                    if (NN === n)
                    {
                        if (solution !== undefined)
                            return false;

                        if (trace)
                            solution = `${X2}**2 - ${Y2}**2 - ${Z2}**2 = ${n}`;
                        else
                            solution = 1;
                    }
                    else
                        throw "Not correct";
                }
            }
        }
    }
    if (solution !== undefined)
    {
        if (trace)
            console.log(solution);
        return true;
    }
    return false;
}

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
