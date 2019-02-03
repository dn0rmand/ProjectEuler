const assert = require('assert');

const MODULO = 1000000007;
const MAX_M  = 1E12;
const MAX_N  = 5000;

function $T(n, m)
{
    function *inner(values)
    {
        if (values.length === m)
        {
            yield values;
            return;
        }
        if (values.length === 0)
        {
            for (let i = 1; i < n; i++)
            {
                yield *inner([i]);
            }
            return;
        }
        let last = values[values.length-1];
        for (let i = 1; i < n; i++)
        {
            if (i+last <= n)
            {
                yield *inner([...values, i]);
            }
        }
    }

    let total = 0;

    for (let tuple of inner([]))
        total++;

    return total;
}

function T(n, m)
{
    let states    = new Uint32Array(n);
    let newStates = new Uint32Array(n);

    states.fill(1);

    for (let x = 2; x <= m; x++)
    {
        process.stdout.write('\r' + x);
        newStates.fill(0);

        for (let d1 = 1; d1 < n; d1++)
        {
            let count = states[d1];
            let limit = n-d1;

            for (let d2 = 1; d2 <= limit; d2++)
                newStates[d2] = (newStates[d2] + count) % MODULO;
        }
        // Swap arrays
        let t = states;
        states = newStates;
        newStates = t;
    }

    let total = 0;
    for (let i = 1; i < n; i++)
        total = (total + states[i]) % MODULO;

    return total;
}

// console.log("T(3, 4) =", T(3, 4));
// console.log("T(5, 5) =", T(5, 5));

assert.equal(T(3, 4), 8);
assert.equal(T(5, 5), 246);
assert.equal(T(10, 100), 862820094);
assert.equal(T(100, 10), 782136797);
console.log("\rTests passed");
for (let i = 2; i < MAX_M;)
    i++;
let answer = T(MAX_N, MAX_M);
console.log('Answer is', answer);
