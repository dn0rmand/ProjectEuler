const assert = require('assert');

const MAX = 10n**17n;

function loadFibonacci(max)
{
    const fibs = [1n, 2n];
    const sums = [1n, 2n];

    let index = 2;

    while (true)
    {
        const sum = sums[index-2] + sums[index-1] + fibs[index-2] - 1n;
        const next = fibs[index-1] + fibs[index-2];
        if (next > max)
            break;

        fibs.push(next);
        sums.push(sum);
        index++;
    }

    return { fibs: fibs, sums: sums };
}

function solve(max)
{
    const {fibs:fibs, sums: sums} = loadFibonacci(max);

    function find(n)
    {
        let min    = 0;
        let max    = fibs.length-1;

        while (min <= max)
        {
            const mid = (min+max)>>1;
            const v   = fibs[mid];
            if (v < n)
                min = mid+1;
            else
                max = mid-1;
        }
        if (max < 0)
            max = 0;
        else if (max >= fibs.length)
            max = fibs.length-1;

        if (fibs[max] > n)
            throw `${fibs[max]} >= ${n}`;

        return { fib: fibs[max], sum: sums[max] };
    }

    function fibSum(n)
    {
        const index = fibs.indexOf(n);
        if (index >= 0)
            return sums[index];

        const {fib:closest, sum: subSum} = find(n);
        const newN = n - closest;
        const result = subSum  + newN + fibSum(n-closest);
        return result
    }

    const total = fibSum(max-1n);

    return total;
}

assert.equal(solve(10n**6n), 7894453);

const answer = solve(MAX);
console.log('Answer is', answer);