const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

const MAX = 1E9;
const MAX_PRIME = Math.ceil(Math.sqrt(MAX))+1;

const primeHelper = require('tools/primeHelper')(MAX_PRIME);

function countCoPrimes(a, max)
{
    const primes = [];

    primeHelper.factorize(a, p => primes.push(p));

    function step(total, size, include)
    {
        function generate(value, index, count, callback)
        {
            if (count === 0) {
                callback(value);
            } else {
                for(let i = index; i < primes.length; i++) {
                    generate(primes[i] * value, i+1, count-1, callback);
                }
            }
        }

        if (include) {
            generate(1, 0, size, value => total += Math.floor((max-a) / value));
        } else {
            generate(1, 0, size, value => total -= Math.floor((max-a) / value));
        }

        return total;
    }

    let total = max-a;
    let include = true;
    for(let size = 1; size <= primes.length; size++) {
        include = !include;
        total = step(total, size, include);
    }

    return total;
}

function H(N, trace)
{
    let total = N-2;
    let extra = 0n;

    const max = Math.floor(N/4);

    const tracer = new Tracer(1, trace);

    for(let i = 1; i < max; i++) {
        tracer.print(_ => max - i);
        const a = i*2 + 1;

        const coPrimes = countCoPrimes(a, N-a);
        const t = total + coPrimes;
        if (t > Number.MAX_SAFE_INTEGER) {
            extra += BigInt(total) + BigInt(coPrimes);
            total  = 0;
        } else {
            total = t;
        }
    }

    tracer.clear();

    total = extra + BigInt(total);
    return total*2n + 1n;
}

assert.strictEqual(H(4), 5n);
assert.strictEqual(H(100), 2043n);
assert.strictEqual(timeLogger.wrap('H(1000)', _ => H(1000)), 202869n);

console.log('Test passed');

timeLogger.wrap('H(10000)', _ => H(10000));

const answer = timeLogger.wrap('', _ => H(MAX, true));
console.log(`Answer is ${answer}`);