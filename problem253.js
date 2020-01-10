const assert = require('assert');
const timeLogger = require('tools/timeLogger');

const MASKS = [];
for(let i = 1; i <= 40; i++)
    MASKS[i] = 2**(i+6);

class State
{
    constructor()
    {
        this.segments = [];
        this.max      = 0;
        this.count    = 1n;
    }

    forEach(maxPiece, callback)
    {
        let current = 1;
        for (let s of this.segments)
        {
            while (current < s.start)
                callback(current++);
            current = s.end+1;
        }
        while (current <= maxPiece)
            callback(current++);
    }

    clone()
    {
        let state2      = new State();
        state2.segments = this.segments.map(s => s);
        state2.max      = this.max;
        state2.count    = this.count;
        return state2;
    }

    merge(state)
    {
        this.count += state.count;
    }

    addPiece(piece)
    {
        let before = this.segments.findIndex((s) => s.end+1 === piece);

        if (before >= 0)
        {
            let after = before+1;
            if (after < this.segments.length && this.segments[after].start-1 === piece)
            {
                this.segments[before] = { start: this.segments[before].start, end: this.segments[after].end };
                this.segments.splice(after, 1);
            }
            else
            {
                this.segments[before] = { start: this.segments[before].start, end: piece };
            }
        }
        else
        {
            let after = this.segments.findIndex((s) => s.start-1 === piece);
            if (after >= 0)
            {
                this.segments[after] = { start: piece, end: this.segments[after].end };
            }
            else
            {
                this.segments.push({ start: piece, end: piece });
                this.segments.sort((a, b) => a.start-b.start);
            }
        }
        if (this.segments.length > this.max)
            this.max = this.segments.length;

        return this;
    }

    getKey()
    {
        let k = this.segments.map(s => s.start*100 + s.end);
        return this.max+"-"+k.join(':');
    }
}

function factorial(n)
{
    n = BigInt(n);
    let total = n;
    while (--n > 1n)
        total *= n;
    return total;
}

function solve(size, trace)
{
    let possibilities = factorial(size);

    let states = [new State()];

    for(let i = 1; i <= size; i++)
    {
        if (trace)
            process.stdout.write(`\r${i} - ${states.length}    `);

        let newStates = {};

        for (let state of states)
        {
            state.forEach(size, (piece) =>
            {
                let newState = state.clone().addPiece(piece);
                let k        = newState.getKey();

                if (newStates[k] === undefined)
                    newStates[k] = newState;
                else
                    newStates[k].merge(newState);
            });
        }

        states = Object.values(newStates);
    }

    if (trace)
        process.stdout.write(`\r                                    \r`);

    let total = 0n;
    for (let state of states)
        total += BigInt(state.max) * state.count;

    for (let i = BigInt(size); i > 1n; i--)
    {
        if (total % i === 0n)
        {
            total /= i;
            possibilities /= i;
        }
    }

    if (trace)
    {
        console.log(`\nTotal = ${total} - Possibilities = ${possibilities}`);
    }

    total = Number(total) / Number(possibilities);
    return total.toFixed(6);
}

assert.equal(solve(10), "3.400732");

let answer = timeLogger.wrap('', () => { return solve(20, true); });

console.log(`Answer is ${answer}`);