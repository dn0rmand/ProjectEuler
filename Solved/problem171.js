const assert = require('assert');
const prettyTime= require("pretty-hrtime");

require('tools/numberHelper');

const MODULO  = 1E9;
const MAX     = 20;
const squares = [0, 1, 4, 9, 16, 25, 36, 49, 64, 81];

const bigSquares = (function() {
    const result = {};
    const max = MAX * 81;

    for (let x = 1; ; x++)
    {
        const s = x*x;
        if (s > max)
            break;
        result[s] = x;
    }

    return result;
})();

//
// Useless method but there only to run the examples
//
function f(n)
{
    let total = 0;

    while (n > 0)
    {
        let d = n % 10;
        n = (n-d)/10;

        total = (total + squares[d]) % MODULO;
    }

    return total;
}

//
// Brute force to get example numbers
//
function examples(maxLength)
{
    if (maxLength > 10)
        throw "You're kidding, right!";

    let total = 0;

    const processed = [];
    const digits = [];

    function inner(sum, value)
    {
        if (digits.length > maxLength)
            return;

        if (bigSquares[sum])
        {
            let k = digits.join('');
            if (! processed[k])
            {
                total = (total + value) % MODULO;
            }
        }

        if (digits.length < maxLength)
        {
            let start = digits.length === 0 ? 1 : 0;

            for (let d = start; d < 10; d++)
            {
                digits.push(d);
                inner(sum + squares[d], (value*10 + d) % MODULO);
                digits.pop();
            }
        }
    }

    inner(0, 0);
    return total;
}

function solve(maxLength)
{
    function update(newState, ns, sum, count)
    {
        if (newState[ns])
        {
            newState[ns].sum   = (newState[ns].sum   + sum)   % MODULO;
            newState[ns].count = (newState[ns].count + count) % MODULO;
        }
        else
        {
            newState[ns] = {sum: sum, count: count};
        }
    }

    const MAX_SUM = maxLength * 81;
    let state = [];

    for (let d = 1; d < 10; d++)
        state[d*d] = { sum:d, count:1 };

    let pow = 1;
    for (let l = 2; l <= maxLength; l++)
    {
        pow = pow.modMul(10, MODULO);

        let newState = [];

        for (let i = 0; i < state.length; i++)
            if (state[i])
                newState[i] = {sum: state[i].sum, count: state[i].count };

        // new Numbers with only zero after
        for (let d = 1; d < 10; d++)
            update(newState, d*d, pow.modMul(d, MODULO), 1);

        for (let s = 1; s <= MAX_SUM; s++)
        {
            if (state[s] === undefined)
                continue;

            const {count, sum} = state[s];
            const p            = pow.modMul(count || 1, MODULO);

            // adding other digits
            for (let d = 1; d < 10; d++)
            {
                const sum2   = (sum + p.modMul(d, MODULO)) % MODULO;
                const ns     = s + (d*d);

                update(newState, ns, sum2, count);//*2);
            }
        }
        state = newState;
    }

    let total = 0;
    for (let square of Object.keys(bigSquares))
    {
        let s = +square;
        if (state[s] && state[s].count > 0 && state[s].sum > 0)
        {
            total = (total + state[s].sum) % MODULO;
        }
    }

    return total;
}

assert.equal(f(3), 9);
assert.equal(f(25), 29);
assert.equal(f(442), 36);

assert.equal(solve(2), examples(2));
assert.equal(solve(3), examples(3));
assert.equal(solve(4), examples(4));
assert.equal(solve(5), examples(5));

let timer = process.hrtime();
const answer = solve(MAX);
timer = process.hrtime(timer);

console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));
