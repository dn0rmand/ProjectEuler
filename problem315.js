'use strict';

const assert = require('assert');
const primes = require('./tools/primeHelper.js')();

const $digits = [
    [0,1,0,1,0,1,0,0,0,1,0,1,0,1,0], // 0
    [0,0,0,0,0,1,0,0,0,0,0,1,0,0,0], // 1
    [0,1,0,0,0,1,0,1,0,1,0,0,0,1,0], // 2  
    [0,1,0,0,0,1,0,1,0,0,0,1,0,1,0], // 3
    [0,0,0,1,0,1,0,1,0,0,0,1,0,0,0], // 4
    [0,1,0,1,0,0,0,1,0,0,0,1,0,1,0], // 5
    [0,1,0,1,0,0,0,1,0,1,0,1,0,1,0], // 6   
    [0,1,0,1,0,1,0,0,0,0,0,1,0,0,0], // 7   
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], // 8
    [0,1,0,1,0,1,0,1,0,0,0,1,0,1,0]  // 9  
];

class Clock extends Object
{
    // static get [Symbol.species]() 
    // {
    //   return this;
    // }

    transitionTo(input)
    {
        return 0;
    }

    *digits(value)
    {
        while (value > 0)
        {
            yield value % 10;
            value = (value - (value % 10)) / 10;
        }    
    }

    execute(input)
    {
        let transitions = 0;
        this.state = undefined;
        while(true)
        {
            transitions += this.transitionTo(input);
            let newValue = 0;
            for(let d of this.digits(input))
                newValue += d;
            if (newValue === input)
                break;
            input = newValue;
        }

        transitions += this.transitionTo(undefined);

        return transitions;
    }
}

class SamClock extends Clock
{
    inner(input)
    {
        let transitions = 0;

        for(let digit of this.digits(input))
        {
            for(let d of $digits[digit])
            {
                if (d !== 0)
                    transitions++;
            }
        }

        return transitions;
    }

    transitionTo(input)
    {
        let transitions = 0;

        if (this.state !== undefined)
        {
            transitions += this.inner(this.state);
            this.state = undefined;
        }

        if (input !== this.state)
        {
            this.state = input;
            transitions += this.inner(input);
        }

        return transitions;
    }
}

class MaxClock extends Clock
{
    inner(input)
    {
        let values = [];

        if (input !== undefined)
        {
            for(let digit of this.digits(input))
            {
                values.push($digits[digit]);
            }
        }

        return values;
    }

    transitionTo(input)
    {
        let current = this.inner(this.state);
        let newState= this.inner(input);

        this.state = input;
        let count = Math.max(current.length, newState.length);
        let transitions = 0;

        const blank = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        const len = blank.length;

        for (let i = 0; i < count; i++)
        {
            let v1 = i < current.length ? current[i] : blank;
            let v2 = i < newState.length? newState[i]: blank;
            for(let j = 0; j < len; j++)
                if (v1[j] !== v2[j])
                    transitions++;
        }

        return transitions;
    }
}

function test()
{
    let vs = new SamClock().execute(137);
    let vm = new MaxClock().execute(137);

    assert.equal(vs, 40);
    assert.equal(vm, 30);
}

function solve()
{
    let result = 0;

    let sam = new SamClock();
    let max = new MaxClock();

    let A = 10000000;
    let B = 20000000;

    primes.initialize(B+1);

    for (let p of primes.primes())
    {
        if (p > B)
            break;
        if (p >= A)
        {
            let v1 = sam.execute(p);
            let v2 = max.execute(p);

            result += (v1-v2);
        }        
    }

    return result;
}

test();

console.log("The answer is " + solve());
console.log("Done");