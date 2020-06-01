const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

require('tools/numberHelper');

const MODULO = 1000000007;
const DIVTWO = Number(2).modInv(MODULO);

class UsedIndex
{
    constructor()
    {
        this.first = undefined;
    }

    add(index)
    {
        if (this.first === undefined)
        {
            this.first = {start: index, end: index, next: undefined, previous: undefined};
            return;
        }

        let p = this.first;
        while (true)
        {
            if (index === p.start-1)
            {
                p.start = index;
                if (p.previous && p.previous.end === index-1)
                {
                    p.previous.next = p.next;
                    if (p.next)
                        p.next.previous = p.previous;
                }
                break;
            }
            else if (index < p.start)
            {
                let x = { start:index, end: index, next: p, previous: p.previous};
                p.previous = x;
                break;
            }
            else if (index === p.end+1)
            {
                p.end = index;
                if (p.next && p.next.start === index+1)
                {
                    p.next = p.next.next;
                    if (p.next)
                        p.next.previous = p;
                }
                break;
            }
            else if (index > p.end)
            {
                if (p.next === undefined)
                {
                    let x = {start: index, end: index, next = undefined, previous = p};
                    p.next = x;
                    break;
                }
                else
                    p = p.next;
            }
        }
    }
}

class SieveArray
{
    constructor(min, size)
    {
        this.size = size;
        this.$min = min;
        this.$max = min + this.size;

        this.array = new Uint8Array(this.size);
        this.free  = this.size;
        this.used = new Set();
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
            this.used.add(i);
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

    fill(start, step, mask, flag, callback)
    {
        callback = callback || (v => {});

        for(let i = start; i < this.max; i += step)
        {
            if (this.get(i, mask))
                continue;

            this.set(i, mask | flag);
            callback(i);
        }
    }

    sum()
    {
        let total1 = this.min.modMul(this.min-1, MODULO).modMul(DIVTWO, MODULO);  
        let total2 = this.max.modMul(this.max-1, MODULO).modMul(DIVTWO, MODULO); 

        this.forEach(0, i => {
            total1++;
        });

        let total = total2 - total1;
        while (total < 0)
            total += MODULO;

        this.free = this.size - this.used.size;
        return total;
    }

    dump()
    {
        console.log(this.array.join(', '));
    }

    forEach(flag, callback)
    {
        for(const i of this.used)
        {
            const v = this.array[i];
            if (v !== 0 && (v & flag) == flag)
                callback(i + this.min);
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
    let previous = 8;

    values.set(MIN, 7 | previous);

    while (true)
    {
        tracer.print(_ => values.free);

        const current = previous ^ 24;

        const offsetX = values.min > MIN ? X - Z : 0;
        const offsetY = values.min > MIN ? Y - Z : 0;

        values.forEach(previous, (i) => {
            let posx = i + offsetX;
            let posy = i + offsetY;

            values.fill(posx, X, 1, current, v1 => {
                values.fill(v1, Z, 4, current);
                values.fill(v1, Y, 2, current);
            });

            values.fill(posy, Y, 2, current, v1 => {
                values.fill(v1, X, 1, current);
                values.fill(v1, Z, 4, current);
            });
        });

        previous = current;

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