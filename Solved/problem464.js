const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

const MAX = 20000000;

primeHelper.initialize(MAX);

const mobius = timeLogger.wrap('Preload Mobius', _ => {
    const mobius    = new Int8Array(MAX+1);
    const allPrimes = primeHelper.allPrimes();

    function inner(value, index, μ)
    {
        mobius[value] = μ;
        for(let i = index; i < allPrimes.length; i++) {
            const p = allPrimes[i];
            const v = value * p;
            if (v > MAX) break;

            inner(v, i+1, -μ);
        }    
    }

    inner(1, 0, 1);
    return mobius;
});

const jumps = timeLogger.wrap('Preload jump count', _ => {
    const jumps = new Uint32Array(MAX+1);
    let jump = 0;

    for(let i = MAX; i > 0; i--) {
        jumps[i] = jump;
        if (mobius[i] !== 0) {
            jump = 0;
        } else {
            jump++;
        }
    }

    return jumps;
});

const { NS, PS } = timeLogger.wrap('Preload Ns and Ps', _ => {
    const NS = new Int32Array(MAX+1);
    const PS = new Int32Array(MAX+1);

    let ns = 0;
    let ps = 0;
    
    for (let i = 0; i <= MAX; i++) {
        if (mobius[i] === -1) {
            ns++;
        } else if (mobius[i] === 1) {
            ps++;
        }
        NS[i] = ns;
        PS[i] = ps;
    }

    return { NS, PS };
});

const { Nmap, Pmap } = timeLogger.wrap('Preload N and P maps', _ => {
    const Nmap = new Int32Array(MAX+1);
    const Pmap = new Int32Array(MAX+1);

    for(let i = MAX; i >= 0; i--) {
        Nmap[NS[i]] = i;
        Pmap[PS[i]] = i;
    }

    return { Nmap, Pmap };
});

function P(a, b)
{
    return PS[b] - PS[a-1];
}

function N(a, b)
{
    return NS[b] - NS[a-1];
}

function C(max, trace) 
{
    let total = 0;
    let extra = 0n;

    const tracerA = Tracer.create(5000, trace);

    let factor = 1;

    let maxP = PS[max];
    let maxN = NS[max];

    const getPIndex = p => {
        if (p > maxP) 
            return max+1;
        return Pmap[p];
    };

    const getNIndex = n => {
        if (n > maxN) 
            return max+1;
        return Nmap[n];
    };

    for(let a = 1; a <= max; a++) {
        tracerA?.print(_ => max - a);

        if (mobius[a] === 0) {
            factor++;
            continue;
        }

        let na = NS[a-1]; 
        let pa = PS[a-1];

        let count = 0;

        for(let b = a; b <= max; b++) {
            const n = NS[b] - na;
            const p = PS[b] - pa;

            if (p*99 > n*100) {
                b += jumps[b];
                const target = getNIndex(Math.ceil((99*p)/100) + na);     
                if (target > b) {
                    b = target-1;
                }
            } else if (n*99 > p*100) {
                b += jumps[b];                
                const target = getPIndex(Math.ceil((99*n)/100) + pa);     
                if (target > b) {
                    b = target-1;
                }
            }
            else {
                const px = Math.floor((100*n)/99) + 1;
                const nx = Math.floor((100*p)/99) + 1;
                const tp = px > p ? getPIndex(px+pa) : max+1;
                const tn = nx > n ? getNIndex(nx+na) : max+1;

                const target = Math.min(tp, tn, max+1);
                if (target > b+1) {   
                    const valid = target-b;
                    count += valid;
                    b = target-1;    
                } else {
                    count++;
                }
            }
        }
        
        const triangle = ((factor)*(factor-1))/2;
        const t = total + factor*count + triangle;
        if (t > Number.MAX_SAFE_INTEGER) {
            extra += BigInt(total) + BigInt(factor*count + triangle);
            total = 0;
        } else {
            total = t;
        }

        factor = 1;
    }
    tracerA?.clear();
    extra += BigInt(total) + BigInt(((factor)*(factor-1))/2);
    return extra;
}

assert.strictEqual(P(2, 10), 2);
assert.strictEqual(N(2, 10), 4);

assert.strictEqual(C(10), 13n);
assert.strictEqual(C(500), 16676n);
assert.strictEqual(timeLogger.wrap('', _ => C(10000)), 20155319n);
assert.strictEqual(timeLogger.wrap('', _ => C(100000)), 3732887700n);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => C(MAX, true));
console.log(`Answer is ${answer}`);

