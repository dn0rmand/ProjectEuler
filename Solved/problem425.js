// Prime connection
// ----------------
// Problem 425
// -----------
// Two positive numbers A and B are said to be connected (denoted by "A ↔ B") if one of these conditions holds:
// (1) A and B have the same length and differ in exactly one digit; for example, 123 <-> 173.
// (2) Adding one digit to the left of A (or B) makes B (or A); for example, 23 <-> 223 and 123 <-> 23.

// We call a prime P a 2's relative if there exists a chain of connected primes between 2 and P and no prime in
// the chain exceeds P.

// For example, 127 is a 2's relative. One of the possible chains is shown below:
// 2 <-> 3 <-> 13 <-> 113 <-> 103 <-> 107 <-> 127
// However, 11 and 103 are not 2's relatives.

// Let F(N) be the sum of the primes ≤ N which are not 2's relatives.
// We can verify that F(1E3) = 431 and F(1E4) = 78728.

// Find F(1E7).

const assert      = require('assert');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');
const getDigits   = require('@dn0rmand/project-euler-tools/src/digits');

const MAX = 1E7;

primeHelper.initialize(MAX);

const allPrimes = primeHelper.allPrimes();

const processed = new Uint8Array(MAX);
const visited   = new Uint32Array(MAX);

function initialize()
{
    processed.fill(0);
    visited.fill(MAX);
}

function shouldVisit(value, max)
{
    if (value === 2)
        return false;

    if (!primeHelper.isPrime(value))
        return false;

    if (processed[value])
        return false;

    let oldMax = visited[value];
    if (oldMax <= max)
        return false;
    visited[value] = max;
    return true;
}

class Entry
{
    constructor(value, max, parent)
    {
        if (value > max)
            max = value;

        this.max   = max;
        this.value = value;
        this.parent= parent;
    }

    create(prime)
    {
        let e = new Entry(prime, this.max, this.value);
        if (e.isRelative())
            processed[prime] = 1;
        return e;
    }

    isRelative()
    {
        return this.value == this.max;
    }

    *findNext(maxValue)
    {
        function fromDigits(digits, start)
        {
            let v = 0;
            if (start === undefined)
                start = 0;

            for (let i = start; i < digits.length; i++)
            {
                let d = digits[i];
                v = v*10 + d;
            }
            return v;
        }

        let digits = getDigits(this.value);
        let length = digits.length;

        // remove digit

        if (digits.length > 1 && digits[1] !== 0)
        {
            let p = fromDigits(digits, 1);
            if (shouldVisit(p, this.max))
                yield this.create(p);
        }

        // same length

        let unit = 1;

        for (let i = 0; i < length; i++)
        {
            let di = digits[length-1-i];
            let mask = this.value - (di * unit);
            for (let d = 0; d < 10; d++)
            {
                if (d === di || (i === 0 && d === 0) || (i === length-1 && d === 0))
                    continue;

                if (i === 0)
                {
                    if ((d & 1) === 0 || (length > 1 && d === 5))
                        continue
                }

                let p = mask + (d * unit);
                // digits[i] = d;
                // let p = fromDigits(digits);
                if (p > maxValue)
                    break;

                if (shouldVisit(p, this.max))
                    yield this.create(p);
            }
            // digits[i] = di;
            unit *= 10;
        }

        // add digit

        let next  = 10 ** length;

        for (let d = 1; d < 10; d++)
        {
            let p = this.value + (d * next);
            if (p > MAX || p > maxValue)
                break;

            if (shouldVisit(p, this.max))
                yield this.create(p);
        }
    }
}

function step(nodes, max)
{
    let newNodes = [];
    let sum      = 0;

    for (let node of nodes)
    {
        for (let n of node.findNext(max))
        {
            if (n.isRelative())
                sum += n.value;
            newNodes.push(n);
        }
    }

    return { sum: sum, nodes: newNodes };
}

function F(max)
{
    initialize();

    let nodes = [ new Entry(2, 2) ];

    let total = -2;

    for (let p of allPrimes)
    {
        if (p > max)
            break;
        total += p;
    }

    while (nodes.length > 0)
    {
        let result = step(nodes, max);
        total -= result.sum;
        nodes  = result.nodes;
    }

    return total;
}

assert.equal(F(1E3), 431);
assert.equal(F(1E4), 78728);

let answer = F(1E7);
console.log('Answer is', answer);
