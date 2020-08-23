const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const MAX = 1000000

function move(sizes, i, j)
{
    const newSizes = sizes.reduce((r, s, si) => 
    {
        if (si === i)
        {
            const s1 = j;
            const s2 = s-j-2;
            if (s1 >= 2)
                r.push(s1);
            if (s2 >= 2)
                r.push(s2);
        }
        else
            r.push(s);

        return r;
    }, []);

    newSizes.sort((a, b) => a-b);
    return newSizes;
}

function getKey(sizes)
{
    return sizes.join('-');
}

const $loses = new Map();

function loses(sizes)
{
    const key = getKey(sizes);

    const r = $loses.get(key);
    if (r !== undefined)
        return r;

    for(let i = 0; i < sizes.length; i++)
    {
        let s = sizes[i];
        for(let j = 0; j <= s-2; j++)
        {
            const newSizes = move(sizes, i, j);
            if (! wins(newSizes))
            {
                $loses.set(key, false);
                return false;
            }
        }
    }
    $loses.set(key, true);
    return true;
}

const $wins = new Map();

function wins(sizes)
{
    const key = getKey(sizes);

    const r = $wins.get(key);
    if (r !== undefined)
        return r;
    
    for(let i = 0; i < sizes.length; i++)
    {
        let s = sizes[i];
        for(let j = 0; j <= s-2; j++)
        {
            const newSizes = move(sizes, i, j);
            if (loses(newSizes))
            {
                $wins.set(key, true);
                return true;
            }
        }
    }
    $wins.set(key, false);
    return false;
}

function solve(max, trace)
{
    const LENGTH = 15;

    const values = [0];

    const tracer = new Tracer(1, trace);
    
    let total  = max;

    for (let i = 1; values.length < LENGTH && i <= max; i++)
    {
        tracer.print(_ => LENGTH-values.length);

        if (! wins([i]))
        {
            values.push(i);
            total--;
        }
    }

    while (values[values.length-1] < max)
    {
        let n    = values.length;
        let next = values[n-5] + 34;

        if (next <= max)
        {
            values.push(next);
            total--;
        }        
        else
            break;
    }

    tracer.clear();

    return total;
}

assert.equal(solve(5), 3);
assert.equal(solve(50), 40);

console.log('Tests passed');

const answer = timeLogger.wrap(`Solving for ${MAX}`, _ => solve(MAX, true));
console.log(`Answer is ${answer}`);