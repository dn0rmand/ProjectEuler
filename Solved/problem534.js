const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const BASE = 15;
const MIN_WEAK = 5;

function Q(QUEENS, weakness, trace) 
{
    const $Q = new Map();

    if (weakness === QUEENS-1) {
        return BigInt(QUEENS) ** BigInt(QUEENS);
    }

    let maxDistance = QUEENS;
    if (weakness) {
        maxDistance = QUEENS-weakness-1;
    }

    // 
    // Check if position is valid
    //
    function isAvailable(qx, queens) 
    {
        for(let i = 1; i <= queens.length; i++) {
            const x = queens[i-1];
            if (x === qx || x+i === qx || x-i === qx) {
                return false;
            }
        }

        return true;
    }

    //
    // Compute nombers of solutions
    //
    function findSolutions(y, queens) 
    {
        if (y === QUEENS) 
        {
            return 1n;
        }
        
        let key, total;

        if (weakness > MIN_WEAK) {
            key = queens.reduce((a, v) => a*BASE + v, y*BASE + queens.length);
            total = $Q.get(key);
            if (total !== undefined)
                return total;
        }

        total = 0n;
        const queens2 = maxDistance-1 < queens.length ? queens.slice(0, maxDistance-1) : queens;
        for (let x = 0; x < QUEENS; x++) 
        {
            if (isAvailable(x, queens)) 
            {
                total += findSolutions(y + 1, [x, ...queens2]);
            }
        }

        if (key) {
            $Q.set(key, total);
        }

        return total;
    }

    assert.strictEqual(QUEENS & 1, 0);

    const middle = QUEENS / 2;

    const tracer = new Tracer(1, trace);

    let total = 0n;

    for(let x = 0; x < middle; x++) {
        tracer.print(_ => middle-x);
        total += findSolutions(1, [x]);
    }

    tracer.clear();

    return total + total;
}

function S(QUEENS, trace)
{
    const tracer = new Tracer(1, trace);

    let total = 0n;

    for(let w = 0; w < QUEENS; w++) {
        tracer.print(_ => QUEENS-w);
        const value = Q(QUEENS, w, trace);
        total += value;
    }
    tracer.clear();
    return total;
}

assert.strictEqual(Q(8, 0), 92n);
assert.strictEqual(Q(10, 0), 724n);
assert.strictEqual(Q(4, 0), 2n);
assert.strictEqual(Q(4, 2), 16n);
assert.strictEqual(Q(4, 3), 256n);
assert.strictEqual(Q(8, 4), 13044n);
assert.strictEqual(S(4), 276n);
assert.strictEqual(S(12), 9414912932950n);

console.log('Tests passed');

const answer = timeLogger.wrap('S(14)', _ => S(14, true));
console.log(`Answer is ${answer}`);