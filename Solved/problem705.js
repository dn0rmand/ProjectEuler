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

function countSteps(sequence)
{
    let state = {
        count:  1,
        digits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        swaps:  0
    };

    for(let digit of sequence)
    {
        const divisors = digitDivisors[digit].length;

        let newState = {
            count:  (state.count * divisors) % MODULO,
            digits: state.digits.map(a => (divisors * a) % MODULO),
            swaps:  (state.swaps * divisors) % MODULO
        };

        for(let divisor of digitDivisors[digit])
        {
            for(let divisorDigit = divisor+1; divisorDigit < state.digits.length; divisorDigit++)
                newState.swaps = (newState.swaps + state.digits[divisorDigit]) % MODULO;

            newState.digits[divisor] = (newState.digits[divisor] + state.count) % MODULO;
        }

        state = newState;
    }

    return state.swaps;
}

function *getSequence(maxPrime)
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

        while (digits.length > 0)
            yield digits.pop();
    }

    for(const p of primeHelper.allPrimes())
    {
        if (p >= maxPrime)
            break;

        yield *addDigits(p);
    }
}

function G(N)
{
    const sequence = getSequence(N);
    return [...sequence];
}

function F(N)
{
    const sequence = getSequence(N);
    const total    = countSteps(sequence);

    return total;
}

assert.equal(countSortSteps([3,4,2,1,4]), 5);
assert.equal(G(20).join(''), '235711131719');
assert.equal(F(20), 3312);
assert.equal(F(50), 338079744);

console.log('Tests passed');

const answer = timeLogger.wrap('', () => F(MAX));
console.log(`Answer is ${answer}`);