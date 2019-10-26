const assert = require('assert');
const timeLog = require('tools/timeLogger');

const LOG2 =  Math.log10(2);

function p(e, count)
{
    const min = Math.log10(e) % 1;
    const max = Math.log10(e+1) % 1;

    let v = LOG2;
    for (let i = 2; ; i++)
    {
        v += LOG2;
        if (v >= 1)
            v -= 1;

        if (v >= min && v <= max && --count == 0)
            return i;
    }
}

assert.equal(p(12, 1), 7);
assert.equal(p(12, 2), 80);
assert.equal(p(123, 45), 12710);

let answer = timeLog.wrap('', () => {
    return p(123, 678910);
});
console.log("Answer is", answer);