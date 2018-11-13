const assert = require('assert');

function *sequence()
{
    const MODULO = 2048;

    let t = 123456;

    while (true)
    {
        if ((t & 1) === 0)
        {
            t = t/2;
        }
        else
        {
            t = ((t-1)/2) ^ 926252;
        }

        let b = (t % MODULO) + 1;
        yield b;
    }
}

function getBeans()
{
    let beans = [];
    for (let b of sequence())
    {
        beans.push(b);
        if (beans.length === 1500)
            break;
    }
    return beans;
}

function solve(beans)
{
    let N   = 0;
    let N1  = 0;
    let N2  = 0;

    for (let i = 0; i < beans.length; i++)
    {
        let x = i + 1;
        N   += beans[i];
        N1  += ((x)*beans[i]);
        N2  += (x*x*beans[i]);
    }

    let a = Math.floor(N1 / N) - Math.floor(N/2);
    a = Math.floor(a);

    let H = (a * (N+1)) + ( (N*(N+1)) / 2 ) - N1;

    let N3 = BigInt(0);

    for (let i = a; i < a+N+1; i++)
    {
        let x = BigInt(i);
        N3 += (x*x);
    }
    let HH = BigInt(H); HH = (HH*HH);
    N3 -= HH;

    let steps = (N3-BigInt(N2))/BigInt(2);

    return steps;
//    a+(a+1)+...+(a+N) - H = N1;
//    a*(N+1) + (N * (N+1)/2) - H = N1;
//    H = a*(N+1) + (N*(N+1)/2) - N1
//    H = a*N + a + N^2 / 2 + N/2 - N1
//    0 < a*N + (N*(N+1))/2 - N1 < N
//    a > N1/N - (N+1)/2
//    a < N1/N - (N+1)/2 + 1
}

assert.equal(solve([2, 3]), 8);
assert.equal(solve([289, 145]), 3419100);

let answer = solve(getBeans());
console.log('Answer is', answer);
