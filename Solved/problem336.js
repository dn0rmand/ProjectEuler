// Maximix Arrangements
// --------------------
// Problem 336
// -----------

// maximix(6) = 24

const assert = require('assert');

function *generate(length)
{
    let used = [];
    let carriages = [];

    function *inner(index)
    {
        if (index === length)
        {
            yield Array.from(carriages);
            return;
        }

        for (let i = 0; i < length; i++)
        {
            if (used[i] === 1)
                continue;

            used[i] = 1;
            carriages[index] = i;
            yield *inner(index+1);
            used[i] = 0;
        }
    }

    yield *inner(0);
}

function swap(carriages, start)
{
    let idx1 = start;
    let idx2 = carriages.length-1;

    if (idx1 === idx2)
        return 0;
    while (idx2 > idx1)
    {
        let v = carriages[idx1];
        carriages[idx1] = carriages[idx2];
        carriages[idx2] = v;
        idx1++;
        idx2--;
    }
    return 1;
}

function sort(carriages)
{
    let index = 0;
    let steps = 0;

    while (index < carriages.length)
    {
        if (carriages[index] !== index)
        {
            let idx1 ;
            for (let i = index+1; i < carriages.length; i++)
            {
                if (carriages[i] === index)
                {
                    idx1 = i;
                    break;
                }
            }
            if (idx1 === undefined)
                throw "ERROR";

            steps += swap(carriages, idx1);
            steps += swap(carriages, index);
        }
        index++;
    }

    return steps;
}

function maximix(length, maxSteps, target)
{
    let count = 0;
    let key   = undefined;

    for (let carriages of generate(length))
    {
        let s;

        if (count === target-1)
            s = Array.from(carriages);

        let steps = sort(carriages, 0);

        if (steps === maxSteps)
        {
            count++;
            if (count === target)
            {
                key = s;
                break;
            }
        }
    }

    if (key === undefined)
        throw "NOT FOUND";

    let result = "";
    let A = "A".charCodeAt(0);

    for (let c of key)
    {
        result += String.fromCharCode(c + A);
    }
    return result;
}

assert.equal(maximix(6, 9, 10), "DFAECB");

console.time(336);
let answer = maximix(11, 19, 2011);
console.timeEnd(336);
console.log('Answer is', answer)