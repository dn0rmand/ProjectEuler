const assert = require('assert');
const MODULO = 1E9;
const LENGTH = 11**12;

function makeKey(sum, modulo)
{
    return (sum * 23) + modulo;
}

function S(size, trace)
{
    let newStates = [];

    for (let d = 1; d < 10; d++)
    {
        newStates[makeKey(d, d)] = {
            sum: d,
            modulo: d,
            count: 1
        };
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

            if (++tracer === 1000)
                tracer = 0;
        }

        let states = newStates;

        newStates = [];

        let addState = (sum, modulo, count) =>
        {
            if (sum > 23)
                return;

            modulo %= 23;

            let k = makeKey(sum, modulo);
            let state = newStates[k];
            if (state !== undefined)
            {
                state.count += count;
            }
            else
            {
                newStates[k] = { sum: sum, modulo: modulo, count: count };
            }
        };

        for (let state of states)
        {
            if (state === undefined)
                continue;

            if (state.sum === 23)
            {
                if (state.modulo === 0)
                {
                    let count = ((size-length)+1) % MODULO;
                    count = (count * state.count) % MODULO;

                    total = (total + count) % MODULO;
                }
            }
            else if (length !== size) // last loop so don't case about new states
            {
                addState(state.sum, state.modulo * 10, state.count);

                for (let d = 1; d < 10; d++)
                {
                    addState(state.sum + d, (state.modulo * 10) + d, state.count);
                }
            }
        }
    }

    if (trace)
        console.log(`\r${size}`);

    return total;
}

assert.equal(S(9),  263626);
assert.equal(S(42), 878570056);

let answer = S(LENGTH, true);

console.log('Answer is', answer);