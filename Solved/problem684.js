const assert = require('assert');
const timeLog = require('tools/timeLogger');
const {Matrix} = require('ml-matrix');

require('tools/bigintHelper');
require('tools/numberHelper');

const MODULO   = 1000000007;
const MODULO_N = BigInt(MODULO);
const TEN      = 10n;

class DNMatrix extends Matrix
{
    static get [Symbol.species]() 
    {
      return this;
    }

    mmul(other) 
    {
        other = this.constructor.checkMatrix(other);
        if (this.columns !== other.rows)
        {
            // eslint-disable-next-line no-console
            console.warn('Number of columns of left matrix are not equal to number of rows of right matrix.');
        }

        var m = this.rows;
        var n = this.columns;
        var p = other.columns;

        var result = new this.constructor[Symbol.species](m, p);

        var Bcolj = new Array(n);
        for (var j = 0; j < p; j++)
        {
            for (var k = 0; k < n; k++)
            {
                Bcolj[k] = other.get(k, j);
            }

            for (var i = 0; i < m; i++)
            {
                var s = 0;
                for (k = 0; k < n; k++)
                {
                    let v = this.get(i, k).modMul(Bcolj[k], MODULO);
                    s = (s + v) % MODULO;
                }

                result.set(i, j, s);
            }
        }

        return result;
    }

    static create()
    {
        let matrix = this.zeros(3, 3);

        matrix.set(0, 0,  1);
        matrix.set(1, 0, 54);
        matrix.set(2, 0, -9);
        matrix.set(1, 1, 10);
        matrix.set(2, 2,  1);

        return matrix;
    }

    pow(pow)
    {
        let m  = this;
        let mm = undefined;

        if (pow == 1)
            return m;

        while (pow > 1)
        {
            if ((pow & 1n) != 0)
            {
                if (mm === undefined)
                    mm = m;
                else
                    mm = mm.mmul(m);

                pow--;
            }

            while (pow > 1 && (pow & 1n) == 0)
            {
                pow /= 2n;
                m =  m.mmul(m);
            }
        }

        if (mm !== undefined)
        {
            m = m.mmul(mm);
        }

        return m;
    }
}

function s(n)
{
    let m = (n % 9n)
    let v = m + 1n;
    let x = (n-m) / 9n;

    let r = TEN.modPow(x, MODULO_N).modMul(v, MODULO_N) - 1n;
    if (r < 0n)
        r = MODULO_N-1n;

    return Number(r);
}

const $lastS = { k: 0n, total: 0 };

function S1(k)
{
    k = BigInt(k);
    let start = $lastS.k + 1n;
    let total = $lastS.total;

    if (start > k)
    {
        start = 1n;
        total = 0;
    }

    while(start % 9n != 0 && start <= k)
    {
        let value = s(start);

        total = (total + value) % MODULO;

        start++;
    }

    // Faster
    if (start <= k)
    {
        const H = 1+2+3+4+5+6+7+8+9;

        let previous = s(start);
        let power    = (previous+1) % MODULO;

        total = (total + previous) % MODULO;
        start++;
        while (start+9n <= k)
        {
            let value = (previous.modMul(9, MODULO) + H.modMul(power, MODULO)) % MODULO;

            total = (total + value) % MODULO;

            previous = (previous.modMul(10, MODULO) + 9) % MODULO;
            power    = power.modMul(10, MODULO);
            start   += 9n;
        }
    }

    // Finish
    while(start <= k)
    {
        let value = s(start);

        total = (total + value) % MODULO;

        start++;
    }

    $lastS.k = k;
    $lastS.total = total;

    return total;
}

function S2(k)
{
    let n     = k - (k % 9n);
    let total = 10n.modPow(n/9n, MODULO_N).modMul(6n, MODULO_N) - ((6n + n) % MODULO_N);

    while (total < 0)
        total += MODULO_N;

    total = Number(total % MODULO_N);

    for(let m = n + 1n; m <= k; m++)
        total = (total + s(m)) % MODULO;

    return total;
}

const refMatrix = DNMatrix.create();

function S3(k)
{
    let total = 0;
    let p = (k - (k % 9n));
    if (p > 0n)
    {
        let m = refMatrix.pow(p / 9n);
        total = (m.get(1, 0) + m.get(2, 0)) % MODULO;

        while (total < 0)
            total += MODULO;
    }

    for (let i = p+1n; i <= k; i++)
    {
        total = (total + s(i)) % MODULO;
    }
    return total;
}

const S = S3; // using Matrix

function solve(max)
{
    let f0 = 0n;
    let f1 = 1n;

    let total = 0;

    for (let i = 2; i <= max; i++)
    {
        let f = f0+f1;
        f0 = f1;
        f1 = f;

        let v = S(f);
        total = (total + v) % MODULO;
    }
    return total;
}

assert.equal(s(10n), 19);
assert.equal(S(20n), 1074);
assert.equal(solve(30), 159166760);
assert.equal(solve(31), 979170050);
assert.equal(solve(32), 725966949);
assert.equal(solve(33), 319026893);

console.log('Tests passed');

const MAX = 90;

let answer = timeLog.wrap('', () => {
    return solve(MAX, true);
});
console.log("Answer for", MAX, "is", answer);