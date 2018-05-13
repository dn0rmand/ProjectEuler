// A lagged Fibonacci sequence
// ---------------------------
// Problem 258 
// -----------
// A sequence is defined as:
//   - gk = 1, for 0 ≤ k ≤ 1999
//   - gk = gk-2000 + gk-1999, for k ≥ 2000.
//
// Find gk mod 20092010 for k = 10^18.

'use strict';

const assert = require('assert');
const {Matrix} = require('ml-matrix');
const bigInt = require('big-integer');
const prettyHrtime = require('pretty-hrtime');

const LAG     = 2000; // 00;
const MODULO  = 20092010;
const BIG_MODULO = 20092010 * 1000;

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
                    s = (s + (this.get(i, k) * Bcolj[k])) % 20092010;
                }

                result.set(i, j, s);
            }
        }

        return result;
    }

    static create()
    {
        let matrix = this.zeros(LAG, LAG);

        let i;

        for (let r = 1; r < LAG; r++)
        {
            matrix.set(r, r-1, 1);
        }

        matrix.set(0,LAG-1,1);
        matrix.set(0,LAG-2,1);
        return matrix;
    }

    static createVector()
    {
        let vector = this.zeros(LAG, 1);

        for (let r = 0; r < LAG; r++)
        {
            vector.set(r, 0, G(r));
        }

        return vector;
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
                console.log(pow);
                if (mm === undefined)
                    mm = m;
                else
                    mm = mm.mmul(m);

                pow--;
            }

            while (pow > 1 && (pow & 1) === 0)
            {
                console.log(pow);
                pow /= 2;
                m =  m.mmul(m);
            }
        }

        if (mm !== undefined)
        {
            console.log(pow);
            m = m.mmul(mm);
        }
        
        return m;
    }
}

let memoize = new Map();

function G(n)
{
    if (n < LAG)
        return 1;
    let result = memoize.get(n);
    if (result !== undefined)
    {
        return result;
    }
    else
    {
        result = (G(n-LAG) + G(n-LAG+1)) % MODULO; 
        memoize.set(n, result);
        return result;
    }
}

function *GENERATE()
{
    let cache = [];
    let idx   = 0;

    for(let i = 0; i < LAG; i++)
    {
        cache.push(1);
        yield 1;
    }

    while (1)
    {
        let v = (cache[idx] + cache[(idx+1) % LAG]) % MODULO;

        yield v;

        cache[idx] = v;
        idx = (idx + 1) % LAG;
    }
}

let matrix = DNMatrix.create();
let vector = DNMatrix.createVector();

let T = Math.pow(10, /*5*/18);

matrix = matrix.pow(T);
vector = matrix.mmul(vector);

let target = vector.get(LAG-1, 0);

if (T <= 100000)
{
    let x = G(T);
    assert.equal(target, x);
    console.log('Done');
}
else
    console.log('G(' + T + ') = ' + target + " - Should be 12747994");
