const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');
const polynomial = require('tools/polynomial');

require('tools/numberHelper');

const $MODULO = 1000000007;
const MAXIMUM = 1E12;

const MIN = (x, y) => x < y ? x : y;
const MAX = (x, y) => x > y ? x : y;

function initialize(useBigInt)
{
    if (useBigInt)
        return { bigInt: x => BigInt(x), ZERO: 0n, ONE: 1n, TWO: 2n, MODULO: undefined };
    else
        return { bigInt: x => x, ZERO: 0, ONE: 1, TWO: 2, MODULO: $MODULO };
}

const { bigInt, ZERO, ONE, TWO } = initialize(true);

let MODULO = bigInt($MODULO);

const FOUR = TWO+TWO;

class ColumnState
{
    constructor(left, value, count, blocks, reachedTop)
    {
        this.value      = value;
        this.left       = left || value; // left cannot be zero
        this.count      = count;
        this.blocks     = (blocks & ONE);
        this.reachedTop = reachedTop;
        this.key        = (this.value * FOUR) + 
                          (this.blocks ? TWO : ZERO) + 
                          (this.reachedTop ? ONE : ZERO);
    }

    get isValid()
    {
        if (! this.reachedTop)
            return false;

        return (this.blocks & ONE) === ZERO;
    }

    get total()
    { 
        return this.isValid ? this.count : ZERO; 
    }

    nextState(value, maxHeight)
    {        
        let newBlocks = value - this.value;
        if (newBlocks < ZERO)
            newBlocks = ZERO;

        const reachedTop = this.reachedTop || value >= maxHeight;

        return new ColumnState(this.left, value, this.count, this.blocks + newBlocks, reachedTop);
    }
}

class FakeMap
{
    constructor()
    {
        this.inner = [];
    }

    clear()
    {
        this.inner.fill(undefined);
    }

    set(key, value)
    {
        this.inner[key] = value;
    }

    get(key)
    {
        return this.inner[key];
    }

    forEach(callback)
    {
        for(const v of this.inner)
        {
            if (v !== undefined)
                callback(v);
        }
    }
}

class ColumnEngine
{
    constructor(width, height, useLeft)
    {
        this.useLeft = (useLeft !== false);
        this.width      = width;
        this.height     = height;
        this.states     = useLeft ? new Map() : new FakeMap();
        this.newStates  = useLeft ? new Map() : new FakeMap();
    }

    forEachStates(callback)
    {
        if (this.useLeft)
        {
            this.states.forEach(leftMap => {
                if (leftMap.size === undefined)
                    callback(leftMap);
                else
                    leftMap.forEach(state => callback(state));
            });
        }
        else
        {
            this.states.forEach(state => callback(state));
        }
    }

    addNewState(state)
    {
        let newStates = this.newStates;
        if (this.useLeft)
        {
            let newStates = this.newStates.get(state.left);
            if (! newStates)
            {
                newStates = new Map();
                this.newStates.set(state.left, newStates);
            }
        }

        const k = state.key;
        const o = newStates.get(k);

        if (o)
        {
            o.count = MODULO 
                ? (o.count + state.count) % MODULO
                : (o.count + state.count);
        }
        else
        {
            newStates.set(k, state);
        } 
    }

    runStep()
    {
        this.forEachStates(state => 
        {
            for(let value = ONE; value <= this.height; value++)
            {
                const s = state.nextState(value, this.height);

                this.addNewState(s);
            }
        });

        [this.states, this.newStates] = [this.newStates, this.states];
        this.newStates.clear();
    }

    get total()
    {
        let total = ZERO;

        this.forEachStates(s => {
            total = MODULO 
                ? (total + s.total) % MODULO
                : (total + s.total)
        });    

        return total;
    }

    get count()
    {
        let total = ZERO;
        this.forEachStates(s => {
            total = total + ((s.blocks & ONE) === ONE ? ZERO : s.count);
            if (MODULO)
                total %= MODULO; 
        });
        return total;
    }

    solve(trace)
    {
        this.states.set(0, new ColumnState(ZERO, ZERO, ONE, ZERO, false));

        const tracer = new Tracer(1, trace);
        for (let i = ONE; i <= this.width; i++)
        {
            tracer.print(_ => this.width-i);

            this.runStep();
        }

        tracer.clear();
    }

    quickMerge(trace)
    {
        const tracer = new Tracer(100, trace, "merging");
        let w = this.height * FOUR;
        let total = ZERO;
        this.forEachStates(leftState => 
        {
            w--;
            tracer.print(_ => w);

            this.forEachStates(rightState => 
            {
                if (leftState.reachedTop || rightState.reachedTop)
                {
                    let low   = MIN(leftState.value, rightState.value);
                    let blocks= (leftState.blocks + rightState.blocks + (low & ONE)) & ONE;

                    if (! blocks)
                    {
                        let count = MODULO 
                            ? leftState.count.modMul(rightState.count, MODULO)
                            : leftState.count * rightState.count;

                        total = MODULO 
                            ? (total + count) % MODULO
                            : total + count;
                    }
                }
            });
        });

        this.addNewState(new ColumnState(ONE, ONE, total, ZERO, true));

        [this.states, this.newStates] = [this.newStates, this.states];
        this.newStates.clear();
    }

