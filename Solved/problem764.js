const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

const MODULO = 10n ** 9n;
const MAX = 10n ** 16n;

require('tools/bigintHelper');
require('tools/numberHelper');

// a=3 , b=4, c=20

// a = m^2 - n^2 = (m+n)(m-n)
// b = 2*n*m    
// c = n^2 + m^2

function getEvenSquares(max)
{
    const values = [];

    for(let i = 2n; ; i += 2n) {
        const s = i*i;

        if (i > max) {
            break;
        }

        values.push(s);
    }

    return values;
}

function getSpecialValues(max)
{
    const special = [];
    for(let i = 1n; ; i++) {
        const value = 8n * i * (i - 1n) + 2n;
        if (value > max) {
            break;
        }
        special.push(value); 
    }
    return special;
}

function generateTriangles(max, trace, callback)
{
    max = BigInt(max);

    const maxN = (max / 2n).sqrt();
    const squares = getEvenSquares(max.sqrt());
    const specialValues = getSpecialValues(max.sqrt());

    // special with squares

    let tracer = new Tracer(1, trace, 'Square m:');

    let a, b, c;
    let offset = 0;

    for(let i = 0; i < specialValues.length; i++) {
        const n = specialValues[i];

        if (n > maxN) {
            break;
        }

        tracer.print(_ => maxN - n);

        const n2 = n*n;

        const maxM = (max - n2).sqrt();

        for(let j = i+offset; ; j++) {
            const m = squares[j];
            if (m > maxM) {
                break;
            }

            if (m < n) {
                offset++;
                continue;
            }

            const m2 = m*m;

            a = m2 - n2;
            b = 2n*m*n;
            c = n2 + m2;
            callback(a / 4n, b.sqrt(), c);
        }
    }
    tracer.clear();

    // n are squares

    tracer = new Tracer(1, trace, 'Square n:');

    offset = 0;
    for(let i = 0; ; i++) {
        const n = squares[i];
        
        if (n > maxN) {
            break;
        }

        tracer.print(_ => maxN - n);

        const n2 = n*n;
        const maxM = (max - n2).sqrt();

        for(let j = offset; j < specialValues.length; j++) {
            const m = specialValues[j];
            if (m > maxM) {
                break;
            }
            if (m < n) {
                offset++;
                continue;
            }

            const m2 = m*m;
    
            a = (m2 - n2);
            b = 2n * m * n;
            c = n2 + m2;

            if (a % 4n === 0n) {
                callback(a / 4n, b.sqrt(), c);
            }
        }
    }
    tracer.clear();

    // n multiple of 4 and n+m is square

    tracer = new Tracer(1, trace, 'Square n+m:');

    for (let n = 4; n <= maxN ; n += 4) {
        tracer.print(_ => maxN - BigInt(n));

        const n2 = n*n;
        const maxM = (max - BigInt(n2)).sqrt();

        for (let q = n.sqrt()+1; ; q++) {
            const q2 = q*q;

            const m = q2 - n;
            if (m > maxM) {
                break;
            }

            if (m < n) {
                continue;
            }

            let m2 = m*m;

            a = m2 - n2;
            b = 2 * m * n;
            c = n2 + m2;

            if (m2 >= Number.MAX_SAFE_INTEGER || b > Number.MAX_SAFE_INTEGER || c > Number.MAX_SAFE_INTEGER) {
                m2 = BigInt(m)*BigInt(m);
                a = m2 - BigInt(n2);
                b = 2n * BigInt(m) * BigInt(n);
                c = BigInt(n2) + m2;

                const aa = a.sqrt();

                if (aa*aa === a) {
                    callback(b / 4n, aa, c);
                }
            } else {
                const aa = a.sqrt();

                if (aa*aa === a) {
                    callback(b / 4, aa, c);
                }
            }
        }
    }
    tracer.clear();
}

function S(N, trace) 
{
    let total = 0;

    const MOD = Number(MODULO);

    generateTriangles(N, trace, (x, y, z) => {
        if (z <= Number.MAX_SAFE_INTEGER) {
            x = Number(x);
            y = Number(y);
            z = Number(z);

            if (x.gcd(y).gcd(z) === 1) {
                const xyz = (x % MOD) + (y % MOD) + (z % MOD);
                total = (total + xyz) % MOD;
            }
        } else if (x.gcd(y).gcd(z) === 1n) {
            const xyz = Number((x+y+z) % MODULO);
            total = (total + xyz) % MOD;
        }
    });

    return total;
}

assert.strictEqual(S(100), 81);
assert.strictEqual(S(10000), 112851);
assert.strictEqual(timeLogger.wrap('S(1E7)' , _ => S(1E7)), 248876211);
assert.strictEqual(timeLogger.wrap('S(1E8)' , _ => S(1E8)), 42501751);
assert.strictEqual(timeLogger.wrap('S(1E9)' , _ => S(1E9)), 258133745);
assert.strictEqual(timeLogger.wrap('S(1E12)' , _ => S(1E12)), 397047378);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => S(MAX, true));
console.log(`Answer is ${answer}`);