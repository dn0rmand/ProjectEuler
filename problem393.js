// Migrating ants
// --------------
// Problem 393 
// -----------
// An n×n grid of squares contains n2 ants, one ant per square.
// All ants decide to move simultaneously to an adjacent square (usually 4 possibilities, except for ants on the edge of 
// the grid or at the corners).
// We define f(n) to be the number of ways this can happen without any ants ending on the same square and without any 
// two ants crossing the same edge between two squares.

// You are given that f(4) = 88.
// Find f(10).

const assert = require('assert');
const bigInt = require('big-integer');
const prettyHrtime = require("pretty-hrtime");

const UP    = 1; 
const DOWN  = 2; 
const LEFT  = 3; 
const RIGHT = 4; 

class Memoize 
{
    constructor()
    {
        this.content = new Map();
        this.size = 0;
    }

    get(key1, key2, key3)
    {
        let inner = this.content.get(key1.valueOf());
        if (inner === undefined)
            return undefined;
        inner = inner.get(key2.valueOf());
        if (inner === undefined)
            return undefined;

        let r = inner.get(key3.valueOf());
        return r;
    }

    set(key1, key2, key3, value)
    {
        let inner = this.content.get(key1.valueOf());
        if (inner === undefined)
        {
            inner = new Map();
            this.content.set(key1.valueOf(), inner);
        }
        let inner2 = inner.get(key2.valueOf());
        if (inner2 === undefined)
        {
            inner2 = new Map();
            inner.set(key2.valueOf(), inner2);
        }
        inner2.set(key3.valueOf(), value);
        this.size++;
    }
}

class Row
{
    constructor(item)
    {
        this.up     = 0;
        this.down   = 0;

        if (item === undefined)
            this.value = 0;
        else
        {
            this.value = item;
            if (item === UP)
                this.up++;
            else if (item === DOWN)
                this.down++;
        }
    }

    clone()
    {
        let r = new Row();

        r.value  = this.value;
        r.down   = this.down;
        r.up     = this.up;

        return r;
    }

    isEmpty() 
    { 
        return this.value === 0; 
    }

    push(item)
    {
        this.value = this.value*10 + item;

        if (item === DOWN)
            this.down++;
        else if (item === UP)
            this.up++;
    }

    pop()
    {  
        let d = this.value % 10;
        this.value = (this.value - d) / 10;
        if (d === UP)
            this.up--;
        else if (d === DOWN)
            this.down--;
    }

    get(index, length)
    {
        if (index < 0 || index >= length)
            return 0;
        else   
        {
            index = length - index - 1;
            let value = this.value; 
            while (index-- > 0)
            {
                value = (value - (value % 10)) / 10;
            }
            return value % 10;
        }
    }

    contains(item)
    {
        if (item === DOWN)
            return this.down !== 0;
        else if (item === UP)
            return this.up !== 0;

        let v = this.value;
        while (v > 0)
        {
            let d = v % 10;
            if (d === item)
                return true;
            v = (v-d) / 10;
        }
        return false;
    }

    countOf(item)
    {
        if (item === UP)
            return this.up;
        else if (item === DOWN)
            return this.down;

        return 0;
    }

    valueOf()
    {
        return this.value;
    }
}

function f(size, trace)
{
    let memoize = new Memoize();
    
    function makeRows(above, aboveAbove)
    {
        let result;

        function inner(row, x)
        {
            if (row === undefined)
            {
                if (above.isEmpty())
                {
                    inner(new Row(RIGHT), 1);
                }
                else
                {
                    if (above.get(1, size) != DOWN)
                    {
                        inner(new Row(RIGHT), 1);
                    }

                    inner(new Row(DOWN), 1);

                    if (above.get(0, size) != DOWN && above.get(1, size) != LEFT && aboveAbove.get(0, size) !== DOWN)
                    {                         
                        inner(new Row(UP), 1);                    
                    }
                }
                return;
            }

            if (x >= size)
            {
                // Ensure correct !!!!
                if (! above.isEmpty())
                {
                    // if (above.countOf(UP) != r.countOf(DOWN))
                    //     continue;
                    if (above.countOf(DOWN) != row.countOf(UP))
                        return; // Invalid row
                }
                else // First row so no UP and start with RIGHT
                {
                    if (row.get(0, size) !== RIGHT || row.contains(UP))
                        return;
                }
                
                result.push(row.clone());
                return;
            }

            let lastX = (x === (size-1));
                
            if (row.get(x-1, x) === LEFT && above.get(x-1, size) != DOWN)
            {
                row.push(LEFT);
                inner(row, x+1);
                row.pop();
            }
            else if (row.get(x-1, x) === RIGHT)
            {
                // Cannot do L
            }
            else if (row.get(x-2, x) != RIGHT && above.get(x-1, size) != DOWN)
            {
                row.push(LEFT);
                inner(row, x+1);
                row.pop();
            }
    
            if (! lastX && above.get(x+1, size) != DOWN) // Cannot go right on the right size
            {
                row.push(RIGHT);
                inner(row, x+1);
                row.pop();
            }

            row.push(DOWN);
            inner(row, x+1);
            row.pop();

            if (above.get(x, size) != DOWN && above.get(x-1, size) !== RIGHT && 
                above.get(x+1, size) !== LEFT && aboveAbove.get(x, size) !== DOWN)
            {
                row.push(UP);
                inner(row, x+1);
                row.pop();
            }
        }

        result = memoize.get(-1, aboveAbove, above);

        if (result === undefined)
        {
            result = [];
            inner();
            memoize.set(-1, aboveAbove, above, result);
            return result;
        }
        else
        {
            return result;
        }
    }

    function execute(above, aboveAbove, rowCount)
    {
        let total = memoize.get(rowCount, aboveAbove, above);
        if (total !== undefined)
            return total;

        total = bigInt.zero;

        let rows = makeRows(above, aboveAbove);
        let count= rows.length;

        for (let index = 0; index < count; index++)
        {
            let row = rows[index];

            if (rowCount === 1)
            {
                if (trace)
                {
                    let percent = ((index / count)*100).toFixed(2);
                    console.log(percent);
                }

                total = total.plus( execute(row, above, rowCount+1) );
            }
            else if (rowCount === size)
            {
                if (! row.contains(DOWN)) // cannot go down from last row
                    total = total.next();
            }
            else
            {
                total = total.plus( execute(row, above, rowCount+1) );
            }
        }

        if (total.isSmall)
            total = total.valueOf();

        memoize.set(rowCount, aboveAbove, above, total);

        return total;
    }

    let start = process.hrtime();
    let total = execute(new Row(), new Row(), 1);
    total = bigInt(2).times(total);
    let end = process.hrtime(start);

    console.log("f("+size+") = " + total.toString() + ", processed in " + prettyHrtime(end, {verbose:true}));
    return total;
}

// "112398351350823112"

assert.equal(f(4).valueOf(), 88);
assert.equal(f(6).valueOf(), 207408);

console.log('f(8)');
f(8, true); // 22902801416
console.log('f(10)');
f(10, true); // "112398351350823112"


console.log('Done');
