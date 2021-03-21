const assert = require('assert');
const BitArray = require('tools/bitArray');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');
const Matrix = require('tools/matrix-small');

const MAX = 10**5;

const matrix = new Matrix(2, 2);

matrix.set(1, 0, 1);
matrix.set(1, 1, 0);
matrix.set(0, 1, 6);
matrix.set(0, 0, 2);

const vector = new Matrix(2, 1);

vector.set(0, 0, 1);
vector.set(1, 0, 1);

function g(x)
{
    if ((x % 2) === 0 || (x % 3) === 0) {
        // even => Nope
        return 0n;
    }

    const max = x*x;

    const visitedB = new Uint8Array(x);

    let b0 = 0;
    let b1 = 1;

    for(let n = 2; n < max ; n++) {
        const b = (2*b1 + 6*b0) % x;
        
        b0 = b1;
        b1 = b;

        if (b === 0) {
            const frequency = n;

            let m2 = matrix.pow(n, x);
            let mm = m2;
            let count = 0;

            while (n < max) {
                const aa = m2.multiply(vector, x);
                a = aa.get(1, 0);

                if (a === 1) {
                    return BigInt(n);    
                }

                count++;

                if (visitedB[a]) {
                    break;
                }
                visitedB[a] = 1;
    
                m2 = m2.multiply(mm, x);
                n += frequency;
            }
        }
    }

    return 0n;
}

function G(n, trace)
{
    let total = 0n;

    const tracer = new Tracer(100, trace);
    for (let x = 3; x <= n; x += 2) {
        tracer.print(_ => n-x);
        total += g(x, trace);
    }
    tracer.clear();
    return total;
}

console.log(g(5));
console.log(g(5**2));
console.log(g(5**3));

assert.strictEqual(g(3), 0n);
assert.strictEqual(g(5), 12n);

assert.strictEqual(G(100), 28891n);
assert.strictEqual(timeLogger.wrap('', _ => G(1000)), 13131583n);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => G(MAX, true));
console.log(`Answer is ${answer}`);