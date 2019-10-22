const timeLog = require('tools/timeLogger');
const DELTA   = 1E-11;

function chase(maxDistance, startingDistance)
{
    let result = 0;
    let states = new Float64Array(maxDistance+1).fill(0);
    let newStates = new Float64Array(maxDistance+1);

    states[startingDistance] = 1;

    //   1 - 2,3,4,5 - 6
    // 1/6 -   4/6   - 1/6

    // const SAME   = 18/36;
    // const PLUS1  = 8/36;
    // const PLUS2  = 1/36;
    // const MINUS1 = 8/36;
    // const MINUS2 = 1/36;

    // 1,2 - 3,4 - 5,6
    // 2/6 - 2/6 - 2/6

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
                distance = maxDistance - (distance - maxDistance);
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

function solve(players, trace)
{
    let total = 0;

    while(players > 1)
    {
        let subTotal = 0;
        let maxDistance = Math.floor(players / 2);
        let prob = 1 / (players-1);

        for (let distance = 1; distance <= maxDistance; distance++)
        {
            if (trace)
                process.stdout.write(`\r  ${ players } - ${ distance }  \r`)
            let r = chase(maxDistance, distance);

            if ((players & 1) == 0 && distance == maxDistance)
                subTotal += r*prob;
            else
                subTotal += r*2*prob;
        }

        total += subTotal;
        players--;
    }

    if (trace)
        console.log('\r');
    return total.toPrecision(9);
}

console.log(solve(5));

let answer = timeLog.wrap('', () => {
    return solve(100);
});
console.log("Answer is", answer);
