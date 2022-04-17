const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const FactorizationSieve = require('@dn0rmand/project-euler-tools/src/sieve_n2_plus_one');

require('@dn0rmand/project-euler-tools/src/numberHelper');

const MODULO = 1000000007;
const MAX = 1E7;

const FACTORS = timeLogger.wrap('Loading n^2+1 factors', _ => new FactorizationSieve(MAX+1));

function solve(end)
{
    let total = 0;

    const tracer = new Tracer(1000, true);

    const factors = new Map();

    for(let k = 1; k <= end; k++) {
        tracer.print(_ => end - k);

        const N2 = (k**2 + 2*k + 2)
        const N1 = (k**2 - 2*k + 2);

        let R = 1;

        // factorize
        const f1 = FACTORS.get(k-1);
        const f2 = FACTORS.get(k+1);
        
        factors.clear();

        for(const [ p, f ] of f1) {
            factors.set(p, f);
        }

        for(const [ p, f ] of f2){
            factors.set(p, (factors.get(p) || 0) + f);
        }

        // Calculate
        for(const [ p, f ] of factors) { 
            R = R.modMul(p**f + 1, MODULO); 
        };

        const N = (N1 % MODULO).modMul(N2 % MODULO, MODULO);
        total = (total + R + MODULO - N) % MODULO;
    }

    // tracer.clear();
    return total;
}

assert.strictEqual(timeLogger.wrap('', _ => solve(1024)), 77532377300600 % MODULO);
console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(MAX));
console.log(`Answer is ${answer}`);
