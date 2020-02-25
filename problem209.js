const connections = (function()
{
    const map  = [];
    const mask = (2**6)-1;
    const A    = 2**5;
    const B    = 2**4;
    const C    = 2**3;

    for(let i = 0; i < 2 ** 6; i++)
    {
        const a = (i & A) === 0 ? 0 : 1;
        const b = (i & B) === 0 ? 0 : 1;
        const c = (i & C) === 0 ? 0 : 1;
        
        const r = ((i * 2) & mask) + (a ^ (b & c));

        map[i] = r;
    }
    return map;
})();

const lucas = (function()
{
    const max = 2**6;
    const map = [2, 1];

    let l0 = 2;
    let l1 = 1;

    for(let i = 2; i < max; i++)
    {
        const l = l1 + l0;
        map.push(l);

        l0 = l1;
        l1 = l;
    }
    return map;
})();

function getCycles()
{
    const processed = [];
    
    function follow(i)
    {
        const start = i;
        processed[i] = 1;

        let steps = 1;
        while (connections[i] != start)
        {
            i = connections[i];
            steps++;
            processed[i] = 1;
        }

        return steps;
    }

    const cycles = [];
    for(let i = 0; i < 2**6; i++)
    {
        if (processed[i])
            continue;
        cycles.push(follow(i));
    }
    return cycles;
}

function solve()
{
    const cycles = getCycles();

    let total  = 1;

    for(let i of cycles)
    {
        total *= lucas[i];
    }

    return total;
}

const answer = solve();
console.log(`Answer = ${answer}`);