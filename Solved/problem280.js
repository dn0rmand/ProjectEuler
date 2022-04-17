const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

class State
{
    constructor(previous) {
        if (previous) {
            this.map = previous.map.map(r => [...r]);
            this.x   = previous.x;
            this.y   = previous.y;
            this.loaded = previous.loaded;
            this.probability = previous.probability;
            this.$key = undefined;
        } else {
            this.map = [
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [1,1,1,1,1],
            ];
            this.x = 2;
            this.y = 2;
            this.probability = 1;
            this.loaded = false;
            this.$key = undefined;
        }
    }

    get success() {
        const r = this.map[0];
        for(let x = 0; x < 5; x++) {
            if (r[x] === 0) {
                return false;
            }
        }
        return true;
    }

    get key() {
        if (this.$key === undefined) {
            let k = this.map.reduce((a, r) => {
                return r.reduce((b, v) => {
                    return b*2 + v;
                }, a)
            }, 0);
            k = k*2 + (this.loaded ? 1 : 0);
            k = k*25 + (5*this.y) + this.x;

            this.$key = k;
        }
        return this.$key;
    }

    freePositions() {
        let pos = [];
        for(let [ox, oy] of [[0, 1], [0, -1], [-1, 0], [1, 0]]) {
            const x = this.x + ox;
            const y = this.y + oy;
            if (x >= 0 && x < 5 && y >= 0 && y < 5) {
                pos.push({ x, y });
            }
        }
        return pos;
    }

    *moves() {
        const positions = this.freePositions();
        const prob = 1 / positions.length;
        for(const {x, y} of positions) {
            const newState = new State(this);

            newState.probability = this.probability * prob;
            newState.x = x;
            newState.y = y;

            if (y === 0 && newState.loaded && newState.map[0][x] === 0) {
                newState.loaded = false;
                newState.map[0][x] = 1;
            } else if (y === 4 && !newState.loaded && newState.map[4][x] === 1) {
                newState.loaded = true;
                newState.map[4][x] = 0;
            }

            yield newState;
        }
    }
}

const MAX_STEPS = 3000;

function solve()
{
    let states = new Map();
    let newStates = new Map();

    states.set(0, new State());

    let steps = -1;

    let result = 0;

    const tracer = new Tracer(100, true);
    while (steps < MAX_STEPS && states.size > 0) {
        steps++;
        tracer.print(_ => `${steps} - ${result.toFixed(9)}`);

        newStates.clear();
        for(const state of states.values()) {
            if (state.success) {
                result += steps*state.probability;
                continue;
            }
            for(const newState of state.moves()) {
                const old = newStates.get(newState.key);

                if (old) {
                    old.probability += newState.probability;
                } else {
                    newStates.set(newState.key, newState);
                }
            }
        }

        [states, newStates] = [newStates, states];
    }
    tracer.clear();

    return result.toFixed(6);
}

const answer = timeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer}`);