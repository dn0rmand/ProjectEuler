const assert = require('assert');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

require('@dn0rmand/project-euler-tools/src/bigintHelper');

const MAX    = 24680;
const MODULO = 1020202009n;
const INVTWO = BigInt(2).modInv(MODULO);

const $binomial = timeLogger.wrap('preloading binomials', _ => 
{
    const tracer = new Tracer(2000, true);
    const cache = new Array(MAX+1);
    const modulo = Number(MODULO);

    cache[0] = [1]
 
    let previous = cache[0];

    for(let i = 1; i <= MAX; i++)
    {
        tracer.print(_ => MAX-i);

        let values = new Uint32Array(i+1);

        values[0] = 1;
        values[i] = 1; 
        for(let k1 = 1, k2 = i-1; k1 <= k2; k1++, k2--)
        {
            let v = (previous[k1-1] + previous[k1]);
            if (v >= modulo) 
                v -= modulo;
            values[k1] = v;
            values[k2] = v;
        }
        cache[i] = values;
        previous = values;
    }

    tracer.clear();

    return cache;
});


const binomial = (n, k) => $binomial[n][k];

const $f = new BigUint64Array(MAX+1);

// known values
$f[0] = $f[1] = $f[2] = 1n;

// http://oeis.org/A000111
// 2*a(n+1) = Sum_{k=0..n} binomial(n, k)*a(k)*a(n-k).
function f(max, trace)
{
    const tracer = new Tracer(1000, trace);

    for(let N = 3; N <= max; N++)
    {
        if ($f[N])
            continue;

        tracer.print(_ => max-N);

        let total = 0n;
        const n = N-1;

        for(let k1 = 0, k2 = n; k1 <= k2; k1++, k2--)
        {
            const v1 = $f[k1];
            const v2 = $f[k2];

            let value = (v1 * v2 * BigInt(binomial(n, k1))) % MODULO;
            if (k1 === k2)
                value = (value * INVTWO) % MODULO;

            total = (total + value) % MODULO;
        }

        $f[N] = total;
    }

    const result = $f[max];
    tracer.clear();

    return result;
}

assert.equal(f(4), 5);
assert.equal(f(8), 1385);
console.log('Tests passed');

const answer = timeLogger.wrap('solving', _ => f(MAX, true));
console.log(`Answer is ${answer}`);
