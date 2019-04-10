// Chip Defects

// Problem 307
// k defects are randomly distributed amongst n integrated-circuit chips produced by a factory
// (any number of defects may be found on a chip and each defect is independent of the other defects).

// Let p(k,n) represent the probability that there is a chip with at least 3 defects.
// For instance p(3,7) ≈ 0.0204081633.

// Find p(20 000, 1 000 000) and give your answer rounded to 10 decimal places in the form 0.abcdefghij

const assert = require('assert');

function p(k, n)
{
    const getting    = 1 / n;
    const notGetting = 1 - getting;

    const state1 = [1];
    const state2 = [1];

    for (let i = 1; i <= k; i++)
        state1[i] = state2[i] = 0;

    let state = state1;
    let newState = state2;

    function step()
    {
        newState[0] = state[0] * notGetting;

        for (let i = 1; i <= k; i++)
            newState[i] = state[i-1]*getting + state[i]*notGetting;

        const s = newState;
        newState = state;
        state = s;
    }

    // Build states

    for (let i = 1; i <= k; i++)
        step();

    let total = 0;

    for (let defect = 3; defect <= k; defect++)
    {
        let t = state[defect];
        let chips = 1;
        for (let d = k-defect; chips <= n && d >= 0; d--)
        {
            t *= (n-chips) * state[d];
            chips++;
        }

        total += x;
    }

    let result = total;
    // let result = 1 - (state[0]+state[1]+state[2]);
    result = (result * n).toFixed(10);

    return result;
}

function $p(k, n, precision)
{
    function simulate(k, n)
    {
        let values = [];

        for (let i = 0; i < k; i++)
        {
            let c = Math.round(Math.random() * n) % n;
            values[c] = (values[c] || 0) + 1;
            if (values[c] > 2)
                return 1;
        }

        return 0;
    }

    let result = 0;
    let oldResult;
    let count  = 0;
    let runs   = 0;

    while (true)
    {
        runs++;
        count += simulate(k, n);

        let result = (count / runs);
        let newResult = result.toFixed(precision);
        if (runs > 10000 && oldResult === newResult)
            break;
        oldResult = newResult;
        if (runs % 100 === 0)
            process.stdout.write(`\rp(${k}, ${n}) => ${newResult} - ${runs}`);
    }

    return (+result).toFixed(10);
}

// console.log(p(4, 7));
// console.log(p(5, 7));
// console.log(p(6, 7));

assert.equal(p(3, 7), "0.0204081633");
assert.equal(p(4, 7), "0.0728862974");
// assert.equal(p(200, 10000), "0.0128617346");  // 0.0129414583

const answer = p(20000, 1000000, 12);

console.log('Answer is', answer);
console.log('Not 0.0001973242 - Should start with 0.7311');
