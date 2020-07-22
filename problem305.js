const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');
const { set } = require('d3');

function getPosition(value)
{
    value = BigInt(value);
    let position = 1n;
    let i = 1n;
    while (10n**i <= value)
    {
        position += (10n**i - 10n**(i-1n)) * i;
        i++;
    }

    position += (value-10n**(i-1n))*i;
    return position;
}

function bruteF(n)
{
    const search = n.toString();
    
    for(let value = 1n; ; value++)
    {
        let target = `${value}`;
        let maxIndex = target.length;
        let v = value;
        while(target.length < search.length*2)
        {
            target += `${++v}`
        }
        let index = target.indexOf(search);
        while(index >= 0 && index < maxIndex)
        {
            if (--n === 0)
            {
                let position = getPosition(value) + BigInt(index);
                return position;
            }
            index = target.indexOf(search, index+1);
        }
    }
}

function fastF(n, trace)
{
    let values  = new Set();
    let max     = BigInt(n);

    values.add(max);
    
    function addDigitsBefore()
    {
        // Adding digit in front of it
        for(let d = 1; values.size < n; d++)
        {
            const v2 = BigInt(`${d}${n}`);

            values.add(v2);
            max = v2;
        }
    }

    function addDigitsAfter()
    {
        // Adding digit in front of it
        let newValues = new Set(values.values());

        for(let d = 0; newValues.size > 0; d++)
        {
            const oldValues = newValues;

            newValues = new Set();
            for (const v of oldValues.values())
            {
                for(let d = 0; d < 10; d++)
                {
                    const v2 = BigInt(`${v}${d}`);

                    if (values.has(v2))
                        continue;

                    if (v2 >= max)
                        break;

                    values.delete(max);
                    values.add(v2);
                    newValues.add(v2);
                    max = v2;
                    values.forEach(x => { 
                        if (x >= max) 
                            max = x;
                    });
                }
            }
        }
    }

    function addDigitsBetween(before, after)
    {
        if (before === '0')
            return;

        const v2 = BigInt(`${before}${after}`);
        if (v2 >= max)
            return;

        if (! values.has(v2))
        {                
            values.delete(max);
            values.add(v2);
            max = v2;
            values.forEach(x => { 
                if (x > max) 
                    max = x;
            });
        }

        // Adding digit in front of it
        for(let x = 0; x < 10; x++)
            addDigitsBetween(`${before}${x}`, after);
    }

    addDigitsBefore();
    addDigitsAfter();

    const search = n.toString();
    for(let i = 1; i < search.length; i++)
    {
        const before = search.substring(0, i);
        const after  = search.substring(i);

        if (! after)
            continue;
        if (! before)
            continue;

        addDigitsBetween(after, before);
    }

    const value    = max;
    const data     = `${value}${value+1n}`;
    const position = getPosition(value);
    const offset   = data.indexOf(n.toString());

    return position + BigInt(offset);
}

function f(n, trace)
{
    if (n < 1000)
        return bruteF(n, trace);
    else
        return fastF(n, trace);
}

function solve()
{
    let total = 0n;

    for (let k = 13; k >= 1; k--)
    {
        let n = 3 ** k;

        total += f(n);
    }

    return total;
}

assert.equal(f(7780, true), 111111365);
assert.equal(f(1), 1);
assert.equal(f(5), 81);
assert.equal(f(12), 271);

console.log("Tests passed");

const answer = timeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer}`);
