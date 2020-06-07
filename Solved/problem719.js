const assert = require('assert');
const timeLogger = require('tools/timeLogger');

const MAX = 1E12;

function isSS(s)
{
    let n = Math.sqrt(s);
    if (n !== Math.floor(n))
        return false;

    return isS(s, n, 1);
}

function isS(s, n, count)
{
    if (n < 0 || n > s)
        return false;

    if (n === s)
        return count >= 2;
    
    for (let div = 10; ; div *= 10)
    {
        let v = s % div;
        let w = (s - v) / div;        
        if (isS(w, n-v, count+1))
            return true;

        if (w === 0)
            break;
    }

    return false;
}

function solve(max)
{
    let total = 0;

    for(let n = 2; ; n++)
    {
        let s = n*n;
        if (s > max)
            break;

        if (isS(s, n, 1))
            total += s;
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