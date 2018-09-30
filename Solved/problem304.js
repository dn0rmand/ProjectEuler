// Primonacci
// ----------
// Problem 304
// -----------
// For any positive integer n the function next_prime(n) returns the smallest prime p
// such that p>n.

// The sequence a(n) is defined by:
// a(1)=next_prime(1E14) and a(n)=next_prime(a(n-1)) for n>1.

// The fibonacci sequence f(n) is defined by: f(0)=0, f(1)=1 and f(n)=f(n-1)+f(n-2) for n>1.

// The sequence b(n) is defined as f(a(n)).

// Find ∑b(n) for 1≤n≤100 000. Give your answer mod 1234567891011.

const MIN_PRIME= 1E14;

const {Matrix} = require('ml-matrix');
const bigInt   = require('big-integer');
//const A        = require('../data/304-primes.js');
const offsetSieve = require('tools/sieve-offset');

const MODULO   = 1234567891011;

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
                    let v = (this.get(i, k) * Bcolj[k]);
                    if (v > Number.MAX_SAFE_INTEGER)
                        v = bigInt(this.get(i, k)).times(Bcolj[k]).mod(MODULO).valueOf();
                    else
                        v = (v % MODULO);

                    s = (s + v) % MODULO;
                }

                result.set(i, j, s);
            }
        }

        return result;
    }

    static create()
    {
        let matrix = this.zeros(2, 2);

        matrix.set(0, 0, 1);
        matrix.set(0, 1, 1);
        matrix.set(1, 0, 1);
        matrix.set(1, 1, 0);

        return matrix;
    }

    pow(pow)
    {
        let m  = this;
        let mm = undefined;

        if (pow === 1)
            return m;

        while (pow > 1)
        {
            if ((pow & 1) !== 0)
            {
                if (mm === undefined)
                    mm = m;
                else
                    mm = mm.mmul(m);

                pow--;
            }

            while (pow > 1 && (pow & 1) === 0)
            {
                pow /= 2;
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

const A = [];

function buildA()
{
    for (let p of offsetSieve(1E14, 1E14+3235444)) // Hopefully range is big enough
    {
        A.push(p);
        if (A.length === 100000)
            break;
    }
    if (A.length < 100000)
        console.log('Not enought primes');
}

function solve()
{
    let n      = MIN_PRIME;
    let matrix = DNMatrix.create();

    matrix = matrix.pow(n);

    F0 = matrix.get(1, 1); // Fn-1
    F1 = matrix.get(1, 0); // Fn

    let index = 0;
    let total = 0;
    while (index < A.length)
    {
        let F = (F0+F1) % MODULO;

        F0 = F1;
        F1 = F;
        n++;

        if (n === A[index])
        {
            // console.log(n, '->', F);
            total = (total + F) % MODULO;
            index++;
        }
    }
    return total;
}

buildA();
let answer = solve();

console.log("Calculated Answer is", answer);
console.log('Right answer is 283988410192')
