const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');
const primeHelper = require('tools/primeHelper')();

require('tools/numberHelper');

const MAX = 3141592653589793;
const MAX_PRIME = Math.ceil(Math.sqrt(MAX))+1

timeLogger.wrap('Loading primes', _ => primeHelper.initialize(MAX_PRIME));

function countCoPrime(n, max)
{
    if (max > n-1)
        max = n-1;

    if ((n & 1) === (max & 1))
        max--;

    const factors = [];
    
    primeHelper.factorize(n, p => factors.push(p));

    function inner(index, max)
    {  
        const p   = factors[index];
        const sum = Math.floor(max / p);

        if (index == factors.length-1) 
            return sum;
        else
            return sum + inner(index+1, max) - inner(index+1, sum);
    }

    const total = max - inner(0, max);
    if (factors[0] !== 2) 
    {
        factors.unshift(2)
        const nonEvens = max - inner(0, max);
        return total - nonEvens;
    }
    else
        return total;
}

// a = m^2 - n^2, b = 2mn, c = m^2+n^2
function P(max, trace)
{
    const tracer = new Tracer(5000, trace);

    const maxm = Math.ceil(Math.sqrt(max))+1;
    
    let total = 0;

    for(let m = 2; m <= maxm; m++)
    {
        const m2 = m*m;

        if (m2+1 > max)
            break;

        tracer.print(_ => {
            tracer.setRemaining(maxm-m);
            return maxm - m;
        });

        const maxn  = Math.floor(Math.sqrt(max-m2));
        if (m-1> maxn)
        {
            if (primeHelper.isKnownPrime(m))
            {
                total += Math.floor(maxn/2);
            }
            else
            {
                total += countCoPrime(m, maxn);
            }
        }
        else
        {
            total += countCoPrime(m, maxn);
        }
    }
    tracer.clear();

    return total;
}

assert.strictEqual(timeLogger.wrap('', _ => P(1E6)), 159139);
assert.strictEqual(timeLogger.wrap('', _ => P(1E8)), 15915492);

console.log('Test passed');

const answer = timeLogger.wrap('', _ => P(MAX, true));
console.log(`Answer is ${answer}`);
