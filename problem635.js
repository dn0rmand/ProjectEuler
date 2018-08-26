// Subset sums
// -----------
// Problem 635
// -----------
// Let Aq(n) be the number of subsets, B, of the set {1,2,...,q*n} that satisfy two conditions:
// 1) B has exactly n elements;
// 2) the sum of the elements of B is divisible by n

// E.g. A2(5)=52 and A3(5)=603

// Let Sq(L) be ∑Aq(p) where the sum is taken over all primes p≤L
// E.g. S2(10)=554, S2(100) mod 1000000009=100433628 and S3(100) mod 1000000009=855618282

// Find S2(10^8)+S3(10^8). Give your answer modulo 1000000009

const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const MODULO = 1000000009;

primeHelper.initialize(1E6);

let memoize = new Map();

function get(count, max, value)
{
    let m = memoize.get(count);
    if (m !== undefined)
        m = m.get(value);
    if (m === undefined)
        return;

    let v = m.get(max);
    if (v !== undefined)
        return v;
    // v = m.get(max+1);
    // if (v === 0)
    //     return 0;
}

function set(count, max, value, subSets)
{
    let m = memoize.get(count);
    if (m === undefined)
    {
        m = new Map();
        memoize.set(count, m);
    }
    let c = m.get(value);
    if (c === undefined)
    {
        c = new Map();
        m.set(value, c);
    }
    c.set(max, subSets);
}

function A(q, n)
{
    let MAX = q*n;

    MAX = (MAX*(MAX+1))/2;

    function countSubSets(value, max, count)
    {
        if (value < 1 || count < 1)
            return 0;

        if (count === 1)
        {
            if (value > 0 && value <= max)
                return 1;
            else
                return 0;
        }

        if (max < count)
            return 0;

        let total = get(count, max, value);
        if (total !== undefined)
            return total;

        total = 0;

        // check

        try
        {
            let m0 = (count*(count+1))/2;
            if (value < m0)
            {
                total = 0;
                return total;
            }

            let m1 = (max*(max+1))/2;
            let m2 = max - count; m2 = (m2*(m2-1))/2;
            if (value > m1-m2)
            {
                total = 0;
                return total;
            }
            //

            for (let i = max; i > 0; i--)
            {
                let result = countSubSets(value-i, i-1, count-1);

                total = (total + result) % MODULO;
            }

            return total;
        }
        finally
        {
            set(count, max, value, total);
        }
    }

    let subSets = 0

//    memoize = new Map(); // Need to clear it because MAX isn't constant

    for(let total = n; total <= MAX; total += n)
    {
        subSets = (subSets + countSubSets(total, q*n, n)) % MODULO;
    }

    return subSets;
}

function S(q, L)
{
    let total = 0;

    for(let prime of primeHelper.primes())
    {
        if (prime > L)
            break;

        let v = A(q, prime);

        console.log("A(",q,',',prime,') =', v);
        total = (total + v) % MODULO;
    }

    return total;
}

assert.equal(A(2, 5), 52);
assert.equal(A(3, 5), 603);

assert.equal(A(2,2), 2);
assert.equal(A(2,3), 8);
assert.equal(A(2,5), 52);
assert.equal(A(2,7), 492);

assert.equal(S(2, 10), 554);
// assert.equal(S(2, 100), 100433628);
// assert.equal(S(3, 100), 855618282);
