const assert = require('assert');
const { State, StateMachine } = require('tools/stateMachine');

const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const example = [
    ['p1', '?1', '$',  0 ],
    ['?1', '$',  '$',  0 ],
    ['$' , '$',  '$', '$'],
];

const problem = [
    [ 0 , 'p1', '?1', '?2', 'p3', '?3'], 
    [ 0 , '?1', '?2', 'd2', '?3', 'v4'],
    ['$', '$' , 'o7', '?7', 'v6', '?4'],
    ['$', '$' , '?7', '?7', '?6', '?5'],
    ['$', '$' , 'h8', '?8', '?5', 'd5']
];

class Block
{
    constructor(state, x, y, c) 
    {
        this.state = state;
        this.c     = c;
        this.c2    = c.length > 1 ? `?${this.c[1]}` : '?' ;
        this.x     = x;
        this.y     = y;
    }

    clone()   { return this.state.clone(); }
    get(x, y) { return this.state.get(x, y); }

    move(callback) 
    {
        const process = s => { if (s) { callback(s); } };

        process(this.up());
        process(this.down());
        process(this.left());
        process(this.right());
    }

    up()
    {
        if (this.get(this.x, this.y-1) === 0) {
            const newState = this.clone();

            newState.set(this.x, this.y, 0);
            newState.set(this.x, this.y-1, this.c);

            return newState;
        }
    }

    down()  
    {
        if (this.get(this.x, this.y+1) === 0) {
            const newState = this.clone();

            newState.set(this.x, this.y, 0);
            newState.set(this.x, this.y+1, this.c);

            return newState;
        }
    }

    left()  
    {
        if (this.get(this.x-1, this.y) === 0) {
            const newState = this.clone();

            newState.set(this.x, this.y, 0);
            newState.set(this.x-1, this.y, this.c);

            return newState;
        }
    }

    right() 
    {
        if (this.get(this.x+1, this.y) === 0) {
            const newState = this.clone();

            newState.set(this.x, this.y, 0);
            newState.set(this.x+1, this.y, this.c);

            return newState;
        }
    }
}

class hBlock extends Block
{
    constructor(state, x, y, c) 
    {
        super(state, x, y, c);
    }
    
    up() 
    {
        if (this.get(this.x, this.y-1) === 0 && 
            this.get(this.x+1, this.y-1) === 0) {
            const newState = this.clone(this);

            newState.set(this.x, this.y-1, this.c);
            newState.set(this.x+1, this.y-1, this.c2);
            newState.set(this.x, this.y, 0);
            newState.set(this.x+1, this.y, 0);

            return newState;
        }
    }

    down() 
    {
        if (this.get(this.x, this.y+1) === 0 && this.get(this.x+1, this.y+1) === 0) {
            const newState = this.clone(this);

            newState.set(this.x, this.y+1, this.c);
            newState.set(this.x+1, this.y+1, this.c2);
            newState.set(this.x, this.y, 0);
            newState.set(this.x+1, this.y, 0);

            return newState;
        }
    }

    left() 
    {
        if (this.get(this.x-1, this.y) === 0) {
            const newState = this.clone(this);

            newState.set(this.x-1, this.y, this.c);
            newState.set(this.x  , this.y, this.c2);
            newState.set(this.x+1, this.y, 0);

            return newState;
        }
    }

    right() 
    {
        if (this.get(this.x+2, this.y) === 0) {
            const newState = this.clone(this);

            newState.set(this.x,   this.y, 0);
            newState.set(this.x+1, this.y, this.c);
            newState.set(this.x+2, this.y, this.c2);

            return newState;
        }
    }    
}

class vBlock extends Block
{
    constructor(state, x, y, c) 
    {
        super(state, x, y, c);
    }
    
    up() 
    {
        if (this.get(this.x, this.y-1) === 0) {
            const newState = this.clone(this);

            newState.set(this.x, this.y-1, this.c);
            newState.set(this.x, this.y, this.c2);
            newState.set(this.x, this.y+1, 0);

            return newState;
        }
    }

    down() 
    {
        if (this.get(this.x, this.y+2)=== 0) {
            const newState = this.clone(this);

            newState.set(this.x, this.y, 0);
            newState.set(this.x, this.y+1, this.c);
            newState.set(this.x, this.y+2, this.c2);

            return newState;
        }
    }

