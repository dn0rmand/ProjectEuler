const bigInt = require('big-integer');
const assert = require('assert');

const MODULO = 1000000007

function getPath(a, b)
{
    function *inner(x, y, value)
    {
        if (y > b || x > a)
            return;

        if (x === a && y === b)
        {
            yield value;
            return;
        }
        yield *inner(x+1, y, value+y);
        yield *inner(x, y+1, value);
    }

    for (let area of inner(0, 0, 0))
    {
        console.log(area);
    }
    console.log('done');
}

// getPath(2,2);

function C(a, b, k)
{
    // let MAX = a*b;
    //
    // function *getAreas(x, height, value)
    // {
    //     if (x === a)
    //     {
    //         for (let y = height; y <= b; y++)
    //         {
    //             let v = value+y;
    //             if (v === 0)
    //             {
    //                 yield v;
    //                 yield MAX;
    //                 continue;
    //             }
    //             if (v >= MAX)
    //                 break;
    //             yield v;
    //         }
    //     }
    //     else
    //     {
    //         for (let h = height; h <= b; h++)
    //         {
    //             yield *getAreas(x+1, h, value+h);
    //         }
    //     }
    // }

    let memoize = [];

    function get(x, y)
    {
        let m = memoize[x];
        if (m !== undefined)
            m = m[y];
        return m;
    }

    function set(x, y, value)
    {
        let mx = memoize[x];
        if (mx === undefined)
        {
            mx = [];
            memoize[x] = mx;
        }
        mx[y] = value;
    }

    function getAreas(x, y)
    {
        if (y > b || x > a)
            return;

        if (x === a)
        {
            return [y];
        }

        if (y === b)
        {
            let value = 0;
            while (++x < a)
            {
                value += b;
            }
            return [value];
        }

        let res = get(x, y);
        if (res !== undefined)
            return res;

        res = [];

        let areas = getAreas(x+1, y);

        for (let area of areas)
        {
            res.push(area+y);
        }

        areas = getAreas(x, y+1);

        for (let area of areas)
        {
            res.push(area);
        }

        set(x, y, res);
        return res;
    }

    let total = 0
    let K     = bigInt(k);

    let areas = getAreas(0, 0);

    for (let area of areas)
    {
        let add = K.modPow(area, MODULO).valueOf();
        total = (total + add) % MODULO;
    }

    console.log('C(',a,',',b,',',k,') =', total);

    return total;
}

assert.equal(C( 2,  2, 1), 6);
assert.equal(C( 2,  2, 2), 35);
assert.equal(C(10, 10, 1), 184756);
assert.equal(C(15, 10, 3), 880419838);

// C(3,3,1);
// C(4,4,1);
// C(5,5,1);
// C(6,6,1);
// C(10,10,1);

for (let k = 1; k <= 7; k++)
{
    let x = 10**k + k;
    C(x, x, k);
}

console.log('Done');