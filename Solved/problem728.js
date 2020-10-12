const assert = require('assert');
const calculateDivisors = require('tools/divisors');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');
const primeHelper = require('tools/primeHelper')();

require('tools/numberHelper');

const MODULO = 1000000007;
const TWO = 2;
const MAX = 1E7;

primeHelper.initialize(MAX);

const pows = new Uint32Array(MAX+2);
const mods = new Uint32Array(MAX+2);
const $divisors = [];

timeLogger.wrap('Loading 2 powers', _ =>
{
    const tracer = new Tracer(10000, true);
    for(let n = 0; n <= MAX+1; n++) 
    {
        tracer.print(_ => MAX - n);
        pows[n] = TWO.modPow(n, MODULO);
        $divisors[n] = [...calculateDivisors(n, primeHelper.isKnownPrime)].sort((a, b) => a-b);

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


function s(n)
{
    const mod      = mods[n];
    const divisors = $divisors[n];

    const counts   = [];
    const specials = [];
    
    for(const d of divisors)
    {
        counts[d] = n / d;
        specials[d] = 0;
        if (mod === 2)
        {
            specials[d] = 0;
        }
        else if (d > mod)
        {
            const k = d.gcd(mod);
            const m = d / k;
            const count = Math.floor(n / (m*mod));
            specials[d] = count;
        }
        else if (mod % d === 0)
        {
            const count = Math.floor(n / mod);
            specials[d] = count;
        }
    }

    let sum = 0;

    for (let i = divisors.length-1; i >= 0; i--) 
    {
        const d1 = divisors[i];
        const c1 = counts[d1];

        if (mod === 2)
            specials[d1] = Math.floor(c1 / 2);

        const s1 = specials[d1];

        for (let j = i-1; j >= 0; j--) 
        {
            const d2 = divisors[j];
            if (d1 % d2 === 0) 
            {
                counts[d2] -= c1;
                if (mod !== 2 && specials[d2])
                    specials[d2] -= s1;
            }
        }

        const p  = n - d1;
        const k1 = (c1 - s1) > 0 ? pows[p+1].modMul(c1 - s1, MODULO) : 0;
        const k2 = s1 > 0 ? pows[p].modMul(s1, MODULO) : 0;

        sum = (sum + k1 + k2) % MODULO;        
    }
    return sum;
}

function S(N, trace)
{
    let total = 0;

    const tracer = new Tracer(10000, trace);

    for(let n = 1; n <= N; n++) 
    {
        tracer.print(_ => N-n) ;
        total = (total + s(n)) % MODULO;
    }
    tracer.clear();
    return total;
}

assert.strictEqual(S(3), 22);
assert.strictEqual(S(10), 10444);

assert.strictEqual(timeLogger.wrap('S(1E3)', _ => S(1E3)), 853837042);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => S(MAX, true));

console.log(`Answer is ${answer}`);