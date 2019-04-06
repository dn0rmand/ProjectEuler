// Chip Defects

// Problem 307
// k defects are randomly distributed amongst n integrated-circuit chips produced by a factory
// (any number of defects may be found on a chip and each defect is independent of the other defects).

// Let p(k,n) represent the probability that there is a chip with at least 3 defects.
// For instance p(3,7) ≈ 0.0204081633.

// Find p(20 000, 1 000 000) and give your answer rounded to 10 decimal places in the form 0.abcdefghij

const assert = require('assert');
const BigNumber = require('bignumber.js');

BigNumber.set({
    // ROUNDING_MODE: 1,
    DECIMAL_PLACES: 20
});

function p(k, n, trace)
{
    const getting    = BigNumber(1).dividedBy(n);
    const notGetting = BigNumber(1).minus(getting);

    let state = [BigNumber(1), BigNumber(0), BigNumber(0)];

    function step()
    {
        const newState   = [];

        newState[0] = state[0].times(notGetting);
        newState[1] = state[0].times(getting).plus(state[1].times(notGetting));
        newState[2] = state[1].times(getting).plus(state[2].times(notGetting));
        state = newState;
    }

    for (let i = 1; i <= k; i++)
    {
        if (trace)
            process.stdout.write(`\r${i}`);
        step();
    }
    if (trace)
        process.stdout.write('\r        \r');

    let result = BigNumber(1).minus(state[0]).minus(state[1]).minus(state[2]);

    result = result.times(n);
    result = result.toFixed(10);

    return result;
}

assert.equal(p(3, 7), "0.0204081633");

const answer = p(20000, 1000000, true);

console.log('Answer is', answer);
console.log('Not 0.0001973242');