const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

const MAX = 1E12;

function isSS(s)
{
    let n = Math.sqrt(s);
    if (n !== Math.floor(n))
        return false;

    return isS(s, n);
}

function isS(s, n, ok)
{
    if (n < 0 || n > s)
        return false;

    if (n === s)
        return !!ok;
    
    for (let div = 10; ; div *= 10)
    {
        let v = s % div;
        let w = (s - v) / div;
        if (isS(w, n-v, true))
            return true;

        if (w === 0)
            break;
    }

    return false;
}

function solve(N)
{
    let total = 0;
    const max = Math.floor(Math.sqrt(N));

    let o1 = 1;
    let o8 = 8;

    for(let n = 9; n <= max; n += o8)
    {
        const s = n*n;

        if (isS(s, n))
            total += s;
            
        const ot = o1;
        o1 = o8;
        o8 = ot;
   }

    return total;
}

assert.equal(isSS(81), true);
assert.equal(isSS(6724), true);
assert.equal(isSS(8281), true);
assert.equal(isSS(9801), true);

assert.equal(solve(1E4), 41333);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(MAX));

console.log(`answer is ${answer}`);