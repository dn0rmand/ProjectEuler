const assert = require('assert');

require('tools/bigintHelper');

class State
{
    constructor()
    {
        this.memory = [];
        this.score  = 0;
        this.count  = 1n;
    }

    clone()
    {
        let s = this.create();

        s.memory = [...this.memory];
        s.score  = this.score;
        s.count  = this.count;

        return s;
    }

    get key()
    {
        let pow = 1;
        let k = this.memory.reduce((a, v) => {
            a += v*pow;
            pow *= 10;
            return a;
        }, 0);
        return this.score + (k * 1E-5);
    }

    getScore()
    {
        return BigInt(this.score) * this.count;
    }

    // Override to create a specific class

    create() { return new State();  } 

    // Override to do specific memory update when number is called ( index of number called )

    updateMemory(index) { }

    call(number)
    {
        const index = this.memory.findIndex((value) => value === number);
        if (index < 0)
        {
            this.memory.push(number);
            if (this.memory.length > 5)
                this.memory.shift();
        }
        else
        {
            this.score += 1;
            this.updateMemory(index);
        }

        return this;
    }    
}

class LarryState extends State
{
    create() { return new LarryState(); }

    updateMemory(index)
    {
        let number = this.memory.splice(index, 1)[0];
        this.memory.push(number);
    }
}

class RobinState extends State
{
    create() { return new RobinState(); }
}

function solveOne(name, firstState, steps)
{
    let states = [ firstState ];

    let length = 1;
    for(let step = 1; step <= steps; step++)
    {
        process.stdout.write(`\r${name} : ${step} - ${length}`);
        let newStates = new Map();

        for(let state of states)
        {
            for(let number = 1; number <= 10; number++)
            {
                let s = state.clone().call(number);
                let k = s.key;
                let o = newStates.get(k);
                if (o !== undefined)
                {
                    // o.score += s.score;
                    o.count += s.count;
                }
                else
                {
                    newStates.set(k, s);
                }
            }
        }

        states = newStates.values();
        length = newStates.size;
    }

    let count = 0n;
    let score = [...states].reduce((a, v) => { count += v.count; return a + v.getScore(); }, 0n);

    let result = score.divise(count, 10);

    console.log('');
    return result;
}

function solve(steps)
{
    const larry = solveOne('Larry', new LarryState(), steps);
    const robin = solveOne('Robin', new RobinState(), steps);

    return Math.abs(larry - robin).toFixed(8);
}

let answer = solve(10);
console.log('Answer is', answer);
