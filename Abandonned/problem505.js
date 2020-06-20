const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const BigMap = require('tools/BigMap');
const Tracer = require('tools/tracer');

const linearRecurrence = require('tools/linearRecurrence');

const MODULO = 2n**60n;
const MAX    = 10n ** 12n;

const max = (a, b) => a > b ? a : b;
const min = (a, b) => a < b ? a : b;
const abs = a => a > 0n ? a : -a;

const $x = new BigMap('x');

let tracer = new Tracer(1, false);

function x(i)
{
    if (i === 0n)
        return 0n;
    else if (i === 1n)
        return 1n;
    
    let res = $x.get(i);
    if (res !== undefined)
        return res;

    if (i & 1n)
    {
        const k = (i-1n)/2n;
        res = (2n * x(k) + 3n * x(k / 2n)) % MODULO;
    }
    else
    {
        const k = i / 2n;

        res = (3n * x(k) +  2n * x(k / 2n)) % MODULO;
    }

    $x.set(i, res);
    return res;
}

const $y = new BigMap('y');

let REF_N = undefined;

function yy(k)
{
    if (k >= REF_N)
        return x(k);
    else
    {
        let res = $y.get(k);

        if (res !== undefined) 
            return res;

        tracer.print(_ => REF_N-k);
        
        const res1 = MODULO - 1n - yy(k+k);
        const res2 = MODULO - 1n - yy(k+k+1n);

        res = min(res1, res2);

        $y.set(k, res);
        return res;
    }
}

function y(n, k, trace)
{
    tracer = new Tracer(100000, trace);
    REF_N = n;

    $y.clear();  
    return yy(k);
}

const A = (n, trace) => y(n, 1n, trace);

function analyze1()
{
    function process(data)
    {
        data = data.map(a => BigInt(a));

        let l = linearRecurrence(data);
        if (! l.factors)
            return;

        let s = [];
        while(true)
        {
            if (s.length < l.factors.length)
                s.push(data[s.length]);
            else
                s = l.next(s);

            while (s[s.length-1] < 0)
                s[s.length-1] += MODULO;
            s[s.length-1] %= MODULO;
            let v = s[s.length-1];
            console.log(v);
        }
    }

    // process([1, 8, 82, 854, 8902, 92798, 967366, 10084238, 105122422, 1095841214]);
    // process([11n, 117n, 1233n, 12873n, 134277n, 1399881n, 14593461n, 152129217n, 1585863213n, 16531722633n]);

    let values = [];
    for(let i = 2n, count = 1n; i < MAX; count *= 4n, i += count)
    {    
        let a = A(i+count);
        for(let k = i+count+1n; ; k++)
        {
            let b = A(k);
            if (b !== a)
            {
                values.push(b);
                break;
            }
        }

        i += count;
    }
    console.log(values.join(', '));
    process.exit(0);
}

function analyze2()
{
    let values = [];

    let current= undefined;

    for(let i = 1n; ; i++)
    {
        let v = A(i);
        if (current === undefined || current.value !== v)
        {
            if (i >= 100000n)
                break;
            if (current)
                console.log(current);
            current = {value: v, index: i, end: i, count: 1};
            values.push(current);
        }
        else
        {
            current.count++;
            current.end = i;
        }
    }
    console.log(current);
    console.log('');
    process.exit(0);
}

// analyze1();
analyze2();

assert.equal(x(2n), 3n);
assert.equal(x(3n), 2n);
assert.equal(x(4n), 11n);

assert.equal(y(4n, 4n), 11n);
assert.equal(y(4n, 3n), MODULO - 9n);
assert.equal(y(4n, 2n), MODULO - 12n);

assert.equal(A(4n), 8);
assert.equal(A(10n), MODULO - 34n);

assert.equal(A(1000n), 101881n);

console.log('Tests passed');

const answer = timeLogger.wrap('', () => A(MAX, true));

console.log(`Answer is ${answer}`);