const assert = require('assert');
const timeLog = require('@dn0rmand/project-euler-tools/src/timeLogger');

class Row
{
    constructor()
    {
        this.values = [];
        this.width  = 0;
    }

    addBrick(width, maxWidth)
    {
        if (this.width + width > maxWidth)
            return undefined;

        let row = new Row();

        row.width = this.width + width;
        row.values = [...this.values, row.width];
        return row;
    }
}

function generateRows(maxWidth, callback)
{
    let rows = [new Row()];

    while (rows.length > 0)
    {
        let newRows = [];

        for(let row of rows)
        {
            for(let w of [2, 3])
            {
                let nr = row.addBrick(w, maxWidth);
                if (nr !== undefined)
                {
                    if (nr.width === maxWidth)
                    {
                        const r = nr.values.slice(0, nr.values.length-1);
                        const k = r.join('-');
                        callback(k, r);
                    }
                    else
                        newRows.push(nr);
                }
            }
        }
        rows = newRows;
    }
}

function solve(width, height)
{
    const rowMap  = new Map();
    const rows    = new Map();

    let states    = new Map();
    let newStates = new Map();

    generateRows(width, (key, row) => 
    {
        const dest = [];

        for(const [k, r] of rows)
        {
            const bad = row.reduce((a, v) => a || r.includes(v), false);
            if (! bad)
            {
                dest.push(k);
                rowMap.get(k).push(key);
            }
        }

        rowMap.set(key, dest);
        rows.set(key, row);
        states.set(key, 1);
    });
    
    for(let h = 1; h < height; h++)
    {
        for(const [key, count] of states)
        {            
            for(const newKey of rowMap.get(key))
            {
                newStates.set(newKey, count + (newStates.get(newKey) || 0));
            }
        }
        
        [states, newStates] = [newStates, states];
        newStates.clear();
    }

    let total = 0;
    states.forEach(c => total += c);

    return total;
}

assert.equal(solve(9, 3), 8);
console.log('Test passed');

const answer = timeLog.wrap('Solving', _ => solve(32, 10, true));
console.log(`Answer is ${answer}`);