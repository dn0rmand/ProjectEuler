const assert = require('assert');
const Matrix = require('tools/matrix-small');

const MODULO = 1000000007;

function a(N)
{
    let az   = Math.floor(Math.pow(N-1, 1/3));
    while ((az+1)**3 < N-1) {
        az++;
    }

    const az1  = az+1;
    const az2  = az**2;
    const az3  = az**3;
    const az12 = (az+1)**2;

    const bv = (function() {
        if (N === 1) return 4;

        if (N  > az*az12)
            return 12;
        else       
            return N > az2*az1 ? 8 : 4;
    })();

    const pz = N < az2*az1 ? N - az3 : az2;
    const qz = N < az*az12 ? N - az3 - pz : az*az1;
    const rz = N < (az+1)**3 ? N - az3 - pz - qz : az12;

    const f  = j => {
        if (j & 1) {
            const low = (j-1)/2;
            const hi  = low+1;
            return hi*low + 1;
        } else {
            return 1 + (j/2)**2;
        }
    }

    const C = end => {
        let p = 0;
        for(let j = 2; j <= end; j++) {
            if (f(j) <= end) {
                p++;
            }
        }
        return p;
    };

    const c1 = C(pz);
    const c2 = C(qz);
    const c3 = C(rz);

    const cv = N > 1 ? 2 * (c1 + c2 + c3) : 2;
    const av = 6 * az2;

    return av + bv + cv;
}

function g(n)
{
    return 6*n - a(n);
}

function G(n)
{
    let total = 3 * n * (n+1);
    let minus = 0;
    for(let i = 1; i <= n; i++) {
        minus += a(i);
    }
    total -= minus;
    return total;
}

function G1(n)
{
    const p = Math.round(Math.pow(n, 1/3));
    if (p**3 !== n) {
        throw "Needs a cube";
    }

    const factors = [
        0,  0,   0,  0,
        0,  1,  -7, 21,
      -35, 35, -21,  7
    ];

    const values = [80, 1312, 8572, 35512, 111676, 291796, 667252, 1379656, 2636636, 4729760, 8054624, 13133100];

    const M = Matrix.fromRecurrence(factors);
    const I = new Matrix(M.rows, 1);

    for(let row = 0; row < I.rows; row++) {
        I.set(I.rows-1-row, 0, values[row]);
    }

    const m = M.pow(p-2, MODULO);
    const v = m.multiply(I, MODULO);

    return v.get(v.rows-1, 0);
}

console.log(G(125));

assert.strictEqual(g(10), 30);
assert.strictEqual(g(18), 66);
assert.strictEqual(G(18), 530);

for(let i = 50; i <= 50; i++) {
    const a = G(i**3) % MODULO;
    const b = G1(i**3);
    if (a !== b) {
        throw "ERROR";
    }
}
// console.log(G1(1000000));

console.log('Tests passed');
