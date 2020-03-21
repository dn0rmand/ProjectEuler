const assert = require('assert');

function get(index)
{
    let current = 0n;
    let f0 = 1n;
    let f1 = 2n;

    for(let i = 0; i < index; i++)
    {
        current += f0;

        if ((i & 1) === 0)
            current += f0;
        
        [f0, f1] = [f1, f1+f0];
        [f0, f1] = [f1, f1+f0];
    }
    return current;
}

function solve(index)
{    
    let total = 0n;

    for(let i = 1; i <= index; i++)
    {
        total += get(i);
    }

    return total;
}

// brute forced first one with problem140.py => 2, 5, 21, 42

assert.equal(get(20), 211345365);
const answer = solve(30);
console.log(`Answer is ${answer}`);