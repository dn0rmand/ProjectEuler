const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLog = require('tools/timeLogger');

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

class Wall
{
    constructor(row, count, key)
    {
        this.lastRow = row || [];
        this.count   = count || 1;
        this.key     = key || 0;
    }

    addRow(values)
    {
        const lastRow = [];
        let key = 0n;

        for(const w of values)
        {
            if (this.lastRow[w] !== undefined)
                return undefined; // cannot add that row
            lastRow[w] = 1;
            key = (key * 50n) + BigInt(w);
        }
        
        return new Wall(lastRow, this.count, key);
    }
}

function *generateRows(maxWidth)
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
                        yield nr.values.slice(0, nr.values.length-1);
                    else
                        newRows.push(nr);
                }
            }
        }
        rows = newRows;
    }
}

function solve(width, height, trace)
{
    const rows = [...generateRows(width)];

    let walls   = new Map();
    let newWalls= new Map();

    walls.set(0n, new Wall());

    const tracer = new Tracer(1, trace)
    for(let h = 0; h < height; h++)
    {
        tracer.print(_ => height-h);

        for(const wall of walls.values())
        {
            for(const row of rows)
            {
                const w = wall.addRow(row);
                if (w !== undefined)
                {
                    const old = newWalls.get(w.key);
                    if (old)
                        old.count += w.count;
                    else
                        newWalls.set(w.key, w);
                }
            }
        }
        [walls, newWalls] = [newWalls, walls];
        newWalls.clear();
    }
    tracer.clear();

    let total = 0;
    walls.forEach(w => total += w.count);

    return total;
}

assert.equal(solve(9, 3), 8);
console.log('Test passed');

const answer = timeLog.wrap('Solving', _ => solve(32, 10, true));
console.log(`Answer is ${answer}`);