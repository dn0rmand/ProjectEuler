require('tools/numberHelper');

const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const timeLogger = require('tools/timeLogger');
const BigMap = require('tools/BigMap');

const MAX    = 60;
const MODULO = 1000000007;

primeHelper.initialize(MAX, true);

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
    let remains = sequence.length;

    let states   = new BigMap();
    let newStates= new BigMap();

    states.set(0, {
        digits: [],
        steps: 0,
        count: 1
    });

    for(let D of sequence)
    {
        if (D === 1)
        {
            for(let state of states.values())
            {
                for(let d2 = D+1; d2 < state.digits.length; d2++)
                {
                    state.steps = (state.steps + (state.digits[d2] || 0)) % MODULO;
                }
            }
            continue;
        }

        if (trace)
            process.stdout.write(`\r${remains--} - ${states.size}   `);

        let divisors = digitDivisors[D];

        newStates.clear();

        for(let state of states.values())
        {
            for (let d1 of divisors)
            {
                let newState = {
                    digits: state.digits.slice(),
                    steps:  state.steps,
                    count:  state.count
                };

                for(let d2 = d1+1; d2 < state.digits.length; d2++)
                {
                    newState.steps = (newState.steps + (newState.digits[d2] || 0)) % MODULO;
                }

                if (d1 > 1)
                    newState.digits[d1] = ((newState.digits[d1] || 0) + 1) % MODULO;

                const key = `${newState.steps}|${newState.digits.join(':')}`;
                const old = newStates.get(key);
                if (old)
                    old.count = (old.count + newState.count) % MODULO;
                else
                    newStates.set(key, newState);
            }
        }

        [states, newStates] = [newStates, states];
    }

    if (trace)
        process.stdout.write('\r                         \r');
    
    let total = 0;

    for(const state of states.values())
        total = (total + state.count.modMul(state.steps, MODULO)) % MODULO;

    return total;
}

function getSequence(maxPrime)
{
    const sequence = [];

    function addDigits(value)
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
            sequence.push(digits.pop());
    }

    for(const p of primeHelper.allPrimes())
    {
        if (p >= maxPrime)
            break;

        addDigits(p);
    }

    return sequence;
}

function G(N)
{
    const sequence = getSequence(N);

    return sequence;
}

function F(N, trace)
{
    const sequence = getSequence(N);
    const total    = countSteps(sequence, trace);

    return total;
}

assert.equal(countSortSteps([3,4,2,1,4]), 5);
assert.equal(G(20).join(''), '235711131719');
assert.equal(F(20), 3312);
assert.equal(F(50, true), 338079744);

console.log('Tests passed');

const answer = timeLogger.wrap('', () => F(MAX, true));
console.log(`Answer is ${answer}`);