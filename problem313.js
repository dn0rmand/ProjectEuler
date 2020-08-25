const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const MAX = 1E6;

const primeHelper = require('tools/primeHelper')(MAX);

const squarePrimes = timeLogger.wrap('Square Primes', _ => {
    const squares = new Set();

    for(const p of primeHelper.allPrimes())
    {
        const pp = p*p;
        if (pp > Number.MAX_SAFE_INTEGER)
            throw "ERROR";
        squares.add(pp);
    }
    return squares;
});

const specialPrimes = timeLogger.wrap('Special primes', _ => {
    const squares = [];
    for(let p of squarePrimes)
    {
        if (p % 6 === 1)
            squares.push(p);
    }
    return squares;
});

class State
{
    static RED = 2;

    constructor(w, h, data)
    {
        this.width = w;
        this.height= h;    
        this.x     = w-1;
        this.y     = h-1; 
        this.data  = data ? Uint8Array.from(data) : new Uint8Array(w*h);

        if (!data)
        {
            this.data.fill(1);
            this.set(0, 0, State.RED); // red
            this.set(w-1, h-1, 0); //empty 
        }
        this.$key = undefined;
    }

    clone()
    {
        const n = new State(this.width, this.height, this.data);

        n.x = this.x;
        n.y = this.y;
        return n;
    }

    get(x, y)
    {
        if (x >= 0 && x < this.width && this.y >= 0 && y < this.height)
        {
            return this.data[y*this.width + x];
        }
        else
        {
            throw "Out of Range";
        }
    }

    set(x, y, value)
    {
        if (x >= 0 && x < this.width && this.y >= 0 && y < this.height)
        {
            this.data[y*this.width + x] = value;
            this.$key = undefined;
        }
        else
        {
            throw "Out of Range";
        }
    }

    get key()
    {
        if (this.$key === undefined)
            this.$key = this.data.reduce((a, v) => a*4n + BigInt(v), 0n);

        return this.$key;
    } 

    get done()
    {
        return this.get(this.width-1, this.height-1) === State.RED;
    }

    move(ox, oy)
    {
        ox = this.x + ox;
        oy = this.y + oy;

        if (oy < 0 || ox < 0 || oy >= this.height || ox >= this.width)
            return undefined;
        
        var clone = this.clone();
        var o = clone.get(ox, oy);
        clone.set(ox, oy, 0);
        clone.set(this.x, this.y, o);

        clone.x = ox;
        clone.y = oy;
        return clone;
    }
}

function S(m, n)
{
    const start = new State(m, n);

    let steps = 0;

    let states    = [start];
    let visited   = new Set();
    
    visited.add(start.key);

    let finished = false;
    while(! finished)
    {
        if (states.length === 0)
            return 0;

        const newStates = [];
        steps++;

        for(const state of states)
        {
            const action = (ox, oy) => {
                const n = state.move(ox, oy);
                if (!n)
                    return;
                if (visited.has(n.key))
                    return;
                visited.add(n.key);
                newStates.push(n);
                finished |= n.done;
            }

            action(0, 1);
            action(0, -1);
            action(1, 0);
            action(-1, 0);
            
            if (finished)
                break;
        }

        states = newStates;
    }

    return steps;
}

function solve(max, trace)
{
    max = max * max;

    function findIndex(value, maxIndex)
    {
        let max = maxIndex || specialPrimes.length-1;
        let min = 0;
        let middle = Math.floor((min+max)/2);
        while (min < max)
        {
            let v = specialPrimes[middle];
            if (value < v)
                max = middle-1;
            else if (value > v)
                min = middle+1;
            else
                return middle;

            middle = Math.floor((min+max)/2);
        }
        if (maxIndex)
        {
            while (specialPrimes[middle] < value)
                middle++;
        }
        return middle;
    }

    const specials = specialPrimes.reduce((a, p) => {
        if (p < max)
            a.push(p);
        return a;
    }, []);

    let total1 = 0;
    let total2 = 0;

    const tracer   = new Tracer(5000000, trace);
    const maxIndex = specials.length-1

    // count prime of the form 8*n+5 and (8*n+5+4)
    for(let p of squarePrimes)
    {
        if (p >= max)
            break;

        if ((p+3) % 8 === 0)
            total1++;
        if ((p+7) % 8 === 0)
            total2++;
    }

    // count special primes ( % 6 = 1 )
    let previous = 0;

    for(let i = 0; i < specials.length; i++)
    {
        let p = specials[i];
        if (p >= max)
            break;

        let x = p-6-4-5;
        if (x % 8 === 0)
        {
            let v = 0;
            while(x > previous)
            {
                v++;
                x -= 8;
            }
            let c = specials.length-i;
            total2 += c*v;
        }
        previous = p;
    }

    let total = total1 + (2 * total2);
    return total;
}

function solve1(max, trace)
{
    max = max * max;

    function findIndex(value, maxIndex)
    {
        let max = maxIndex || specialPrimes.length-1;
        let min = 0;
        let middle = Math.floor((min+max)/2);
        while (min < max)
        {
            let v = specialPrimes[middle];
            if (value < v)
                max = middle-1;
            else if (value > v)
                min = middle+1;
            else
                return middle;

            middle = Math.floor((min+max)/2);
        }
        if (maxIndex)
        {
            while (specialPrimes[middle] < value)
                middle++;
        }
        return middle;
    }

    const specials = specialPrimes.reduce((a, p) => {
        if (p < max)
            a.push(p);
        return a;
    }, []);

    let total1 = 0;
    let total2 = 0;

    const tracer   = new Tracer(5000000, trace);
    const maxIndex = specials.length-1

    for(let m = 9; m < max; m += 8)
    {
        let count = m;

        tracer.print(_ => max - count);

        if (squarePrimes.has(count))
            total2++;

        if (count % 6 !== 1)
            continue;

        let idx = findIndex(count + 6, maxIndex);
        if (idx <= maxIndex)
            total2 += maxIndex-idx+1;
    }

    tracer.clear();

    const total = total1 + 2*total2;
    return total;
}

assert.equal(S(2, 2), 5);
assert.equal(S(5, 4), 25);

assert.equal(solve(100), 5482);

console.log("Tests passed");

const answer = timeLogger.wrap('', _ => solve(MAX, true));
console.log(`Answer is ${answer}`);
console.log('Should be 2057774861813004');