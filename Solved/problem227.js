const assert = require('assert');
const timeLog = require('tools/timeLogger');

const MIN_DELTA = 1E-11

const SAME   = 18/36;
const PLUS1  = 8/36;
const PLUS2  = 1/36;
const MINUS1 = 8/36;
const MINUS2 = 1/36;

class StateCollection
{
    constructor(players)
    {
        assert.equal(players & 1, 0);

        this.middle= players / 2;
        this.inner = new Float64Array(this.middle+1).fill(0);
        this.inner[this.middle] = 1;
    }

    clear()
    {
        this.inner.fill(0);
    }

    add(distance, probability)
    {
        if (distance < 0)
            distance = Math.abs(distance);
        else if (distance > this.middle)
            distance = this.middle+this.middle-distance;

        this.inner[distance] += probability;
    }

    forEach(callback)
    {
        this.inner.forEach((value, distance) => {
            if (value != 0)
                callback(distance, value);
        });
    }
}

function solve(players)
{
    assert.equal(players & 1, 0);

    let states    = new StateCollection(players);
    let newStates = new StateCollection(players);

    let oldDelta = 0;
    let result    = 0;

    for(let turn = 0; ; turn++)
    {
        newStates.clear();

        let delta = 0;

        states.forEach((distance, value) =>
        {
            if (distance == 0)
            {
                delta += turn * value;
            }
            else
            {
                newStates.add(distance + 0, value * SAME);// distance remain the same

                newStates.add(distance - 2, value * MINUS2); // a 1 and a 6
                newStates.add(distance + 2, value * PLUS2); // a 6 and a 1

                newStates.add(distance - 1, value * MINUS1); // a 6 and neither 1 or 6
                newStates.add(distance + 1, value * PLUS1); // a 1 and neither 1 or 6
            }
        });

        result += delta;

        if (delta < oldDelta)
            if (delta < MIN_DELTA)
                break;

        oldDelta = delta;

        [states, newStates] = [newStates, states];
    }

    return result.toPrecision(10);
}

const PLAYERS = 100;

let answer = timeLog.wrap(`Solving for ${PLAYERS} players`, () => {
    return solve(PLAYERS);
});

console.log("Answer is", answer);