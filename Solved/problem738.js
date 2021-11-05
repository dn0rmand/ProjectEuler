const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

require('tools/numberHelper');

const MAX = 1E10;
const MODULO = 1000000007;

function twoPower(N)
{
    let m = 1;
    let p = 0;
    while (m*2 <= N) {
        p++;
        m *= 2;
    }
    return p;
}

function d(N, K)
{
    function inner(value, count, min)
    {
        if (count === K) {
            return 1;
        }

        if (count === K-1) {
            const max = Math.floor(N / value);
            if (max >= min) {
                return max+1-min;
            } 
            return 0;
        }

        const maxFactor = Math.ceil(Math.pow(N / value, 1 / (K-count)));

        let total = 0;
        
        for(let factor = min; factor <= maxFactor; factor++) {
            const v = value * factor;
            if (v > N) { 
                break; 
            }
            total += inner(v, count+1, factor);
            if (total > MODULO) 
                total %= MODULO;
        }

        return total;
    }        

    return inner(1, 0, 2);
}

function solve(N, trace)
{
    const p = Math.min(twoPower(N), N);

    let previous = 1;
    let total    = 0;
    let offset   = 0;

    const tracer = new Tracer(1, trace);
    for(let k = 1; k <= p; k++) {
        tracer.print(_ => p-k);
        offset = (d(N, k) + previous) % MODULO;
        total = (total + offset) % MODULO;
        previous = offset;
    }
    total = (total + offset.modMul(N-p, MODULO)) % MODULO;
    tracer.clear();
    return total;
}

assert.strictEqual(solve(10), 153);
assert.strictEqual(solve(100), 35384);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(MAX, true));
console.log(`Answer is ${answer}`);
