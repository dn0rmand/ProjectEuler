const assert = require('assert');

let WIDTH     = 6;
let MAX_WIDTH = 3;
let A_CODE    = 'A'.charCodeAt(0);
let a_CODE    = 'a'.charCodeAt(0);

class State
{
    constructor(parent, x, y)
    {
        if (parent === undefined)
        {
            this.data  = { x: 0, y: 0 };
            this.minX  = 0;
            this.maxX  = 0;
            this.level = 0;
        }
        else
        {
            if (x === undefined || y === undefined)
                throw "ERROR";

            this.data   = { x, y, parent: parent.data };
            this.maxX   = Math.max(x, parent.maxX);
            this.minX   = Math.min(x, parent.minX)
            this.level  = parent.level + x; // (x < 0 ? -1 : (x > 0 ? 1 : 0));
        }
    }

    forEach(callback)
    {
        for (let node = this.data; node !== undefined; node = node.parent)
        {
            if (callback(node.x, node.y) === true)
                return true;
        }
    }

    getKey()
    {
        function getID(x, y)
        {
            const cy = String.fromCharCode(A_CODE + y);
            if (x === 0)
                return cy;

            if (y === 0)
                throw "ERROR";

            const cx = x < 0 ? String.fromCharCode(a_CODE - x) : String.fromCharCode(A_CODE + x);

            return cx+cy;
        }

        let key1 = [];
        let key2 = [];

        this.forEach((x, y) => {
            key1.push(getID(x, y));
            key2.push(getID(-x, y));
        });

        key1 = key1.sort().join(':');
        key2 = key2.sort().join(':');

        return { key1, key2 };
    }

    isUsed(x, y)
    {
        if (y <= 0)
            return true;

        if (x > MAX_WIDTH || x < -MAX_WIDTH)
            return true;

        return this.forEach((xRef, yRef) => {
            if (x === xRef && y === yRef)
                return true;
        }) === true;
    }

    neighbors(callback)
    {
        const visited = [];

        const isValid = (x, y) =>
        {
            const k = (x+100) + 100*y;
            if (visited[k])
                return false;
            visited[k] = true;
            return ! this.isUsed(x, y);
        }

        this.forEach((x, y) =>
        {
            if (isValid(x-1, y))
            {
                callback(new State(this, x-1, y));
            }
            if (isValid(x+1, y))
            {
                callback(new State(this, x+1, y));
            }
            if (isValid(x, y+1))
            {
                callback(new State(this, x, y+1));
            }
            if (isValid(x, y-1))
            {
                callback(new State(this, x, y-1));
            }
        });
    }
}

function solve(n, trace)
{
    WIDTH = n;
    MAX_WIDTH = Math.floor(n / 2);

    let states = [new State()];

    while (n--)
    {
        let newStates = [];
        let visited   = {};

        if (trace)
            process.stdout.write(`\r${n}:${states.length}    `);

        for (let state of states)
        {
            state.neighbors((newState) =>
            {
                if (newState.level > 0)
                {
                    let level = newState.level;
                    level += (n * newState.minX) - ((n*(n+1)) / 2);
                    if (level > 0)
                        return; // No chance
                }
                else if (newState.level < 0)
                {
                    let level = newState.level;
                    level += (n * newState.maxX) + ((n*(n+1)) / 2);
                    if (level < 0)
                        return; // No chance
                }

                const {key1, key2} = newState.getKey();
                if (visited[key1] !== undefined)
                    return;

                visited[key1] = 1;
                visited[key2] = 1;
                newStates.push(newState);
            });
        }

        states = newStates;
    }

    return states.reduce((a, s) => s.level === 0 ? a+1 : a, 0);
}

assert.equal(solve(6), 18);
assert.equal(solve(10), 964);
assert.equal(solve(15, true), 360505);

console.log("Tests passed");

const answer = solve(18, true);
console.log('Answer is', answer);