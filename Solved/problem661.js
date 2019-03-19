const assert = require('assert');
const prettyTime= require("pretty-hrtime");

const LIMIT  = 2000
const SIZE = LIMIT*2+10;
const buffer1 = new Float64Array(LIMIT*2+10);
const buffer2 = new Float64Array(LIMIT*2+10);

let STOP = 1e-10;

function EA(pa, pb, p)
{
    let p0 = 1 - pa - pb;

    let newStates = buffer1;
    let states    = buffer2;

    for (let i = 0; i < SIZE; i++)
    {
        states[i] = 0;
        newStates[i] = 0;
    }

    let min = 0;
    let max = 0;

    function playGame()
    {
        let t = 0;
        for (let i = min; i <= max; i++)
        {
            let j = i+1+LIMIT;
            newStates[j] = (states[j] * p0) + (states[j-1] * pa) + (states[j+1] * pb);
            if (i > 0)
                t += newStates[j];
        }

        if (min > -LIMIT)
        {
            let j = min + 1 + LIMIT;
            newStates[j-1] = states[j] * pb;
            min--;
        }
        else
        {
            let j = min + 1 + LIMIT;
            newStates[j] += states[j] * pb;
        }

        if (max < LIMIT)
        {
            let j = max+1+LIMIT;
            t += (newStates[j+1] = states[j] * pa);
            max++;
        }
        else
        {
            let j = max+1+LIMIT;
            t += (newStates[j] += states[j] * pa);
        }

        let old = states;
        states = newStates;
        newStates = old;

        return t;
    }

    let total = 0;
    let coef  = 1;

    states[LIMIT+1] = 1;

    for (let game = 1; ; game++)
    {
        let t = playGame();

        t *= coef;

        total += t;

        coef = coef * (1-p);

        if (coef < STOP)
            break;
    }

    return total;
}

function H(min, max, trace)
{
    let total = 0;

    for (let k = min; k <= max; k++)
    {
        let pa = 1 / Math.sqrt(k+3);
        let pb = pa + 1 / (k*k);
        let p  = 1 / (k*k*k);

        total += EA(pa, pb, p);
        if (trace)
            process.stdout.write(`\r${k} - ${total.toFixed(6)}`);
    }
    if (trace)
        console.log('');
    return total.toFixed(4);
}

console.log('Running Tests');
assert.equal(EA(0.25, 0.25, 0.5).toFixed(6), "0.585786");
assert.equal(EA(0.47, 0.48, 0.001).toFixed(6), "377.471736");
assert.equal(H(3, 3), "6.8345");
console.log('Tests passed');

let timer = process.hrtime();
let answer = H(3, 50, true);
timer = process.hrtime(timer);
console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));

// 646188.7504