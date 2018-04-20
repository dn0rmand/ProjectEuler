const assert = require('assert');
const bigNum = require('bigNumber.js');

bigNum.config({ DECIMAL_PLACES: 10 })

const arc = /*72*/ (Math.PI * 2)/5;
const circle  = 2*Math.PI;
const cos_arc = bigNum("0.30901699437494745");//Math.cos(arc);
const sin_arc = bigNum("0.9510565162951535");//Math.sin(arc);

const ERROR = bigNum("2.220446049250313e-16");

let X = bigNum(0);
let Y = bigNum(0);
let direction = 0;

function move(clockWise) // 1 or -1
{
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
        y2 = offsetY.times(cos_dir).plus(offsetY.times(sin_dir));

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

    atStart();
}

function atStart()
{
    if (X.abs().gt(ERROR))
        return false;

    X = bigNum(0);

    if (Y.abs().gt(ERROR))
        return false;

    Y = bigNum(0);

    return true;
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

function process(totalMoves)
{
    let count = 0
    let memoize = {};

    function inner(moves)
    {
        if (moves === totalMoves)
        {
            if (X == 0 && Y == 0)
                count++;
            return;
        }

        let key = moves + "|" + X.valueOf() + "|" + Y.valueOf() + "|" + direction;

        let saved = memoize[key];
        if (saved !== undefined)
        {
            count += saved;
            return;
        }

        // Save State

        let oldCount = count;
        let x = X;
        let y = Y;
        let d = direction;

        move(-1);
        inner(moves+1);
        reset(x, y, d);

        move(1);
        inner(moves+1)
        reset(x, y, d);

        let added = count-oldCount;
        memoize[key] = added;
    }

    reset(bigNum(0), bigNum(0), 0);
    inner(0);

    return count;
}

assert.equal(test(), true);
assert.equal(process(25), 70932);

// let count = process(70);
// console.log(count);

console.log("Done");