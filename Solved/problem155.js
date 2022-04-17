const assert = require('assert');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

require('@dn0rmand/project-euler-tools/src/numberHelper');

class State
{
    constructor()
    {
        this.numerator = 1;
        this.divisor   = 1;
        this.count     = 1;
    }

    simplify()
    {
        const g = this.numerator.gcd(this.divisor);
        if (g !== 1) {
            this.numerator /= g;
            this.divisor   /= g;
        }
    }

    add(other) 
    {
        const state = new State();

        state.count     = this.count + other.count; 
        state.numerator = this.numerator * other.divisor + this.divisor * other.numerator;
        state.divisor   = this.divisor * other.divisor;
        
        state.simplify();
        return state;
    }

    multiply(other)
    {
        const state = new State();

        state.count     = this.count + other.count; 
        state.divisor   = this.divisor * other.numerator + this.numerator * other.divisor;
        state.numerator = this.numerator * other.numerator;

        state.simplify();
        return state;
    }

    get key() 
    { 
        return `${this.numerator}/${this.divisor}-${this.count}`;
    }

    get value() 
    { 
        return `${this.numerator}/${this.divisor}`;
    }
}

function D(units, trace)
{
    let added   = [];

    const states  = new Map();
    const visited = new Set();

    const add = state => {
        if (state.count <= units && !states.has(state.key)) {
            states.set(state.key, state);
            visited.add(state.value);
            added.push(state);
        }
    }

    add(new State());

    const tracer = new Tracer(1, trace);

    while(added.length) 
    {
        tracer.print(_  => `${visited.size} - ${added.length}`);

        const others  = [...states.values()];
        const newOnes = added;

        newOnes.sort((a, b) => a.count - b.count);
        others.sort((a, b) => a.count - b.count);

        added = [];

        for(const s1 of newOnes) 
        {
            if (s1.count >= units) {
                break;
            }

            for(const s2 of others) 
            {
                if ((s1.count + s2.count) > units) {
                    break;
                }
                 add(s1.add(s2));
                 add(s1.multiply(s2));
            }
        }
    }

    tracer.clear();

    return visited.size; 
}

assert.strictEqual(D(1), 1);
assert.strictEqual(D(2), 3);
assert.strictEqual(D(3), 7);

console.log('Tests passed');

const answer = timeLogger.wrap('D(18)', _ => D(18, true));
console.log(`Answer is ${answer}`);
