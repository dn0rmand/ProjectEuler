const assert = require('assert');
const MODULO = 1E9;
const LENGTH = 11**12;

function makeKey(sum, modulo)
{
    return (sum * 23) + modulo;
}

function S(size, trace)
{
    let newStates = new Uint32Array(24*23);
    let states = new Uint32Array(24*23);

    for (let d = 1; d < 10; d++)
    {
        newStates[makeKey(d, d)] = 1;
    }

    let length = 0;
    let total  = 0;
    let tracer = 1;

    while (++length <= size)
    {
        if (trace)
        {
            if (tracer === 0)
                process.stdout.write(`\r${size-length}  `);

            if (++tracer === 10000)
                tracer = 0;
        }

        let oldStates = states;
        states = newStates;
        newStates = oldStates;
        newStates.fill(0);

        let addState = (sum, modulo, count) =>
        {
            if (sum > 23)
                return;

            modulo %= 23;

            let k = makeKey(sum, modulo);
            let state = newStates[k];
            if (state !== undefined)
                state = (state + count) % MODULO;
            else
                state = count;

            newStates[k] = state;
        };

        for (let idx = 0; idx < states.length; idx++)
        {
            let state = states[idx];
            if (! state)
                continue;

            let modulo = (idx % 23);
            let sum    = (idx - modulo) / 23;

            if (sum === 23)
            {
                if (modulo === 0)
                {
                    let count = ((size-length)+1) % MODULO;
                    count = (count * state) % MODULO;

                    total = (total + count) % MODULO;
                }
            }
            else
            {
                addState(sum, modulo * 10, state);

                for (let d = 1; d < 10; d++)
                {
                    addState(sum + d, (modulo * 10) + d, state);
                }
            }
        }
    }

    if (trace)
        console.log(`\r${size}`);

    return total;
}

// assert.equal(S(9),  263626);
assert.equal(S(42), 878570056);

let answer = S(LENGTH, true);

console.log('Answer is', answer);