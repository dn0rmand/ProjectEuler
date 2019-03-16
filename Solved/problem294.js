const assert = require('assert');
require('tools/numberHelper');

const MODULO = 1E9;
const LENGTH = 11**12;
const TEN    = Number(10);

function createEmptyMatrix()
{
    let m = []

    for (let sum = 0; sum < 24; sum++)
    {
        let r = [];
        for (let mod = 0; mod < 23; mod++)
            r.push(0);
        m.push(r);
    }
    return m;
}

const matrixOne = (function()
{
    let m = createEmptyMatrix();

    for (let digit = 0; digit < 10; digit++)
    {
        m[digit][digit] = 1;
    }

    return m;

})();

//
// rows = sum - columns = modulo
//

function times(A, B, delta)
{
    delta %= 23;

    let output = createEmptyMatrix();

    for (let rowA = 0; rowA <= 23; rowA++)
    for (let rowB = 0; rowB <= 23; rowB++)
    {
        let row = rowA+rowB;
        if (row > 23)
            continue;

        for (let colA = 0; colA < 23; colA++)
        for (let colB = 0; colB < 23; colB++)
        {
            let a = A[rowA][colA];
            let b = B[rowB][colB];

            let col = ((colA * delta) + colB) % 23;

            let count = output[row][col];

            let add   = a.modMul(b, MODULO);
            count = (count + add) % MODULO;

            output[row][col] = count;
        }
    }

    return output;
}

function power(n)
{
    if (n === 1)
        return matrixOne;

    let odd = (n & 1) === 1;
    if (odd)
        n--;

    n /= 2;

    let half    = power(n);
    let delta   = TEN.modPow(n, 23);
    let result  = times(half, half, delta);

    if (odd)
        result = times(result, matrixOne, 10);

    return result;
}

function S(size)
{
    let n = power(size);

    let result = n[23][0];
    return result;
}

assert.equal(S(9),  263626);
assert.equal(S(42), 878570056);

let answer = S(LENGTH);

console.log('Answer is', answer);