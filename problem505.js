const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const BigMap = require('tools/BigMap');

const MODULO = 2n**60n;
const MAX    = 10n ** 12n;

const max = (a, b) => a > b ? a : b;
const min = (a, b) => a < b ? a : b;

const $x = new BigMap('x');

function x(i)
{
    if (i === 0n)
        return 0n;
    else if (i === 1n)
        return 1n;
    
    let res = $x.get(i);
    if (res !== undefined)
        return res;

    if (i & 1n)
    {
        const k = (i-1n)/2n;
        res = (2n * x(k) + 3n * x(k / 2n)) % MODULO;
    }
    else
    {
        const k = i / 2n;

        res = (3n * x(k) +  2n * x(k / 2n)) % MODULO;
    }

    $x.set(i, res);
    return res;
}

const $y = new BigMap('y');

let REF_N = undefined;

function yy(k)
{
    if (k >= REF_N)
        return x(k);
    else
    {
        let res = $y.get(k);

        if (res !== undefined) 
            return res;

        const res1 = MODULO - 1n - yy(k+k);
        const res2 = MODULO - 1n - yy(k+k+1n);

        res = min(res1, res2);

        $y.set(k, res);
        return res;
    }
}

function y(n, k)
{
    REF_N = n;
    $y.clear();  
    return yy(k);
}

const A = n => y(n, 1n);

assert.equal(x(2n), 3n);
assert.equal(x(3n), 2n);
assert.equal(x(4n), 11n);

assert.equal(y(4n, 4n), 11n);
assert.equal(y(4n, 3n), MODULO - 9n);
assert.equal(y(4n, 2n), MODULO - 12n);

assert.equal(A(4n), 8);
assert.equal(A(10n), MODULO - 34n);

assert.equal(A(1000n), 101881n);

console.log('Tests passed');

const answer = timeLogger.wrap('', () => A(50000000n));

console.log(`Answer is ${answer}`);