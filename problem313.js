const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const MAX = 1E6;

const primeHelper = require('tools/primeHelper')(MAX);

const squarePrimes = timeLogger.wrap('initialization', () => {
    const squares = []

    for(const p of primeHelper.allPrimes())
    {
        const pp = p*p;
        if (pp % 6 === 1)
            squares.push(pp);
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
        let max = maxIndex || squarePrimes.length-1;
        let min = 0;
        let middle = Math.floor((min+max)/2);
        while (min < max)
        {
            let v = squarePrimes[middle];
            if (value < v)
                max = middle-1;
            else if (value > v)
                min = middle+1;
            else
                return middle;

            middle = Math.floor((min+max)/2);
        }
        if (maxIndex)
            while (squarePrimes[middle] < value)
                middle++;
        return middle;
    }

    const isPrime = c => {
        c = Math.sqrt(c);
        if (Math.floor(c) === c && primeHelper.isKnownPrime(c))
            return true;

        return false;
    }

    let total1 = 0;
    let total2 = 0;

    const tracer   = new Tracer(10000, trace);
    const maxIndex = findIndex(max)-1;

    for(let m = 0; ; m++)
    {
        let count = 8*m + 5;
        if (count >= max)
            break;

        tracer.print(_ => max - count);

        if (isPrime(count))
            total1++;

        count += 4;
        if (isPrime(count))
            total1 += 2;

        count += 6;
        if (count % 6 !== 1)
            continue;

        let idx = findIndex(count, maxIndex);
        if (idx <= maxIndex)
            total2 += Math.max(0, maxIndex-idx+1);
    }

    tracer.clear();

    const total = total1 + 2*total2;
    return total;
}

assert.equal(S(2, 2), 5);
assert.equal(S(5, 4), 25);

assert.equal(solve(100), 5482);

console.log("Tests passed");

const answer = solve(MAX, true);
console.log(`Answer is ${answer}`);