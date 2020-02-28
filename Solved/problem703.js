const assert = require('assert');
const timeLogger = require('tools/timeLogger');

require('tools/numberHelper');

const MODULO = 1001001011;

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
            nodes[r] = new Set();
        
        if (r != i)
            nodes[r].add(i);

        connections[i] = { value: r, parents: nodes[r] };
    }

    return { connections, reverse: nodes };
};

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

            // mark all as part of the cycle 

            do
            {
                const node = connections[i];
                node.inCycle = true;
                node.parents.delete(i);
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

    const $calculate = [];

    function calculate(start)
    {
        function inner(node)
        {
            let parents = reverse[node];
            if (parents === undefined)
                return { one: 1, zero: 1 };

            let one  = 1;
            let zero = 1;
    
            for(let parent of parents)
            {
                const info = inner(parent);
    
                zero = zero.modMul((info.one+info.zero) % MODULO, MODULO);
                one  = one.modMul(info.zero, MODULO); 
            }

            return { one, zero };    
        }
        
        let info = $calculate[start];

        if (!info)
        {
            info = inner(start);
            $calculate[start] = info;
        }
        
        return info;
    }

    function  goAround(cycle, zero, one)
    {
        // case start at one

        let i             = cycle;
        let canEndWithOne = one ? false : true;

        let info = calculate(i);
        zero = info.zero.modMul(zero, MODULO);
        one  = info.one.modMul(one, MODULO);
        i = connections[i].value;
        
        while(i != cycle)
        {
            info = calculate(i);

            [zero, one] = [ info.zero.modMul((zero + one) % MODULO, MODULO), info.one.modMul(zero, MODULO)]

            i = connections[i].value;
        }

        if (canEndWithOne)
            return (one + zero) % MODULO;
        else
            return zero;
    }

    const cycles = getCycles(bits);

    let total = 1;

    for(let cycle of cycles)
    {
        let ones = goAround(cycle, 0, 1);
        let zeros = goAround(cycle, 1, 0);

        total = total.modMul((zeros + ones) % MODULO, MODULO);
    }

    return total;
}

assert.equal(solve(3), 35);
assert.equal(solve(4), 2118);

const answer = timeLogger.wrap('', () => solve(20));

console.log(`Answer = ${answer}`);


