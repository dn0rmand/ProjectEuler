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

timeLogger.wrap('Loading 2 powers', _ =>
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
});

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

function exclude(divisors, counts, i, count)
{
    const d1 = divisors[i];

    for(let j = i-1; j > 0; j--)
    {
        const d2 = divisors[j];

        if (counts[d2] && (d1 % d2 === 0))
        {
            counts[d2] -= count;
            exclude(divisors, counts, j, -count);
        }
    }
}

function s(n)
{
    const mod      = mods[n];
    const divisors = [...getDivisors(n)].sort((a, b) => a-b);

    const counts   = [];
    const specials = [];

    for(let i = 0; i < divisors.length; i++)
    {
        const d1 = divisors[i];

        // calculate total count
        counts[d1] = n/d1;
        includeExclude(divisors, counts, i, counts[d1]);

        // calculate special count
        if (i > 0 && mod > 2)
        {
            if (d1 <= mod) 
            {
                if (mod % d1 === 0)
                {
                    const count = Math.floor(n / mod);
                    if (count) 
                    {
                        specials[d1] = count;
                        exclude(divisors, specials, i, count);
                    }
                }
            }
            else 
            {
                const k = d1.gcd(mod);
                const m = d1 / k;
                const count = Math.floor(n / (m*mod));
                if (count) 
                {
                    specials[d1] = count;
                    exclude(divisors, specials, i, count);
                }
            }            
        }
    }
    
    const sum = divisors.reduce((sum, d) =>
    {
        const c2 = mod === 2 ? Math.floor(counts[d] / 2) : (specials[d] || 0);
        const c1 = counts[d] - c2;
        const p  = n - d;
        const k1 = c1 > 0 ? pows[p+1].modMul(c1, MODULO) : 0;
        const k2 = c2 > 0 ? pows[p].modMul(c2, MODULO) : 0;

        return (sum + k1 + k2) % MODULO;        
    }, 0);

    return sum;
}

function S(N, trace)
{
    let total = 0;

    const tracer = new Tracer(100, trace);

    for(let n = 1; n <= N; n++) 
    {
        tracer.print(_ => N-n);
        total = (total + s(n)) % MODULO;
    }
    tracer.clear();
    return total;
}

assert.strictEqual(F(3, 2), 4);
assert.strictEqual(F(8, 3), 256);
assert.strictEqual(F(9, 3), 128);

assert.strictEqual(S(3), 22);
assert.strictEqual(S(10), 10444);

assert.strictEqual(timeLogger.wrap('S(1E3)', _ => S(1E3)), 853837042);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => S(MAX, true));

console.log(`Answer is ${answer}`);