    left() 
    {
        if (this.get(this.x-1, this.y) === 0 && this.get(this.x-1, this.y+1) === 0) {
            const newState = this.clone(this);

            newState.set(this.x, this.y, 0);
            newState.set(this.x, this.y+1, 0);
            newState.set(this.x-1, this.y, this.c);
            newState.set(this.x-1, this.y+1, this.c2);

            return newState;
        }
    }

    right() 
    {
        if (this.get(this.x+1, this.y) === 0 && this.get(this.x+1, this.y+1) === 0) {
            const newState = this.clone(this);

            newState.set(this.x, this.y, 0);
            newState.set(this.x, this.y+1, 0);
            newState.set(this.x+1, this.y, this.c);
            newState.set(this.x+1, this.y+1, this.c2);

            return newState;
        }
    }    
}

class oBlock extends Block
{
    constructor(state, x, y, c) 
    {
        super(state, x, y, c);
    }

    up() 
    {
        if (this.get(this.x, this.y-1) === 0 && this.get(this.x+1, this.y-1) === 0) {
            const newState = this.clone(this);

            newState.set(this.x, this.y-1, this.c);
            newState.set(this.x+1, this.y-1, this.c2);

            newState.set(this.x, this.y, this.c2);
            newState.set(this.x+1, this.y, this.c2);

            newState.set(this.x, this.y+1, 0);
            newState.set(this.x+1, this.y+1, 0);

            return newState;
        }
    }

    down() 
    {
        if (this.get(this.x, this.y+2) === 0 && this.get(this.x+1, this.y+2) === 0) {
            const newState = this.clone(this);

            newState.set(this.x, this.y+2, this.c2);
            newState.set(this.x+1, this.y+2, this.c2);
            newState.set(this.x, this.y+1, this.c);
            newState.set(this.x+1, this.y+1, this.c2);
            newState.set(this.x, this.y, 0);
            newState.set(this.x+1, this.y, 0);

            return newState;
        }
    }

    left() 
    {
        if (this.get(this.x-1, this.y) === 0 && this.get(this.x-1, this.y+1) === 0) {
            const newState = this.clone(this);

            newState.set(this.x-1, this.y, this.c);
            newState.set(this.x-1, this.y+1, this.c2);

            newState.set(this.x, this.y, this.c2);
            newState.set(this.x, this.y+1, this.c2);

            newState.set(this.x+1, this.y, 0);
            newState.set(this.x+1, this.y+1, 0);

            return newState;
        }
    }

    right() 
    {
        if (this.get(this.x+2, this.y) === 0 && this.get(this.x+2, this.y+1) === 0) {
            const newState = this.clone(this);

            newState.set(this.x+2, this.y, this.c2);
            newState.set(this.x+2, this.y+1, this.c2);

            newState.set(this.x+1, this.y, this.c);
            newState.set(this.x+1, this.y+1, this.c2);

            newState.set(this.x, this.y, 0);
            newState.set(this.x, this.y+1, 0);

            return newState;
        }
    }
}

class pBlock extends Block
{
    constructor(state, x, y, c) 
    {
        super(state, x, y, c);
    }
    
    up() 
    {
        if (this.get(this.x, this.y-1) === 0 && this.get(this.x+1, this.y-1) === 0) {
            const newState = this.clone();

            newState.set(this.x, this.y-1, this.c);
            newState.set(this.x+1, this.y-1, this.c2);

            newState.set(this.x, this.y, this.c2);
            newState.set(this.x+1, this.y, 0);

            newState.set(this.x, this.y+1, 0);

            return newState;
        }
    }

    down()
    {
        if (this.get(this.x, this.y+2) === 0 && this.get(this.x+1, this.y+1) === 0) {
            const newState = this.clone();

            newState.set(this.x, this.y, 0);
            newState.set(this.x+1, this.y, 0);

            newState.set(this.x, this.y+1, this.c);
            newState.set(this.x+1, this.y+1, this.c2);

            newState.set(this.x, this.y+2, this.c2);            

            return newState;
        }
    }

    left()
    {
        if (this.get(this.x-1, this.y) === 0 && this.get(this.x-1, this.y+1) === 0) {
            const newState = this.clone();

            newState.set(this.x-1, this.y, this.c);
            newState.set(this.x-1, this.y+1, this.c2);

            newState.set(this.x, this.y  , this.c2);
            newState.set(this.x, this.y+1, 0);

            newState.set(this.x+1, this.y, 0);                        

            return newState;
        }
    }

