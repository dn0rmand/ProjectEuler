const assert = require('assert');

const MODULO = 1000000007;

const $g = [];

const RED = 0;
const BLUE= 1;
const YELLOW = 2;

function g(n)
{
    function inner(color, sameColorConnections, count)
    {

    }

    if ((n & 1) === 0)
    {
        throw "DON'T KNOW";
    }
    else
    {
        let m = (n-1)/2;
        var RED = 0, GREEN = 0, BLUE = 0, YELLOW = 0;

        for (let cL = 0; cL = 4; cL++)
            for (let cR = 0; cR+Cl <= 4; cR++)
                RED += inner(RED, cL, m) * inner(RED, cR, m);

        for (let cL = 0; cL = 3; cL++)
        {
            for (let cR = 0; cR+Cl <= 3; cR++)
            {
                BLUE += inner(BLUE, cL, m) * inner(BLUE, cR, m);
                GREEN+= inner(GREEN, cL, m) * inner(GREEN, cR, m);
            }
        }

        YELLOW = inner(YELLO, 0, m) * inner(YELLO, 0, m) +
                 inner(YELLO, 1, m) * inner(YELLO, 0, m) +
                 inner(YELLO, 0, m) * inner(YELLO, 1, m)

        return RED + GREEN + BLUE + YELLOW;
    }
}

assert.equal(g(3), 15);

assert.equal(g(2), 5);
assert.equal(g(4), 57);
assert.equal(g(10), 710249);