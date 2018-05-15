const assert = require('assert');
const bigNum = require('bignumber.js');

function isTriangular(num)
{
    if (typeof num === 'number')
    {
        if (num < 0)
            return false;
        let d = Math.sqrt(num*8 + 1);
        if (Math.floor(d) !== d)
            return false;
        return (d & 1) === 1;
    }
    else
    {
        if (num.isNegative())
            return false;
    
        let d = num.times(8).plus(1).sqrt();
    
        if (! d.isInteger())
            return false;

        d = d.mod(2);
        return !d.isZero();
    }
}

function M2(n, expected)
{
    function initialize()
    {
        let coins = [];
        for (let i = 0; i < n; i++)
        {
            coins[i] = 'R';
            coins[2*n-i] = 'B';        
        }
        coins[n] = ' ';

        return coins;
    }

    function finished(state)
    {
        if (state.pos !== n)
            return false;
        for (let i = 0; i < n; i++)
            if (state.coins[i] !== 'B')
                return false;
        return true;
    }

    function *moves(state)
    {
        function swap(p1, p2)
        {
            c = Array.from(state.coins);
            let o = c[p1];
            c[p1] = c[p2];
            c[p2] = o;
            return c;
        }

        let p = state.pos;

        if (p > 0)
            yield { pos:p-1, coins: swap(p, p-1) };

        if (p > 1)
            yield { pos: p-2, coins: swap(p, p-2) };

        if (p < state.coins.length-1)
            yield { pos: p+1, coins: swap(p, p+1) };

        if (p < state.coins.length-2)
            yield { pos: p+2, coins: swap(p, p+2) };
    }
    
    const visited = new Map();

    function isVisited(state)
    {
        let k = state.coins.join('');

        if (! visited.has(k))
        {
            visited.set(k);
            return false;
        }
        return true;
    }

    let coins = initialize();
    let pos   = n;

    let states = [{
        pos: n,
        coins: coins
    }];

    // register starting point as visited
    // isVisited(states[0]);

    let steps = 0;
    let done  = false;

    while (! done)
    {
        let newStates = [];

        steps++;
        if (steps > expected)
        {
            steps = -1;
            break;
        }

        for(let s of states)
        {
            if (done) 
                break;
            for (let ss of moves(s))
            {
                if (isVisited(ss))
                    continue;
                if (finished(ss))
                {
                    done = true;
                    break;
                }
                newStates.push(ss);
            }
        }

        if (!done && newStates.length === 0)
        {
            steps = -2;
            break;
        }
        states = newStates;
    }

    return steps;
}

function M1(n, expected)
{
    function initialize()
    {
        let coins = [];
        for (let i = 0; i < n; i++)
        {
            coins[i] = 'R';
            coins[2*n-i] = 'B';        
        }
        coins[n] = ' ';

        return coins;
    }
    
    let coins   = initialize();
    let minStep = Number.MAX_SAFE_INTEGER;

    function finished(pos)
    {
        if (pos !== n)
            return false;
        for (let i = 0; i < n; i++)
            if (coins[i] !== 'B')
                return false;
        return true;
    }
    
    const visited = new Map();

    function isVisited(step)
    {
        let k = coins.join('');
        let v = visited.get(k);

        if (v !== undefined && v <= step)
            return true;
        
        visited.set(k, step);
        return false;
    }

    function swap(p1, p2)
    {
        let o = coins[p1];
        coins[p1] = coins[p2];
        coins[p2] = o;
    }

    function move(pos, step)
    {
        if (isVisited(step))
            return;

        if (step > minStep || step > expected)
            return;

        if (finished(pos))
        {
            minStep = step;
            return;
        }

        // let k1 = coins.join('');

        if (pos > 0)
        {
            swap(pos-1, pos);
            move(pos-1, step+1);
            swap(pos-1, pos);
        }

        if (pos > 1)
        {
            swap(pos-2, pos);
            move(pos-2, step+1);
            swap(pos-2, pos);
        }

        if (pos < coins.length-1)
        {
            swap(pos+1, pos);
            move(pos+1, step+1);
            swap(pos+1, pos);
        }

        if (pos < coins.length-2)
        {
            swap(pos+2, pos);
            move(pos+2, step+1);
            swap(pos+2, pos);
        }

        // let k2 = coins.join('');

        // assert.equal(k1, k2);
    }

    move(n, 0);

    return minStep;
}

function M(n)
{
    let v = n*(n+2);
    
    if (v > Number.MAX_SAFE_INTEGER)
        v = bigNum(n).times(n+2);

    return v;
}

function solve(count)
{
    let sum    = 0;
    let cc     = 0;
    let current= 0;

    while (true)
    {
        current++;
        let v = M(current);
        if (isTriangular(v))
        {
            sum += current;
            cc++;
            if (--count === 0)
                return sum;
        }
    }
}

assert.equal(M(3), 15);
assert.equal(isTriangular(M(1)), true);
assert.equal(isTriangular(M(22)), true);
assert.equal(isTriangular(M(10)), true);
assert.equal(isTriangular(M(63)), true);

let triangles = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105, 120, 136, 153, 171, 190, 210, 231, 253, 276, 300, 325, 351, 378, 406];

for (let t = 1; t <= 406; t++)
    assert.equal(isTriangular(t), triangles.includes(t));

assert.equal(solve(5), 99);

let answer = solve(40);

console.log("The sum of the first forty terms of this sequence is " + answer);
