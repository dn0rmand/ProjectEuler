// Subset sums
// -----------
// Problem 635
// -----------
// Let Aq(n) be the number of subsets, B, of the set {1,2,...,q*n} that satisfy two conditions:
// 1) B has exactly n elements;
// 2) the sum of the elements of B is divisible by n

// E.g. A2(5)=52 and A3(5)=603

// Let Sq(L) be ∑Aq(p) where the sum is taken over all primes p≤L
// E.g. S2(10)=554, S2(100) mod 1000000009=100433628 and S3(100) mod 1000000009=855618282

// Find S2(10^8)+S3(10^8). Give your answer modulo 1000000009

require('@dn0rmand/project-euler-tools/src/bigintHelper');

const assert = require('assert');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');

const MODULO = 1000000009;
const MODULO_N = BigInt(MODULO);

const MAX = 100000000;

const factorial = new Uint32Array(3*MAX);

function preload()
{
    console.log("Preloading primes")
    primeHelper.initialize(MAX, true);

    console.log("Preloading factorials")
    let value = 1;
    let x     = 2;
    let max   = 3*MAX;

    while (x <= max)
    {
        let v = (value * x);
        if (v > Number.MAX_SAFE_INTEGER)
        {
            v = (BigInt(value) * BigInt(x)) % MODULO_N;
            value = Number(v);
        }
        else
        {
            value = v % MODULO;
        }
        factorial[x++] = value;
    }

    console.log('Preloaded')
}

function divise(quotient, divisor)
{
    if (typeof(quotient) !== 'bigint')
        quotient = BigInt(quotient);

    if (typeof(divisor) !== 'bigint')
        divisor = BigInt(divisor);

    divisor = divisor.modInv(MODULO_N);

    let result = (quotient * divisor) % MODULO_N;

    return result;
}

function CNR(n, r)
{
    let N = BigInt(factorial[n]);
    let R = BigInt(factorial[r]);
    let NR= BigInt(factorial[n-r]);

    let divisor = (R * NR) % MODULO_N;
    let result  = N.modDiv(divisor, MODULO_N);

    return result;
}

function A(q, n)
{
    if (q != 2 && q != 3)
        throw "q can only be 2 or 3 supported"

    // Special case
    if (n == 2)
        return q == 2 ? BigInt(2) : BigInt(6);

    // Normal case

    let v1 = BigInt(q*(n-1));
    let v2 = BigInt(CNR(q*n, n));
    let v  = (v1 + v2) % MODULO_N;

    let result = v.modDiv(n, MODULO_N) ;
    return result;
}

function S(q, n)
{
    let total = BigInt.ZERO;
    for (let p of primeHelper.primes())
    {
        if (p > n)
            break;

        total = (total + A(q, p)) % MODULO_N;
    }
    return total;
}

function Solve(n)
{
    let total = BigInt.ZERO;
    for (let p of primeHelper.primes())
    {
        if (p > n)
            break;

        let a = (A(2, p) + A(3, p)) % MODULO_N;

        total = (total + a) % MODULO_N;
    }

    return Number(total);
}

console.time(635);
preload();

assert.equal(A(2,5), 52);
assert.equal(A(3,5), 603);

assert.equal(A(2, 7), 492);
assert.equal(A(3, 7), 16614);

assert.equal(S(2, 10), 554);
assert.equal(S(2, 100), 100433628);
assert.equal(S(3, 100), 855618282);

console.log("All tests passed");

let answer = Solve(MAX);

console.timeEnd(635);
console.log("Answer is", answer);
