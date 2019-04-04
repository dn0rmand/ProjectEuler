const assert = require('assert');
const prettyTime= require("pretty-hrtime");

const MAX_N = 10000003;
const MIN_L = 10000000;
const MAX_L = 10200000;

function getTribonacci(n, maxI)
{
    maxI = 2*maxI + 2;

    const t = new Uint32Array(maxI);
    t[2] = 1;

    for (let i = 3; i < maxI; i++)
    {
        t[i] = (t[i-1]+t[i-2]+t[i-3]) % n;
    }

    return t;
}

function *M(n, minSteps, maxSteps)
{
    let trace = true;

    if (maxSteps === undefined)
    {
        trace    = false;
        maxSteps = minSteps;
        minSteps = 0;
    }

    const T  = getTribonacci(n, maxSteps);
    const A  = new Int32Array(n);

    function calculateMax(s, e)
    {
        let max_so_far = A[s];
        let max_ending_here = A[s];

        let i1 = 0;
        let i2 = 0;
        let start = s;

        for (let i = s+1; i < e; i++)
        {
            max_ending_here += A[i];
            if (max_so_far <= max_ending_here)
            {
                i1 = start;
                i2 = i;
                max_so_far = max_ending_here;
            }
            if (max_so_far < A[i])
            {
                max_so_far = A[i];
                start = i;
                i1 = i;
                i2 = i;
                max_ending_here = max_so_far;
            }
            else if (max_ending_here < 0)
            {
                max_ending_here = 0;
                if (A[i] < 0)
                    start = i+1;
                else
                    start = i;
            }
        }
        if (i2 < i1)
            i2 = n-1;

        return  [max_so_far, i1, i2];
    }

    let m1 = 0, m2 = 0, M  = undefined;

    function maxSubArraySum(index, $old, $new)
    {
        if (M === undefined)
        {
            [M, m1, m2] = calculateMax(0, n);
            return M;
        }

        if ($old > $new && (index < m1 || index > m2))
        {
            return M; // No change
        }
        else if ($old < $new && index >= m1 && index <= m2)
        {
            M += ($new - $old);
            return M;
        }
        else if (index < m1)
        {
            if ($new < 0 && $old > $new)
                return M;
            [M, m1, m2] = calculateMax(0, m2+1);
            return M;
        }
        else if (index > m2)
        {
            if ($new < 0 && $old > $new)
                return M;
            [M, m1, m2] = calculateMax(m1, n);
            return M;
        }
        else
        {
            [M, m1, m2] = calculateMax(0, n);
            return M;
        }
    }

    let count = 1;

    for (let i = 1; i <= maxSteps; i++)
    {
        if (trace)
        {
            if (count === 0)
            {
                process.stdout.write(`\r${i}`);
            }
            if (++count >= 100)
                count = 0;
        }

        let j = i+i;
        let x = T[j - 2];
        let y = T[j - 1];

        let $old = A[x];
        A[x] = A[x] + 2*y - n + 1;
        let $new = A[x];

        if (i > minSteps)
        {
            if (M === undefined || $old !== $new)
                M = maxSubArraySum(x, $old, $new);

            yield M;
        }
    }
    if (trace)
        console.log(`\r${maxSteps}`);
}

function S(n, minL, maxL)
{
    let total = 0;
    let extra = 0n;

    for (let m of M(n, minL, maxL))
    {
        let t = total + m;
        if (! Number.isSafeInteger(t))
        {
            extra = BigInt(total)+BigInt(m);
            total = 0;
        }
        else
            total = t;
    }

    return BigInt(total) + extra;
}

assert.equal(S(5, 100), 2416);
assert.equal(S(14, 100), 3881);
assert.equal(S(107, 1000), 1618572);
console.log('Test passed');

let timer = process.hrtime();
const answer = S(MAX_N, MIN_L, MAX_L);
timer = process.hrtime(timer);
console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));
console.log('Should be 1884138010064752');