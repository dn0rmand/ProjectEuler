function getConnections(bits)
{
    const mask =(2 ** bits)-1;
    const A    = 2 ** (bits-1);
    const B    = 2 ** (bits-2);
    const C    = 2 ** (bits-3);

    const nodes       = [];
    const connections = [];

    for(let i = 0; i < 2 ** bits; i++)
    {
        const a = (i & A) === 0 ? 0 : 1;
        const b = (i & B) === 0 ? 0 : 1;
        const c = (i & C) === 0 ? 0 : 1;
        
        const r = ((i * 2) & mask) + (a & (b ^ c));

        if (nodes[r] === undefined)
            nodes[r] = new Set([i]);
        else
            nodes[r].add(i);

        connections[i] = { value: r, parents: nodes[r] };
    }

    return { connections, reverse: nodes };
};

function getLucas(bits)
{
    const max = 2 ** bits;
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
}

function solve(bits)
{
    const {connections, reverse} = getConnections(bits);

    function getCycles(bits)
    {
        const processed = [];
        
        function findCycle(i)
        {
            const visited = [];

            while (! visited[i])
            {
                processed[i] = 1;
                visited[i] = 1;
                const node = connections[i];
                if (node.inCycle)
                    return;
                i = node.value;
            }

            const start = i; // i is start point ( any point on loop is good enough )

            // mark all as part of the
            do
            {
                const node = connections[i];
                node.inCycle = true;
                i = node.value;
            }
            while (i != start);

            return start;
        }

        const cycles = [];
        for(let i = 0; i < 2 ** bits; i++)
        {
            if (processed[i])
                continue;
            const cycle = findCycle(i);
            if (cycle !== undefined) 
                cycles.push(cycle);
        }
        return cycles;
    }

    function calculate(cycle, current)
    {
        let parents = reverse[cycle];
        if (parents === undefined)
            return 1;

        let total = 1;

        for(let n of parents)
        {
            if (connections[n].inCycle) // ignore the parent part of the cycle
                continue;

            if (current === 0)
            {
                total *= (calculate(n, 0) + calculate(n, 1))
            }
            else
            {
                total *= calculate(n, 0);
            }
        }
        return total;
    }

    const cycles = getCycles(bits);

    let total = 1;

    for(let cycle of cycles)
    {
        let i, current;

        // case start at one
        current = 1;
        i = cycle;

        let subTotal1 = 0;
        do
        {
            subTotal1 += calculate(i, current);
            current = 1 ^ current;
            i = connections[i].value;
        }
        while (i != cycle);

        // case start at zero
        current = 0;
        i = cycle;

        let subTotal2 = 0;
        // do
        // {
        //     subTotal2 += calculate(i, current, i);
        //     current = 1 ^ current;
        //     i = connections[i].value;
        // }
        // while (i != cycle);

        console.log(subTotal1, subTotal2);

        total *= Math.max(subTotal1, subTotal2);
    }

    return total;
}

const answer = solve(4);
console.log(`Answer = ${answer}`);