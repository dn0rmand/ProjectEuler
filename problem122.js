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

function execute(max, done)
{
    let state = [];

    state[1] = 0;

    let step = 0;
    while (! done(state))
    {
        step++;
        let newState = [];

        for(let i = 1; i < state.length; i++)
            newState[i] = state[i];

        for(let i = 1; i < state.length; i++)
        {
            if (state[i] === undefined)
                continue;

            let n = i+i;
            if (n > max)
                continue;

            if (newState[n] === undefined)
                newState[n] = step;

            for(let j = i+1; j < state.length; j++)
            {
                if (state[j] === undefined)
                    continue;

                if (state[i] < state[j])
                {
                    let n = i+j;

                    if (newState[n] === undefined)
                    {
                        newState[n] = step;
                    }
                }
            }
        }

        state = newState;
    }

    return state;
}

function $m(k)
{
    let state = execute(k, (state) => state[k] !== undefined);

    return state[k];
}

const cache = [0, 0];

function m(k)
{
    const soFar = [];

    function inner(step)
    {
        let len = soFar.length;
        for (let i = 1; i < len; i++)
        {
            if (! soFar[i])
                continue;

            if (i+i > k)
                break;

            for (let j = i; i+j <= k && j < len; j++)
            {
                if (! soFar[j])
                    continue;

                let n = i+j;

                if (soFar[n] === undefined)
                {
                    if (cache[n] === undefined || cache[n] > step)
                    {
                        cache[n] = step;
                    }
                    soFar[n] = 1;
                    inner(step+1);
                    soFar[n] = 0;
                    soFar.length = len;
                }
            }
        }
    }

    soFar[1] = 1;
    inner(1);
    return cache[k];
}

function solve(max)
{
    /*
    let state = execute(max, (state) => {
        for (let i = max; i > 0; i--)
        {
            if (state[i] === undefined)
                return false;
        }
        return true;
    });
    */
    let total = 0;
    for (let i = max; i > 0; i--)
    {
        if (cache[i] === undefined)
            m(i);

        total += cache[i];
    }
    return total;
}

// assert.equal(m(15), 5);

let answer = solve(200);
console.log("Answer is", answer);