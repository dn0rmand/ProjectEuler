const assert = require('assert');
const timeLogger = require('tools/timeLogger');

const MAX = 200000;

const $memoize_C = [];
const $costs = [];
const $treeCost = [];

const generateEmptyTree = offset =>
{
    let totalEntries = ((offset-1)/2 - 1);
    
    const addLayer = bottoms =>
    {
        const newBottoms = [];
        for(let i = 0; totalEntries > 0 && i < bottoms.length; i++)
        {
            const node = bottoms[i];

            const left = { value: 0 };

            node.left = left;
            newBottoms.push(left);

            if (--totalEntries > 0)
            {
                const right = { value: 0 };
            
                node.right = right;
                newBottoms.push(right);
                totalEntries--;
            }
        }

        return newBottoms;
    }

    let tree    = { value: 0 };
    let bottoms = [tree];

    while (totalEntries > 0)
    {
        bottoms = addLayer(bottoms);
    }

    return tree;
}

const createTree = offset =>
{
    const tree = generateEmptyTree(offset);
    let nextValue = 0;

    const getNextValue = _ =>
    {
        nextValue += 2;
        return nextValue;
    }

    const fill = node =>
    {
        if (node.left)
            fill(node.left);
        node.value = getNextValue();
        if (node.right)
            fill(node.right);
    }

    fill(tree);

    return tree;
}

const getCost = (node, cost, depth) => 
{
    if (node === undefined)
        return { cost, depth };

    let left = getCost(node.left, cost + node.value, depth+1);
    let right= getCost(node.right,cost + node.value, depth+1);

    if (right.depth >= left.depth)
        return right;
    else
        return left;
};

const calculateCost = offset =>
{
    if ($treeCost[offset])
        return $treeCost[offset];

    const tree = createTree(offset);
    const cost = getCost(tree, 0, 0);

    $treeCost[offset] = cost;

    return cost;
}

const fastC = (max, offset) =>
{
    const getRightCost = offset =>
    {
        const value = max - offset;
        const { cost, depth } = calculateCost(offset);

        return cost + value*depth;
    }

    let maxOffset = 2;
    while (maxOffset-1 <= offset)
        maxOffset *= 2;
        
    let start   = max - offset;
    let result  = start + Math.max($costs[start-1], getRightCost(offset));
    let best    = offset;

    offset += 8;
    let minStart = Math.floor(max / 2);

    while (offset < maxOffset)
    {
        start = max - offset;
        if (start < minStart)
            break;

        if (start < 1)
            break;

        const v = start + Math.max($costs[start-1], getRightCost(offset));

        if (v < result)
        {
            result = v;
            best   = offset;
        }
        else if (v === result)
        {
            best = offset;
        }

        offset += 8;
    }

    return { value: result, offset: best }
}

const C = (maxValue, offset) =>
{
    const odds = (maxValue & 1) === 0 ? 1 : 0;

    const inner  = (min, max) =>
    {
        if (min >= max)
            return { value:0, guesses: [0] };

        if (min+1 === max)
            return { value: min, guesses: [min] };

        if ($memoize_C[min] === undefined)
            $memoize_C[min] = [];
        if ($memoize_C[min][max] !== undefined)
            return $memoize_C[min][max];

        let result = { value: Number.MAX_SAFE_INTEGER, guesses: [] };
        let start  = Math.floor((min+max)/2);

        start = (start - (start & 1)) + odds;

        for (let guess = start; guess <= max; guess += 2)
        {
            const pass2 = inner(min, guess-1);
            const pass1 = inner(guess+1, max);

            const pass  = (pass1.value < pass2.value ? pass2 : pass1);

            if (guess + pass.value < result.value)
            {
                result = { value: pass.value + guess, guesses : [guess] };
            }
            else if (guess + pass.value === result.value)
            {
                result.guesses.push(guess);
            }
        }

        $memoize_C[min][max] = result;

        return result;
    }

    let answer = inner(1, maxValue);

    offset = answer.guesses.reduce((a, v) => Math.max(maxValue - v, a), 0);

    return { value: answer.value, offset};
}

function solve(max)
{
    let total       = 0;
    let lastOffset  = 0;

    for(let i = 1; i <= max; i++)
    {
        const f = i < 100 ? C : fastC;

        const { value, offset } = f(i, lastOffset);

        total += value;
        lastOffset = offset;
        $costs[i] = value;
    }

    return total;
}


assert.costs = function()
{
    const knownCost = offset =>
    {
        switch (offset)
        {
            case  15: return { depth: 3, cost: 34 };
            case  23: return { depth: 4, cost: 50 };
            case  31: return { depth: 4, cost: 98 };
            case  39: return { depth: 5, cost: 74 };
            case  47: return { depth: 5, cost: 130 };
            case  55: return { depth: 5, cost: 210 };
            case  63: return { depth: 5, cost: 258 };
            case  71: return { depth: 6, cost: 114 };
            case  79: return { depth: 6, cost: 178 };
            case  87: return { depth: 6, cost: 266 };
            case  95: return { depth: 6, cost: 322 };
            case 103: return { depth: 6, cost: 458 };
            case 111: return { depth: 6, cost: 514 };
            case 119: return { depth: 6, cost: 594 };
            case 127: return { depth: 6, cost: 642 };
            case 135: return { depth: 7, cost: 186 };

            default: return undefined;
        }
    }

    for(let offset = 15; offset <= 135; offset += 8)
    {
        const ref = knownCost(offset);
        if (ref === undefined)
            throw 'No reference to compare to';

        const value = calculateCost(offset);

        if (value.cost !== ref.cost || value.depth !== ref.depth)
        {
            console.log(`Invalid calculation for offset ${offset} - {cost: ${value.cost}, depth: ${value.depth}} instead of {cost: ${ref.cost}, depth: ${ref.depth}}`)
        }
    }

    return;
}

assert.costs();
assert.equal(C(1).value, 0);
assert.equal(C(2).value, 1);
assert.equal(C(8).value, 12);
assert.equal(C(100).value, 400);
assert.equal(solve(100), 17575);
assert.equal(timeLogger.wrap('', _ => solve(900)), 2480183);
assert.equal(timeLogger.wrap('', _ => solve(2000)), 14210783);

console.log("Tests passed");

const answer = timeLogger.wrap('', _ => solve(MAX));

console.log(`Answer is ${answer}`);
