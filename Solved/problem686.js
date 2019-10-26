const assert = require('assert');
const timeLog = require('tools/timeLogger');

function p(e, count)
{
    let min = Math.log10(e);
    let max = Math.log10(e+1);

    min = min - Math.floor(min);
    max = max - Math.floor(max);

    for (let i = 2; ; i++)
    {
        let v = (i * Math.log10(2));
        v = v - Math.floor(v);

        if (v >= min && v <= max)
        {
            if (--count == 0)
                return i;
        }
    }
}

assert.equal(p(12, 1), 7);
assert.equal(p(12, 2), 80);
assert.equal(p(123, 45), 12710);

let answer = timeLog.wrap('', () => {
    return p(123, 678910);
});
console.log("Answer is", answer);