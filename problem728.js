const assert = require('assert');
const getDivisors = require('tools/divisors');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

require('tools/numberHelper');

const MODULO = 1000000007;
const TWO = 2;
const MAX = 1E7;

function F(n, k)
{
    let one = 1;

    if (n & 1) // odd
    {
        one = (k % 2 === 0) ? 0 : 1;
    }
    else
    {
        for(let x = 2; x <= n ; x *= 2)
        {
            const x2 = x+x;
            if (n % x === 0 && n % x2 !== 0) {
                one = (k % x2 === 0) ? 0 : 1;
                break;
            }
        }
    }

    const g = n.gcd(k);
    const total = n - g + one;

    return pows[total];
}

const pows = new Uint32Array(MAX+2);
const mods = new Uint32Array(MAX+2);

function prepare()
{
    const tracer = new Tracer(1000, true);
    for(let n = 0; n <= MAX+1; n++) {
        tracer.print(_ => MAX - n);
        pows[n] = TWO.modPow(n, MODULO);

        for(let x = 1; x <= n ; x *= 2)
        {
            if (n % x === 0 && n % (x+x) !== 0) 
            {
                mods[n] = x+x;
                break;
            }
        }
    }
    tracer.clear();
}

function includeExclude(divisors, counts, i, count)
{
    const d1 = divisors[i];
    for(let j = i-1; j >= 0; j--)
    {
        const d2 = divisors[j];

        if (d1 % d2 === 0)
        {
            counts[d2] -= count;
            includeExclude(divisors, counts, j, -count);
        }
    }
}

function s0(n)
{
    let sum = 0;

    const mod      = mods[n];
    const divisors = [...getDivisors(n)].sort((a, b) => a-b);

    const counts   = [];
    const specials = [];

    for(let i = 0; i < divisors.length; i++)
    {
        const d1 = divisors[i];
        specials[d1] = 0;
        counts[d1]   = n/d1;

        includeExclude(divisors, counts, i, counts[d1]);
    }

    const specials2 = [];

    if (mod === 2) 
    {
        for(d1 of divisors) 
        {
            specials[d1] = Math.floor(counts[d1] / 2);
        }
    } 
    else if (mod < n) 
    {
        for(let x = mod; x <= n ; x += mod) 
        {
            const c = x.gcd(n);
            specials[c]++;
        }        
    }
    
    for(const d of divisors)
    {
        const c2 = specials[d] || 0;
        const c1 = counts[d] - c2;
        const p  = n - d;
        const k1 = c1 > 0 ? pows[p+1].modMul(c1, MODULO) : 0;
        const k2 = c2 > 0 ? pows[p].modMul(c2, MODULO) : 0;

        sum = (sum + k1 + k2) % MODULO;
    }

    return sum;
}

function S0(N, trace)
{
    let total = 0;

    const tracer = new Tracer(100, trace);

    for(let n = 1; n <= N; n++) 
    {
        tracer.print(_ => N-n);
        total = (total + s0(n)) % MODULO;
    }
    tracer.clear();
    return total;
}

function s1(n)
{
    let mod = mods[n];

    let sum = 0;
    let c1  = [];
    let c0  = [];

    for(let k = 1, kk = 1; k <= n; k++, kk++)
    {
        const g = n.gcd(k);

        c0[g] = (c0[g] || 0) + 1;

        let offset = 1;
        if (kk === mod) {
            kk = 0;
            offset = 0;
            c1[g] = (c1[g] || 0) + 1;
        }

        const p = n - g + offset;

        sum = (sum + pows[p]) % MODULO;
    }

    // if (mod > 2)
    // {
    //     const c = c1.reduce((a, v) => a + ((v||0) > 0) ? 1 : 0, 0);
    //     if (c > 2)
    //         console.log(`N=${n}, mod=${mod}, c0=${c0.reduce((a, v, i) => v === undefined ? a : `${a} ${i}x${v}`,'')}, c1=${c1.reduce((a, v, i) => v === undefined ? a : `${a} ${i}x${v}`,'')}`);
    // }

    return sum;
}

function S1(N, trace)
{
    let total = 0;

    const tracer = new Tracer(100, trace);

    for(let n = 1; n <= N; n++) {
        tracer.print(_ => N-n);
        total = (total + s1(n)) % MODULO;
    }
    tracer.clear();
    return total;
}

const S = S0;

timeLogger.wrap('Loading 2 powers', _ => prepare());

assert.strictEqual(F(3, 2), 4);
assert.strictEqual(F(8, 3), 256);
assert.strictEqual(F(9, 3), 128);

assert.strictEqual(S(3), 22);
assert.strictEqual(S(10), 10444);

assert.strictEqual(timeLogger.wrap('S(1E3)', _ => S(1E3)), 853837042);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => S(MAX, true));

console.log(`Answer is ${answer}`);