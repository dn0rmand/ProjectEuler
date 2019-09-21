// Sum of Squares
// --------------
// Problem 273
// Consider equations of the form: a2 + b2 = N, 0 ≤ a ≤ b, a, b and N integer.
//
// For N=65 there are two solutions:
//
// a=1, b=8 and a=4, b=7.
//
// We call S(N) the sum of the values of a of all solutions of a2 + b2 = N, 0 ≤ a ≤ b, a, b and N integer.
//
// Thus S(65) = 1 + 4 = 5.
//
// Find ∑ S(N), for all squarefree N only divisible by primes of the form 4k+1 with 4k+1 < 150.

const assert = require('assert');
const primeHelper = require('tools/primeHelper')(150);
const timerLog = require('tools/timeLogger');

class Complex
{
    constructor(a, b)
    {
        this.a = Number(a);
        this.b = Number(b);
    }

    mult1(other) {
        let a = (this.a * other.a) - (this.b * other.b);
        let b = (this.a * other.b) + (this.b * other.a);

        return new Complex(a, b);
    }

    mult2(other) {
        let a = (this.a * other.a) + (this.b * other.b);
        let b = (this.b * other.a) - (this.a * other.b);

        return new Complex(a, b);
    }

    get value() {
        let a = Math.abs(this.a);
        let b = Math.abs(this.b);
        return Math.min(a, b);
    }
}

function bruteForce(n)
{
    let result = undefined;
    for (let a = 0; ; a++)
    {
        let A = a*a;
        let B = n-A;
        if (B < A) break;
        let b = Math.round(Math.sqrt(B));
        if (b*b === B)
        {
            if (result !== undefined)
                throw "ERROR";
            result = new Complex(a, b);
        }
    }
    return result;
}

const allPrimes = timerLog.wrap('Loading primes', () => {
    var primes = primeHelper.allPrimes().reduce((a, p) => {
        if ((p % 4)===1)
        {
            a.push(bruteForce(p));
        }
        return a;
    }, []);
    return primes;
});

function generateNumbers(callback)
{
    let usedPrimes = [];

    function inner(index)
    {
        if (index > 0)
            callback(usedPrimes);

        for (let i = index; i < allPrimes.length; i++)
        {
            usedPrimes.push(allPrimes[i]);
            inner(i+1);
            usedPrimes.pop();
        }
    }

    inner(0);
}

function Sum(primes)
{
    let total = 0;
    let extra = 0n;

    function inner(current, index)
    {
        if (index >= primes.length)
        {
            let a = current.value;
            let t = total + a;
            if (t > Number.MAX_SAFE_INTEGER)
            {
                extra+= BigInt(total) + BigInt(a);
                total = 0;
            }
            else
                total = t;
            return;
        }
        let pa = primes[index];
        let c1 = current.mult1(pa);
        let c2 = current.mult2(pa);
        inner(c1, index+1);
        inner(c2, index+1);
    }

    inner(primes[0], 1);

    return extra + BigInt(total);
}

function S(n)
{
    var primes = [];
    primeHelper.factorize(n, (p, f) => {
        if ((p % 4) !== 1 || f !== 1)
            throw "ERROR";

        primes.push(bruteForce(p));
    })
    return Sum(primes);
}

function solve()
{
    let total = 0n;
    generateNumbers((primes) => {
        total += Sum(primes);
    });
    return total;
}

assert.equal(S(65), 5);

let answer = timerLog.wrap('', () => {
    return solve();
});

console.log(`Answer is ${answer}`);
