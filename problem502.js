const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

require('tools/numberHelper');

const $MODULO = 1000000007;
const MAX     = 1E12;

function initialize(useBigInt)
{
    if (useBigInt)
        return { bigInt: x => BigInt(x), ZERO: 0n, ONE: 1n, TWO: 2n, MODULO: BigInt($MODULO)};
    else
        return { bigInt: x => x, ZERO: 0, ONE: 1, TWO: 2, MODULO: $MODULO };
}

const { bigInt, ZERO, ONE, TWO, MODULO } = initialize(false);
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

class ColumnEngine
{
    constructor(width, height, useLeft)
    {
        this.useLeft = (useLeft !== false);
        this.width      = width;
        this.height     = height;
        this.states     = new Map();
        this.newStates  = new Map();
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
            this.states.forEach(state => callback(state));
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
            o.count = (o.count + state.count) % MODULO;
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
            total = (total + s.total) % MODULO;
        });    

        return total;
    }

    solve(trace)
    {
        this.states.set('XX', new ColumnState(ZERO, ZERO, ONE, ZERO, false));

        const tracer = new Tracer(1, trace);
        for (let i = 1; i <= this.width; i++)
        {
            tracer.print(_ => this.width-i);

            this.runStep();
        }

        tracer.clear();

        return this.total;
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
                let count = leftState.count.modMul(rightState.count, MODULO);
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

function F0(width, height, trace)
{
    const engine = new ColumnEngine(width, height, false);

    return engine.solve(trace);
}

function findBestStart(max)
{
    function inner(start)
    {
        let value= start;

        while (value <= max)
        {
            const newValue = value+value-1;
            if (newValue > max)
                break;
            value = newValue;
        }

        return max - value;
    }

    let best = Math.min(3, max);
    let min = inner(best);

    const end = Math.min(max, 20000000);

    for(let i = best+1; i < end; i++)
    {
        const v = inner(i);
        if (v < min)
        {
            min = v;
            best= i;
            if (min === 0)
                break;
        }
    }

    return best;
}

function F1(width, height, trace)
{
    function solve(width)
    {
        const start = findBestStart(width);

        const tracer = new Tracer(1, trace);
        tracer.prefix = `> ${start}`;
    
        let engine;

        if (start > 5)
        {
            if (start === 1)
                start = 3;
            engine = solve(start);
        }
        else
        {
            engine = new ColumnEngine(start, height, true);
            engine.solve(trace);
        }
    
        tracer.prefix = 'merging states';
    
        let w = start;

        while (w+w-1 <= width)
        {
            tracer.print(_ => width-w);
            engine.merge();
            w = w+w-1;
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


assert.equal(F0(4, 2), 10);
assert.equal(timeLogger.wrap('13x10', _ => F0(13, 10)), 50584533);
assert.equal(timeLogger.wrap('10x13', _ => F0(10, 13)), 959702255);

console.log('Tests passed');

//console.log(timeLogger.wrap('1E12x100', _ => F1(MAX, 100, true)));

// F(MAX, 100) = 364553235 ( 14 minutes )

console.log(timeLogger.wrap('10000x10000', _ => F0(10000, 10000, true)));