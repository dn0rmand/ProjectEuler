const assert = require('assert');
const timeLog = require('@dn0rmand/project-euler-tools/src/timeLogger');
/*
1 state:
    key = 3letters + 4counts
    3 last letters
    count FREE
    count REEF
    count FARE
    count AREA
    total
*/

function makeKey(state)
{
    if (state.bad)
        return '<BAD>';
    else
        return state.letters + `:${state.frees}:${state.reefs}:${state.fares}:${state.areas}`;
}

function addLetter(state, letter)
{
    if (state.bad)
        return undefined;

    let s = {
        letters:state.letters + letter,
        frees:state.frees,
        reefs:state.reefs,
        fares:state.fares,
        areas:state.areas,
        count:state.count
    };

    if (s.letters == 'FREE')
        s.frees++;
    else if (s.letters == 'REEF')
        s.reefs++;
    else if (s.letters == 'FARE')
        s.fares++;
    else if (s.letters == 'AREA')
        s.areas++;

    if (s.areas > 1 || s.frees > 1 || s.reefs > 1 || s.fares > 1)
    {
        return undefined;
    }

    if (s.letters.length > 3)
    {
        s.letters = s.letters.substring(1);
    }

    return s;
}

function f(max)
{
    let length = 1;
    let states = [];
    let letters= ['A', 'E', 'F', 'R'];

    for (let letter of letters)
    {
        let state = { letters:letter, frees:0, reefs:0, fares:0, areas:0, count:1n };

        states.push(state) ;
    }

    while (length++ < max)
    {
        let newStates = {};

        for (let state of states)
        {
            for (let letter of letters)
            {
                let state2 = addLetter(state, letter);
                if (! state2)
                    continue; // Don't store bad states

                let key = makeKey(state2);

                let old = newStates[key];
                if (old)
                    old.count += state.count;
                else
                    newStates[key] = state2;
            }
        }

        states = Object.values(newStates);
    }

    let total = 0n;

    for (let state of states)
    {
        if (state.frees == 1 && state.reefs == 1 && state.fares == 1 && state.areas == 1)
            total += state.count;
    }

    return total;
}

assert.equal(f(9), 1);
assert.equal(f(15), 72863);

let answer = timeLog.wrap('', () => { return f(30); });

console.log(`Answer is ${answer}`);

answer = timeLog.wrap('', () => { return f(100); });
console.log(`f(100) is ${answer}`);

answer = timeLog.wrap('', () => { return f(1000); });
console.log(`f(1000) is ${answer}`);
