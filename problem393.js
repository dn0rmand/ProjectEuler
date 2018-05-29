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

const UP    = 1;
const DOWN  = 2;
const LEFT  = 3;
const RIGHT = 4;

class Row
{
    constructor(item)
    {
        this.isRow = true;

        if (item === undefined)
            this.value = [];
        else
            this.value = [item];
    }

    clone()
    {
        let r = new Row();
        r.value = Array.from(this.value);
        return r;
    }

    isEmpty() 
    { 
        return this.value.length === 0; 
    }

    push(item)
    {
        this.value.push(item);
    }

    pop()
    {  
        this.value.pop();
    }

    get(index)
    {
        if (index < 0 || index >= this.value.length)
            return ' ';
        else   
            return this.value[index];
    }

    contains(item)
    {
        return this.value.includes(item);
    }

    getLength() 
    {
        return this.value.length; 
    }

    valueOf()
    {
        return this.value.join('');
    }
}

function f(size)
{
    let memoize = {};
    
    function makeRows(above, aboveAbove)
    {
        if (above === undefined)
            above = new Row();
        else if (above.isRow !== true)
            above = new Row(above);

        if (aboveAbove === undefined)
            aboveAbove = new Row();
        else if (aboveAbove.isRow !== true)
            aboveAbove = new Row(aboveAbove);

        function *inner(row)
        {
            if (row === undefined)
            {
                if (above.get(1) != DOWN)
                {
                    yield *inner(new Row(RIGHT));
                }

                yield *inner(new Row(DOWN));

                if (above.get(0) != DOWN && above.get(1) != LEFT && aboveAbove.get(0) !== DOWN)
                {                         
                    yield *inner(new Row(UP));                    
                }
                return;
            }

            let x = row.getLength();

            if (x >= size)
            {
                yield row.clone();          
                return;
            }

            let lastX = (x === (size-1));
                
            if (row.get(x-1) === LEFT && above.get(x-1) != DOWN)
            {
                row.push(LEFT);
                yield *inner(row);
                row.pop();
            }
            else if (row.get(x-1) === RIGHT)
            {
                // Cannot do L
            }
            else if (row.get(x-2) != RIGHT && above.get(x-1) != DOWN)
            {
                row.push(LEFT);
                yield *inner(row);
                row.pop();
            }
    
            if (! lastX && above.get(x+1) != DOWN) // Cannot go right on the right size
            {
                row.push(RIGHT);
                yield *inner(row);
                row.pop();
            }

            row.push(DOWN);
            yield *inner(row);
            row.pop();

            if (above.get(x) != DOWN && above.get(x-1) !== RIGHT && 
                above.get(x+1) !== LEFT && aboveAbove.get(x) !== DOWN)
            {
                row.push(UP);
                yield *inner(row);
                row.pop();
            }
        }

        let key    = aboveAbove.valueOf() + '-' + above.valueOf();
        let result = memoize[key];

        if (result === undefined)
        {
            result = [];

            for(let r of inner())
                result.push(r);

            memoize[key] = result;
            return result;
        }
        else
        {
            return result;
        }
    }

    function execute(above, aboveAbove, rowCount)
    {
        let key = above.valueOf()+'-'+aboveAbove.valueOf()+'-'+rowCount;

        let total = memoize[key];
        if (total !== undefined)
            return total;

        total = bigInt.zero;

        let rows = makeRows(above, aboveAbove);
        let count= rows.length;

        if (rowCount === 1)
        {
            while (count > 0 && rows[count-1].get(0) !== RIGHT)
            {
                count--;
            }
        }

        for (let index = 0; index < count; index++)
        {
            let row = rows[index];

            if (rowCount === 1)
            {
                // let percent = ((index / count)*100).toFixed(2);
                // console.log(percent);

                if (! row.contains(UP)) // cannot go up from first row
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

        memoize[key] = total;
        return total;
    }

    let total = execute(new Row(), new Row(), 1) * 2;

    console.log("f("+size+") = " + total.toString());
    return total;
}

// "112398351350823112"

// console.log(f(2));
f(4);
f(6);
//f(8);

//assert.equal(f(4), 88);

console.log('Done');
