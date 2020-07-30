const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');
const BigMap = require('tools/BigMap');

class State
{
    constructor(size)
    {
        this.remainders = size ? new Uint8Array(size).fill(0) : undefined;
        this.count      = 1n;
        this.hasDivisor = false;
    }

    get key()
    {
        const k = this.remainders.reduce((a, v) => a*10n + BigInt(v), 0n);
        return k * (this.hasDivisor ? -1n : 1n);
    }

    addDigit(digit, size)
    {
        let d = digit % size;

        if (d === 0 && this.hasDivisor)
            return;  // multiple divisor

        let newRemainders = new Uint8Array(size).fill(0);

        newRemainders[d] = 1;

        for(let modulo = 0; modulo < size; modulo++)
        {
            const r = this.remainders[modulo];
            if (! r)
                continue;
            
            const r2 = (modulo * 10 + d) % size;

            newRemainders[r2] = Math.max(2, r + newRemainders[r2]);
        }

        if (newRemainders[0] > 1)
            return; // invalid

        let clone = new State();

        clone.remainders = newRemainders;
        clone.hasDivisor = this.hasDivisor || (newRemainders[0] !== 0);
        clone.count      = this.count;

        return clone;
    }
}

function countOneChild(size, trace)
{
    let states    = new BigMap();
    let newStates = new BigMap();

    states.set(0, new State(size));

    const modulo = size;

    let total = 0n;

    const tracer = new Tracer(1, trace);

    for(let i = 0; i < size; i++)
    {
        tracer.print(_ => `${size-i}`);

        const last = (i+1 === size);
        newStates.clear();

        const innerTracer = new Tracer(10000, trace);
        let idx = 0;
        for(const state of states.values())
        {
            idx++;
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
            innerTracer.print(_ => `${states.size-idx} - ${newStates.size}`);
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

assert.equal(countOneChild(2), 20);

assert.equal(solve(1), 9);
assert.equal(solve(3), 389);
assert.equal(solve(7), 277674);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(19, true));

console.log(`Answer is ${answer}`);