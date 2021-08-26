const assert = require('assert');
const linearRecurrence = require('tools/linearRecurrence');
const matrix = require('tools/matrix');
const timeLogger = require('tools/timeLogger');

const MODULO = 10n ** 9n;
const MAX = 10n ** 18n;

const sequence = (function()
{
    const s = [1, 2, 3];

    let s0 = 1;
    let s1 = 2;
    let s2 = 3;

    while(s.length < 1000) {
        const s3 = s2 + s0;
        s.push(s3);

        s0 = s1;
        s1 = s2;
        s2 = s3;
    }

    return s;
})();

function f(n)
{
    const $memoize = [];

    function get(index, sum, count) {
        const x = $memoize[index];
        if (x) {
            const y = x[count];
            if (y) {
                return y.get(sum);
            }
        }
    }

    function set(index, sum, count, value) {
        let x = $memoize[index];
        if (! x) {           
            $memoize[index] = x = [];
        }
        let y = x[count];
        if (! y) {            
            x[count] = y = new Map();
        }

        y.set(sum, value);
    }

    function inner(index, sum, count)
    {
        if (index >= n) {
            return 0;
        }

        let t = get(index, sum, count);
        if (t !== undefined) {
            return t;
        }

        t = 0;
        for(let i = index; i < n; i++) {
            const s = sequence[i];

            if (count >= 2 && s < sum) {
                t += 1;
            }

            t += inner(i+1, sum + s, count+1);
        }

        set(index, sum, count, t);
        return t;
    }

    const total = inner(0, 0, 0);

    if (total > Number.MAX_SAFE_INTEGER) {
        throw "Please use BigiInt";
    }
    return total;
}

function solve(n)
{
    const values = [];

    for(let i = 0; i < 19; i++) {
        values.push(f(i+4));
    }
   
    const { factors } = linearRecurrence(values, true);
    const M = matrix.fromRecurrence(factors);
    const V = new matrix(M.rows, 1);

    for(let i = 0; i < M.rows; i++) {
        V.set(M.rows-i-1, 0, values[i]);
    }

    const m = M.pow(BigInt(n)-4n, MODULO);
    const r = m.multiply(V, MODULO).get(V.rows-1, 0);
    
    return Number(r);
}

assert.strictEqual(f(5), 7);
assert.strictEqual(f(10), 501); 
assert.strictEqual(f(25), 18635853);

assert.strictEqual(solve(25), 18635853);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(MAX));
console.log(`Answer is ${answer}`);