const assert = require('assert');
const {Matrix} = require('ml-matrix');

const MODULO = 1000000007;
const MAX_M  = 1E12;
const MAX_N  = 50//00;
const MODULO_N = BigInt(MODULO);

if (global.gc === undefined)
    global.gc = () => {}

class DNMatrix
{
    $mmul(other)
    {
        other = this.constructor.checkMatrix(other);
        if (this.columns !== other.rows)
        {
            // eslint-disable-next-line no-console
            console.warn('Number of columns of left matrix are not equal to number of rows of right matrix.');
        }

        let m = this.rows;
        let n = this.columns;
        let p = other.columns;

        let result = new this.constructor[Symbol.species](m, p);

        let Bcolj = new Array(n);
        for (let j = 0; j < p; j++)
        {
            for (let k = 0; k < n; k++)
            {
                Bcolj[k] = other.get(k, j);
            }

            for (let i = 0; i < m; i++)
            {
                let s = 0;
                for (let k = 0; k < n; k++)
                {
                    let x = this.get(i, k);
                    let y = Bcolj[k];
                    let z = (x * y);
                    if (z > Number.MAX_SAFE_INTEGER)
                    {
                        let z2 = Number((BigInt(x) * BigInt(y)) % MODULO_N);
                        z = z2;
                    }
                    else
                        z = z % MODULO;
                    s = (s + z) % MODULO;
                }

                result.set(i, j, s);
            }
        }

        return result;
    }

    static create(k)
    {
        let matrix = Matrix.zeros(k, k);

        let i;

        for (let r = 0; r < k; r++)
        for (let c = 0; c < k; c++)
        {
            let v = (r+c)-k;
            if (v < 0)
                matrix.set(r, c, 0n);
            else
                matrix.set(r, c, 1n);
        }

        return matrix;
    }

    static createVector(k)
    {
        let vector = Matrix.empty(k, 1).fill(1n);

        return vector;
    }

    static mod(m, modulo)
    {
        global.gc();

        for (let r = 0; r < m.rows; r++)
        for (let c = 0; c < m.columns; c++)
            m.set(r, c, m.get(r, c) % modulo);
        return m;
    }

    static pow(m, pow)
    {
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
                {
                    mm = DNMatrix.mod(mm.mmulStrassen(m), MODULO_N);
                }
                pow--;
            }

            while (pow > 1 && (pow & 1) === 0)
            {
                console.log(pow);
                pow /= 2;
                m =  DNMatrix.mod(m.mmulStrassen(m), MODULO_N);
            }
        }

        if (mm !== undefined)
        {
            console.log(pow);
            m = DNMatrix.mod(m.mmulStrassen(mm), MODULO_N);
        }

        return m;
    }
}

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

function $$T(n, m)
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
                newStates[d2] = (newStates[d2] + count) //% MODULO;
        }
        // Swap arrays
        let t = states;
        states = newStates;
        newStates = t;
    }

    let total = 0;
    for (let i = 1; i < n; i++)
        total = (total + states[i]) //% MODULO;

    return total;
}

function T(n, m)
{
    let matrix = DNMatrix.create(n);
    let vector = DNMatrix.createVector(n);

    matrix = DNMatrix.pow(matrix, m);
    vector = DNMatrix.mod(matrix.mmul(vector), MODULO_N);

    let max = vector.get(n-1, 0);
    return Number(max);
}

function test()
{
    assert.equal(T(3, 4), 8);
    assert.equal(T(5, 5), 246);
    assert.equal(T(10, 100), 862820094);
    assert.equal(T(100, 10), 782136797);
    console.log("\rTests passed");
}

test();

let answer = T(MAX_N, MAX_M);
console.log('Answer is', answer);