const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

const MODULO = 123123123n;
const MAX    = 111111111111222333n;

const validLength = new Set();

function preLoad(max)
{
    function fix(value)
    {
        let i = value.lastIndexOf('0');
        if (i > 0)
        {
            let start = value.substr(0, i);
            let end   = '3' + value.substr(i+1);
            start = Number.parseInt(start, 3)-1;
            if (start === 0)
                return end;
            else
                return fix(start.toString(3)) + end;
        }
        else if (i === 0)
        {
            return '3' + value.substr(1);
        }
        else
            return value;
    }

    function validate(value)
    {
        if (value >= 1 && value <= 3)
            return true;

        let ds = [0, 0, 0, 0];

        while (value > 0)
        {
            let d = value % 10;
            if (d < 1 || d > 3)
                return false;
            ds[d]++;
            value = (value - d) / 10;
        }

        if (ds[1] && ! validate(ds[1]))
            return false;
        if (ds[2] && ! validate(ds[2]))
            return false;
        if (ds[3] && ! validate(ds[3]))
            return false;

        return true;
    }

    validLength.add(0);

    let position = 0;
    while (position <= max)
    {
        let value = fix((++position).toString(3));
        value = parseInt(value, 10);

        if (validate(value))
            validLength.add(value);
    }
}

preLoad(300);

function factorial(n)
{
    let total = 1n;
    n = BigInt(n);
    for (let i = 2n; i <= n; i++)
        total *=  i;

    return  total;
}

function getCount(digits, prefix)
{
    prefix = prefix || [];
    const d1 = prefix.filter(a => a === 1).length;
    const d2 = prefix.filter(a => a === 2).length;
    const d3 = prefix.filter(a => a === 3).length;

    let count = 0n;

    for (let ones = 0; ones <= digits; ones++)
    {
        if (! validLength.has(d1+ones))
            continue;

        for (let twos = 0; ones+twos <= digits; twos++)
        {
            const threes = digits-ones-twos;
            if (! validLength.has(d2+twos) || ! validLength.has(d3+threes))
                continue;

            const c = factorial(digits) / (factorial(ones)*factorial(twos)*factorial(threes));
            count += c;
        }
    }
    return count;
}

function F(n)
{
    n = BigInt(n);

    let digits = 1;
    let index  = 0n;
    while(true)
    {
        const count = getCount(digits);
        if (index+count <= n)
        {
            index += count;
            digits += 1;
        }
        else
            break;
    }

    let prefix = [];
    let digit  = 1;

    while (index < n && prefix.length < digits)
    {
        prefix.push(digit);
        const count = getCount(digits-prefix.length, prefix);
        if (index+count >= n)
        {
            digit = 1;
        }
        else
        {
            index += count;
            prefix.pop();

            digit = digit+1;
            if (digit > 3)
                throw "ERROR";
        }
    }

    let value = BigInt(prefix.join(''));
    return Number(value % MODULO);
}

assert.equal(F(4), 11);
assert.equal(F(10), 31);
assert.equal(F(40), 1112);
assert.equal(F(1000), 1223321);
assert.equal(F(6000), 2333333333323n % MODULO);

console.log('Tests passed');

const answer = timeLogger.wrap('', () => F(MAX));

console.log(`Answer is ${answer}`);