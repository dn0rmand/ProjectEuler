const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

require('tools/numberHelper');

const MODULO = 1000000007;
const DIVTWO = Number(2).modInv(MODULO);

class SieveArray
{
    constructor(min, size)
    {
        this.size = size;
        this.$min = min;
        this.$max = min + this.size;

        this.array = new Uint8Array(this.size);
        this.free  = this.size;
    }

    cloneArray()
    {
        return new Uint8Array(this.array);
    }

    set min(value)
    {
        this.$min = value; 
        this.$max = value + this.size;
    }

    get min()
    { 
        return this.$min;
    }

    get max()
    { 
        return this.$max; 
    }

    set(index)
    {
        const i = index - this.min;
        if (i >= 0 && i < this.size)
        {
            this.array[i] = 1;
        }
    }

    fill(start, step, callback)
    {
        callback = callback || (v => {});

        while (start < this.max)
        {
            this.set(start);
            callback(start);
            start += step;
        }
        return start;
    }

    sum()
    {
        this.free  = 0;
        let total  = 0;

        for(let i = 0; i < this.size; i++)
        {
            if (this.array[i] === 0)
            {
                this.free++;
                total += i;
                while (total >= MODULO) 
                    total -= MODULO;
            }
        }

        total = (total + this.free.modMul(this.min % MODULO, MODULO)) % MODULO;

        return total;
    }

    dump()
    {
        console.log(this.array.join(', '));
    }

    forEach(flag, callback)
    {
        for(let i = 0; i < this.size; i++)
        {
            const v = this.array[i];
            if (v !== 0 && (v & flag) == flag)
            {
                callback(i+this.min);
            }
        }
    }
}

function G(p, trace)
{
    const X = 17 ** p;
    const Y = 19 ** p;
    const Z = 23 ** p;

    const MIN = X+Y+Z;
    const SIZE= Z;

    let values = new SieveArray(MIN, SIZE);
    let total  = MIN.modMul(MIN-1,MODULO).modMul(DIVTWO, MODULO);

    const tracer = new Tracer(10, trace);

    let xContinue = new Set([MIN]);
    let yContinue = new Set([MIN]);
    let xs = new Set();
    let ys = new Set();

    values.set(MIN);

    while (true)
    {
        tracer.print(_ => values.free);

        xs.clear();
        ys.clear();

        for(let posx of xContinue)
        {
            xs.add(values.fill(posx, X, v1 => ys.add(values.fill(v1, Y))));
        }

        for(let posy of yContinue)
        {
            ys.add(values.fill(posy, Y, v1 => xs.add(values.fill(v1, X))));
        }

        [xContinue, xs, yContinue, ys] = [xs, xContinue, ys, yContinue];

        let s = values.sum();
        if (s === 0)
            break;

        total = (total + s) % MODULO;

        values.min += SIZE;
    }

    tracer.clear();

    return total;
}

assert.equal(G(1), 8253);
assert.equal(G(2), 60258000);
assert.equal(G(3), 299868284548 % MODULO);
assert.equal(timeLogger.wrap('G(4)', _ => G(4, true)), 859617967);
assert.equal(timeLogger.wrap('G(5)', _ => G(5, true)), 381641126);

console.log('Tests passed');

const answer = timeLogger.wrap('G(6)', _ => G(6, true));
console.log(`Answer is ${answer}`);