// Numbers with a given prime factor sum
// -------------------------------------
// Problem 618 
// -----------
// Consider the numbers 15, 16 and 18:
// 15=3×5 and 3+5=8
// 16=2×2×2×2 and 2+2+2+2=8
// 18=2×3×3 and 2+3+3=8
// 15, 16 and 18 are the only numbers that have 8 as sum of the prime factors (counted with multiplicity).

// We define S(k) to be the sum of all numbers n where the sum of the prime factors (with multiplicity) of n is k
// Hence S(8)=15+16+18=49
// Other examples: S(1)=0, S(2)=2, S(3)=3, S(5)=5+6=11
// The Fibonacci sequence is F1=1,F2=1,F3=2,F4=3,F5=5, ....
// Find the last nine digits of ∑k=S(Fk) where 2 <= k <= 24

const announce = require('./tools/announce');
const assert = require('assert');
const bigInt = require('big-integer');
const primeHelper = require('./tools/primeHelper')();

const MODULO = 1000000000;

function Fibonacci(n)
{
    if (n < 3)
        return 1;

    let f1 = 1;
    let f2 = 1;
    let f  = 2;

    for (let i = 3; i<=n; i++)
    {
        f = f1+f2;
        f1 = f2;
        f2 = f;
    }

    return f;
}

primeHelper.initialize(Fibonacci(25));

function version0()
{
    const memoize = new Map();

    function get(k, j)
    {
        k = k + j * 100000;
        return memoize.get(k);
    }

    function set(k, j, v)
    {
        k = k + j * 100000;
        memoize.set(k, v);
    }

    // V(k,j) = V(k, j-1) + pj*V(k-pj, j)    
    function V(k, j)
    {
        if (k < 2)
            return 0;

        if (k === 2)
            return 2;

        let total = get(k, j);
        if (total !== undefined)
            return total;

        let primes = primeHelper.allPrimes();

        let usedPrimes = [];

        function inner(value, index)
        {
            if (value > k)
                return 0;

            if (value === k)
            {
                let v = usedPrimes.reduce((a, v) => a.times(v), bigInt(1));
                return v.mod(MODULO).valueOf() ;
            }

            let total = 0;

            for (let i = index; i < j; i++)
            {
                let p = primes[i];
                let pp= p;
                let v = value+p;
                if (v > k)
                    break;

                let pushed = 0;
                while (v <= k)
                {
                    usedPrimes.push(pp);
                    total = (total + inner(v, i+1)) % MODULO;
                    usedPrimes.pop();

                    let ppp = pp * p;
                    if (ppp > Number.MAX_SAFE_INTEGER)
                    {
                        usedPrimes.push(pp);
                        pushed++;
                        pp = p;
                    }
                    else
                        pp = ppp;
                    v  += p;
                }
                while (pushed-- > 0)
                    usedPrimes.pop();
            }

            return total;
        }

        let pj = primes[j-1];        
        
        total = 0;

        if (j > 1 && pj < k)
        {
            let t1 = V(k, j-1);
            let t2 = V(k - pj, j);
            
            total = bigInt(t2).times(pj).plus(t1).mod(MODULO).valueOf();
        }
        else
        {
            total = inner(0, 0);
        }

        set(k, j, total);
        return total;
    }

    function S(k)
    {
        if (k < 2)
            return 0;

        let J = 0;
        let primes = primeHelper.allPrimes();
        for (let i = 0; i < primes.length; i++)
        {
            let p = primes[i];
            if (p > k)
            {
                J = i;
                break;
            }
        }

        if (J === 0)
            throw "ERROR";

        return V(k, J);
    }

    function solve()
    {
        let total = 0;

        for (let k = 2; k <= 24; k++)
        {
            let v = Fibonacci(k);
            let f = S(v);

            total = (total + f) % MODULO;
        }

        return total;
    }

    return {S:S, solve:undefined};
}

