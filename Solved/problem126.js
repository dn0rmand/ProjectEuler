const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

const MAX = 50000;

const $C = new Uint32Array(MAX+1); 

function calculate(w, h, d)
{
    let c = 2*(w*h + h*d + d*w);
    let B = 0;
    let A = w+h+d;

    while (c <= MAX)
    {            
        $C[c]++;
        c = c + 4*A + B;
        B += 8;
    }
}

function preload()
{
    for(let w = 1; ; w++)
    {
        if ((2*w + 4) > MAX)
            break;

        for(let h = 1; h <= w; h++)
        {
            if (2*(w*h + h + w) > MAX)
                break;

            for(let d = 1; d <= h; d++)
            {
                if (2*(w*h + h*d + d*w) > MAX)
                    break;

                calculate(w, h, d);
            }
        }
    }
}

function C(n)
{
    return $C[n];
}

function solve(target)
{
    return $C.findIndex(value => value === target);
}

const answer = timeLogger.wrap('', _ => {
    preload();

    assert.equal(C(22), 2);
    assert.equal(C(46), 4);
    assert.equal(C(78), 5);
    assert.equal(C(118), 8);
    assert.equal(C(154), 10);

    assert.equal(solve(20), 286);

    console.log('Tests passed');

    return solve(1000, true);
});

console.log(`Answer is ${answer}`);