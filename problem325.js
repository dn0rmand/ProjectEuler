const assert = require('assert');
const bigNumber = require('bignumber.js');
const prettyTime= require("pretty-hrtime");

require('tools/numberHelper');

const MODULO = 7n ** 10n;
const MAX    = 10n ** 16n;

const fibonacci = (function()
{
    let fibs = [0n, 1n];
    let l = 1;
    while (fibs[l] < MAX)
    {
        fibs[l+1] = fibs[l] + fibs[l-1];
        l++;
    }
    return fibs;
})();

/*

We can prove a theorem: Any losing configuration must be of form
(a * F_t + b * F_{t-1}, a * F_{t-1} + b * F_{t-2})
where t is odd, F_t are the Fibonacci numbers and a, b be natural numbers such that a >= 2 * b.

Expand the sum a bit and we have the formula.

*/

function SS(N)
{
    let total = 0n;

    for (let t = 3; t < fibonacci.length; t += 2)
    {
        for (let b = 1n; ; b++)
        {
            let a = b+b;

            let A = a * fibonacci[t]   + b * fibonacci[t-1];
            let B = a * fibonacci[t-1] + b * fibonacci[t-2];

            if (A > N || B > N)
                break;

            while (A <= N && B <= N)
            {
                total += (A+B);

                A += fibonacci[t];
                B += fibonacci[t-1]
            }
        }
    }
    return total;
}

const coef  = (Math.sqrt(5)+1) / 2;

function $S(N)
{
    function inner(n)
    {
        if (n <= 1)
            return [0n, 0n, 0n];

        let n_coef = BigInt(bigNumber(n.toString()).dividedBy(coef).integerValue().toString());
        let m_coef = n - 1n - n_coef;

        let [below, above, total] = inner(n_coef);

        let A = (m_coef ** 2n) + m_coef;
        let B = (m_coef ** 3n) - m_coef;
        let C = (n_coef ** 3n) - n_coef;

        below = (A + (A*n_coef + C)/2n + B/3n - total) % MODULO;
        above = ((A*n - A) / 2n + (C - B)/3n - total + above) % MODULO;

        console.log(n, below+above);

        return [below, above, (below + above) % MODULO];
    }

    return Number(inner(N)[2]);
}

function S2(N)
{
    let tau = 1 / (1+coef);
    let total = 0;
    let modulo = Number(MODULO);

    {
        let count = Math.floor(N * tau);
        let v1    = N.modMul(4*count, modulo);
        let v2    = (count.modMul(count, modulo) + count) % modulo;
        let v3    = v1 - v2;
        while (v3 < 0)
            v3 += modulo;

        let v     = v3.modDiv(2, modulo);

        if (! Number.isSafeInteger(v1))
            console.log('v1 too Big');
        if (! Number.isSafeInteger(v2))
            console.log('v2 too Big');
    }

    for (let i = N; i >=  3; i--)
    {
        let count = Math.floor(i * tau) ;
        let v1    = i.modMul(4*count, modulo);
        let v2    = (count.modMul(count, modulo) + count) % modulo;
        let v3    = v1 - v2;
        while (v3 < 0)
            v3 += modulo;

        let v     = v3.modDiv(2, modulo);
        total     = (total + v) % modulo;
    }
    return total;
}

function S(N)
{
    if (N < 2)
        return 0;

    N = Number(N);

    let lines  = Array(N+1).fill(0);

    let matrix = [];
    for (let i = 0; i <= N; i++)
    {
        matrix[i] = Array(N+1).fill("00");
    }

    function add(a, b)
    {
        let t = a+b;
        lines[b]++;
        total += t;
        t = t.toString();
        while (t.length < 2)
            t = '0'+t;
        matrix[a][b] = t;
    }

    function dump()
    {
        console.log('');
        for (let i = 0; i <= N; i++)
            console.log(... matrix[i]);
        console.log('');
        console.log(lines.join(', '));
        console.log('');
    }

    let total = 0;
    let modulo = Number(MODULO);

    for (let a = 2; a < N; a++)
    {
        let b = a+1;
        add(a, b)
        let max = Math.floor(a * coef);
        while (b < max && b < N)
        {
            b++;
            add(a, b);
        }
    }
    dump();
    return total;
}

assert.equal(S2(10), 211);
assert.equal(S2(10000), 230312207313n % MODULO);

let timer = process.hrtime();
let answer = S2(1E8);
timer = process.hrtime(timer);
console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));

// console.log(S(30));
// console.log(S2(30));
// assert.equal($S(10000n), 230312207313n % MODULO);

//let answer = 0;//S(MAX);
//console.log('Answer is', answer);
