const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const MAX = 200000;

const $memoize_C = [];

// A276128
function C(maxValue)
{
    function inner(min, max)
    {
        if (min >= max)
            return { 
                value:0, 
                guesses: 0, 
                guess: 0 
            };

        if (min+1 === max)
            return { 
                value: min, 
                guesses: 1, 
                guess: min
            };

        if ($memoize_C[min] === undefined)
            $memoize_C[min] = [];
        if ($memoize_C[min][max] !== undefined)
            return $memoize_C[min][max];

        let result = {
            value: Number.MAX_SAFE_INTEGER,
            guesses: 0
        };

        let start = Math.floor((min+max)/2);
        for(let guess = start; guess <= max; guess++)
        {
            const pass2 = inner(min, guess-1);
            const pass1 = inner(guess+1, max);

            const pass  = pass1.value < pass2.value ? pass2 : pass1;

            if (pass.value+guess < result.value)
            {
                result = { 
                    value: pass.value+guess, 
                    guesses: pass.guesses+1, 
                    guess: guess,
                    next: pass
                };
            }
        }

        $memoize_C[min][max] = result;

        return result;
    }

    let answer = inner(1, maxValue);

    return answer.value;
}

function solve(max, trace)
{
    let total = 0;
    const tracer = new Tracer(100, trace);
    for (let i = 1; i <= max; i++)
    {
        tracer.print(_ => max-i);
        total += C(i, trace);
    }
    tracer.clear();
    return total;
}

assert.equal(C(1), 0);
assert.equal(C(2), 1);
assert.equal(C(8), 12);
assert.equal(C(100), 400);
assert.equal(timeLogger.wrap('', _ => solve(100)), 17575);

console.log("Tests passed");

console.log(timeLogger.wrap('', _ => solve(2000, true)));
