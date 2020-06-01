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
        this.lastPos = undefined;
    }

    add(index)
    {
        if (this.first === undefined)
        {
            this.first = {start: index, end: index, next: undefined, previous: undefined};
            return;
        }

        let p = this.lastPos || this.first;

        while (true)
        {
            this.lastPos = p;

            if (index >= p.start && index <= p.end) // already in the list?
            {
                break;
            }
            else if (index === p.start-1)
            {
                p.start = index;
                if (p.previous && p.previous.end === index-1)
                {
                    p.previous.end = p.end;
                    p.previous.next = p.next;
                    if (p.next)
                        p.next.previous = p.previous;

                    this.lastPos = p.previous;
                }
                break;
            }
            else if (index < p.start)
            {
                if (! p.previous)
                {
                    throw "ERROR";
                }
                else if (index > p.previous.end+1)
                {
                    let x = { start:index, end: index, next: p, previous: p.previous };
                    if (p.previous)
                        p.previous.next = x;
                    p.previous = x;
                    break;
                }
                else
                {
                    p = p.previous;
                }
            }
            else if (index === p.end+1)
            {
                p.end = index;
                if (p.next && p.next.start === index+1)
                {
                    p.end = p.next.end;
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
                    let x = {start: index, end: index, next: undefined, previous: p};
                    p.next = x;
                    break;
                }
                else
                    p = p.next;
            }
            else
                throw "Invalid case";
        }
    }

    clone()
    {
        let p = this.first;
        let f = { ... p };
        let k = f;
        p = p.next;
        while (p)
        {
            let x = { ... p };
            x.previous = k;
            k.next     = x;
            k = x;
            p = p.next;
        }
        return f;
    }

    forEach(callback, clone) // callback(start, count)
    {        
        let p = clone === false ? this.first : this.clone();
        while (p)
        {
            callback(p.start, p.end);
            p = p.next;
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
        this.used  = new UsedIndex();
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
            if (this.array[i] === 0)
                this.used.add(i);
            this.array[i] |= mask;
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

    fill(start, count, step, mask, flag, callback)
    {
        callback = callback || (v => {});

        for(let i = start; i < this.max; i += step)
        {
            const alreadySet = this.get(i, mask);

            for(let j = 0; j < count; j++)
                this.set(i+j, mask | flag);

            if (! alreadySet)
                callback(i);
        }
    }

    sum()
    {
        let total1 = this.min.modMul(this.min-1, MODULO).modMul(DIVTWO, MODULO);  
        let total2 = this.max.modMul(this.max-1, MODULO).modMul(DIVTWO, MODULO); 
        let total3 = 0;

        this.used.forEach((start, end) => {
            start += this.min;
            end   += this.min;
            let t1 = start.modMul(start-1, MODULO).modMul(DIVTWO, MODULO);  
            let t2 = end.modMul(end+1, MODULO).modMul(DIVTWO, MODULO); 
            total1 += (t2-t1);
            total3 += end-start+1;
        }, false);

        let total = total2 - total1;
        while (total < 0)
            total += MODULO;

        this.free = this.size - total3;
        return total;
    }

    dump()
    {
        console.log(this.array.join(', '));
    }

    forEach(flag, callback) // callback(start, end)
    {
        this.used.forEach((start, end) => {
            if (start < 0 || start >= this.size)
                throw "ERROR";

            let v = this.array[start];
            if (v === 0)
                throw "ERROR";

            if ((v & flag) == flag)
            {
                start += this.min;
                end   += this.min;

                callback(start, end);
            }
        });
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

        values.forEach(previous, (start, end) => {
            let count= end-start+1;
            let posx = start + offsetX;
            let posy = start + offsetY;

            values.fill(posx, count, X, 1, current, v1 => {
                values.fill(v1, count, Z, 4, current);
                values.fill(v1, count, Y, 2, current);
            });

            values.fill(posy, count, Y, 2, current, v1 => {
                values.fill(v1, count, X, 1, current);
                values.fill(v1, count, Z, 4, current);
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

// const answer = timeLogger.wrap('G(5)', _ => G(5, true));
// console.log(`Answer is ${answer}`);