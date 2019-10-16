const timeLog = require('tools/timeLogger');
const DELTA   = 1E-11;

function solve(PLAYERS)
{
    const MIDDLE = Math.floor(PLAYERS/2);

    let result = 0;
    let states = new Float64Array(MIDDLE+1).fill(0);
    let newStates = new Float64Array(MIDDLE+1);

    states[MIDDLE] = 1;

    const PLUS1 = 8/36;
    const PLUS2 = 1/36;
    const MINUS1= 8/36;
    const MINUS2= 1/36;
    const SAME  = 18/36;

    const MIN_ITERATIONS = PLAYERS*PLAYERS;

    for(let turn = 1; ; turn++)
    {
        newStates.fill(0);

        for(let distance = 1; distance <= MIDDLE; distance++)
        {
            let last = states[distance];

            newStates[distance]   += SAME * last;
            newStates[distance-1] += MINUS1 * last;

            if (distance == 1)
            {
                newStates[distance]   += MINUS2 * last;
                newStates[distance+1] += PLUS1 * last;
                newStates[distance+2] += PLUS2 * last;
            }
            else if (distance == MIDDLE-1)
            {
                newStates[distance]   += PLUS2 * last;
                newStates[distance-2] += MINUS2 * last;
                newStates[distance+1] += PLUS1 * last;
            }
            else if (distance == MIDDLE)
            {
                newStates[distance-1] += PLUS1 * last;
                newStates[distance-2] += (MINUS2 + PLUS2) * last;
            }
            else
            {
                newStates[distance-2] += MINUS2 * last;
                newStates[distance+1] += PLUS1 * last;
                newStates[distance+2] += PLUS2 * last;
            }
        }

        let old = states;
        states = newStates;
        newStates = old;

        let delta = turn * states[0];
        result += delta;
        if (turn > MIN_ITERATIONS && delta < DELTA)
            break;
    }

    return result.toPrecision(10);
}

let answer = timeLog.wrap('', () => {
    return solve(100);
});
console.log("Answer is", answer);
