const assert = require('assert');
const timeLogger = require('tools/timeLogger');

const MAX    = 20000;
const MODULO = 1E9;

function countCoins(size)
{
    if (size & 1) {
        return size * ((size+1)/2);
    } else {
        return (size/2) * (size+1);
    }
}

const $T = [];

function T(coins)
{   
    function get(coins, diagonal)
    {
        const a = $T[coins];
        if (a) {
            return a[diagonal];
        }
    }

    function set(coins, diagonal, value) 
    {
        let a = $T[coins];
        if (! a) {
            a = $T[coins] = [];
        }
        a[diagonal] = value;
    }

    function inner(diagonal, coins) 
    {
        if (coins < 0 || diagonal < 1) { return 0; }
        if (coins === 0) { return diagonal === 1 ? 1 : 0; }
        
        let total = get(coins, diagonal);
        if (total !== undefined) {
            return total;
        }

        const minCoins = countCoins(diagonal-1);
        if (coins < minCoins) {
            set(coins, diagonal, 0);
            return 0;
        }

        total = 0;

        // Same Size Diagonal
        if (coins >= diagonal) 
        {
            if (diagonal === 1) 
                total = (total + 2*inner(diagonal, coins - diagonal)) % MODULO;
            else
                total = (total + inner(diagonal, coins - diagonal)) % MODULO;
        }

        // shorter diagonal
        if (diagonal > 1 && coins >= diagonal-1) {
            total = (total + inner(diagonal-1, coins - (diagonal-1))) % MODULO;
        }

        // all bigger sizes
        const choices = diagonal === 1 ? 4 : 1;
        for(let h = diagonal+1; h <= coins; h++)
        {
            const subTotal = inner(h, coins - h);
            if (subTotal === 0) {
                break;
            }

            total = (total + choices * inner(h, coins - h)) % MODULO;
        }

        set(coins, diagonal, total);
        return total;
    }

    const MAXDIAG = Math.floor(Math.sqrt(2*coins))+1;

    let answer = (3 * inner(1, coins - 1)) % MODULO;

    for(let d = 2; d <= MAXDIAG; d++)
    {
        const subTotal = inner(d, coins - d);
        if (subTotal === 0) {
            break;
        }
        answer = (answer + 6*subTotal) % MODULO;
    }

    return answer;
}

function solve(coins) 
{
    // Preloading memoize cache to avoid stack overflow
    for(let i = 100; i < coins; i += 100) { T(i); }    
    
    // actual solve
    return T(coins);
}

// assert.strictEqual(T(4), 3);
// assert.strictEqual(T(10), 78);

assert.strictEqual(T(4), 48);
assert.strictEqual(T(10), 17760);
assert.strictEqual(T(100), 688447422);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(MAX));
console.log(`Answer is ${answer}`);
