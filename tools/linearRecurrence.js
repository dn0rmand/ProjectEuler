const assert = require('assert');
const gcd    = require('gcd');

require('tools/numberHelper');

function solveRecurrence(data, size)
{
    function simplify(values)
    {
        assert.equal(values.length > 1, true);

        for(let i = 0; i < values.length; i++)
        {
            if (values[i] !== 0)
            {
                if (values[i] < 0)
                {
                    for(let j = i; j < values.length; j++)
                        values[j] = values[j] * -1;
                }
                break;
            }
        }
        
        let g = gcd(Math.abs(values[0]), Math.abs(values[1]));        
        if (g === 1)
            return values;

        if (g === 0)
            g = Math.max(Math.abs(values[0]), Math.abs(values[1]));

        for(let i = 2; i < values.length; i++)
        {
            let g2 = gcd(g, Math.abs(values[i]));
            if (g2 === 1)
                return values;

            if (g2 === 0)
                g = Math.max(g, Math.abs(values[i]));
            else
                g = g2;
        }

        if (g > 1)
        {
            for(let i = 0; i < values.length; i++)
            {
                values[i] /= g;
                if (values[i] == 0)
                    values[i] = 0;
            }
        }

        return values;
    }

    function buildMatrix()
    {
        const matrix = [];

        for(let offset = 0; offset < size; offset++)
        {
            const row = [];

            for(let r = 0; r <= size; r++)
            {
                const i = offset+r;
                if (i >= data.length)
                    throw "Not enough data";

                row.push(data[i]);
            }

            matrix.push(simplify(row));
        }

        return matrix;
    }

    const matrix = buildMatrix();

    // Going down

    for(let y = 1; y < size; y++)
    {
        let s = matrix[y-1];
        let k = s[y-1];

        for(let r = y; r < size; r++)
        {
            let d = matrix[r];
            let w = d[y-1];

            for(let x = 0; x <= size; x++)
            {
                let a = w * s[x];
                d[x] = (d[x] * k) - a;
            }
            matrix[r] = simplify(d);
        }
    }

    // going up

    for(let y = size-1; y > 0; y--)
    {
        let s = matrix[y];
        let k = s[y];

        for(let r = y-1; r >= 0; r--)
        {
            let d = matrix[r];
            let w = d[y];

            for(let x = 0; x <= size; x++)
            {
                let a = w * s[x];
                d[x] = (d[x] * k) - a;
            }
            matrix[r] = simplify(d);
        }
    }

    let values = [];

    for(let i = 0; i < size; i++)
    {
        if (matrix[i][i] != 1)
            return;

        values.push(matrix[i][size]);
    }

    // verify

    let lastRow = data; // [data.length-1];
    let total   = lastRow[lastRow.length-1];

    for(let i = 0; i < values.length; i++)
    {
        let a = values[values.length-1-i];
        let b = lastRow[lastRow.length-2-i];

        total -= (a*b);
    }

    if (total === 0)
        return values;
}

function findRecurrence(data)
{
    for(let size = 2; ; size++)
    {
        let values = solveRecurrence(data, size);
        if (values)
            return values;
    }
}

function calculateNext(values, factors, modulo)
{
    assert.equal(values.length >= factors.length, true);
    
    let value = 0;
    let res   = [];

    for(let i = 0; i < factors.length; i++)
    {
        let v = values[i];
        if (i > 0)
            res.push(v);

        if (modulo)
            value += v.modMul(factors[i], modulo);
        else
            value += v * factors[i];
    }

    if (modulo)
    {
        while (value < 0)
            value += modulo;

        res.push(value % modulo);
    }
    else
        res.push(value);

    return res;
}

function get(n, values, factors, modulo)
{    
    assert.equal(values.length >= factors.length, true);

    for(let y = factors.length; y < n; y++)
    {
        values = calculateNext(values, factors, modulo);
    }

    return values[factors.length-1];
}

module.exports = function(data) 
{
    const factors = findRecurrence(data);

    if (factors)
    {
        return {
            factors,
            next: (values, modulo) => calculateNext(values, factors, modulo),
            get: (n, values, modulo) => get(n, values, factors, modulo)
        }
    }
}