const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

const MAX = 6E6;

timeLogger.wrap('Loading primes', _ => primeHelper.initialize(MAX, true));

const squares = timeLogger.wrap('Calculating squares', _ => {
    const values = new Map();
    for(let i = 1; ; i++) {
        const s = i*i;
        if (s >= 4*MAX) {
            break;
        }
        values.set(s, i);
    }
    return values;
});

// 4p = a^2 + 27*b^2
function N1(p)
{
    const p4 = p * 4;

    const MAXB = Math.floor(Math.sqrt(p4/27));

    for(let b = MAXB; b > 0 ; b--) {        
        const B = 27 * b * b;
        const a2 = p4-B;
        const a  = squares.get(a2);

        if (a) {
            if (a % 3 === 1) {
                return p + a - 2;
            } else {
                return p - a - 2;
            }
        }
    }

    throw "ERROR";
}

function F(p)
{
    if (p < 3 || p === 7 || p === 13) {
        return 0;
    } else if ((p-1) % 6) {
        return (p-1)*(p-2);
    } else {
        return (N1(p) - 6) * (p-1); 
    }
}

function solve(max, trace) 
{
    const tracer = new Tracer(20000, trace);

    let total = 0; 
    let extra = 0n;

    const allPrimes = primeHelper.allPrimes();

    for (const p of allPrimes) {
        if (p > max) {
            break;
        }
        tracer.print(_ => max - p);
        const f = F(p);
        const t = total + f;
        if (t > Number.MAX_SAFE_INTEGER) {
            extra = extra + BigInt(total);
            total = f;
        } else {
            total = t;
        }
    }

    tracer.clear();
    return BigInt(total) + extra;
}

assert.strictEqual(F(5), 12);
assert.strictEqual(F(7), 0);
assert.strictEqual(F(2971), 8633790);

assert.strictEqual(timeLogger.wrap('', _ => solve(1000)), 48911174n);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(MAX, true));
console.log(`Answer is ${answer}`);
