const assert = require('assert');
const timeLog = require('tools/timeLogger');
const FS = require('fs');

const MAX_LIMITS = 25000;
const TARGET     = 0.5

const limits = (function()
{
    let total  = (Math.PI*Math.PI)/6;

    const limits = [];

    for (let i = 1; i <= MAX_LIMITS; i++)
    {
        limits[i] = total;
        total -= 1/(i*i);
    }

    return limits;
}());

const preCalculation =  (function()
{
    const preCalculation = [];
    for (let i = 1; i <= MAX_LIMITS; i++)
        preCalculation[i] = 1 / (i*i);
    return preCalculation;
})();

const probabilities =  (function()
{
    const probabilities = [];

    let v = 1;
    for (let i = 0; i <= MAX_LIMITS; i++, v /= 2)
        probabilities[i+1] = v;

    return probabilities;
})();

function p1(MAX_DEEP)
{
    let result = 0;

    const inner = (value, i) =>
    {
        if (value > TARGET)
        {
            result += probabilities[i];
            return;
        }

        if (i > MAX_DEEP)
            return;

        if ((value + limits[i+1]) > TARGET)
            inner(value, i+1);
        else if ((value + limits[i]) < TARGET)
            return;

        inner(value + preCalculation[i], i+1);
    }

    inner(0, 1);

    return result.toFixed(8);
}

function p(MAX_DEEP, trace)
{
    const MAX_SIZE = 500000;

    function consolidate(states)
    {
        const EPSILON = 1E-8;

        if (states.length < MAX_SIZE)
            return states;

        states.sort((a,b) => b.sum-a.sum);

        let len = states.length;
        if (len > MAX_SIZE)
        {
            let s1 = states[len-1];
            let s2;

            for(let i = len-1; i > 0; i--)
            {
                s2 = s1;
                s1 = states[i-1];
                if (s2.sum === -1)
                    continue;

                let d = s1.sum-s2.sum;
                if (d <= EPSILON)
                {
                    let newSum = (s1.sum * s1.probability + s2.sum * s2.probability);

                    s1.probability += s2.probability;
                    s1.sum          = newSum / s1.probability;
                    s2.sum          = -1;
                    len--;
                }
            }

            states.sort((a,b) => b.sum-a.sum);
            states.length = len;
        }

        return states;
    }

    let states = [{ sum:0, probability: 1}];
    let result = 0;

    for(let i = 1; i <= MAX_DEEP; i++)
    {
        let newStates = [];

        for (let state of states)
        {
            if (state.sum + limits[i+1] > TARGET) // Can make it with 0
            {
                let p = state.probability / 2;

                // Adding a 1
                let newSum = state.sum + preCalculation[i];
                if (newSum > TARGET)
                    result += p;
                else
                    newStates.push({ sum: newSum, probability: p } );

                // Adding a 0
                newStates.push({ sum: state.sum, probability: p });
            }
            else if (state.sum + limits[i] > TARGET) // Can make it with 1 but not 0
            {
                const p = state.probability / 2;

                // Adding a 1
                let newSum = state.sum + preCalculation[i];
                if (newSum > TARGET)
                    result += p;
                else
                    newStates.push({ sum: newSum, probability: p } );
            }
        }

        states = consolidate(newStates);

        if (trace)
            process.stdout.write(`\r${i} - ${result.toFixed(10)}  `);
    }

    for(let state of states)
    {
        let chances = state.sum / TARGET;

        result += chances * (state.probability / 2);
    }

    if (trace)
        process.stdout.write(`\r${MAX_DEEP} - ${result.toFixed(10)}  \r\n`);

    return result.toFixed(8);
}

//assert.equal(p(20), p1(20));
let answer = timeLog.wrap('', () => p(MAX_LIMITS-1, true));

console.log('Answer is', answer);