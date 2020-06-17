const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');
const BigMap = require('tools/BigMap');

require('tools/bigintHelper');

const ZERO   = 0n;
const ONE    = 1n;
const MODULO = 10n ** 18n;

const patterns = [
    [4, 1],
    [3, 2],
    [3, 1, 1],
    [2, 2, 1],
    [2, 1, 1, 1],
    [1, 1, 1, 1, 1],
];

const makeKey = digits => digits.join(':');
const isSame  = (a, b) => {
    if (a.length !== b.length)
        return false;

    for(let i = a.length; i > 0; i--)
        if (a[i-1] !== b[i-1])
            return false;

    return true;
};

const $countPattern = {}

function countPattern(values)
{
    let k = values.join('_');
    
    if ($countPattern[k])
        $countPattern[k];

    function makeLetters()
    {
        let c = 'A'.charCodeAt(0);
        let word = "";
        for(let s of values)
        {
            word += String.fromCharCode(c).repeat(s);
            c++;
        }
        assert.equal(word.length, 5);
        return word.split('');
    }

    const letters = makeLetters();
    const words = [];
    const visited = new Set();

    function inner(index)
    {
        if (index === 5)
        {
            let k = words.slice().join('');
            visited.add(k);
        }

        for(let i = 0; i < letters.length; i++)
        {
            let c = letters[i];
            if (c !== undefined)
            {
                letters[i] = undefined;
                words[index] = c;
                inner(index+1);
                letters[i] = c;
            }
        }
    }

    inner(0);

    $countPattern[k] = BigInt(visited.size);
    return BigInt(visited.size);
}

function routine(digits, base)
{
    const v2 = [];
    const l  = digits.length;

    let remainder = 0;
    for(let i = 0; i < l; i++)
    {
        let v = (digits[i]-remainder) - digits[l-i-1];
        if (v < 0)
        {
            remainder = 1;
            v = base+v;
        }
        else
            remainder = 0

        v2[l-i-1] = v;
    }

    return v2;
}

const $kaprekar = new BigMap('kaprekar', true);

function getTarget(digits, base)
{
    if ($kaprekar.base !== base)
    {
        $kaprekar.base = base;
        $kaprekar.clear();
        $kaprekar.target = undefined;
    }
    if ($kaprekar.target !== undefined)
        return;

    digits = digits.slice();

    const visited = new Set();

    visited.add(makeKey(digits));
    while ($kaprekar.target === undefined)
    {
        digits.sort((a, b) => a-b);
        digits = routine(digits, base);

        const k = makeKey(digits);

        if(visited.has(k))
        {
            $kaprekar.target = digits;
            $kaprekar.sortedTarget = digits.slice().sort((a, b) => a-b);
        }
        else
            visited.add(k);
    }
}

function Kaprekar(digits, base)
{
    base   = base || 10;
    digits = digits.slice().sort((a, b) => a-b);

    getTarget(digits, base);
    
    const target = $kaprekar.target;

    function inner(digits)
    {
        if (isSame(digits, target))
            return ZERO;

        digits.sort((a, b) => a-b);
        const key = makeKey(digits);

        let result = $kaprekar.get(key);

        if (result !== undefined)
            return result;

        const newDigits = routine(digits, base);

        result = ONE + inner(newDigits);
        $kaprekar.set(key, result);
        return result;
    }

    return inner(digits);
}

function S(base, trace)
{
    let total = ZERO;

    const used   = new Uint16Array(base);
    const digits = new Uint16Array(5);

    const $steps = [];

    function inner(patternIndex)
    {
        used.fill(0);

        const pattern = patterns[patternIndex];
        const count   = countPattern(pattern);

        function _inner_(index, length)
        {
            if (index === pattern.length)
            {
                const steps = Kaprekar(digits, base);
                const s = Number(steps);
                const x = used.reduce((a, v, i) => {
                    if (v)
                        a.push(i);
                    return a;
                },[]);
                if (x.length == 2)
                {
                    if (! $steps[s])
                        $steps[s] = new Set();
                    $steps[s].add(makeKey(x));
                }
                total = (total + steps*count) % MODULO;
                return;
            }

            const s = pattern[index];
            let start = 0;
            if (index > 0 && s === pattern[index-1])
            {
                start = digits[length-1];
            }

            const tracer = new Tracer(1, trace && index < 2);

            for(let digit = start; digit < base; digit++)
            {
                if (! used[digit])
                {
                    tracer.print(_ => base-digit);

                    used[digit] = 1;
                    digits.fill(digit, length, length+s);
                    _inner_(index+1, length + s);
                    used[digit] = 0;
                }
            }

            tracer.clear();
        }

        _inner_(0, 0);
    }

    const tracer = new Tracer(1, trace, 'Pattern');
    for(let pattern = 0; pattern < patterns.length; pattern++)
    {
        tracer.print(_ => patterns.length-pattern);
        inner(pattern);
    }

    tracer.clear();
    return total-1n;
}

function getBase(t)
{
    return 6*t + 3;
}

/*
let values = [
        5274369n, // 2 
       34289199n, // 3
      132630799n, // 4
      403303329n, // 5
     1012505449n, // 6
     2261868699n, // 7
     4569203749n, // 8
     8602511049n, // 9
    15196177539n, // 10
    25593193049n, // 11
    41295167239n, // 12 
    64386118619n, // 13
    97237602349n, // 14
];
*/

assert.equal(timeLogger.wrap('', _ => S(15)), 5274369);
assert.equal(timeLogger.wrap('', _ => S(getBase(3))), 34289199);
assert.equal(timeLogger.wrap('', _ => S(getBase(4))), 132630799);
assert.equal(timeLogger.wrap('', _ => S(getBase(5))), 403303329);
assert.equal(timeLogger.wrap('', _ => S(getBase(6))), 1012505449);
assert.equal(timeLogger.wrap('', _ => S(getBase(7))), 2261868699);

assert.equal(timeLogger.wrap('', _ => S(111, true)), 400668930299);

console.log('Tests passed');