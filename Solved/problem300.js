const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

class Item
{
    constructor(parent)
    {
        this.parent = parent;
        this.data   = new Map();
        if (parent === undefined)
        {
            this.minX = 0;
            this.maxX = 0;
            this.minY = 0;
            this.maxY = 0;
            this.$set(0, 0, 1);
        }
        else
        {
            this.x = this.parent.x;
            this.y = this.parent.y;
            this.minX = this.parent.minX;
            this.maxX = this.parent.maxX;
            this.minY = this.parent.minY;
            this.maxY = this.parent.maxY;
        }
    }

    key(x, y)
    {
        x += 100;
        y += 100;

        return x*1000 + y;
    }

    get(x, y)
    {
        let k = this.key(x, y);
        let v = this.data.get(k);
        if (v === undefined && this.parent !== undefined)
            v = this.parent.get(x, y);

        return v;
    }

    getRelative(x, y)
    {
        return this.get(x+this.x, y+this.y);
    }

    $set(x, y, value)
    {
        if (this.get(x, y) !== undefined)
            throw "ERROR";

        this.data.set(this.key(x, y), value);
        this.x = x;
        this.y = y;
        if (x > this.maxX)
            this.maxX = x;
        if (x < this.minX)
            this.minX = x;
        if (y > this.maxY)
            this.maxY = y;
        if (y < this.minY)
            this.minY = y;
    }

    set(x, y, value)
    {
        let i = new Item(this);
        i.$set(x + this.x, y + this.y, value);
        return i;
    }

    process(value, states)
    {
        if (! this.getRelative(0, 1))
            states.push(this.set(0, 1, value));
        if (! this.getRelative(0, -1))
            states.push(this.set(0,-1, value));
        if (! this.getRelative(1, 0))
            states.push(this.set(1, 0, value));
        if (! this.getRelative(-1,0))
            states.push(this.set(-1,0, value));
    }
}

function generateProteins(n)
{
    let states = ['H', 'P'];

    for(let i = 1; i < n; i++)
    {
        let newStates = [];

        for(let state of states)
        {
            newStates.push(state+'P');
            newStates.push(state+'H');
        }

        states = newStates;
    }

    return states;
}

function generatePaths(length, trace)
{
    let states = [new Item()];

    for (let i = 2; i <= length; i++)
    {
        let newStates = [];
        for (let state of states)
            state.process(i, newStates);

        states = newStates;
    }

    let newStates = [];
    let visited   = {};

    while (states.length > 0)
    {
        let state = states.pop();

        if (trace && states.length % 1000 === 0)
            process.stdout.write(`\r${states.length} `);

        let touches = [];
        let keys    = [];

        for (let x = state.minX; x <= state.maxX; x++)
        for (let y = state.minY; y <= state.maxY; y++)
        {
            let v0 = state.get(x, y);
            if (v0 === undefined)
                continue;

            let touch = [];
            let v1 = state.get(x, y-1);
            let v2 = state.get(x, y+1);
            let v3 = state.get(x-1, y);
            let v4 = state.get(x+1, y);

            if (v1 !== undefined && v1 > v0)
                touch.push(v1-1);
            if (v2 !== undefined && v2 > v0)
                touch.push(v2-1);
            if (v3 !== undefined && v3 > v0)
                touch.push(v3-1);
            if (v4 !== undefined && v4 > v0)
                touch.push(v4-1);

            touch.sort((a, b) => a-b);
            touches[v0-1] = touch;
            keys[(v0-1)] = touch.join(',');
        }
        let k = keys.reduce((a, v) => a + "-" + (v || ""), "");

        if (! visited[k])
        {
            newStates.push(touches);
            visited[k] = 1;
        }
    }

    if (trace)
    {
        process.stdout.write('\r               \r');
        console.log(`${newStates.length} paths`);
    }
    return newStates;
}

function solve(length, trace)
{
    let contacts = generatePaths(length, trace);
    let proteins = generateProteins(length);
    let total = 0;

    for (let i = 0; i < proteins.length; i++)
    {
        if (trace)
            process.stdout.write(`\r${proteins.length - i} `);
        let p = proteins[i];
        let idx = p.indexOf('H');
        if (idx < 0)
            continue;

        let good = false;
        for (j = idx+1; j < length && !good; j += 2)
            good = (p[j] === 'H');
        if (! good) // Need another H in a position with different oddity (+=2)
            continue;

        let maxContacts = 0;

        for(let touches of contacts)
        {
            let contacts = 0;

            for(let i = 0; i < length; i++)
            {
                if (p[i] === 'H' && touches[i] !== undefined)
                    for (j of touches[i])
                        if (p[j] === 'H')
                            contacts++;
            }

            if (contacts > maxContacts)
                maxContacts = contacts;
        }

        total += maxContacts;
    }
    if (trace)
        process.stdout.write('\r    \r');
    return total / proteins.length;
}

assert.equal(solve(8), 3.3203125)

const answer = timeLogger.wrap('', () => solve(15, true));

console.log('Answer is ', answer);