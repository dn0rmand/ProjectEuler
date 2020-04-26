const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const BLANK = '⬜️';
const BRICK = '🟩';
const BAD   = '🟥';

const $MODULO = 1000000007;

const DEBUG = 0;
const DUMP  = 0;
const DUMP_INVALID = 0;

function initialize(useBigInt)
{
    if (useBigInt)
        return { bigInt: x => BigInt(x), ZERO: 0n, ONE: 1n, TWO: 2n, MODULO: BigInt($MODULO)};
    else
        return { bigInt: x => x, ZERO: 0, ONE: 1, TWO: 2, MODULO: $MODULO };
}

const { bigInt, ZERO, ONE, TWO, MODULO } = initialize(false);

//#region ABSTRACT CLASSES

class State
{
    static nextKey = 0;

    constructor(value, count, blocks, previous)
    {
        this.value  = value;
        this.count  = count;
        this.blocks = (blocks & ONE);

        if (DEBUG)
        {            
            this.$key     = ++State.nextKey;
            this.previous = previous;
        }
        else
        {
            this.$key = (this.value * TWO) + (this.blocks & ONE); 
        }
    }

    get key()
    { 
        return this.$key;
    }

    get isValid() { return (this.blocks & ONE) === ZERO; }
    get total()   { return this.isValid ? this.count : ZERO; }


    nextState(value, maxHeight) { throw "Need implementation";; }

    draw(buffer, x, y)
    {
        throw "Need implementation";
    }

    dump(width, height)
    {
        if (DEBUG && DUMP)
        {
            if (! this.isValid && ! DUMP_INVALID)
                return;

            const brick = this.isValid ? BRICK : BAD;
            const buffer = new Array(height);
            for(let i = 0; i < width; i++)
                buffer[i] = new Array(width).fill(0);

            this.draw(buffer, width, height);

            for(let y = height-1; y >= 0; y--)
            {
                let s = '';
                for(let x = 0; x < width; x++)
                {
                    s += buffer[y][x] ? brick : BLANK;
                }
                console.log(s);
            }

            console.log('');
        }
    }
}

class Engine
{
    constructor(width, height)
    {
        this.width  = width;
        this.height = height;
    }

    solve()
    {
        let states     = new Map();
        let newStates  = new Map();

        states.set('XX', this.createFirstState());

        this.outerLoop(_ => {
            states.forEach(state => this.innerLoop(state, value => {
                let s = state.nextState(value, this.height);
                if (s !== undefined)
                {
                    let k = s.key;
                    let o = newStates.get(k);
                    if (o)
                    {
                        // if (o.blocks !== s.blocks)
                        //     throw "ERROR";

                        o.count = (o.count + s.count) % MODULO;
                    }
                    else
                        newStates.set(k, s);
                }
            }));

            [states, newStates] = [newStates, states];
            newStates.clear();
        });

        let total = ZERO;

        states.forEach(s => {
            s.dump(this.width, this.height);
            total = (total + s.total) % MODULO;
        });    

        return total;
    }

    createFirstState()
    {
        throw "Need implementation";
    }

    outerLoop(callback)
    {
        throw "Need implementation";
    }

    innerLoop(state, callback)
    {
        throw "Need implementation";
    }
}

//#endregion

//#region IMPLEMENTATION for COLUMN per COLUMN calculation

class ColumnState extends State
{
    constructor(value, count, blocks, previous)
    {
        super(value, count, blocks, previous);

        this.reachedTop = false;
    }

    get isValid()
    {
        if (! this.reachedTop)
            return false;

        return super.isValid;
    }

    get key()
    {
        const k = super.key;

        return (k*TWO) + (this.reachedTop ? 1 : 0);
    }

    nextState(value, maxHeight)
    {        
        let newBlocks = value - this.value;
        if (newBlocks < ZERO)
            newBlocks = ZERO;

        let s = new ColumnState(value, this.count, this.blocks + newBlocks, this);

        s.reachedTop = this.reachedTop || s.value >= maxHeight;

        return s;
    }

    draw(buffer, x, h)
    {
        for(let y = ZERO; y < this.value; y++)
        {
            buffer[y][x-1] = 1;
        }
        if (this.previous)
            this.previous.draw(buffer, x-1, h);
    }
}

class ColumnEngine extends Engine
{
    constructor(width, height)
    {
        super(width, height);
    }

    createFirstState()
    {
        return new ColumnState(ZERO, ONE, ZERO)
    }

    outerLoop(callback)
    {
        for (let w = 1; w <= this.width; w++)
            callback(w);
    }

    innerLoop(_, callback)
    {
        for(let value = ONE; value <= this.height; value++)
        {
            callback(value);
        }
    }
}

//#endregion

//#region IMPLEMENTATION for ROW per ROW calculation

class RowState extends State
{
    static countBlocks(value)
    {
        let blocks = ZERO;
        while (value > 0)
        {
            if ((value & ONE) === ONE)
            {
                blocks++;
                while ((value & ONE) === ONE)
                {
                    value = (value - ONE) / TWO;
                }
            }
            else
                value /= TWO;
        }

        return blocks;
    }

    constructor(value, count, blocks, previous)
    {
        super(value, count, blocks, previous);
    }   
    
    nextState(value, maxHeight)
    {
        if ((this.value & value) !== value)
            return undefined; // cannot do that!

        let blocks = RowState.countBlocks(value) + this.blocks;

        return new RowState(value, this.count, blocks, this);
    }

    min()
    {
        if (this.value === ZERO)
            return ONE;
        let v = ONE;
        while ((v & this.value) === ZERO)
        {
            v *= TWO;
        }
        return v;
    }

    max()
    {
        return this.value+ONE;
    }

    draw(buffer, w, y)
    {
        let row = this.value.toString(2).padStart(w, '0').split('').map(a => +a);

        for(let i = 0; i < w; i++)
            buffer[y-1][i] = row[i] || 0;

        if (this.previous)
            this.previous.draw(buffer, w, y-1);
    }
}

class RowEngine extends Engine
{
    constructor(width, height)
    {
        super(width, height);
        this.MAX_VALUE = TWO ** bigInt(width);
    }

    get isValid()
    {
        return this.value != 0 && super.isValid;
    }

    createFirstState()
    {
        return new RowState(this.MAX_VALUE-ONE, ONE, ONE)
    }

    outerLoop(callback)
    {
        for(let h = 2; h <= this.height; h++)
            callback(h);
    }

    innerLoop(state, callback)
    {
        let max = state.max();
        let min = state.min();

        // callback(ZERO);

        for(let value = min; value < max; value++)
        {
            callback(value);
        }
    }
}

//#endregion

function F(width, height, perRow)
{
    let engine ;

    if (perRow === true)
        engine = new RowEngine(width, height);
    else    
        engine = new ColumnEngine(width, height);

    let total = engine.solve();

    return total;
}

console.log('Row per Row');
assert.equal(F(4, 2, true), 10);
assert.equal(timeLogger.wrap('13x10', _ => F(13, 10, true)), 50584533);
assert.equal(timeLogger.wrap('10x13', _ => F(10, 13, true)), 959702255);

console.log('');
console.log('Column per Column');
assert.equal(F(4, 2, false), 10);
assert.equal(timeLogger.wrap('13x10', _ => F(13, 10, false)), 50584533);
assert.equal(timeLogger.wrap('10x13', _ => F(10, 13, false)), 959702255);

console.log('Tests passed');
