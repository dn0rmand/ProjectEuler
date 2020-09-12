const assert = require('assert');
const timeLogger = require('tools/timeLogger');

const MODULO = 10n ** 16n;

function S(length)
{
    const startState = {
        count: 1n,
        max: 0,
        sum: 0,
        value: 0n,
    };

    let states = startState;
    
    for(let i = 0; i < length; i++)
    {
        const visited = [];
        let newStates = undefined;

        for(let state = states; state; state = state.next)
        {
            let value = state.value * 10n;
            
            for(let digit = 0; digit < 10; digit++, value += state.count)
            {
                if (state.sum + digit > 18)
                    break;

                if (value > MODULO)
                    value %= MODULO;

                const newState = {
                    next:  newStates,
                    count: state.count,
                    sum:   state.sum + digit,
                    max:   digit >= state.max ? digit : state.max,
                    value,
                };

                const k = newState.max + 10*newState.sum;
                const o = visited[k];

                if (o)
                {
                    o.count = (o.count + newState.count) % MODULO;
                    o.value = (o.value + newState.value) % MODULO;
                }
                else
                {
                    visited[k] = newState;
                    newStates  = newState;
                }
            }
        }

        states = newStates;
    }

    let total = 0n;
    for(let s = states; s ; s = s.next)
    {
        if (s.max === s.sum-s.max)
        {
            total = (total + s.value);
        }
    }
    return total % MODULO;
}

assert.strictEqual(S(3), 63270n);
assert.strictEqual(S(7), 85499991450n);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => S(2020));
console.log(`Answer is ${answer}`);