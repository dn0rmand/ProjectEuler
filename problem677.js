const assert = require('assert');

const MODULO = 1000000007;

const $g = [];

const RED = 0;
const BLUE= 1;
const YELLOW = 2;

$g[RED] = [];
$g[BLUE]= [];
$g[YELLOW]= [];

function g(n)
{
    function inner(color, count)
    {
        if (count === 0)
            return 0;

        if (count === 1)
            return color === YELLOW ? 2 : 3;

        let result = $g[color][count];
        if (result !== undefined)
            return result;

        result = 0;

        // only 1 edge
        result += inner(RED, count-1);
        result += inner(BLUE, count-1);
        if (color !== YELLOW)
            result += inner(YELLOW, count-1);

        if (count > 1)
        {
            // 2 edges
            for (let e1 = 1; e1 <= count-1;)
            {
                let y =  inner(RED, count-e1) + inner(BLUE, count-e1);
                if (color !== YELLOW)
                    y += inner(YELLOW, count-e1);

                result += inner(RED, e1) + y;
                result += inner(BLUE, e1)+ y;

                if (color !== YELLOW)
                    result += inner(YELLOW, e1) + y;
            }
        }

        if (count > 2)
        {

        }

        if (color === RED && count > 3)
        {

        }

        $g[color][count] = result;
        return result;
    }

    return inner(RED, n-1) + inner(BLUE, n-1) + inner(YELLOW, n-1);
}

assert.equal(g(2), 5);
assert.equal(g(3), 15);
assert.equal(g(4), 57);
assert.equal(g(10), 710249);