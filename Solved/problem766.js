const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const example = [
    ['G1', 'G1', 'R',  0 ],
    ['G1', 'R',  'R',  0 ],
    ['R' , 'R',  'R', 'R'],
];

const problem = [
    [ 0 , 'R1', 'R1', 'G1', 'R2', 'R2'], 
    [ 0 , 'R1', 'G1', 'G1', 'R2', 'Y1'],
    ['P', 'P' , 'B1', 'B1', 'Y2', 'Y1'],
    ['P', 'P' , 'B1', 'B1', 'Y2', 'G2'],
    ['P', 'P' , 'C1', 'C1', 'G2', 'G2']
];

class State 
{
    constructor({ data, previous }) 
    {
        if (previous) {
            // Clone the map
            this.data = previous.data.map(r => [...r]);
            this.width = previous.width;
            this.height= previous.height;
            this.$key = undefined;
        } else {
            this.data  = data;
            this.width = data[0].length;
            this.height= data.length;
            this.$key  = undefined;
        }
    }

    get key() 
    {
        if (this.$key === undefined) {
            const char = this.data.map(r => {
                return r.map(v => {                    
                    return v ? v[0] : 'X';
                }).join('');
            });
            this.$key = char.join('');
        }
        return this.$key;
    }

    get(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return -1;
        }
        return this.data[y][x];
    }

    set(x, y, value) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return;
        }
        this.data[y][x] = value;
    }

    getBlock(x, y, pieces, value) {
        if (this.get(x, y) !== value) {
            return;
        }
        const k = `${x}:${y}`;
        if (! pieces.has(k)) {
            pieces.set(k, { x, y });
            this.getBlock(x-1, y, pieces, value);
            this.getBlock(x+1, y, pieces, value);
            this.getBlock(x, y-1, pieces, value);
            this.getBlock(x, y+1, pieces, value);
        }
    }

    moves(callback) 
    {
        const tryMoveUp = (x, y) => {
            if (this.get(x, y-1) !== 0) {
                return;
            }

            const c = this.get(x, y);
            if (c === -1 || c === 0) return;
            if (c.length === 1) {
                const newState = new State({ previous: this });
                newState.set(x, y, 0);
                newState.set(x, y-1, c);
                callback(newState);
            } else {
                let block = new Map();
                this.getBlock(x, y, block, c);
                block = [...block.values()].sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);
                let x1 = block[0].x - 1;
                let canMove = true;
                for(let i = 0; i < block.length && block[i].x >= x1 ; i++) {
                    const { x: bx, y: by } = block[i];
                    if (bx === x1) continue;
                    x1 = bx;
                    if (this.get(bx, by-1) !== 0) {
                        canMove = false;
                        break;
                    }
                }
                if (canMove) {
                    const newState = new State({ previous: this });
                    for(const { x: bx, y: by } of block) {
                        newState.set(bx, by-1, c);
                        newState.set(bx, by, 0);
                    }
                    callback(newState);
                }
            }
        }

        const tryMoveDown = (x, y) => {
            if (this.get(x, y+1) !== 0) {
                return;
            }

            const c = this.get(x, y);
            if (c === -1 || c === 0) return;
            if (c.length === 1) {
                const newState = new State({ previous: this });
                newState.set(x, y, 0);
                newState.set(x, y+1, c);
                callback(newState);
            } else {
                let block = new Map();
                this.getBlock(x, y, block, c);
                block = [...block.values()].sort((a, b) => a.x === b.x ? b.y - a.y : a.x - b.x);
                let x1 = block[0].x - 1;
                let canMove = true;
                for(let i = 0; i < block.length && block[i].x >= x1 ; i++) {
                    const { x: bx, y: by } = block[i];
                    if (bx === x1) continue;
                    x1 = bx;
                    if (this.get(bx, by+1) !== 0) {
                        canMove = false;
                        break;
                    }
                }
                if (canMove) {
                    const newState = new State({ previous: this });
                    for(const { x: bx, y: by } of block) {
                        newState.set(bx, by+1, c);
                        newState.set(bx, by, 0);
                    }
                    callback(newState);
                }                
            }
        }

        const tryMoveLeft = (x, y) => {
            if (this.get(x-1, y) !== 0) {
                return;
            }

            const c = this.get(x, y);
            if (c === -1 || c === 0) return;
            if (c.length === 1) {
                const newState = new State({ previous: this });
                newState.set(x, y, 0);
                newState.set(x-1, y, c);
                callback(newState);
            } else {
                let block = new Map();
                this.getBlock(x, y, block, c);
                block = [...block.values()].sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y);
                let y1 = block[0].y - 1;
                let canMove = true;
                for(let i = 0; i < block.length && block[i].y >= y1 ; i++) {
                    const { x: bx, y: by } = block[i];
                    if (by === y1) continue;
                    y1 = by;
                    if (this.get(bx-1, by) !== 0) {
                        canMove = false;
                        break;
                    }
                }
                if (canMove) {
                    const newState = new State({ previous: this });
                    for(const { x: bx, y: by } of block) {
                        newState.set(bx-1, by, c);
                        newState.set(bx, by, 0);
                    }
                    callback(newState);
                }                
            }
        }

        const tryMoveRight = (x, y) => {
            if (this.get(x+1, y) !== 0) {
                return;
            }

            const c = this.get(x, y);
            if (c === -1 || c === 0) return;
            if (c.length === 1) {
                const newState = new State({ previous: this });
                newState.set(x, y, 0);
                newState.set(x+1, y, c);
                callback(newState);
            } else {
                let block = new Map();
                this.getBlock(x, y, block, c);
                block = [...block.values()].sort((a, b) => a.y === b.y ? b.x - a.x : a.y - b.y);
                let y1 = block[0].y - 1;
                let canMove = true;
                for(let i = 0; i < block.length && block[i].y >= y1 ; i++) {                    
                    const { x: bx, y: by } = block[i];
                    if (by === y1) continue;
                    y1 = by;
                    if (this.get(bx+1, by) !== 0) {
                        canMove = false;
                        break;
                    }
                }
                if (canMove) {
                    const newState = new State({ previous: this });
                    for(const { x: bx, y: by } of block) {
                        newState.set(bx+1, by, c);
                        newState.set(bx, by, 0);
                    }
                    callback(newState);
                }                                
            }
        }

        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                tryMoveUp(x, y);
                tryMoveLeft(x, y);
                tryMoveDown(x, y);
                tryMoveRight(x, y);
            }
        }
    }
}

function count(data, trace)
{
    let states    = new Map();
    let newStates = new Map();
    let visited   = new Set();
    let state     = new State({ data });

    states.set(state.key, state); 
    visited.add(state.key);

    const tracer = new Tracer(1, trace);
    while(states.size > 0) {
        tracer.print(_ => states.size);
        newStates.clear();
        for(let state of states.values()) {
            state.moves(newState => {
                if (! visited.has(newState.key)) {
                    visited.add(newState.key);
                    newStates.set(newState.key, newState);
                }
            });
        }
        [newStates, states] = [states, newStates];
    }

    tracer.clear();
    return visited.size;
}

assert.strictEqual(count(example), 208);

console.log('Test passed');

const answer = timeLogger.wrap('', _ => count(problem, true));
console.log(`Answer is ${answer}`);