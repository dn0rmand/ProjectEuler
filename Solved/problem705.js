require('tools/numberHelper');

const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const timeLogger = require('tools/timeLogger');

const MAX    = 1E8;
const MODULO = 1000000007;

const DEBUG = false;

timeLogger.wrap('Loading Primes', () => primeHelper.initialize(MAX, true));

const digitDivisors = [
    [], // nothing for 0
    [1], // 1
    [1, 2], // 2
    [1, 3], // 3
    [1, 2, 4], // 4
    [1, 5], // 5
    [1, 2, 3, 6], // 6
    [1, 7], // 7
    [1, 2, 4, 8], // 8
    [1, 3, 9], // 9
];

function countSortSteps(values)
{
    let steps = 0;
    const digits = [];

    for(let D of values)
    {
        for(let d = D+1; d < digits.length; d++)
            steps += digits[d] || 0;
        digits[D] = (digits[D] || 0) + 1;
    }

    return steps;
}

function countSteps(sequence, trace)
{
    let total = primeHelper.allPrimes().length;
    let traceCount = 0;

    let count  = 1;
    let digits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let swaps  = 0;

    for(const digit of sequence)
    {
        if (digit === 0)
        {
            if (trace)
            {
                total--;
                if (traceCount === 0)
                    process.stdout.write(`\r${total} `);
                if (traceCount++ >= 123456)
                    traceCount = 0;
            }
            continue;
        }

        const divisors = digitDivisors[digit].length;
        const newDigits= digits.map(a => (divisors * a) % MODULO);

        swaps = (swaps * divisors) % MODULO;

        for(const divisor of digitDivisors[digit])
        {
            for(let divisorDigit = divisor+1; divisorDigit < 10; divisorDigit++)
                swaps = (swaps + digits[divisorDigit]) % MODULO;

            newDigits[divisor] = (newDigits[divisor] + count) % MODULO;
        }

        count  = (count * divisors) % MODULO;
        digits = newDigits;
    }

    if (trace)
        process.stdout.write('\r               \r');
        
    return swaps;
}

function *getSequence(maxPrime, trace)
{
    function *addDigits(value)
    {
        const digits = [];
        while (value > 0)
        {
            const d = value % 10;
            value = (value - d) / 10;
            if (d)
                digits.push(d);
        }

        for(let i = digits.length-1; i >= 0; i--)
            yield digits[i];
    }

    for(const p of primeHelper.allPrimes())
    {
        if (p >= maxPrime)
            break;

        yield *addDigits(p);
        if (trace)
            yield 0;
    }
}

function G(N)
{
    const sequence = getSequence(N);
    return [...sequence];
}

function F(N, trace)
{
    const sequence = getSequence(N, trace);
    const total    = countSteps(sequence, trace);

    return total;
}

assert.equal(countSortSteps([3,4,2,1,4]), 5);
assert.equal(G(20).join(''), '235711131719');
assert.equal(F(20), 3312);
assert.equal(F(50), 338079744);

console.log('Tests passed');

const answer = timeLogger.wrap('', () => F(MAX, true));
console.log(`Answer is ${answer}`);