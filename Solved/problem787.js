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

    const maxa = max - a;

    function generate(value, index, count)
    {
        if (count === 0) {
            return Math.floor(maxa / value);
        } else {
            let t = 0;
            for(let i = index; i < primes.length; i++) {
                t += generate(primes[i] * value, i+1, count-1);
            }
            return t;
        }
    }

    let total = maxa;
    let include = true;
    for(let size = 1; size <= primes.length; size++) {
        include = !include;
        total += include ? generate(1, 0, size) : -generate(1, 0, size);
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