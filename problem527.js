const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');
const linearRecurrence = require('tools/linearRecurrence');

require('tools/bigintHelper');

const MAX = 1E10;

class Decimal
{
    simplify()
    {
        const g = this.numerator.gcd(this.divisor);

        if (g > 1)
        {
            this.numerator /= g; 
            this.divisor   /= g; 
        }
    }

    constructor(numerator, divisor)
    {
        this.numerator = numerator; 
        this.divisor   = divisor;
    }

    valueOf()
    {
        return this.numerator.divise(this.divisor, 10);
        // return Number(this.numerator) / Number(this.divisor);
    }

    add(decimal)
    {
        this.numerator = this.numerator * decimal.divisor + decimal.numerator * this.divisor;
        this.divisor   = this.divisor * decimal.divisor;

        // this.simplify();

        return this;
    }

    multiply(decimal)
    {
        this.numerator = this.numerator * decimal.numerator;
        this.divisor   = this.divisor   * decimal.divisor;

        this.simplify();

        return this;
    }

    divise(decimal)
    {
        this.numerator = this.numerator * decimal.divisor;
        this.divisor   = this.divisor   * decimal.numerator;

        this.simplify();

        return this;
    }
}

const $memoize = {};

function $bruteR(n)
{
    function search(t, l, h)
    {
        let key = `${l}-${h}-${t}`;
        let expected = $memoize[key];
        if (expected)
        {            
            expected = new Decimal(expected.numerator, expected.divisor);
            return expected;
        }

        let count = BigInt(h-l+1);
        let total = new Decimal(count, 1n);

        for(let i = l; i <= h; i++)
        {
            if (i < t)
            {
                total = total.add(search(t, i+1, h));
            }
            else if (i > t)
            {
                total = total.add(search(t, l, i-1));
            }
        }

        total = total.divise(new Decimal(count, 1n));

        if (expected)
        {
            assert.equal(total.numerator, expected.numerator);
            assert.equal(total.divisor, expected.divisor);
        }

        $memoize[key] = total;
        return total;
    }

    let total = new Decimal(0n, 1n);

    for(let t = 1; t <= n; t++)
    {
        total = total.add(search(t, 1, n));
    }

    total = total.divise(new Decimal(BigInt(n), 1n));

    return total;
}

function bruteR(n)
{
    const total = $bruteR(n);
    console.log(total.numerator, '/', total.divisor);
    return total.valueOf();
}

function bruteB(n)
{
    function search(t)
    {
        let L = 1;
        let H = n;
        let guesses = 1;
        let c = Math.floor((L+H) / 2);

        while(c !== t)
        {
            guesses++;
            if (c < t)
                L = c+1;
            else
                H = c-1;
            c = Math.floor((L+H)/2);
        }

        return guesses;
    }

    let total = 0;

    for(let t = 1; t <= n; t++)
    {
        total += search(t);
    }

    return (total / n);
}

function B(max)
{
    let offset = 2;
    let count  = 2;
    let start  = 1;
    let n      = 1;

    let c = count;
    while(n < max)
    {
        if ((n + count) <= max)
        {
            start += offset * count;
            n     += count;

            offset++;
            count *= 2;
            c = count;
        }
        else
        {
            // finish up

            let o = max-n;
            start += offset*o;
            n += o;
            c -= o;
        }
    }

    return (start / n);
}

// console.log('R(10) =', bruteR(10));
// console.log('R(100) =', bruteR(100));

assert.equal(bruteB(6).toFixed(8), '2.33333333');
assert.equal(bruteR(6).toFixed(8), '2.71666667');

assert.equal(B(1000), bruteB(1000));

console.log('Tests passed');

function analyze()
{
    const tracer = new Tracer(1, true);
    const max = 50;

    let values  = [1n];
    let divisor = 1n;

    for(let i = 2; i <= max; i++)
    {
        tracer.print(_ => max+1-i);

        let t = $bruteR(i);
        let l = divisor.lcm(t.divisor);
        let p = l / divisor;
        for(let j = 0; j < values.length; j++)
            values[j] *= p;
        values.push(t.numerator * (l / t.divisor));
        divisor = l;
    }
    let g = divisor;
    for(let v of values)
    {
        g = g.gcd(v);
    }
    tracer.clear();
    const l = linearRecurrence(values);
}

analyze();

const b = timeLogger.wrap('', _ => B(MAX));
console.log(`Answer is ${b}`);
