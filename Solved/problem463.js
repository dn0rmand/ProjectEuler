// A weird recurrence relation

// Problem 463
// The function f is defined for all positive integers as follows:

// f(1)=1
// f(3)=3
// f(2n)=f(n)
// f(4n+1)=2*f(2n+1)−f(n)
// f(4n+3)=3*f(2n+1)−2*f(n)

// The function S(n) is defined as ∑f(i) for i in [1..n]
// S(8)=22 and S(100)=3604

// Find S(3^37). Give the last 9 digits of your answer.

/*
S(4n + 0) = 6*S(2*n+0) - 5*S(1*n) - 3*S(n-1) - 1
S(4n + 1) = 2*S(2*n+1) + 4*S(2*n) - 6*S(n)   - 2*S(n-1) - 1
S(4n + 2) = 3*S(2*n+1) + 3*S(2*n) - 6*S(n)   - 2*S(n-1) - 1
S(4n + 3) = 6*S(2*n+1) - 8*S(1*n) - 1
*/

const assert = require('assert');

const MODULO = 1000000000;
const MAX = 3n ** 37n;

const $S = new Map();

function S(n)
{
    function MOD(x)
    {
        while (x < 0)
            x += MODULO;

        if (x >= MODULO)
            x %= MODULO;

        return x;
    }

    if (n === 0n)
        return 0;
    if (n === 1n)
        return 1;
    if (n === 2n)
        return 2;
    if (n === 3n)
        return 5;

    let key = n;

    if ($S.has(key))
        return $S.get(key);

    let result;

    let k = n % 4n;
    n = (n-k)/4n;

    switch (k)
    {
        case 0n:
        {
            let a = S(2n * n);
            let b = S(n);
            let c = S(n-1n);

            result = MOD(MOD(6*a) - MOD(5*b) - MOD(3*c) - 1);
            break;
        }
        case 1n:
        {
            let a = S(2n*n + 1n);
            let b = S(2n*n);
            let c = S(n);
            let d = S(n-1n);

            result = MOD(MOD(2*a) + MOD(4*b) - MOD(6*c) - MOD(2*d) - 1);
            break;
        }
        case 2n:
        {
            let a = S(2n*n + 1n);
            let b = S(2n*n);
            let c = S(n);
            let d = S(n-1n);

            result = MOD(MOD(3*a) + MOD(3*b) - MOD(6*c) - MOD(2*d) - 1);
            break;
        }
        case 3n:
        {
            let a = S(2n*n + 1n);
            let b = S(n);

            result = MOD(MOD(6*a) - MOD(8*b) - 1);
            break;
        }

        default:
            throw "Impossible";
    }

    $S.set(key, result);
    return result;
}

assert.equal(S(8n), 22);
assert.equal(S(100n), 3604);

const answer = S(MAX);
console.log('Answer is', answer);