const assert = require('assert');
const timeLogger = require('tools/timeLogger');

require('tools/bigintHelper');

const MAX = 30;

function makeKey(list, max)
{
    let k = 0;
    while (list)
    {
        k = (k * max) + list.value;
        list = list.next;
    }

    return k;
}

const memoize = new Map();

function sort(list, max)
{
    let key = makeKey(list, max);
    let switches = memoize.get(key);

    if (switches !== undefined)
        return switches;

    switches = 0;

    let split = new Map();

    for(let position = list; position.next; position = position.next)
    {
        if (position.value > position.next.value)
        {
            let p = position.next;
            position.next = p.next;
            p.next = list;
            list = p;
            position  = { next: list };
            switches++;

            let k2 = makeKey(list, max);
            if (memoize[k2])
            {
                switches += memoize[k2];
                break;
            }
            else
            {
                split.set(k2, switches);
            }
        }
    }

    memoize.set(key, switches);

    for(let [k, v] of split)
    {
        memoize[k] = switches - v;
    }
    return switches;
}

function makeList(values)
{
    let list = values.reduce((a, v) => { return { value: v, next: a || undefined  } }, 0);
    return list;
}

function bruteE(n, precision)
{
    N = Math.max(n, 10);

    memoize.clear();

    const used = [];
    const items= [];

    function *generateList()
    {
        if (items.length === n)
        {
            yield makeList(items);
            return;
        }

        for(let i = 0; i < n; i++)
        {
            if (used[i])
                continue;

            used[i] = 1;
            items.push(i);
            yield *generateList(count+1);
            items.pop(i);
            used[i] = 0;
        }
    }

    let count = 0;
    let sum   = 0;

    for(let list of generateList())
    {
        sum += sort(list, N);
        count++;
    }

    return { value: (sum / count).toFixed(precision), sum, count };
}

function E(n, precision)
{
    // http://oeis.org/A279683
    // a(n) = a(n-1)*n + (n-1)! * (2^(n-1)-1) for n>0, a(0) = 0

    $factorials = (function()
    {
        let f = [1n, 1n];
        for(let i = 2; i <= n; i++)
        {
            f[i] = BigInt(i)*f[i-1];
        }
        return f;
    })();

    function a(n)
    {
        if (n === 0)
            return 0n;

        let N = BigInt(n);
        let T = (2n ** (N-1n)) - 1n;
        let v = a(n-1)*N + $factorials[n-1]*T;

        return v;
    }

    let sum   = a(n);
    let count = $factorials[n];

    let x = sum.gcd(count);
    sum   /= x;
    count /= x;

    return (Number(sum) / Number(count)).toFixed(precision);
}

assert.equal(E(4, 2), 3.25);
assert.equal(E(10, 3), 115.725);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => E(MAX, 2));
console.log(`Answer is ${answer}`);