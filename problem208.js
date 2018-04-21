const assert = require('assert');
const bigInt = require('big-integer');

let $direction = 0;
let $arcs = [[0,0,0,0,0],[0,0,0,0,0]];

function isClosed()
{
    function inner(values)
    {
        let ref = values[0];

        if (values[1] === ref && 
            values[2] === ref && 
            values[3] === ref && 
            values[4] === ref)
        {
            return true;
        }
    
        return false;            
    }

    if ($direction !== 0)
        return false;

    let result = inner($arcs[0]) && inner($arcs[1]);

    if (! result)
        return false;

    return true;
}

function reset()
{
    $direction = 0;
    $arcs = [[0,0,0,0,0],[0,0,0,0,0]];
}

function move(clockWise) // 1 or -1
{
    assert.equal(clockWise === -1 || clockWise === 1, true);

    if (clockWise === -1)
        clockWise = 0;

    let index = $direction; // / 72;

    let arcs = $arcs[clockWise];

    let value = arcs[index];
    value = (value + 1);
    arcs[index] = value;

    // Some kind of modulo
    var min = Math.min(arcs[0], arcs[1], arcs[2], arcs[3], arcs[4]);
    while (min > 0)
    {
        arcs[0]--;
        arcs[1]--;
        arcs[2]--;
        arcs[3]--;
        arcs[4]--;

        min--;
    }

    if (clockWise)
        $direction = ($direction+1) % 5;
    else if ($direction > 0)
        $direction--;
    else
        $direction = 4;
}

function test()
{
    reset();

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

    return isClosed();
}

function process(totalMoves)
{
    let memoize = {};

    function makeKey(moves)
    {
        var key = moves + '-' + $direction + '-' + $arcs.toString();

        return key;
    }

    function saveState()
    {
        // Save State
        let state = [[],[]];

        for (let i = 0; i < 5; i++)
        {
            state[0][i] = $arcs[0][i];
            state[1][i] = $arcs[1][i];
        }

        return {
            direction: $direction,
            arcs: state
        };
    }

    function restoreState(state)
    {
        $direction = state.direction;

        for (let i = 0; i < 5; i++)
        {
            $arcs[0][i] = state.arcs[0][i];
            $arcs[1][i] = state.arcs[1][i];
        }
    }

    function inner(moves)
    {
        if (moves === 0)
        {
            if (isClosed())
                return 1;
            else
                return 0;
        }

        let key = makeKey(moves);

        let cache = memoize[key];
        if (cache !== undefined)
            return cache;            

        let state = saveState();

        move(-1);
        let c1 = inner(moves-1);

        restoreState(state);

        move(1);
        let c2 = inner(moves-1);

        restoreState(state);

        let c ;

        if (bigInt.isInstance(c1))
            c = c1.plus(c2);
        else if (bigInt.isInstance(c2))
            c = c2.plus(c1);
        else
        {
            c = c1+c2;
            if (c > Number.MAX_SAFE_INTEGER)
                c = bigInt(c1).plus(c2);
        }

        memoize[key] = c;

        return c;
    }

    reset();
    let count = inner(totalMoves);

    return count;
}

assert.equal(test(), true);
assert.equal(process(25), 70932);

let count = process(70);
console.log(count.toString() + " (331951449665644800)");

console.log("Done");