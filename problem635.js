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

class SubsetCounter
{
    constructor(q, n)
    {
        if (q !== 2 && q !== 3)
            throw "Not supported";

        this.q = q;
        this.n = n;
        this.memoize = new Map();
    }

    get(count, max, value)
    {
        let m = this.memoize.get(value);
        if (m !== undefined)
            m = m.get(count);
        if (m !== undefined)
            return m.get(max);
    }

    set(count, max, value, subSets)
    {
        let m = this.memoize.get(value);
        if (m === undefined)
        {
            m = new Map();
            this.memoize.set(value, m);
        }
        let c = m.get(count);
        if (c === undefined)
        {
            c = new Map();
            m.set(count, c);
        }
        c.set(max, subSets);
    }

    doCount()
    {
    }

    countSubSets(modulo, max, count)
    {
        if (count === 0)
        {
            if (modulo === 0)
            {
                return 1;
            }
            else
                return 0;
        }
        else if (count < 0)
            return 0;

        let total = this.get(count, max, modulo);
        if (total !== undefined)
            return total;

        total = 0;

        // check

        try
        {
            for (let i = max; i >= 0; i--)
            {
                let result1, result2, result3;

                // use once ( example 1 or 1+n ... 1+(q-1)*n)
                let v = (modulo + i) % this.n;

                result1 = this.countSubSets(v, i-1, count-1);
                total = (total + (this.q*result1))// % MODULO;

                if (count > 1)
                {
                    // used both ( 1 and 1+n )
                    v = (modulo + (i*2)) % this.n;
                    result2 = this.countSubSets(v, i-1, count-2);
                    if (this.q === 2)
                        total = (total + result2)// % MODULO;
                    else if (this.q === 3)
                        total = (total + (3*result2))// % MODULO;
                }
                if (count > 2 && this.q === 3)
                {
                    v = (modulo + (i*3)) % this.n;
                    result3 = this.countSubSets(v, i-1, count-3);
                    total = (total + result3)// % MODULO;
                }
            }

            return total;
        }
        finally
        {
            this.set(count, max, modulo, total);
        }
    }

    count()
    {
        this.doCount();

        return this.countSubSets(0, this.n-1, this.n);
    }
}

function S(q, L)
{
    let total = 0;

    for(let prime of primeHelper.primes())
    {
        if (prime > L)
            break;

        let v = new SubsetCounter(q, prime).count();

        total = (total + v) % MODULO;
    }

    return total;
}

function A(q, n)
{
    return new SubsetCounter(q, n).count();
}

function AA(q, n)
{
    let k = n;
    let ncnt= []
    for (let x = 1; x <= q*n; x++)
    {
        let i = x % k;
        ncnt[i] = (ncnt[i] || 0)+1;
    }

    function waysToCreate(input_class, class_idx, n)
    {
        let ways = 0
        // not using this class:
        if (class_idx+1 < k)
            ways += waysToCreate(input_class, class_idx+1, n);

        for(let i = 1; i < ncnt[class_idx] && i <= n; )
        {
            let new_input_class = (input_class + i*class_idx) % k;

            if (i == n && new_input_class != 0)
            {
                break; // all elements are used, but doesn't congrunent with 0 (mod k)
            }

            let subways  =1;
            if (class_idx+1 < k)
                subways = waysToCreate(new_input_class, class_idx+1, n-i)

            ways += nchoosek(ncnt[class_idx], i) * subways;
        }

        return ways;
    }

    
}

function subCount(q, n)
{
    let k = n;

    n = n*q;

    let mod = [];
    for(i = 0; i < k; i++)
        mod.push(0);

    let cumSum = 0;
    for (let i = 0; i < n; i++)
    {
        cumSum += i+1;
        mod[cumSum % k]++;
    }

    // Initialize result
    let result = 0;

    // Traverse mod[]
    for (let i = 0; i < k; i++)
    {
        // If there are more than one prefix subarrays
        // with a particular mod value.
        if (mod[i] > 1)
            result += (mod[i] * (mod[i] - 1)) / 2;
    }
    result += mod[0];

    return result;
}

// console.log(A(2,1));
// console.log(A(2,2));
// console.log(A(2,3));
// console.log(A(2,4));
// console.log(A(2,5));
// console.log(A(2,6));
// console.log(A(2,7));

console.log(subCount(2, 5));

assert.equal(A(2,5), 52);
assert.equal(A(3,5), 603);

assert.equal(A(2,7), 492);
assert.equal(A(3,7), 16614);

assert.equal(S(2,10), 554);
assert.equal(A(3,10), 3004206);

let total = 0;
for (let i = 2; i < 36; i++)
{
    let v1 = A(2, i);
    console.log("A(2,", i, ") =", v1, "- total", total);
    total += v1;
}

// console.time("A2(100)")
// assert.equal(A(2,100), 52431190);
// console.timeEnd("A2(100)")

// console.time("S2(100)")
// assert.equal(S(2,100), 100433628);
// console.timeEnd("S2(100)")
// console.time("S3(100)")
// assert.equal(S(3,100), 855618282);
// console.timeEnd("S3(100)")

console.log("All tests passed");