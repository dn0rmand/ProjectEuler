const assert = require('assert');

function *getMarbles()
{
    let r = 6563116;

    let x = (r % 1000) + 1;
    if (r > 10000000)
        yield -x;
    else
        yield x;

    while (true)
    {
        r = (r * r) % 32745673;
        x = x + (r % 1000) + 1;
        if (r > 10000000)
            yield -x;
        else
            yield x;
    }
}

function loadMarbles(count)
{
    let marbles = [];

    for(let x of getMarbles())
    {
        marbles.push(x);
        if (marbles.length === count)
            break;
    }

    return marbles;
}

function d(L, N, j)
{
    let marbles = loadMarbles(N);

    for (let i = 0; i < N; i++)
    {
        let d = marbles[i];

        d = (L - d);

        marbles[i] = d;
    }

    marbles.sort((a,b) => b-a);
    let result = marbles[j-1];
    result -= (j*20-10);
    return result;
}

assert.equal(d(5000, 3, 2), 5519);
assert.equal(d(10000, 11, 6), 11780);
assert.equal(d(100000, 101, 51), 114101);

console.log("Answer is", d(1000000000,1000001,500001));
