const assert = require('assert');
const divisors = require('tools/divisors');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

require('tools/numberHelper');

const MAX_N = 1234567898765;
const MAX_K = 4321;

const KEY_FACTOR = 5000n;
const MODULO = 1E9;

function solve(n, k, trace)
{
    const divs = [...divisors(n)].map(d => d % k).sort((a, b) => a-b);
    const tracer = new Tracer(100, trace);

    const $inner = new Map();
    function inner(m, r, deep) 
    {
        const key = BigInt(m)*KEY_FACTOR + BigInt(r);

        let total = $inner.get(key);
        if (total !== undefined)
            return total;

        tracer.print(_ => deep);

        total = 0;

        if (m === 0) {
            total = r === 0 ? 1 : 0;
        } else if (m & 1) {
            for(const d of divs) {
                total = (total + inner(m-1, (r+d) % k, deep+1)) % MODULO;
            } 
        } else {
            const m2 = m / 2;
            for(let i = 0; i < k; i++)
            {
                const v1 = inner(m2, i, deep+1);
                if (v1) {
                    const v2 = inner(m2, (r+k-i) % k, deep+1);
                    if (v2) {
                        total = (total + v1.modMul(v2, MODULO)) % MODULO;
                    }
                }
            }            
        }

        $inner.set(key, total);
        return total;
    }
    
    const answer = inner(n, n % k, 0);
    tracer.clear();
    return answer;
}

assert.strictEqual(solve(3, 4), 4);
assert.strictEqual(solve(4, 11), 8);
assert.strictEqual(solve(1111, 24), 840643584);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(MAX_N, MAX_K, true));
console.log(`Answer is ${answer}`);