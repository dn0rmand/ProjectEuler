const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

require('tools/numberHelper');

const MAX_N = 1E7;
const MAX_K = 1E5;

const MODULO = 10007;
    
var totalTime = new timeLogger('');
totalTime.start();

// load enough primes

const allPrimes = timeLogger.wrap('Loading primes', _ => {
    const primeHelper = require('tools/primeHelper')();
    primeHelper.initialize(20 * MAX_N, true);
    return primeHelper.allPrimes();
});

assert.ok(MAX_N < allPrimes.length);

const S = timeLogger.wrap('Loading S', _ => {
    const s = new Uint32Array(MAX_N+1);
    const tracer = new Tracer(50000, true);
    for(let k = 1; k <= MAX_N; k++) {
        tracer.print(_ => MAX_N-k);
        s[k] = allPrimes[k-1].modPow(k, MODULO);
    }
    tracer.clear();
    return s;
});

const S2 = timeLogger.wrap('Loading S2', _ => {
    const s2 = new Uint32Array(MAX_N+1);
    for(let k = 1; k <= MAX_N; k++) {
        s2[k] = S[k] + + S[Math.floor(k / 10000) + 1];
    }

    return s2;
});

function M(i, j)
{
    const values = [...S2.subarray(i, j+1)];

    values.sort((a, b) => a-b);
    const m = (j-i);
    if ((m & 1) === 0) {
        return values[m / 2];
    } else {
        return (values[(m-1)/2] + values[(m+1)/2]) / 2;
    }
}

function F(n, k, trace)
{
    let total = 0;

    const tracer = new Tracer(1000, trace);

    const values = [...S2.subarray(1, k+1)];

    values.sort((a, b) => a-b);

    assert.strictEqual(k & 1, 0);

    const index = Math.floor((k-1)/2);

    const nextValues = (i, j) => {
        const v1 = S2[i];
        const v2 = S2[j];
        // if (v1 === v2) {
        //     return;
        // }
        
        let idx = values.indexOf(v1);

        if (idx > 0 && values[idx-1] > v2) {
            while(idx > 0 && values[idx-1] > v2) {
                values[idx] = values[idx-1];
                idx--;
            }
            values[idx] = v2;
        } else {
            while(idx < k-1 && values[idx+1] < v2) {
                values[idx] = values[idx+1];
                idx++;
            }
            values[idx] = v2;
        }
    };

    for(let i = 1; i <= n-k+1; i++) {
        tracer.print(_ => n-k+1-i);
        total += (values[index] + values[index+1]) / 2;
        nextValues(i, i+k);
    }
    tracer.clear();
    return total.toFixed(1);
}

totalTime.pause();

assert.strictEqual(M(1, 10), 2021.5);
assert.strictEqual(M(1E2, 1E3), 4715.0);

assert.strictEqual(F(100, 10), '463628.5');
assert.strictEqual(timeLogger.wrap('', _ => F(1E5, 1E4, true)), '675348207.5');

console.log('Tests passed');

totalTime.resume();

const answer = timeLogger.wrap('', _ => F(MAX_N, MAX_K, true));

totalTime.stop();

console.log(`Answer is ${answer}`);