const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

const MAX_T = 1000000;

const L = new Int32Array(MAX_T+1).fill(0);

function preLoad()
{
    for(let outer = 3; ; outer++)
    {
        const outer2 = outer*outer;
        let tiles = outer2 - (outer-2)*(outer-2);
        if (tiles > MAX_T)
            break;

        for(let inner = outer-2; inner > 0; inner -= 2) {
            tiles = outer2 - inner*inner;

            if (tiles > MAX_T)
                break;
            
            L[tiles]++;
        }
    }
}

function N(n)
{
    return L.reduce((count, v) => count += (v === n), 0);
}

function solve(max)
{
    let total = 0;

    for(let n = 1; n <= max; n++)
        total += N(n);
    
    return total;
}

timeLogger.wrap('', _ => {
    preLoad();

    assert.strictEqual(L[8], 1);
    assert.strictEqual(L[32], 2);
    assert.strictEqual(N(15, true), 832);

    console.log('Tests passed');

    const answer = solve(10);
    console.log(`Answer is ${answer}`);
});