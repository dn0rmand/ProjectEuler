// The prime factorisation of binomial coefficients
// ------------------------------------------------
// Problem 231
// -----------
// The binomial coefficient 10C3 = 120.
// 120 = 2^3 × 3 × 5 = 2 × 2 × 2 × 3 × 5, and 2 + 2 + 2 + 3 + 5 = 14.
// So the sum of the terms in the prime factorisation of 10C3 is 14.

// Find the sum of the terms in the prime factorisation of 20000000C15000000.

// require('es6-shim');

import * as assert from 'assert';
import * as BigInteger from 'tools/bigintHelper';
import * as $primeHelper from 'tools/primeHelper';

const primeHelper      = $primeHelper();

const MAX_N: number    = 20000;
const MODULO: number   = 1000000007;
const MODULO_B: bigint = BigInt(MODULO);

primeHelper.initialize(MAX_N);

const $factors = new Map<number, Factor[]>();
const $modInv = new Map<number, bigint>();

declare interface BigInt
{
    modInv(modulo : bigint): bigint;
    modPow(power : bigint, modulo: bigint): bigint;
}

interface Factor
{
    prime: number;
    count: number;
}

function getInverseModulo(divisor: number) : bigint
{
    if ($modInv.has(divisor))
        return $modInv.get(divisor) || 0n;

    let d: bigint = BigInt(divisor);

    d = d.modInv(MODULO_B)
    $modInv.set(divisor, d);
    return d;
}

function getFactors(n: number) : Factor[]
{
    let result : Factor[];

    let x = $factors.get(n);

    if (x !== undefined)
    {
        result = x;
    }
    else
    {
        result = [];

        primeHelper.factorize(n, (prime: number, count: number) => {
            result.push({ prime: prime, count:count });
        });

        $factors.set(n, result);
    }
    return result;
}

function *factorize(n: number): Iterable<Factor>
{
    for (let entry of getFactors(n))
        yield entry;
}

// previous is B(n-1) which is a map of factors key=prime , value=count
function getNextB(n:number, previous: Map<number, number>): Map<number, number>
{
    if (n === 1)
    {
        previous = new Map<number, number>();
        return previous;
    }

    // n^n
    for (let entry of factorize(n))
    {
        let count = entry.count * n;
        let prime = entry.prime;

        count += (previous.get(prime) || 0);
        previous.set(prime, count);
    }

    // n!
    for (let i = 2; i <= n; i++)
    {
        for (let entry of factorize(i))
        {
            let count = entry.count;
            let prime = entry.prime;

            let c = (previous.get(prime)||0) - count;
            if (c < 0)
                throw "That should not be either";

            if (c === 0)
                previous.delete(prime);
            else
                previous.set(prime, c);
        }
    }

    return previous;
}

function B(n: number): Map<number, number>
{
    let current = new Map<number, number>();

    for (let i = 1; i <= n; i++)
    {
        current = getNextB(i, current);
    }

    return current;
}

function modDiv(num:bigint, divisor:number): bigint
{
    let d: bigint = getInverseModulo(divisor);
    return (num * d) % MODULO_B;
}

function modPow(value:number, power:number): bigint
{
    let v:bigint = BigInt(value);
    let p:bigint = BigInt(power);

    let result: bigint = v.modPow(p, MODULO_B);

    return result;
}

function innerD(n: number, bn: Map<number, number>)
{
    if (bn.size === 0) // not calculated?
        bn = B(n);

    let total = 1n;

    for (let entry of bn)
    {
        let prime:number = entry[0];
        let count:number = entry[1];

        let x:bigint = modPow(prime, count+1) - 1n;

        if (x < 0n)
            x += MODULO_B;

        x = modDiv(x, prime-1);

        total = (total * x) % MODULO_B;
    }

    return total;
}

function D(n: number)
{
    let bn: Map<number, number> = new Map<number, number>();
    innerD(n, bn);
}

function S(n: number)
{
    let total:bigint = 0n;
    let bn: Map<number, number> = new Map<number, number>();
    let trace:number = 0;

    for (let x = 1; x <= n; x++)
    {
        if (++trace >= 1000)
        {
            trace = 0;
            console.log(x,'/',n);
        }

        bn = getNextB(x, bn)
        total = (total + innerD(x, bn)) % MODULO_B ;
    }

    return Number(total);
}

console.log('Pre-factorizing');

for (let i = 2; i <= MAX_N; i++)
    getFactors(i);

console.log('Generating inverse modulo');
for (let p of primeHelper.primes())
{
    if (p >= MAX_N)
        break;

    getInverseModulo(p-1);
}

console.log('Running tests');

assert.equal(D(5), 5467);
assert.equal(S(5), 5736);
assert.equal(S(100), 332792866);
assert.equal(S(10), Number(141740594713218418n % MODULO_B));

console.log('Test passed');

let answer = S(20000);
console.log("Answer is", answer);