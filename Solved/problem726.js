const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

require('tools/bigintHelper');

const MODULO = 1000000033n;
const MAX = 1E4;
const MAX_BOTTLES = 50005000; // Because of MAX 1e4

`
1
3 1
5 3 1
7 5 3 1 => 7 = n*2 + 1
`

const factorial = timeLogger.wrap('Pre-loading Factorial', _ => {
    const $factorial = new BigUint64Array(MAX_BOTTLES+1);

    let value = 1n;

    $factorial[0] = $factorial[1] = 1n;

    const tracer = new Tracer(1000, true);
    for(let i = 2; i <= MAX_BOTTLES; i++) 
    {
        tracer.print(_ => MAX_BOTTLES - i);
        value = (value * BigInt(i)) % MODULO;
        $factorial[i] = value;
    }
    tracer.clear();

    return $factorial;
});

const TWO_POWERS = timeLogger.wrap('Loading powers of 2', () => {
    const values = new BigUint64Array(MAX+1);

    values[0] = 0n;
    values[1] = 1n;

    let value = 2n;

    for(let height = 2n; height <= MAX; height++) {
        value = (value*2n) % MODULO;

        values[height] = value - 1n;
    }

    return values;
});

function f(n)
{
    let total   = 1n;
    let bottles = 0n;
    let divisor = 1n;

    for(let height = BigInt(n), items = 1n; height > 0n; height--, items++) 
    {
        bottles += items;

        if (height > 1n)
        {
            // part 1
            let value = TWO_POWERS[height].modPow(items, MODULO);

            total = (total * value) % MODULO;

            // part 2
            divisor = (divisor * (height+height-1n).modPow(items, MODULO)) % MODULO;
        }
    }

    const div = divisor.modInv(MODULO);
    const multiplier = (factorial[Number(bottles)] * div) % MODULO;

    total = (total * multiplier) % MODULO;

    return total;
}

function S(n, trace)
{
    let total = 0n;

    const tracer = new Tracer(1, trace);
    
    for(let i = n; i >= 1; i--)
    {
        tracer.print(_ => i);
        total = (total + f(i)) % MODULO;
    }
    tracer.clear();
    return total;
}

assert.strictEqual(f(1), 1n);
assert.strictEqual(f(2), 6n);
assert.strictEqual(f(3), 1008n);

assert.strictEqual(f(4), 15240960n);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => S(MAX, true));

console.log(`Answer is ${answer}`);