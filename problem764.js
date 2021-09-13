const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

const MODULO = 1E9;

require('tools/numberHelper');

// a=3 , b=4, c=20

// a = m^2 - n^2 = (m+n)(m-n)
// b = 2*n*m    
// c = n^2 + m^2

function generateTriangles(max, callback)
{
    const maxM = Math.floor(Math.sqrt(max));

    const isSquare = b => {
        const bb = Math.sqrt(b);
        if (Math.floor(bb) === bb) {
            return (a, c, multiply) => {
                if (multiply) {
                    if (a & 1) {
                        callback(a, bb * 2, c * 4);
                    }
                } else if (a % 4 === 0) {
                    callback(a / 4, bb, c);
                }
            }
        } else {
            return _ => {};
        }
    };

    for (let m = 1; m <= maxM ; m++)
    {
        const m2 = m*m;
        const maxK = 2*m-1;
        const start = m & 1 ? m+2 : m+1;
        for (let k = start; k <= maxK ; k += 2)
        {
            if (m.gcd(k) !== 1) {
                continue;
            }

            const n = k-m;
            const n2 = n*n;

            a = m2 - n2 ;
            b = 2*m*n;
            c = n2 + m2;

            const aSquare = isSquare(a);
            const bSquare = isSquare(b);
            
            aSquare(b, c, false);
            aSquare(b, c, true);
            bSquare(a, c, false);
            bSquare(a, c, true);
        }
    }
}

function S(N, trace) 
{
    let total = 0;

    generateTriangles(N, (x, y, z) => {
        if (x <= N && y <= N && z <= N) {
            const g = x.gcd(y).gcd(z);
            if (g === 1) {            
                const xyz = (x + y + z) % MODULO;
                total = (total + xyz) % MODULO;
            } else {
                console.log('I GOT HERE')
            }
        }
    });

    return total;
}

assert.strictEqual(S(100), 81);
assert.strictEqual(S(10000), 112851);
assert.strictEqual(timeLogger.wrap('S(1E9)' , _ => S(1E9, true)), 258133745);
assert.strictEqual(timeLogger.wrap('S(1E7)' , _ => S(1E7, true)), 248876211);
assert.strictEqual(timeLogger.wrap('S(1E8)' , _ => S(1E8, true)), 42501751);

console.log('Tests passed');