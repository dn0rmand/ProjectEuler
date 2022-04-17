const assert = require('assert');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');
const announce = require('@dn0rmand/project-euler-tools/src/announce');
const divisors = require('@dn0rmand/project-euler-tools/src/divisors');

require('@dn0rmand/project-euler-tools/src/numberHelper');

const MAX = 2 * 1E6;

primeHelper.initialize(MAX);

// A129296 = A000005(n^2-1)/2
function getCount(r)
{
    let count = 1;

    primeHelper.factorize(r, (p, f) => { 
        count *= (f+1);
    });

    const result = count / 2;
    return result;
}

// (q-r)(p-r) = r^2-1
function F(N, trace)
{
    let total = 0n;

    const tracer = new Tracer(1, trace);
    for(let r = 2; r < N; r++) {
        tracer.print(_ => N-r);

        const R2D2 = r*r - 1;
        const count = getCount(R2D2);

        const divs = [...divisors(R2D2)]
                        .filter(d => d+r <= N)
                        .sort((a, b) => a-b);
        for(const pr of divs) {
            const p = pr + r;
            const q = (R2D2 / pr) + r;
            if (p >= q) {
                break;
            }
            
            total += BigInt(p+q);
            count--;
            if (! count) {
                break;
            }
        }
    }

    tracer.clear();
    return total;
}

assert.strictEqual(F(5), 59n);
assert.strictEqual(F(100), 697317n);
assert.strictEqual(timeLogger.wrap('', _ => F(500, true)), 90159518n);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => F(MAX, true));
console.log(`Answer is ${answer}`);
