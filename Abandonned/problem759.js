const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');
const Matrix = require('tools/matrix-small');

require('tools/numberHelper');

const TWO = 2;
const MAX = 1E10;
const MODULO = 1000000007;

if (MAX > Number.MAX_SAFE_INTEGER) {
    throw "It's too big";
}

function fast(n)
{
    const matrix = Matrix.fromRecurrence([262144, -688128, 774144, -488960, 190848, -47712, 7640, -756, 42]);
    const id = new Matrix(9, 1);

    id.set(0, 0, 134814336); 
    id.set(1, 0, 13472288); 
    id.set(2, 0, 1302064);
    id.set(3, 0, 120064);
    id.set(4, 0, 10336); 
    id.set(5, 0, 806); 
    id.set(6, 0, 57); 
    id.set(7, 0, 5);
    id.set(8, 0, 1);

    const m = matrix.pow(n, MODULO);
    const v = m.multiply(id, MODULO)

    return v.get(m.rows-1, 0);
}

function S(max, trace)
{
    function f(n)
    {
        let total = 0;
        let m = n % MODULO;
    
        while(n)
        {
            if (n & 1) {
                total = (total + m) % MODULO;
                n -= 1;
            }
            n /= 2;
        }
        return total;
    }

    const tracer = new Tracer(10000, trace);

    let power = 0;
    let start = 1;
    let end   = max;
    let sign  = 1;

    while (2*start <= max) {
        power++;
        start *= 2;
    }

    if (max - start > start+start-max) {
        power++;        
        end   = start+start;
        start = max+1;
        sign  = -1;
    } else {
        sign = 1;
        start= start+1;
        end  = max;
    }

    let part1 = fast(power);
    let part2 = 0;

    for(let i = start; i <= end; i++) {
        tracer.print(_ => end-i);

        let F = f(i);
        F = F.modMul(F, MODULO);
        part2 = (part2 + F) % MODULO;
    }    

    tracer.clear();
    if (sign === 1) {
        return (part1+part2) % MODULO;
    } else {
        return (part1+MODULO-part2) % MODULO;
    }
}

function solve(n)
{
    const matrix = Matrix.fromRecurrence([262144, -688128, 774144, -488960, 190848, -47712, 7640, -756, 42]);
    const id = new Matrix(9, 1);

    id.set(0, 0, 134814336); 
    id.set(1, 0, 13472288); 
    id.set(2, 0, 1302064);
    id.set(3, 0, 120064);
    id.set(4, 0, 10336); 
    id.set(5, 0, 806); 
    id.set(6, 0, 57); 
    id.set(7, 0, 5);
    id.set(8, 0, 1);

    const m = matrix.pow(n, MODULO);
    const v = m.multiply(id, MODULO)

    return v.get(m.rows-1, 0);
}

function test(n)
{
    let states = new Matrix(1, 4);
    states.set(0, 0, 1);
    // states.set(1, 0, 1);

    const matrix = new Matrix(4, 4);

    let b = 1;
    while(true)
    {
        if (n & b) {
            matrix.set(0, 0, 3+2*b); matrix.set(0, 1, 1+1*b); matrix.set(0, 2,     0); matrix.set(0, 3,     0); 
            matrix.set(1, 0,     1); matrix.set(1, 1, 3+3*b); matrix.set(1, 2,     0); matrix.set(1, 3,     0); 
            matrix.set(2, 0,     1); matrix.set(2, 1, 1+1*b); matrix.set(2, 2, 2+2*b); matrix.set(2, 3,     0); 
            matrix.set(3, 0,     0); matrix.set(3, 1, 2+2*b); matrix.set(3, 2,     1); matrix.set(3, 3, 1+1*b); 
        } else {
            matrix.set(0, 0,     1); matrix.set(0, 1, 1+1*b); matrix.set(0, 2, 2+2*b); matrix.set(0, 3,     0); 
            matrix.set(1, 0,     0); matrix.set(1, 1, 2+2*b); matrix.set(1, 2,     1); matrix.set(1, 3, 1+1*b); 
            matrix.set(2, 0,     0); matrix.set(2, 1,     0); matrix.set(2, 2, 3+2*b); matrix.set(2, 3, 1+1*b); 
            matrix.set(3, 0,     0); matrix.set(3, 1,     0); matrix.set(3, 2,     1); matrix.set(3, 3, 3+3*b); 
        }

        states = states.multiply(matrix, MODULO);
        if (b >= n) {
            break;
        }

        b *= 2;
    }

    const under = (states.get(0, 0) + states.get(0, 1)) % MODULO;
    const over  = (states.get(0, 2) + states.get(0, 3)) % MODULO;

    const result = (under - over + MODULO) % MODULO;

    return result;
}

assert.strictEqual(S(10), 1530);
assert.strictEqual(S(100), 4798445);
assert.strictEqual(S(2**5), 120064);
assert.strictEqual(S(2**6), 1302064);

console.log('Tests passed');

console.log(test(100))
console.log(test(12345))
// const answer = timeLogger.wrap('', _ => S(MAX, true));

// console.log(`Answer is ${answer}`);