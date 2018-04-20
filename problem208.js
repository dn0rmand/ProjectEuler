const assert = require('assert');
const bigNum = require('bigNumber.js');
const bigInt = require('big-integer');

//bigNum.set({ ROUNDING_MODE: 1, DECIMAL_PLACES: 10 })

const arc = /*72*/ (Math.PI * 2)/5;
const circle  = 2*Math.PI;
const cos_arc = bigNum("0.30901699437494745");//Math.cos(arc);
const sin_arc = bigNum("0.9510565162951535");//Math.sin(arc);

const ERROR = bigNum("2.220446049250313e-16");

let X = bigNum(0);
let Y = bigNum(0);
let direction = 0;

function memorizer()
{
    const memoize = [];

    return {
        set: function(id, x, y, d, value)
        {
            let entry = memoize[id];
            if (entry === undefined)
            {
                entry = new Map();
                memoize[id] = entry;
            }
            x = x.toString();
            y = y.toString();

            let xE = entry.get(x);
            if (xE === undefined)
            {
                xE = new Map();
                entry.set(x, xE);
            }
            let yE = xE.get(y);
            if (yE === undefined)
            {
                yE = new Map();
                xE.set(y, yE);
            }
            yE.set(d, value);
        },
        get: function(id, x, y, d)
        {
            let entry = memoize[id];
            if (entry !== undefined)
            {
                x = x.toString();
                entry = entry.get(x);
                if (entry !== undefined)
                {
                    y = y.toString();
                    entry = entry.get(y);
                    if (entry !== undefined)
                    {
                        entry = entry.get(d);
                    }
                }
            }
            return entry;
        }
    };
}

const moveMemoize = memorizer();

function move(clockWise) // 1 or -1
{
    let xx = X;
    let yy = Y;
    let dd = direction;

    let result = moveMemoize.get(clockWise+1, xx, yy, dd);
    if (result !== undefined)
    {
        X = result.X;
        Y = result.Y;
        direction = result.direction;
        return;
    }

    let offsetY = sin_arc;
    let offsetX = bigNum(1).minus(cos_arc).times(clockWise);

    // Rotate offsets
    if (direction !== 0)
    {
        let cos_dir = Math.cos(direction).toFixed(15);
        let sin_dir = Math.sin(direction).toFixed(15);

        // x′=xcosθ−ysinθ
        // y′=ycosθ+xsinθ

        x2 = offsetX.times(cos_dir).minus(offsetY.times(sin_dir));
        y2 = offsetY.times(cos_dir).plus(offsetX.times(sin_dir));

        offsetX = x2;
        offsetY = y2;
    }

    // Add offset

    X = X.plus(offsetX);
    Y = Y.plus(offsetY);

    // Add rotation

    direction += (arc * clockWise);

    // fix calculation errors
    while (direction >= circle)
        direction -= circle;
    while (direction <= -circle)
        direction += circle;

    if (X.abs().lte(ERROR))
        X = bigNum(0);

    if (Y.abs().lte(ERROR))
        Y = bigNum(0);

    let data = {
        X: X,
        Y: Y,
        direction: direction
    };

    moveMemoize.set(clockWise+1,  xx, yy, dd, data);
}

function test()
{
    reset(bigNum(0), bigNum(0), 0);

    let moves = [
        -1, 1, -3, 4, -1, 2, -1, 1, -4, 1, -2, 1, -3 
    ];

    for (let m of moves)
    {
        if (m < 0)
        {
            while (m++ !== 0)
                move(-1);
        }
        else
        {
            while (m-- !== 0)
                move(1);
        }
    }

    return X == 0 && Y == 0;
}

function reset(x, y, d)
{
    X = x;
    Y = y;
    direction = d;    
}

let memoize = memorizer() ;
    
function process(totalMoves)
{
    let count = bigInt(0);

    function inner(moves)
    {
        if (moves === 0)
        {
            if (X == 0 && Y == 0)
                count = count.next();
            return;
        }

        let saved = memoize.get(moves, X, Y, direction);
        if (saved !== undefined)
        {
            count = count.plus(saved);
            return;
        }

        // Save State

        let oldCount = count;
        let x = X;
        let y = Y;
        let d = direction;

        move(-1);
        inner(moves-1);
        reset(x, y, d);

        move(1);
        inner(moves-1)
        reset(x, y, d);

        let added = count.minus(oldCount);
        memoize.set(moves, X, Y, direction, added);
    }

    reset(bigNum(0), bigNum(0), 0);
    inner(totalMoves);

    return count;
}

function passes()
{
   let total = bigInt(0);

   let memoize=[];

   function inner(moves)
   {
        if (moves === 0)
        {
            total = total.next();
            return;
        }
        let t = memoize[moves];
        if (t !== undefined)
        {
            total = total.plus(t);
            return;
        }
        let old = total;
        inner(moves-1);
        inner(moves-1);
        memoize[moves] = total.minus(old);
   } 

   inner(25);
   console.log(total.toString());
}

//passes();

assert.equal(test(), true);
assert.equal(process(25).valueOf(), 70932);

let count = process(70);
console.log(count.toString());

console.log("Done");