function solve(size)
{
    const SIZE = BigInt(size)*10n;

    const losing = new Set();
    const holes  = new Set();

    function makeKey(x, y)
    {
        let k = (SIZE * BigInt(x)) + BigInt(y);

        return k;
    }

    function revertKey(k)
    {
        let y = k % SIZE;
        let x = (k - y) / SIZE;

        return {x:Number(x), y:Number(y)};
    }

    function addLosing(x, y)
    {
        let k = makeKey(x, y);
        losing.add(k);
        holes.delete(k);

        for (let i = 1; i <= size; i++)
        {
            if (x+y+i > size)
                break;

            if (x+i+y+i <= size)
            {
                k = makeKey(x+i, y+i);
                holes.delete(k);
            }

            k = makeKey(x+i, y);
            holes.delete(k);

            k = makeKey(x, y+i);
            holes.delete(k);
        }

        let x1 = x+2, y1 = y+1;
        while (x1+y1 <= size)
        {
            k = makeKey(x1, y1);
            holes.delete(k);
            x1 += 2;
            y1 += 1;
        }

        let x2 = x+1, y2 = y+2;
        while (x2+y2 <= size)
        {
            k = makeKey(x2, y2);
            holes.delete(k);
            x2 += 1;
            y2 += 2;
        }
    }

    for (let x = 0; x <= size; x++)
    {
        for (let y = x; y <= size; y++)
        {
            if (x+y <= size)
                holes.add(makeKey(x, y));
            else
                break;
        }
    }

    addLosing(0, 0);
    while (holes.size > 0)
    {
        let {x, y} = revertKey(holes.keys().next().value);
        x = +x;
        y = +y;

        addLosing(x, y);
        addLosing(y, x);
    }

    // if (size < 50)
    // {
    //     for (let x = 0; x <= size; x++)
    //     {
    //         let s = "";
    //         for (let y = 0; y <= size; y++)
    //         {
    //             let k = makeKey(x, y);
    //             if (losing.has(k))
    //                 s += 'X';
    //             else
    //                 s += '.';
    //         }
    //         console.log(s);
    //     }
    // }

    let total = 0;

    for (let k of losing.keys())
    {
        let {x, y} = revertKey(k);
        x = +x;
        y = +y;
        if (x+y > size)
            throw "Error 1"
        if (x > y)
            continue;
        total += (x+y);
    }
    return total;
}

let seq = '';
for (let i = 1; i < 50; i++)
    seq += solve(i)+', ';
console.log(seq);

console.log(solve(10));
console.log(solve(20));
console.log(solve(100));
console.log(solve(1000));
console.log(solve(10000));

// solve(1E7);