const assert = require('assert');
const Tracer = require('tools/tracer');

function s({a, b})
{
    return { a: a+a, b: b+1n };
}

function r({a, b})
{
    return { a: a+1n, b: b+b };
}

function brute({a, b}, steps, trace)
{
    const tracer = new Tracer(1, trace);

    let states = [{a, b}];

    if (! steps)
        steps = 1;

    while(true)
    {
        steps++;

        tracer.print(_ => `${steps} - ${states.length}`);

        const newStates = [];

        for(const {a, b, path} of states)
        {
            const s1 = s({a, b});
            const s2 = r({a, b});

            if (s1.a === s1.b) 
            {
                tracer.clear();
                if (! trace)
                    return steps;
                else
                    return s1.a;
            }
            else if (s2.a === s2.b) 
            {
                tracer.clear();
                if (! trace)
                    return steps;
                else
                    return s2.a;
            }

            newStates.push(s1);
            newStates.push(s2)
        }

        states = newStates;
    }
}

function solve()
{
    let state = { a: 45n, b: 90n };
    let path  = 'R';

    state = r(state);

    let steps = 2;
    while (! state.b.toString(2).startsWith(state.a.toString(2)))
    {
        steps++;
        state = r(state);
        path += 'R';
    }

    while (steps < 80) 
    {
        steps++;
        state = s(state);
    }

    const answer = brute(state, steps, true);

    return answer;
}

assert.strictEqual(brute({ a: 45n, b: 90n }), 10);

const answer = solve();
console.log(`Answer is ${answer}`);