    right()
    {
        if (this.get(this.x+2, this.y) === 0 && this.get(this.x+1, this.y+1) === 0) {
            const newState = this.clone();

            newState.set(this.x, this.y, 0);
            newState.set(this.x, this.y+1, 0);

            newState.set(this.x+1, this.y  , this.c);
            newState.set(this.x+1, this.y+1, this.c2);

            newState.set(this.x+2, this.y  , this.c2);

            return newState;
        }
    }
}

// ⎦
class dBlock extends Block
{
    constructor(state, x, y, c) 
    {
        super(state, x, y, c);
    }
    
    up() 
    {
        if (this.get(this.x, this.y-2) === 0 && this.get(this.x-1, this.y-1) === 0) {
            const newState = this.clone();

            newState.set(this.x  , this.y-2, this.c2);

            newState.set(this.x-1, this.y-1, this.c2);
            newState.set(this.x  , this.y-1, this.c);

            newState.set(this.x-1, this.y, 0);
            newState.set(this.x  , this.y, 0);

            return newState;
        }
    }

    down()
    {
        if (this.get(this.x-1, this.y+1) === 0 && this.get(this.x, this.y+1) === 0) {
            const newState = this.clone();

            newState.set(this.x  , this.y-1, 0);

            newState.set(this.x-1, this.y, 0);
            newState.set(this.x  , this.y, this.c2);

            newState.set(this.x-1, this.y+1, this.c2);
            newState.set(this.x  , this.y+1, this.c);

            return newState;
        }
    }

    left()
    {
        if (this.get(this.x-2, this.y) === 0 && this.get(this.x-1, this.y-1) === 0) {
            const newState = this.clone();

            newState.set(this.x, this.y-1, 0);
            newState.set(this.x, this.y, 0);

            newState.set(this.x-1, this.y-1, this.c2);
            newState.set(this.x-2, this.y, this.c2);
            newState.set(this.x-1, this.y, this.c);

            return newState;
        }
    }

    right()
    {
        if (this.get(this.x+1, this.y) === 0 && this.get(this.x+1, this.y-1) === 0) {
            const newState = this.clone();

            newState.set(this.x+1, this.y-1, this.c2);
            newState.set(this.x+1, this.y, this.c);
            newState.set(this.x  , this.y, this.c2);

            newState.set(this.x, this.y-1, 0);
            newState.set(this.x-1, this.y, 0);

            return newState;
        }
    }
}

class State766 extends State
{
    constructor({ data, previous }) 
    {
        super(previous);
        if (previous) {
            // Clone the map
            this.data = previous.data.map(r => [...r]);
            this.width = previous.width;
            this.height= previous.height;
        } else {
            this.data  = data;
            this.width = data[0].length;
            this.height= data.length;
        }
    }

    merge(other)     { return this; }
    clone()          { return new State766({ previous: this }); }
    generateKey()    { return this.data.map(r => r.map(v => v ? v[0] : 'X').join('')).join(''); }

    set(x, y, value) { this.data[y][x] = value; }

    get(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return -1;
        }
        return this.data[y][x];
    }

    nextStates(callback) 
    {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                const c = this.get(x, y);
                if (c === 0 || c === -1) { continue; }

                switch (c[0]) {
                    case '?': 
                        // ignore those ... part of a block
                        break;

                    case '$':
                        new Block(this, x, y, c).move(callback);
                        break;

                    case 'h':
                        new hBlock(this, x, y, c).move(callback);
                        break;

                    case 'v':
                        new vBlock(this, x, y, c).move(callback);
                        break;
                       
                    case 'o':
                        new oBlock(this, x, y, c).move(callback);
                        break;
                        
                    case 'p':
                        new pBlock(this, x, y, c).move(callback);
                        break;

                    case 'd':
                        new dBlock(this, x, y, c).move(callback);
                        break;
                }
            }
        }
    }
}

class StateMachine766 extends StateMachine
{
    constructor(data, trace)
    {
        super(0);
        this.visited = new Set();
        this.data    = data;
        this.tracer  = new Tracer(1, trace);
    }

    trace() { this.tracer.print(_ => this.states.size); }

    isValid(state) 
    {
        if (this.visited.has(state.key)) {
            return false;
        }
        this.visited.add(state.key);
        return true;
    }

    get result() { return this.visited.size; }

    get initialState() 
    {
        const state = new State766({ data: this.data });
        this.visited.add(state.key);
        return state;
    }
}

function count(data, trace)
{
    return new StateMachine766(data, trace).run().result;
}

assert.strictEqual(count(example), 208);

console.log('Test passed');

const answer = timeLogger.wrap('', _ => count(problem, true));
console.log(`Answer is ${answer}`);