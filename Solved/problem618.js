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
const MODULO1= 100000000000000;

if (MODULO1 > Number.MAX_SAFE_INTEGER)
    throw "Too big";

class Memoize 
{
    constructor()
    {
        this.memoize = new Array();
        this.currentK = 0;
        this.memoizeMaxN = 0;
        this.entries = 0;
    }

    clear()
    {
        // this.memoize = new Array();
        // this.memoizeMaxN = 0;
        // this.entries = 0;
    }

    get(N, index)
    {
        let a = this.memoize[N];
        if (a === undefined)
            return a;
        return a[index];
    }

    set(N, index, value)
    {
        if (this.memoizeMaxN < N)
        {
            this.memoizeMaxN = N;
            process.stdout.write('\r' + this.currentK + ": " + N);
        }

        let a = this.memoize[N];
        if (a === undefined)
        {
            a = new Array();
            this.memoize[N] = a;
        }
        a[index] = value;
        this.entries++;
    }

    size()
    {
        let undefined1 = 0;
        let undefined2 = 0;

        for(let i = 0 ; i < this.memoize.length; i++)
        {
            let a = this.memoize[i];
            if (a === undefined)
                undefined1++;
            else
            {
                for(let v of a)
                    if (v === undefined)
                        undefined2++;
            }
        }
        console.log();
        console.log(undefined1, "value holes");
        console.log(undefined2, "index holes");

        return this.entries;
    }
}

let memoize = new Memoize();

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

function S1(maxK)
{
    let primes = primeHelper.allPrimes();

    let info = -1;

    function inner(value, index)
    {
        if (value > maxK)
            return 0;

        if (value === maxK)
        {
            return 1;
        }

        let total = memoize.get(value, index);
        
        if (total !== undefined)
        {
            return total;
        }

        total = bigInt.zero;

        for (let i = index; i < primes.length; i++)
        {
            let p = primes[i];
            let v = value+p;
            if (v > maxK)
                break;

            let pp= bigInt(p);
            while (v <= maxK)
            {
                let t = inner(v, i+1);
                total = pp.times(t).plus(total).mod(MODULO1).valueOf();
                pp = bigInt(pp).times(p);
                v += p;
            }
        }

        memoize.set(value, index, total);

        return total;
    }

    memoize.clear();
    let total = inner(0, 0) % MODULO;
    return total;
}

function version2()
{
    let primes = primeHelper.allPrimes();

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

        let t = memoize.get(N, index);
        if (t !== undefined)
            return t;

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
            let tt = bigInt(2).pow(factor).mod(MODULO1).valueOf();
            return tt;
        }

        t = memoize.get(N, index);
        if (t !== undefined)
            return t;

        let t1 = bigInt(p).times(V(N-p, index));
        let t2 = V(N, index-1);
        let t3 = p === N ? p : 0;

        let total = t1.plus(t2).plus(t3).mod(MODULO1);

        memoize.set(N, index, total);

        return total;
    }

    function S(N)
    {
        memoize.clear();
        let index = getPrimes(N);
        let total = V(N, index) % MODULO;

        return total;
    }   
    
    return S;
}

function solve(MAX, S)
{
    let total = 0;
    
    for (let k = 2; k <= MAX; k++)
    {
        memoize.currentK = k;
        process.stdout.write('\r' + memoize.currentK + ": 0     ");

        let v = Fibonacci(k);
        let f = S(v);

        total = (total + f) % MODULO;
    }

    return total;
}

function Test(S)
{
    memoize.clear();
    assert.equal(S(5).valueOf(), 11);
    memoize.clear();
    assert.equal(S(8).valueOf(), 49);
    memoize.clear();
    assert.equal(S(1).valueOf(), 0);
    memoize.clear();
    assert.equal(S(2).valueOf(), 2);
    memoize.clear();
    assert.equal(S(3).valueOf(), 3);
}

let S = version2();

// Test(S);

let MAX = 24;

console.time("S2");
let answer2 = solve(MAX, S);
console.timeEnd("S2");

console.log(618, "last nine digits of ∑k=S(Fk) where 2 <= k <= " + MAX + " are " + answer2);
// console.log(memoize.size())