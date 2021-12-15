const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');
const primeHelper = require('tools/primeHelper')();

primeHelper.initialize(1E6);

require('tools/numberHelper');

function f(x, y) 
{
    const value =  x*x + 5*x*y + 3*y*y;
    return value;
}

const $countSolutions = [];

function countSolutions(z)
{
    let total = $countSolutions[z];
    if (total !== undefined) {
        return total;
    }

    total = 0;

    const z2 = z*z;
    const maxX = z;

    for(let x = 1; x < maxX; x++) {
        const D2 = 13*(x*x) + 12*z2;        
        const D  = Math.sqrt(D2);

        if (Math.floor(D) !== D) { 
            continue; 
        }

        const y = (D - 5*x) / 6;

        if (y > 0 && Math.floor(y) === y) {
            if (x.gcd(y) === 1) {
                total++;
            }
        }
   }

   $countSolutions[z] = total;
   return total;
}

function C(n, trace)
{
    let total = 0;

    const tracer = new Tracer(1, trace);
    for(let z = 1; z <= n; z++) {
        tracer.print(_ => n-z);

        const t = countSolutions(z);
        total += countSolutions(z);
    }
    tracer.clear();

    return total;
}

function C(n, trace)
{
    const allPrimes = primeHelper.allPrimes();
    const weirdPrimes = [];
    const goodPrimes = [];

    let total = 0;

    function inner(index, value)
    {
        if (value > n) { 
            return ;
        }

        for(let i = index; i < goodPrimes.length; i++) {
            const p = goodPrimes[i];
            let v = value * p;
            if (v > n) {
                break;
            }
            while (v <= n) {
                const t = countSolutions(v);
                total += t;

                inner(i+1, v);
                v = v*p;
            }
        }
    }

    const tracer = new Tracer(1, trace);
    const max2 = n / 3;
    for(const p of allPrimes) {        
        if (p > n) { 
            break;
        }
        tracer.print(_ => n-p);
        if (countSolutions(p)) {
            // if (weirdPrimes.includes(p)) {
            //     throw "ERROR";
            // }
            goodPrimes.push(p);
        } else if (p < max2 && countSolutions(p*p)) {
            // if (weirdPrimes.includes(p)) {
            //     throw "ERROR";
            // }
            goodPrimes.push(p);
        } else {
            // if (!weirdPrimes.includes(p)) {
            //     console.log(p, p % 17);
            // }
            weirdPrimes.push(p);
        }
    }
    tracer.clear();

    inner(0, 1);

    return total;
}

assert.strictEqual(countSolutions(17), 1);
assert.strictEqual(countSolutions(87), 2);
assert.strictEqual(C(1000), 142);

console.log(timeLogger.wrap('', _ => C(10000, true)));
console.log(timeLogger.wrap('', _ => C(100000, true)));
// assert.strictEqual(C(1000000, true), 142463);

console.log('Tests passed');