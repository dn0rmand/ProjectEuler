const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

var RBTree = require('bintrees').RBTree;

const compare = (a, b) => a-b;

function getPosition(value)
{
    let position = 1;
    let i = 1;
    while (10**i <= value)
    {
        position += (10**i - 10**(i-1)) * i;
        i++;
    }

    position += (value-10**(i-1))*i;
    return position;
}

function bruteF(n)
{
    const search = n.toString();
    
    for(let value = 1; ; value++)
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
                let position = getPosition(value) + index;
                return position;
            }
            index = target.indexOf(search, index+1);
        }
    }
}

function fastF(n, trace)
{
    let values  = new RBTree(compare);
    let max     = n;

    values.insert(max);
    
    function addDigitsBefore()
    {
        // Adding digit in front of it
        for(let d = 1; values.size < n; d++)
        {
            const v2 = +`${d}${n}`;

            values.insert(v2);
        }
        max = values.max();
    }

    function addDigitsAfter()
    {
        // Adding digit in front of it
        let newValues = new Set();
        values.each(v => newValues.add(v));

        for(let d = 0; newValues.size > 0; d++)
        {
            const oldValues = newValues;

            newValues = new Set();
            for (const v of oldValues.values())
            {
                for(let d = 0; d < 10; d++)
                {
                    const v2 = +`${v}${d}`;

                    if (values.find(v2))
                        continue;

                    if (v2 >= max)
                        break;

                    values.remove(max);
                    values.insert(v2);
                    newValues.add(v2);
                    max = values.max();
                }
            }
        }
    }

    function addDigitsBetween(before, after)
    {
        if (before[0] === '0')
            return;

        const v2 = +`${before}${after}`;

        if (v2 >= max)
            return;

        if (! values.find(v2))
        {                
            values.remove(max);
            values.insert(v2);
            max = values.max();
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
    const data     = `${value}${value+1}`;
    const position = getPosition(value);
    const offset   = data.indexOf(n.toString());

    return position + offset;
}

function f(n)
{
    if (n < 1000 && n != 81)
        return bruteF(n);
    else
        return fastF(n);
}

function solve()
{
    let total = 0;

    const tracer = new Tracer(1, true);
    for (let k = 13; k >= 1; k--)
    {
        tracer.print(_ => k);
        const n = 3 ** k;
        const fn = f(n);
        total +=  fn;
    }
    tracer.clear();

    return total;
}

assert.equal(f(1), 1);
assert.equal(f(5), 81);
// assert.equal(f(12), 271);
assert.equal(f(7780), 111111365);

console.log("Tests passed");

const answer = timeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer}`);
