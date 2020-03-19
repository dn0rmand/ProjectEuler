const assert  = require('assert');
const timeLog =  require('tools/timeLogger');

const MAX    = 1E5;
const MODULO = 1000000007;

class State
{
    constructor(copyOf)
    {
        if (copyOf)
        {
            this.count      = copyOf.count;
            this.complete   = copyOf.complete;
        }
        else
        {
            this.count    = 1;
            this.complete = 0;
        }
        this.counts = [0, 0, 0];
    }

    get key()
    {
        const k = this.complete*1000 + this.counts[0]*100 + this.counts[1]*10 + this.counts[2];

        return k;
    }

    addDigit(d)
    {
        const s = new State(this); // make copy

        s.counts[d % 3] = 1;
        if (d % 3 === 0)
            s.complete = (this.complete+1) % 3;
            
        for(let i = 0; i < this.counts.length; i++)
        {
            if (! this.counts[i])
                continue;

            const c = (i + d) % 3;

            if (c === 0)
                s.complete = (s.complete + this.counts[i]) % 3;

            s.counts[c] = (s.counts[c] + this.counts[i]) % 3;
        }

        return s;
    }
}

function solve(maxLength, trace)
{
    let states    = new Map();
    let newStates = new Map();

    states.set(0, new State());

    let start  = 1;

    for(let i = 0; i < maxLength; i++)
    {
        if (trace)
        {
            if (i % 100 === 0)
                process.stdout.write(`\r${maxLength - i} : ${states.size}  `);
        }        
        newStates.clear();

        for (const state of states.values())
        {
            for(let d = start; d < 10; d++)
            {
                const newState = state.addDigit(d);
                const k        = newState.key;
                const old      = newStates.get(k);
                if (old)
                    old.count = (old.count + newState.count) % MODULO;
                else
                    newStates.set(k, newState);
            }
        }

        start = 0;
        [states, newStates] = [newStates, states];
    }

    let total = 0; 
    states.forEach((s) => {
        if (s.complete === 0)
            total = (total + s.count) % MODULO;
    });
    return total;
}

assert.equal(solve(2), 30);
assert.equal(solve(6), 290898);

console.log('Test passed');

const answer = timeLog.wrap('', () => solve(1E5));
console.log(`Answer is ${answer}`);