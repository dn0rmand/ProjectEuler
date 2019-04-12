// Chip Defects

// Problem 307
// k defects are randomly distributed amongst n integrated-circuit chips produced by a factory
// (any number of defects may be found on a chip and each defect is independent of the other defects).

// Let p(k,n) represent the probability that there is a chip with at least 3 defects.
// For instance p(3,7) ≈ 0.0204081633.

// Find p(20 000, 1 000 000) and give your answer rounded to 10 decimal places in the form 0.abcdefghij

const assert = require('assert');
const Decimal = require('decimal.js');

Decimal.set({ precision: 20 })

const $factorials = [];

function loadFactorial(max)
{
    let f = Decimal(1).ln();

    let next = $factorials.length-1;

    if (next > 0)
    {
        f = $factorials[next];
        next++;
    }
    else
    {
        $factorials[0] = f; // 1
        $factorials[1] = f; // 1
        next = 2;
    }

    for (let x = next; x <= max; x++)
    {
        f = f.plus(Decimal(x).ln());
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

    const NK  = Decimal(n).ln().times(k);
    const TWO = Decimal(2).ln();

    function NPR(n, r)
    {
        let N  = factorial(n);
        let NR = factorial(n-r);
        return N.minus(NR);
    }

    function step(x)
    {
        let A = NPR(n, k-x);
        let B = NPR(k, x+x);

        B = B.minus(factorial(x)).minus(TWO.times(x));

        let result = A.plus(B).minus(NK);

        // convert back to decimal

        let y = result.exp();
        return y;
    }

    let sum = Decimal(1);
    for (let x = 0; x <= k/2; x++)
    {
        let t = step(x);
        sum = sum.minus(t);
    }

    let result = sum.toFixed(10);

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

assert.equal(p(3, 7), "0.0204081633");
assert.equal(p(4, 7), "0.0728862974");
assert.equal(p(200, 10000), "0.0128617346");

console.time(307);
const answer = p(20000, 1000000);
console.log('Answer is', answer);
console.timeEnd(307);

