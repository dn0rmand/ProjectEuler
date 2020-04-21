const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

require('tools/numberHelper');

const MODULO    = 1000000007;
const MAXCOLORS = 1112131415;

const $factorials = [];

function factorial(n)
{
    if (n < 2)
        return 1;

    if ($factorials[n])
        return $factorials[n];

    return n.modMul(factorial(n-1), MODULO);
}

function binomials(n, p)
{
    const top     = factorial(n);
    const bottom  = factorial(p).modMul(factorial(n-p), MODULO);

    return top.modDiv(bottom, MODULO);
}

class State 
{
    constructor(row, count)
    {
        this.count = count || 1;
        this.row   = row;
    }

    get key()
    {
        const map   = [];
        let   count = 0;

        return this.row.reduce((a, v) => a*100n + BigInt(map[v] || (map[v] = ++count)), 0n);
    }

    addColor(color, index)
    {
        if (this.row[index] === color)
            return undefined;

        if (index > 0 && this.row[index-1] === color)
            return undefined;

        const row = this.row.slice(); // clone array
        row[index] = color;
        return new State(row, this.count);
    }
}

function F(width, height, colors, trace)
{
    let states    = new Map();
    let newStates = new Map();

    states.set(0, new State(new Uint16Array(width)));

    const tracer = new Tracer(1, trace);
    const STEPS  = width*height;

    for(let i = 0; i < STEPS; i++)
    {
        tracer.print(_ => `${STEPS-i-1} : ${states.size}`);

        newStates.clear();

        const index = i % width;
        for(const state of states.values())
        {
            for(let color = 1; color <= colors; color++)
            {
                const s = state.addColor(color, index);
                if (s === undefined)
                    continue;

                const k   = s.key;
                const old = newStates.get(k);

                if (old)
                    old.count = (old.count + s.count) % MODULO;
                else
                    newStates.set(k, s);
            }
        }

        [states, newStates] = [newStates, states]
    }

    let total = 0;
    states.forEach(v => total = (total + v.count) % MODULO);

    tracer.clear();
    return total;
}

function S(width, height, maxColors, trace)
{
    $E = [];

    function setE(c, fc)
    {
        if (c === 2)
        {
            $E[2] = fc;
        }
        else
        {
            for(let k = 2; k < c; k++)
            {
                fc = (fc - binomials(c, k).modMul($E[k], MODULO)) % MODULO;
                while (fc < 0)
                    fc += MODULO;
            }
            $E[c] = fc;
        }
    }
    
    const maximum = Math.min(maxColors, width*height);

    const tracer = new Tracer(1, trace);

    tracer.prefix = 'Generate Es';

    // Calculate (kind of brute force) up to the maximum colors that can be used
    for(let colors = 2; colors <= maximum; colors++)
    {
        tracer.print(_ => colors);
        
        setE(colors, F(width, height, colors, trace));
    }

    tracer.prefix = 'Calculate sum'

    let total = 0;

    // Quickly calculator for the other ones

    const N = maxColors+1;
    
    let nCr = N.modMul(N-1, MODULO).modDiv(2, MODULO);

    for(let colors = 2; colors <= maximum; colors++)
    {
        tracer.print(_ => colors);
        nCr = nCr.modMul(N-colors, MODULO).modDiv(colors+1, MODULO);

        const s = nCr.modMul($E[colors], MODULO);
        total = (total + s) % MODULO;
    }

    tracer.clear();

    return total;
}


assert.equal(F(2, 2, 3), 18);
assert.equal(F(2, 2, 20), 130340);
assert.equal(F(3, 4, 6), 102923670);
assert.equal(S(4, 4, 15), 325951319);
assert.equal(S(4, 4, 20), 785036814);

console.log('Tests passed');

// console.log(timeLogger.wrap('', _ => S(4, 4, MAXCOLORS, true)));

console.log(timeLogger.wrap('', _ => S(9, 10, MAXCOLORS, true)));
