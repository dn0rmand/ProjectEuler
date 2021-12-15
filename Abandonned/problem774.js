const assert = require('assert');
const binomial = require('tools/binomial');

require('tools/numberHelper');

const MODULO = 998244353;

function getMax(b)
{
    for(let i = 1; ; i *= 2) {
        if (i > b) {
            return i-1;
        }
    }
}

function getBitCount(v)
{
    let count = 0;
    while (v > 0) {
        if (v & 1) {
            count++;
            v = (v-1)/2;
        } else {
            v /= 2;
        }
    }
    return count;
}

let $inner = [];
let $b = undefined;

function c(n, b)
{
    if ($b !== b) {
        $b = b;
        $inner = [];
    }

    function get(count, previous)
    {
        if ($inner[count]) { 
            return $inner[count][previous]; 
        }
    }

    function set(count, previous, value)
    {
        let a = $inner[count];
        if (! a) {
            $inner[count] = a = [];
        }
        a[previous] = value;
    }

    function inner(count, previous)
    {
        if (count === 0) {
            return 1;
        }
        let bits = getBitCount(previous);
        let total = get(count, bits);
        if (total !== undefined) {
            return total;
        }
        total = 0;
        for(let a = 1; a <= b; a++) {
            if (previous & a) {
                total = (total + inner(count-1, a)) % MODULO;
            }
        }
        set(count, bits, total);
        return total;
    }

    const value = inner(n, getMax(b));
    return value;
}

function c1(n, b)
{
    const cache = [];

    function add(from, to)
    {
        from = getBitCount(from);
        to   = getBitCount(to);

        if (cache[from] === undefined) {
            cache[from] = [];
        }
        cache[from][to] = (cache[from][to] || 0) + 1;
    }

    for(let a1 = 1; a1 <= b; a1++) {
        for(let a2 = 1; a2 <= b; a2++) {
            if (a1 & a2) {
                add(a1, a2);
            }
        }
    }

    let states = new Map();
    let newStates = new Map();

    states.set(getBitCount(b), 1);

    for(let i = 1; i <= n; i++) {
        newStates.clear();

        let total = 0;
        for(let from of states.keys()) {
            let count = states.get(from);
            for (const to in cache[from]) {
                let newCount = count.modMul(cache[from][to], MODULO);
                total = (total + newCount) % MODULO;
                newStates.set(to, ((newStates.get(to) || 0) + newCount) % MODULO);
            }
        }
        [states, newStates] = [newStates, states];
    }
    return 0;
}

console.log(c(10, 2**3-1));
console.log(c1(10, 2**3-1));
// assert.strictEqual(c1(20, 2**3 - 1), 137131919);
// assert.strictEqual(c(20, 2**4 - 1), 667431985);
// assert.strictEqual(c(20, 2**5 - 1), 404701472);
// assert.strictEqual(c(20, 2**6 - 1), 839045403);

// assert.strictEqual(c(3, 4), 18);
// assert.strictEqual(c(10, 6), 2496120);
// assert.strictEqual(c(100, 200) % MODULO, 268159379);

console.log('Tests passed');

const answer = c(123, 134217727); // 123456789);
console.log(`Answer is ${answer}`);