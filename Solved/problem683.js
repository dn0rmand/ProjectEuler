const timeLog = require('@dn0rmand/project-euler-tools/src/timeLogger');
const assert  = require('assert');

let DELTA   = 1E-7;

function chase(maxDistance, players)
{
    let odd = (players & 1) != 0;

    let result = 0;
    let states = new Float64Array(maxDistance+1).fill(0);
    let newStates = new Float64Array(maxDistance+1);

    for (let i = 1; i <= maxDistance; i++)
        states[i] = 2/players;

    if (!odd)
        states[maxDistance] = 1/players

    const PLUS1 = 8/36;
    const PLUS2 = 4/36;
    const MINUS1= 8/36;
    const MINUS2= 4/36;
    const SAME  =12/36;

    let maxDelta = 0;

    for(let turn = 1; ; turn++)
    {
        newStates.fill(0);

        let set = (distance, value) => {
            if (distance < 0)
                distance = -distance;
            if (distance > maxDistance)
            {
                distance = (maxDistance+odd) - (distance - maxDistance);
                if (distance < 0)
                    distance = -distance;
            }

            if (distance < 0)
                throw "GRRRR";

            newStates[distance] += value;
        };

        for(let distance = 1; distance <= maxDistance; distance++)
        {
            let last = states[distance];

            set(distance, SAME * last);
            set(distance-1, MINUS1 * last);
            set(distance-2, MINUS2 * last);
            set(distance+1, PLUS1 * last);
            set(distance+2, PLUS2 * last);
        }

        let old = states;
        states = newStates;
        newStates = old;

        let delta = turn * turn * states[0];
        result += delta;

        if (maxDelta < delta)
            maxDelta = delta;

        if (delta < maxDelta && delta < DELTA)
            break;
    }

    return result;
}

function solve(players, precision, trace)
{
    let total = 0;

    while(players > 1)
    {
        if (trace)
            process.stdout.write(`\r${players} `);
        let maxDistance = Math.floor(players / 2);
        total += chase(maxDistance, players);
        players--;
    }

    if (trace)
        console.log('\r');
    total = total.toPrecision(precision);
    return total.replace('+', '');
}

assert.equal(solve(5, 5), "96.544");
assert.equal(solve(50, 9), "2824917.88");

DELTA = 1E-4;

let answer = timeLog.wrap('', () => {
    return solve(500, 9, true);
});
console.log("Answer is", answer);