    merge()
    {
        const lefts = [];
        this.forEachStates(state => {
            if (lefts[state.left] === undefined)
                lefts[state.left] = [state];
            else
                lefts[state.left].push(state);
        });

        this.forEachStates(leftState => {
            const rightStates = lefts[leftState.value];
            if (rightStates === undefined)
                throw "ERROR";

            for(const rightState of rightStates)
            {
                let count = MODULO 
                    ? leftState.count.modMul(rightState.count, MODULO)
                    : leftState.count * rightState.count;
                    
                let blocks= (leftState.blocks + rightState.blocks + (rightState.left & ONE)) & ONE;

                const newState = new ColumnState(leftState.left, 
                                                rightState.value, 
                                                count, blocks,
                                                leftState.reachedTop || rightState.reachedTop);

                this.addNewState(newState);
            }
        });

        [this.states, this.newStates] = [this.newStates, this.states];
        this.newStates.clear();
    }
}

function F(width, height, trace)
{
    width = bigInt(width);
    height= bigInt(height);

    const engine = new ColumnEngine(width, height, false);

    engine.solve(trace);

    return engine.count;
}

function F0(width, height, trace)
{
    width = bigInt(width);
    height= bigInt(height);

    let W = width;
    if ((width & ONE) === ZERO)
        width /= TWO;

    const engine = new ColumnEngine(width, height, false);

    engine.solve(trace);

    if (W !== width)
    {
        engine.quickMerge(trace);
    }

    return engine.total;
}

function findBestStart(max)
{
    function inner(start)
    {
        let value= start;

        while (value <= max)
        {
            const newValue = value+value-ONE;
            if (newValue > max)
                break;
            value = newValue;
        }

        return max - value;
    }

    let best = MIN(bigInt(3), max);
    let min = inner(best);

    const end = MIN(max, bigInt(20000000));

    for(let i = best+ONE; i < end; i++)
    {
        const v = inner(i);
        if (v < min)
        {
            min = v;
            best= i;
            if (min === ZERO)
                break;
        }
    }

    return best;
}

function F1(width, height, trace)
{
    width = bigInt(width);
    height = bigInt(height);

    function solve(width)
    {
        const start = findBestStart(width);

        const tracer = new Tracer(1, trace);
        tracer.prefix = `> ${start}`;
    
        let engine;

        if (start > bigInt(5))
        {
            if (start === ONE)
                start = bigInt(3);
            engine = solve(start);
        }
        else
        {
            engine = new ColumnEngine(start, height, true);
            engine.solve(trace);
        }
    
        tracer.prefix = 'merging states';
    
        let w = start;

        while (w+w-ONE <= width)
        {
            tracer.print(_ => width-w);
            engine.merge();
            w = w+w-ONE;
        }
    
        tracer.prefix = 'Finishing up';
    
        while (w++ < width)
        {
            tracer.print(_ => width-w);
            engine.runStep();
        }
    
        tracer.clear();

        return engine;
    }

    const engine = solve(width);

    return engine.total;
}

function F3(width, height, trace)
{
    width = bigInt(width);
    height= bigInt(height);

    function findPolynomial(start)
    {
        let values = [];
        let h = ZERO;

        h = start;

        const tracer = new Tracer(1, trace, 'populating values');

        while(h < bigInt(400))
        {
            tracer.print(_ => h);
            try
            {
                let power = polynomial.findPower(values, MODULO);
                if (power < h-ONE)
                {
                    try
                    {
                        tracer.clear();
                        tracer.prefix = 'Resolving polynomial';
                        return polynomial.solve(values, MODULO);
                    }
                    catch(error)
                    {
                        console.log(error);
                        throw error;
                    }
                    finally
                    {
                        tracer.clear();
                    }
                }
            }
            catch
            {

            }
            
            values.push(F(width, h))
            h += TWO;
        }

        throw "NO SOLUTION"
    }

    // disable MODULO
    MODULO = undefined;

    const pEven = findPolynomial(ZERO);
    const pOdd  = findPolynomial(ONE);

    // restore MODULO
    MODULO = bigInt($MODULO);

    let value;

    if ((height & ONE) === ONE)
    {
        let x = (height-ONE)/TWO;
        let t = pOdd.calculate(x, MODULO);
        let b = pEven.calculate(x, MODULO);

        value = t - b;
    }
    else
    {
        let x = height / TWO;
        let t = pEven.calculate(x, MODULO);
        let b = pOdd.calculate(x-1n, MODULO);

        value = t - b;
    }

    while (value < 0)
        value += MODULO;
    
    value = Number(value);
    return value;
}

assert.equal(F0(4, 2), 10);
assert.equal(timeLogger.wrap('13x10', _ => F3(13, 10)), 50584533);
assert.equal(timeLogger.wrap('10x13', _ => F3(10, 13)), 959702255);

console.log('Tests passed');

// F1(MAXIMUM, 100) = 364553235 ( 14 minutes )
// F0(10000, 10000) = 749784357 ( 20 hours 34 minutes )

const answer = timeLogger.wrap('100x1e12', _ => F3(100, MAXIMUM, true));

console.log(`Answer is ${ (answer + 364553235 + 749784357) % Number(MODULO) }`); 