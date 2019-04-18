// Efficient exponentiation

// Problem 122
// The most naive way of computing n^15 requires fourteen multiplications:

// n × n × ... × n = n^15

// But using a "binary" method you can compute it in six multiplications:

// n × n = n^2
// n^2 × n^2 = n^4
// n^4 × n^4 = n^8
// n^8 × n^4 = n^12
// n^12 × n^2 = n^14
// n^14 × n = n^15

// However it is yet possible to compute it in only five multiplications:

// n × n = n^2
// n^2 × n = n^3
// n^3 × n^3 = n^6
// n^6 × n^6 = n^12
// n^12 × n^3 = n^15

// We shall define m(k) to be the minimum number of multiplications to compute n^k; for example m(15) = 5.

// For 1 ≤ k ≤ 200, find ∑ m(k).

const assert = require('assert');
const prettyTime= require("pretty-hrtime");

const best = [0, 0];

function execute(max)
{
    let states = [ [1] ];

    let step = 0;
    let count = max-best.length+1;

    if (max >= 191 && process.argv[2] === 'fast')
    {
        best[191] = 11;
        count--;
    }

    while (count > 0 && states.length > 0)
    {
        step++;

        process.stdout.write(`\r${step} - ${count} - ${states.length} `);

        const newStates = [];
        const duplicates= new Set();

        while(count > 0 && states.length > 0)
        {
            const state = states.pop();
            const processed = [];

            process.stdout.write(`\r${step} - ${count} - ${states.length} `);

            for(let idx1 = 0; count > 0 && idx1 < state.length; idx1++)
            {
                const i = state[idx1];

                if (i+i > max)
                    break;

                for(let idx2 = idx1; count > 0 && idx2 < state.length; idx2++)
                {
                    const j = state[idx2];
                    const n = j+i;

                    if (n > max)
                        break;

                    if (processed[n] || state.includes(n))
                        continue;

                    processed[n] = 1;

                    const newState = [...state, n].sort((a, b) => a-b);
                    const k = newState.join(',');
                    if (duplicates.has(k))
                        continue;
                    duplicates.add(k);

                    newStates.push(newState);

                    if (best[n] === undefined)
                    {
                        best[n] = step;
                        count--;

                        process.stdout.write(`\r${step} - ${count} - ${states.length} `);
                    }
                }
            }
        }

        states = newStates;
    }

    process.stdout.write("\r                                                     \r");
}

function m(k)
{
    execute(k);
    return best[k];
}

function solve(max)
{
    execute(max);

    let total = 0;
    for (let k = 1; k <= max; k++)
    {
        total += best[k];
    }
    return total;
}

let timer = process.hrtime();

assert.equal(m(15), 5);
assert.equal(m(50), 7);
assert.equal(solve(50), 269);

let answer = solve(200);
timer = process.hrtime(timer);
console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));
