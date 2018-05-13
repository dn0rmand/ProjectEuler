// A lagged Fibonacci sequence
// ---------------------------
// Problem 258 
// -----------
// A sequence is defined as:
//   - gk = 1, for 0 ≤ k ≤ 1999
//   - gk = gk-2000 + gk-1999, for k ≥ 2000.
//
// Find gk mod 20092010 for k = 10^18.

const assert = require('assert');
const {Matrix} = require('ml-matrix');
const bigInt = require('big-integer');
const prettyHrtime = require('pretty-hrtime');

const LAG     = 2000; // 00;
const MODULO  = 20092010;
const BIG_MODULO = 20092010 * 1000;

function G(n)
{
    if (n < LAG)
        return 1;
    return G(n-LAG) + G(n-LAG+1); 
}

function makeMatrix()
{
    let matrix = Matrix.zeros(LAG, LAG);

    let i;

    for (let r = 1; r < LAG; r++)
    {
        matrix.set(r, r-1, 1);
    }

    matrix.set(0,LAG-1,1);
    matrix.set(0,LAG-2,1);
    return matrix;
}

function makeVector()
{
    let vector = Matrix.zeros(LAG, 1);

    for (let r = 0; r < LAG; r++)
    {
        vector.set(r, 0, G(r));
    }

    return vector;
}

function multiply(m1, m2)
{
    // let rows    = m1.rows;
    // let columns = m1.columns;

    // let result = new Matrix(rows, columns);
    // let cache  = new Array(columns);

    // for (let col = 0; col < columns; col++) 
    // {
    //     for (let col2 = 0; col2 < columns; col2++) 
    //         cache[col2] = m2.get(col2, col);

    //     for (let row = 0; row < rows; row++) 
    //     {
    //         let s = 0;
    //         for (let col2 = 0; col2 < columns; col2++)
    //             s += (m1.get(row, col2) * cache[col2]) % BIG_MODULO;

    //         result.set(row, col, s);
    //     }
    // }

    let result = m1.mmul(m2);
    
    return result;
}

function matrixPower(m, pow)
{
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
                mm = multiply(mm, m);

            pow--;
        }

        while (pow > 1 && (pow & 1) === 0)
        {
            console.log(pow);
            pow /= 2;
            m =  multiply(m, m);
        }
    }

    if (mm !== undefined)
        m = multiply(mm, m);

    return m;
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
        let v = (cache[idx] + cache[(idx+1) % LAG]);// % MODULO;

        yield v;

        cache[idx] = v;
        idx = (idx + 1) % LAG;
    }
}

console.log("Make sure to modify ml-matrix mmul to include the modulo");

let matrix = makeMatrix();
// printM(matrix);

let v = makeVector();
let T = Math.pow(10, 18);

rows = matrixPower(matrix, T);
rows = rows.mmul(v).mod(MODULO);

let target = rows.get(LAG-1, 0);
//let x = G(T);

//assert.equal(target, x);

console.log('G(' + T + ') = ' + target);
console.log("FYI, 3394748 is incorrect.")
console.log('Done');
