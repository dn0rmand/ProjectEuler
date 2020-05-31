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
        // this.used = new Set();
        // this.unused = new Set();
        // for(let i = 0; i < size; i++)
        //     this.unused.add(i);
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

    set(index, mask)
    {
        const i = index - this.min;
        if (i >= 0 && i < this.size)
        {
            this.array[i] |= mask;
            // this.used.add(i);
            // this.unused.delete(i);
        }
    }

    get(index, mask)
    {
        mask = mask || 7;
        const i = index - this.min;
        if (i >= 0 && i < this.size)
            return (this.array[i] & mask);
        else
            return 0;
    }

    fill(start, step, mask, callback)
    {
        callback = callback || (v => {});

        for(let i = start; i < this.max; i += step)
        {
            if (this.get(i, mask))
                continue;

            this.set(i, mask);
            callback(i);
        }
    }

    sum()
    {
        let total = 0;
        let free  = 0;
        
        total = this.array.reduce((a, v, i) => {
            if (! v)
            {
                free++;
                a = (a + i + this.$min) % MODULO;
            }
            return a;
        }, 0);

        this.free = free;
        return total;
    }

    dump()
    {
        console.log(this.array.join(', '));
    }

    *indexes()
    {
        const idxes = [...this.used];
        for(const i of idxes)
            yield i + this.min;
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
    values.set(MIN, 7);
    let total  = MIN.modMul(MIN-1,MODULO).modMul(DIVTWO, MODULO);

    const tracer = new Tracer(10, trace);
    while (true)
    {
        tracer.print(_ => values.free);

        const old = values.cloneArray();

        for(let i = 0; i < SIZE; i++)
        {
            if (old[i] === 0)
                continue;

            let posx = i + values.min;
            let posy = posx;
            let posz = posx;

            if (values.min > MIN)
            {
                posx = posx - Z + X;
                posy = posy - Z + Y;
            }

            values.fill(posx, X, 1, v1 => {
                values.fill(v1, Z, 4);//, v2 => values.fill(v2, Y, 2));
                values.fill(v1, Y, 2);//, v2 => values.fill(v2, Z, 4));
            });

            values.fill(posy, Y, 2, v1 => {
                values.fill(v1, X, 1);//, v2 => values.fill(v2, Z, 4));
                values.fill(v1, Z, 4);//, v2 => values.fill(v2, X, 1));
            });

            // values.fill(posz, Z, 4, v1 => {
            //     values.fill(v1, X, 1);//, v2 => values.fill(v2, Y, 2));
            //     values.fill(v1, Y, 2);//, v2 => values.fill(v2, X, 1));
            // });
        }

        // values.dump();

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

console.log('Tests passed');

const answer = timeLogger.wrap('G(5)', _ => G(5, true));
console.log(`Answer is ${answer}`);