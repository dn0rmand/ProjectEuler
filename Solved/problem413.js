const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');
const BigMap = require('tools/BigMap');

class State
{
    constructor()
    {
        this.remainders     = [];
        this.remainderCount = [];
        this.hasDivisor     = false;
        this.count          = 1n;
    }

    static create()
    {
        return new State();
    }

    get key()
    {
        if (this.hasDivisor)
        {
            // don't need the count
            return -this.remainders.reduce((a, v) => a*40n + BigInt(v), 0n);
        }
        else
        {
            return this.remainders.reduce((a, v) => a*40n + BigInt(v) + (this.remainderCount[v] > 1 ? 20n : 0n), 0n);
        }
    }

    addDigit(digit, modulo)
    {
        let d = digit % modulo;
        let hasDivisor = d === 0;

        if (hasDivisor && this.hasDivisor)
            return;  // multiple divisor

        let clone = State.create();

        clone.count             = this.count;
        clone.hasDivisor        = hasDivisor || this.hasDivisor;
        clone.remainders        = [d];
        clone.remainderCount[d] = 1;

        for(const r of this.remainders)
        {
            const r2    = (r*10 + d) % modulo;
            const count = Math.min(2, this.remainderCount[r] + (clone.remainderCount[r2] || 0));

            if (r2 === 0)
            {
                if (clone.hasDivisor || count > 1)
                    return;

                clone.hasDivisor = true;
            }
            
            clone.remainderCount[r2] = count;
            if (! clone.remainders.includes(r2))
                clone.remainders.push(r2);
        }

        clone.remainders.sort((a, b) => a-b);
        return clone;
    }
}

function countOneChild(size, trace)
{
    let states    = new BigMap();
    let newStates = new BigMap();

    states.set(0, State.create());

    const modulo = size;

    let total = 0n;

    const tracer = new Tracer(1, trace);

    for(let i = 0; i < size; i++)
    {
        tracer.print(_ => `${size-i}`);

        const last = (i+1 === size);
        newStates.clear();

        const innerTracer = new Tracer(10000, trace);
        let idx = states.size;
        for(const state of states.values())
        {
            idx--;
            innerTracer.print(_ => idx);

            for(let digit = i ? 0 : 1; digit < 10; digit++)
            {
                let newState = state.addDigit(digit, modulo);
                if (! newState)
                    continue;

                if (last)
                {
                    if (newState.hasDivisor)
                        total += newState.count;
                }
                else
                {
                    let k = newState.key;
                    let o = newStates.get(k);
                    if (o)
                    {
                        o.count += newState.count;
                    }
                    else
                    {
                        newStates.set(k , newState);
                    }
                }
            }
        }
        innerTracer.clear();

        [states, newStates] = [newStates, states];
    }
    tracer.clear();

    return total;
}

function solve(size, trace)
{
    let total = 0n;
    const tracer = new Tracer(1, trace);
    for(let s = 1; s <= size; s++)
    {
        tracer.print(_ => s);
        total += countOneChild(s, trace);
    }
    tracer.clear();
    return total;
}

assert.equal(countOneChild(1), 9);
assert.equal(countOneChild(2), 20);
assert.equal(countOneChild(3), 360);

assert.equal(solve(1), 9);
assert.equal(solve(3), 389);
assert.equal(solve(7), 277674);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(19, true));

console.log(`Answer is ${answer}`);