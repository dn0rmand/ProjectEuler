const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

const MODULO = 100000007;

class State
{
    constructor(state)
    {
        if (state === undefined)
        {
            this.data = 0;
            this.x = 0;
            this.y = 0;
            this.checksum = 0;

            this.set(0, 0, 0); this.set(1, 0, 0); this.set(2, 0, 1); this.set(3, 0, 1);
            this.set(0, 1, 0); this.set(1, 1, 0); this.set(2, 1, 1); this.set(3, 1, 1);
            this.set(0, 2, 0); this.set(1, 2, 0); this.set(2, 2, 1); this.set(3, 2, 1);
            this.set(0, 3, 0); this.set(1, 3, 0); this.set(2, 3, 1); this.set(3, 3, 1);
        }
        else
        {
            this.data = state.data;
            this.x    = state.x;
            this.y    = state.y;
            this.checksum = state.checksum;
        }
    }

    get key()
    {
        return (BigInt(this.data) << 4n) | (BigInt(this.y) << 2n) | BigInt(this.x); 
    }

    set(x, y, value)
    {
        const bit = 2 ** (y*4 + x);

        this.data |= bit;
        if (value === 0)
            this.data -= bit;
    }

    get(x, y)
    {
        const bit = 2 ** (y*4 + x);
        return (this.data & bit) !== 0 ? 1 : 0;
    }

    apply(move)
    {
        let x = this.x;
        let y = this.y;
        let value = 0;

        switch(move)
        {
            case 'L':
                if (x === 3)
                    return;
                x++;
                value = 76;
                break;
            case 'R':
                if (x === 0)
                    return;
                x--;
                value = 82;
                break;
            case 'U':
                if (y === 3)
                    return;
                y++;
                value = 85;
                break;
            case 'D':
                if (y === 0)
                    return;
                y--;
                value = 68;
                break;
        }

        const s = new State(this);

        s.set(this.x, this.y, this.get(x, y));
        s.set(x, y, 0);
        s.x = x;
        s.y = y;
        s.checksum = (s.checksum * 243 + value) % MODULO;

        return s;
    }

    dump()
    {
        console.log('+----+');
        for(let y = 0; y < 4; y++)
        {
            let s = ['|'];
            for (let x = 0; x < 4; x++)
            {
                if (x === this.x && y === this.y)
                    s.push(' ');
                else if (this.get(x, y))
                    s.push('B');
                else 
                    s.push('R');
            }
            s.push('|');
            console.log(s.join(''));
        }
        console.log('+----+');
    }
}

function check()
{
    let state = new State();
    for(let c of 'LULUR')
    {
        state = state.apply(c);
    }
    // state.dump();

    return state.checksum;
}

function getTarget()
{
    const state = new State();

    state.set(0, 0, 0); state.set(1, 0, 1); state.set(2, 0, 0); state.set(3, 0, 1);
    state.set(0, 1, 1); state.set(1, 1, 0); state.set(2, 1, 1); state.set(3, 1, 0);
    state.set(0, 2, 0); state.set(1, 2, 1); state.set(2, 2, 0); state.set(3, 2, 1);
    state.set(0, 3, 1); state.set(1, 3, 0); state.set(2, 3, 1); state.set(3, 3, 0);

    return state.key;
}

function solve()
{
    const target = getTarget();

    let states  = [ new State() ];
    let visited = new Map();
    let total   = 0;
    let moves   = 0;

    visited.set(states[0].key, 0);

    while (total === 0)
    {
        moves++;

        let newStates = [];

        for(let state of states)
        {
            for (let move of 'LRUD')
            {
                const s = state.apply(move);
                if (! s)
                    continue;

                const k = s.key;
                if (k === target)
                {
                    total += s.checksum;
                    continue;
                }
                else if (total == 0)
                {
                    const mv = visited.get(k);
                    if (mv === undefined)
                    {
                        newStates.push(s);
                        visited.set(k, moves);
                    }
                    // else if (mv >= moves)
                    // {
                    //     newStates.push(s);
                    // }
                }
            }
        }

        states = newStates;
    }

    return total;
}

assert.equal(check(), 19761398);
console.log('Test passed');

let answer = timeLogger.wrap('', () => solve());

console.log(`Answer is ${answer}`);