function version1()
{
    function S(targets)
    {
        let maxK = -1;

        function init()
        {
            let t = new Map();
            for (let k of targets)
            {
                t.set(k, 0);
                if (k > maxK)
                    maxK = k;
            }

            targets = t;
        }

        init();

        let primes = primeHelper.allPrimes();

        let usedPrimes = [];
        let info = -1;

        function inner(value, index)
        {
            if (value > maxK)
                return;

            let count = targets.get(value);
            if (count !== undefined)
            {
                let v = usedPrimes.reduce((a, v) => a.times(v), bigInt(1));
                count = v.add(count).mod(MODULO).valueOf() ;
                targets.set(value, count);
            }

            if (value === maxK)
            {
                if (usedPrimes.length != info)
                {
                    info = usedPrimes.length;
                    process.stdout.write('\r'+info+'    ');
                }
                return;
            }

            for (let i = index; i < primes.length; i++)
            {
                let p = primes[i];
                let pp= p;
                let v = value+p;
                if (v > maxK)
                    break;

                let pushed = 0;
                while (v <= maxK)
                {
                    usedPrimes.push(pp);
                    inner(v, i+1);
                    usedPrimes.pop();

                    let ppp = pp * p;
                    if (ppp > Number.MAX_SAFE_INTEGER)
                    {
                        usedPrimes.push(pp);
                        pushed++;
                        pp = p;
                    }
                    else
                        pp = ppp;
                    v  += p;
                }
                while (pushed-- > 0)
                    usedPrimes.pop();
            }
        }

        inner(0, 0);

        let total = 0;
        for(let k of targets.keys())
        {
            total = (total + targets.get(k)) % MODULO;
        }
        return total;
    }

    function solve()
    {
        let targets = [];

        for (let k = 2; k <= 24; k++)
        {
            let v = Fibonacci(k);
            targets.push(v);
        }

        return S(targets);
    }

    return {S:S, solve:undefined};
}

function version2()
{
    let primes = primeHelper.allPrimes();
    let memoize= new Map();

    memoizeMaxN = 0;
    currentK = 0;

    function get(N, index)
    {
        let k = (index * 100000) + N;
        return memoize.get(k);        
    }

    function set(N, index, value)
    {
        if (N > 5000)
        {
            if ((N & 1) !== 0)
                return;
            if (N > 20000)
            {
                if ((N & 3) !== 0)
                    return;
            }
        }

        if (memoizeMaxN < N)
        {
            memoizeMaxN = N;
            process.stdout.write('\r' + currentK + ": " + N);
        }
        let k = (index * 100000) + N;
        memoize.set(k, value);
    }

    function getPrimes(N)
    {
        for (let i = 0; i < primes.length; i++)
        {
            let p = primes[i];

            if (p > N)
                return i-1;
        }

        return 0;
    }

    function V(N, index)
    {
        if (index < 0)
            return 0;
        if (N < 2)
            return 0;
        if (N === 2)
            return 2;

        if (index < 0)
            return 0;

        let p = primes[index];

        while (index > 0 && p > N)
        {
            index--;
            p = primes[index];
        }

        if (index === 0 && (N & 1) !== 0)
            return 0;

        if (index === 0)
        {
            let factor = N >> 1;
            let tt = bigInt(2).pow(factor).mod(MODULO).valueOf();
            return tt;
        }

        let t = get(N, index);
        if (t !== undefined)
            return t;

        let t0 = p === N ? p : 0;
        let t1 = p * V(N-p, index);

        let t2 = V(N, index-1);

        let total = (t0 + t1 + t2) % MODULO;

        set(N, index, total);

        return total;
    }

    function S(N)
    {
        if (N.length === undefined)
            N = [N];

        let total = 0;

        for (let n of N)
        {
            let index = getPrimes(n);

            total = (total + V(n, index)) % MODULO;
        }

        return total;
    }   
    
    function solve()
    {
        let total = 0;

        for (let k = 2; k <= 24; k++)
        {
            currentK = k;
            process.stdout.write('\r' + currentK + ": 0     ");
            //memoize.clear();
            memoizeMaxN = 0;
            let v = Fibonacci(k);
            let f = S(v);

            total = (total + f) % MODULO;
        }

        return total;
    }

    return {S:S, solve:solve};
}

let S = version2().S;
let solve = version2().solve;

assert.equal(S([5]).valueOf(), 11);
assert.equal(S([8]).valueOf(), 49);
assert.equal(S([1]).valueOf(), 0);
assert.equal(S([2]).valueOf(), 2);
assert.equal(S([3]).valueOf(), 3);

//assert.equal(S([1,2,3,5,8]), 0+2+3+11+49);

let answer = solve();

announce(618, "last nine digits of ∑k=S(Fk) where 2 <= k <= 24 are " + answer);
