// Minimum of subsequences
// -----------------------
// Problem 375 
// -----------
// Let Sn be an integer sequence produced with the following pseudo-random number generator:

// S0	= 	290797 
// Sn+1	= 	Sn^2 mod 50515093
// Let A(i, j) be the minimum of the numbers Si, Si+1, ... , Sj for i ≤ j.
// Let M(N) = ΣA(i, j) for 1 ≤ i ≤ j ≤ N.
// We can verify that M(10) = 432256955 and M(10 000) = 3264567774119.

// Find M(2 000 000 000).

const assert = require('assert');
const bigInt = require('big-integer');

const MAX       = 2000000000;
const FREQUENCY = 6308948;
const Ses = [];

function build()
{
    let s = 290797; 
    let n = 0;
    while (n <= FREQUENCY)
    {
        n++;
        s = (s*s) % 50515093;
        Ses.push(s);
    }
}

build();

function S(n)
{
    if (n === 0)
        return 290797;

    n -= 1;
    n  = (n % FREQUENCY);
    return Ses[n];
}

const memoize = new Map();

function A(i, j)
{
    let v = memoize.get(j);
    if (v !== undefined)
    {
        if (v.index >= i)
        {
            return v;
        }
    }

    let min = S(i);
    let idx = i;
    let maxLoop = FREQUENCY+1;

    for (let k = i+1; maxLoop > 0 && k <= j; k++, maxLoop--)
    {
        let s = S(k);
        if (s < min)
        {
            memoize.set(k-1, { value:min, index:idx });
            min = s;
            idx = k;
        }
    }

    let result = { value: min, index: idx };

    memoize.set(j, result);
    return result;
}

function M(n)
{
    let ref   = { index: 0 };
    let total = bigInt(0);
    let pc = -1;

    for (let i = 1; i <= n; i++)
    {
        if (i > ref.index) // Need new reference?
        {
            memoize.clear();
            ref = A(i, n);
            let percent = Math.floor((i / n) * 100);
            if (percent !== pc)
            {
                pc = percent;
                console.log(pc + "%");
            }
        }

        let ref2 = ref;
        let j = n;
        while (j >= i)
        {
            let count;

            if (j >= ref2.index)
            {
                let count = (j - ref2.index) + 1
                j = ref2.index-1;
                total = total.plus( bigInt(ref2.value).times(count) );
            }
            else // Need new reference
                ref2 = A(i, j);
        }
    }

    return total.toString();
}

assert.equal(M(10), "432256955");
assert.equal(M(10000), "3264567774119");

console.log("Tests passed");
let answer = M(MAX);
console.log("Answer might be " + answer);
console.log('Done');
