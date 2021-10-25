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

function countSolutions(z)
{
    let total = 0;

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

assert.strictEqual(countSolutions(17), 1);
assert.strictEqual(countSolutions(87), 2);
assert.strictEqual(C(1000), 142);
// assert.strictEqual(C(1000000, true), 142463);

let values = [];
for(let k = 1; k < 500; k++) {
    const v = countSolutions(k);
    if (v !== 0) {
        let s = `${v}=>`;
        primeHelper.factorize(k, (p, f) => {
            if (f > 1) {
                s += `${p}^${f} `;
            } else {
                s += `${p} `;
            }
        });
        values.push(s.trim().replaceAll(' ',' * '));
    }
}
console.log(values.join(', '));

// console.log(timeLogger.wrap('', _ => C(10, true)));
// console.log(timeLogger.wrap('', _ => C(100, true)));
// console.log(timeLogger.wrap('', _ => C(1000, true)));
// console.log(timeLogger.wrap('', _ => C(10000, true)));
// console.log(timeLogger.wrap('', _ => C(100000, true)));

console.log('Tests passed');