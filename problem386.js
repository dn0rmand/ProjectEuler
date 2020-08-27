const assert = require('assert');
const getDivisors = require('tools/divisors');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

class State
{
    constructor(values)
    {
        this.values = values || [];
        // this.value  = 1;
        this.size   = values.length;
        this.key    = this.values.join(':');
    }

    add(value)
    {
        for(let v of this.values)
        {
            if (v % value === 0 || value % v === 0)
                return undefined;
        }

        return new State([...this.values, value].sort((a, b) => a-b));
    }
}

const info = [];

function N(n, trace)
{
    const divisors = [];

    for(const divisor of getDivisors(n))
    {
        if(divisor !== 1 && divisor !== n)
            divisors.push(divisor);
    }

    let states = new Map();
    let newStates = new Map();

    states.set(0, new State());

    const tracer1 = new Tracer(1, trace);
    tracer1.print(_ => divisors.length);

    const tracer = new Tracer(10000, trace);
    
    let remaining = divisors.length;
    let maxSize   = 1;
    let maxStates = 0;

    const maximum = Math.max(5, Math.floor(divisors.length/2));

    for(const divisor of divisors)
    {
        remaining--;

        newStates.clear();

        for(const state of states.values())
        {
            if (maxStates < newStates.size)
            {
                maxStates = newStates.size
                tracer.print(_ => maxStates);
            }
    
            const newState = state.add(divisor);
            
            if (newState)
            {
                if (newState.size > maxSize)
                {
                    maxSize = newState.size;
                    if (maxSize === maximum)
                        break;
                }
                if (newState.size + remaining > maxSize)
                    newStates.set(newState.key, newState);
            }

            if (state.size + remaining > maxSize)
                newStates.set(state.key, state);
        }

        if (maxSize === maximum)
            break;

        [states, newStates] = [newStates, states];
    }
    tracer.clear();
    tracer1.clear();

    info[divisors.length] = Math.max(maxSize, info[divisors.length] || 0);

    return maxSize;
}

function solve(max, trace)
{
    let total = 0;

    const tracer = new Tracer(100, trace);
    for(let n = 1; n <= max; n++)
    {
        tracer.print(_ => max - n);
        total += N(n, trace);
    }
    tracer.clear();
    return total;
}

assert.equal(N(30), 3);

let values = [];
let sum = 0;
for(let i = 1; i < 50; i++)
{
    sum += N(i);
    values.push(sum);
}
console.log(values.join(', '));

const answer = timeLogger.wrap('', _ => solve(1E4, true));
console.log(`Answer is ${answer}`);

console.log(info.join(', '));
