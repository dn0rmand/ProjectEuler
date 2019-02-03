// The prime factorisation of binomial coefficients
// ------------------------------------------------
// Problem 231
// -----------
// The binomial coefficient 10C3 = 120.
// 120 = 2^3 × 3 × 5 = 2 × 2 × 2 × 3 × 5, and 2 + 2 + 2 + 3 + 5 = 14.
// So the sum of the terms in the prime factorisation of 10C3 is 14.

// Find the sum of the terms in the prime factorisation of 20000000C15000000.

const assert = require('assert');

const primeHelper = require('tools/primeHelper')();

const MAX_N = 20000;
const MODULO= 1000000007;
const MODULO_B= BigInt(MODULO);

primeHelper.initialize(MAX_N);

const $factorial = new Map();

const ONE = BigInt(1);
const ZERO= BigInt(0);

function GCD(a, b) 
{
    while (b !== ZERO) 
    {
        let t = a;
        a = b;
        b = t % b;
    }
    return a;
}

function factorial(n)
{
    if (n < 2)
        return BigInt(1);

    if ($factorial.has(n))
        return $factorial.get(n);

    let result = BigInt(n);
    for (let x = BigInt(n-1); x > ONE; x--)
    {
        if ($factorial.has(x))
        {
            result = result * $factorial.get(x);
            break;
        }
        else
            result *= x;
    } 

    $factorial.set(n, result);
    return result;
}

function binomial(n,  k)
{
    let K = factorial(k);
    let NK= factorial(n-k);
    let N = factorial(n);

    let v = N / (K * NK);

    return v;
}

function getPrimes(N, K)
{
    let NK = N-K;

    factors = {}

    for (let i = 2; i <= NK; i++)
    {
        primeHelper.factorize(i, (prime, factor) =>
        {
            if (factors[prime] === undefined)
                factors[prime] = -factor;
            else
                factors[prime] -= factor;
        });
    }

    for (let i = K+1; i <= N; i++)
    {
        primeHelper.factorize(i, (prime, factor) =>
        {
            if (factors[prime] === undefined)
                factors[prime] = factor;
            else
                factors[prime] += factor;
        });
    }

    for (let k of Object.keys(factors))
        if (factors[k] < 0)
            throw "WTF";
        else if (factors[k] == 0)
            delete factors[k];
    return factors;
}

function *getDivisors(factors)
{
    let keys     = Object.keys(factors);
    let divisors = new Set();

    function *inner(index, value)
    {
        if (! divisors.has(value))
        {
            divisors.add(value);
            yield Number(value);// % MODULO_B);
        }

        for (let i = index; i < keys.length; i++)
        {
            let p = keys[i];
            let count = factors[p];
            p = BigInt(+p);

            let v = value;
            while (count-- > 0)
            {
                v *= p;
                yield *inner(i+1, v);
            }
        }
    }

    yield *inner(0, ONE);
}

function product(n)
{
    let divisors  = new Set();
    let pending     = [];
    let pendingKeys = new Map();

    divisors.add(ONE);

    let visited = {}

    function inner(t, b, index)
    {
        let k = t + '.' + b;
        if (visited[k] !== undefined)
        {
            if (visited[k] <= index)
                return;
        }
        visited[k] = index;

        if (b === ONE)
            divisors.add(t);

        for (let i = index; i < pending.length; i++)
        {
            let v = pending[i];
            let t2 = t * v[0];
            let b2 = b * v[1];
            
            let x = GCD(t2, b2);
            if (x > ONE)
            {
                t2 /= x;
                b2 /= x;
            }

            inner(t2, b2, i+1);
        }
    }

    function contains(t, b)
    {
        if (pendingKeys.has(t))
            return pendingKeys.get(t).has(b);
        else
            return false;
    }

    function add(t, b)
    {
        if (contains(t, b))
            return false;

        if (! pendingKeys.has(t))
        {
            m = new Set();
            m.add(b);
            pendingKeys.set(t, m);
        }
        else
            pendingKeys.get(t).add(b);
        pending.push([t, b]);
        return true;
    }

    for (let k = 1; k <= n; k++)
    {
        let t = BigInt(n-k+1);
        let b = BigInt(k);

        let x = GCD(t, b);
        if (x !== ONE)
        {
            t /= x;
            b /= x;
        }
        add(t, b);
    }    

    inner(ONE, ONE, 0);
    return 0;
}

function product2(n)
{
    let factors = {}

    for (let k = 0; k <= n; k++)
    {
        let f = getPrimes(n, k);
        for (let p of Object.keys(f))
        {
            if (factors[p] === undefined)
                factors[p] = f[p];
            else
                factors[p] += f[p];
        }
    }

    return factors;
}

function D(n)
{
    let factors = product(n);
    let total   = 0;

    for (let d of getDivisors(factors))
        total = (total + d);// % MODULO;

    return total;
}

function S(n)
{
    let total = 0;

    for (let x = 1; x <= n; x++)
        total = (total + D(x));// % MODULO ;

    return total;
}

D(100);

assert.equal(D(5), 5467);
assert.equal(S(5), 5736);
assert.equal(S(100), 332792866);
assert.equal(S(10), 141740594713218418 % MODULO);

console.log("Done");