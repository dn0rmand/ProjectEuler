function Solve(A, B, C)
{
    let delta = (B*B) - (4*A*C);

    if (delta < 0)
        return;

    delta = Math.sqrt(delta);

    if (delta <= B || Math.ceil(delta) !== Math.floor(delta))
        return;

    let x = (delta-B) / (2*A);

    if (x > 0 && Math.ceil(x) === Math.floor(x))
        return x;
}

function P3(n)
{
    return Solve(1, 1, -2*n);
}

function P4(n)
{
    let x = Math.sqrt(n);
    if (Math.ceil(x) === Math.floor(x))
        return x;
}

function P5(n)
{
    return Solve(3, -1, -2*n);
}

function P6(n)
{
    return Solve(2, -1, -n); 
}

function P7(n)
{
    return Solve(5, -3, -2*n);
}

function P8(n)
{
    return Solve(3, -2, -n);
}

function fillCache(fn)
{
    let cache = [];

    for(let x = 1000; x < 10000; x++)
    {
        let n = fn(x);
        if (n !== undefined)
            cache[x] = n;
    }

    return cache;
}

let caches = [
    fillCache(P3),
    fillCache(P4),
    fillCache(P5),
    fillCache(P6),
    fillCache(P7),
    fillCache(P8)
];

function Assert(values, fn)
{
    let n = 1;
    for (let out of values)
    {
        let x = fn(out);

        if (n !== x)
            throw "Invalid calculation";

        n++;
    }
}

Assert([1, 3, 6, 10, 15], P3);
Assert([1, 4, 9, 16, 25], P4);
Assert([1, 5, 12, 22, 35], P5);
Assert([1, 6, 15, 28, 45], P6);
Assert([1, 7, 18, 34, 55], P7);
Assert([1, 8, 21, 40, 65], P8);

console.log("Tests passed");

function FindSolution(used, values, ns)
{
    function allowed(n)
    {
        if (n === undefined)
            return false;

        for(let i = 0; i < ns.length; i++)
            if (n === ns[i])
                return false;
        return true;
    }

    if (values.length === 6)
    {
        let v1 = values[0];
        let v2 = values[5];

        v1 = (v1 - (v1 % 100)) / 100;
        v2 = v2 % 100;
        if (v1 === v2)
        {
            return values;
        }
        return undefined;
    }
    let min = 1000;
    let max = 9999;

    if (values.length > 0) 
    {
        min = (values[values.length-1] % 100) * 100;
        max = min + 99;
    }

    for (let x = min; x <= max; x++)
    {
        if ((x % 100) < 10)
            continue;

        for (let i = 0; i < caches.length; i++)
        {
            let n = caches[i][x]; 
            if (! allowed(n))
                continue;

            if (used[i] !== 1)
            {
                used[i] = 1;
                values.push(x);
                ns.push(n);
                let solution = FindSolution(used, values, ns);
                if (solution !== undefined)
                    return solution;
                ns.pop();
                values.pop();
                used[i] = 0;
            }
        }
    }
    return undefined;
}

let values = FindSolution([], [], []);
if (values !== undefined)
{
    console.log("Ordered set of six cyclic 4-digit numbers is " + values.toString())
    let sum = 0;
    for (let i = 0; i < 6; i++)
        sum += values[i];
    console.log("Sum of the numbers is " + sum);
}
else
    console.log("Didn't find a solution");
