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
    //ROUNDING_MODE: 1,
    DECIMAL_PLACES: 30
});

const $factorials = [];

function loadFactorial(max)
{
    let f = BigNumber(1);

    let next = $factorials.length-1;

    if (next > 0)
    {
        f = $factorials[next];
        next++;
        if (next < max)
            $factorials[max] = 0;//pre-allocate array size
    }
    else
    {
        $factorials[0] = 1;
        $factorials[1] = 1;
        next = 2;
    }

    for (let x = next; x <= max; x++)
    {
        f = f.times(x);
        $factorials[x] = f;
    }
}

function factorial(n)
{
    if (n >= $factorials.length)
        throw "Not initialized properly";
    if (n < 0)
        throw "Invalid n";
    return $factorials[n];
}

function p(k, n)
{
    loadFactorial(Math.max(k,n));

    const TWO = BigNumber(2);

    const NK = BigNumber(n).pow(k);

    function NPR(n, r)
    {
        let N = factorial(n);
        let NR = factorial(n-r);
        return N.dividedBy(NR);
    }

    function step(x)
    {
        let A = NPR(n, k-x);
        let B = NPR(k, x+x);

        B = B.dividedBy(factorial(x)).dividedBy(TWO.pow(x))

        return A.times(B).dividedBy(NK);
    }

    let total = BigNumber(1);
    for (let x = 0; x <= k/2; x++)
    {
        total = total.minus(step(x));
    }

    let result = total.toFixed(10);

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
assert.equal(p(200, 10000), "0.0128617346");  // 0.0129414583

const answer = p(20000, 1000000, 12);

console.log('Answer is', answer);
console.log('Not 0.0001973242 - Should start with 0.7311');
