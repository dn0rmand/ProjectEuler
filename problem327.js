const assert = require('assert');
const Tracer = require('tools/tracer');
const BigMap = require('tools/BigMap');
const timeLogger = require('tools/timeLogger');

const MAX_ROOM = 30;

class State
{
    static $maxRooms = 10n;
    static $lastRoom = -1;
    static $magicCount = 1000;

    constructor(maxRooms)
    {
        if (maxRooms)
        {
            State.$lastRoom = maxRooms;

            this.boxes = new Uint8Array(maxRooms-1);

            this.room  = 0;
            this.cards = 0;
            this.total = 0;
        }
        this.$key = undefined;
        this.previous = undefined;
    }

    clone(action)
    {
        let s = new State();

        s.boxes = this.boxes.slice();
        s.room  = this.room;
        s.cards = this.cards;
        s.total = this.total;
        s.previous = this;

        if (action)
            action(s);

        return s;
    }

    dump()
    {
        if (this.room === 0)
        {
            // if (this.boxes.find((v) => v !== 4 && v !== 0))
            //     return;
            console.log(this.boxes.join('-'), '-', this.total);
        }
        else
            this.previous.dump();
    }

    get boxIndex()
    {
        if (this.room < 1  || this.room >= State.$lastRoom)
            return -1;

        const i = this.room-1;
        if (i < this.boxes.length)
            return i;

        return -1;
    }

    get boxCount()
    {
        if (this.room === 0)
            return State.$magicCount;

        const i = this.boxIndex;

        if (i < 0)
            return 0;

        return this.boxes[i] || 0;
    }

    set boxCount(value)
    {
        if (this.room === 0 && value === State.$magicCount-1)
        {
            this.total++;
            return;
        }

        const i = this.boxIndex;
       
        if (i >= 0)
            this.boxes[i] = value;
    }

    get subKey()
    {
        if (this.$subkey === undefined)
        {
            this.$subkey = this.boxes.reduce((a, v) => a * State.$maxRooms + BigInt(v), 
                                             BigInt(this.cards) * State.$maxRooms);
        }

        return this.$subkey;
    }

    get key()
    {
        if (this.$key === undefined)
        {
            this.$key = this.subKey * State.$maxRooms + BigInt(this.room);
        }

        return this.$key;
    }

    moveForward()
    {
        if (this.cards === 0)
            return undefined; // STUCK

        // if (this.cards-1 === 0 && this.room !== this.lastRoom)
        //     return undefined;

        return this.clone(s => {
            s.room  += 1;
            s.cards -= 1;
        });
    }

    static $map = new BigMap();

    moveBack()
    {
        if (this.cards === 0 || this.room === 0)
            return undefined; // STUCK or in room ZERO

        let s = this.clone(s => {
            s.room -= 1;
            s.cards-= 1;
        });

        if (s.room === 0)
        {
            let k = s.boxes.reduce((a, v) => a*100n + BigInt(v), 0n);
            if (k)
            {
                let v = State.$map.get(k);
                if (v === undefined || v > s.total)
                {
                    State.$map.set(k, s.total);
                    let x = s.boxes.join('-').substr(0, 11);
                    if (x === '1-1-1-1-1-1' ||
                        x === '1-1-1-1-1-0' ||
                        x === '1-1-1-1-0-0' ||
                        x === '1-1-1-0-0-0' ||
                        x === '1-1-0-0-0-0' ||
                        x === '1-0-0-0-0-0')
                    {
                        console.log(`${s.total} cards => ${x}`);
                    }
                }
            }
        }

        return s;
    }

    takeCard(maxCard)
    {
        if (this.cards === maxCard)
            return undefined; // Nope, cannot do that

        let count = this.boxCount;
        if (count > 0)
        {            
            return this.clone(s => {
                s.boxCount = count-1;
                s.cards += 1;    
            });            
        }
        else
        {
            return undefined;
        }
    }

    dropCard()
    {
        if (this.cards <= 0 || this.boxIndex < 0)
            return undefined; // No card or no box to drop it to

        if (this.cards === 1 && this.room > 0)
            return undefined; // would be stuck in this room

        return this.clone( s => {
            s.boxCount += 1;
            s.cards    -= 1;
        });
    }

    canFinish(maxCards, maxRoom)
    {
        let cards = this.cards;
        let room  = this.room;

        if (room > 0)
            cards = Math.min(maxCards, this.cards + this.boxCount);

        let actualRoom = this.room;

        while (room <= maxRoom && cards > 0)
        {
            room++;
            cards--;
            if (room > maxRoom)
                return true;

            this.room = room; // temporary change
            cards = Math.min(maxCards, cards + this.boxCount);
            this.room = actualRoom;
        }

        return false;
    }

    forEachMoves(maxCards, callback)
    {
        const action = (s) => { 
            if (s) callback(s); 
        };

        action(this.dropCard());
        action(this.takeCard(maxCards));
        action(this.moveForward());
        action(this.moveBack());
    }
}

class StateMap
{
    constructor()
    {
        this.rooms = [];
    }

    getSubMap(state)
    {
        let m = this.rooms[state.room];
        if (m === undefined)
            m = this.rooms[state.room] = new BigMap();

        return m;
    }

    get(state)
    {
        let m = this.getSubMap(state);
        return m.get(state.subKey);
    }    

    set(state, value)
    {
        let m = this.getSubMap(state);
        return m.set(state.subKey, value);
    }

    clear()
    {
        for(let m of this.rooms)
        {
            if (m)
                m.clear();
        }
    }

    *values()
    {
        for(let m of this.rooms)
        {
            if (m)
                yield *m.values();
        }
    }

    get size()
    {
        const s = this.rooms.reduce((a, v) => a + (v === undefined ? 0 : v.size), 0);
        return s;
    }
}

function fastM(roomCount)
{
    let total = 3n;

    for(let i = 1n; i <= roomCount-2; i++)
    {
        total += 3n**i;
    }
    return total;
}

function M(handSize, roomCount, trace)
{
    if  (handSize === 3)
        return fastM(roomCount);

    let states    = new StateMap();
    let newStates = new StateMap();
    let visited   = new StateMap();
    let start     = new State(roomCount);

    states.set(start, start);

    let minimum = Number.MAX_SAFE_INTEGER;
    let maxRoom = 0;
    let maxTotal= '';

    const tracer = new Tracer(10, trace)
    while (states.size > 0)
    {
        tracer.print(_ => `${maxRoom}: ${states.size} - ${maxTotal}`);

        newStates.clear();

        for(let state of states.values())
        {
            if (state.room > roomCount || state.canFinish(handSize, roomCount))
            {
                minimum = Math.min(minimum, state.total);
                state.dump();
                //newStates.clear();
                continue;
            }
            if (state.total >= minimum)
                continue;

            let old = visited.get(state);
            if (old === undefined || old > state.total)
                visited.set(state, state.total);

            if (state.room > maxRoom)
            {
                maxRoom = state.room;
                maxTotal= state.total;
            }
            else if (state.room === maxRoom)
            {
                maxTotal = Math.max(state.total, maxTotal);
            }

            state.forEachMoves(handSize, (s) => {
                if (s.total >= minimum)
                    return;
                let old = visited.get(s);
                if (old === undefined)
                    visited.get(s, s.total);
                else if (old > s.total)
                    visited.get(s, s.total);
                else
                    return;

                old = newStates.get(s);
                if (old === undefined || old.total > s.total)
                    newStates.set(s, s);
            });
        }

        [states, newStates] = [newStates, states];
    }

    tracer.clear();
    return minimum;
}

function solve(maxC, rooms, trace)
{
    let total = 0;

    const tracer = new Tracer(1, trace);

    for (let c = maxC; c >= 3; c--)
    {
        tracer.print(_ => `M(${c}, ${rooms})`);
        const value = M(c, rooms, trace);
        total += value;
        tracer.clear();
        console.log(`\rM(${c}, ${rooms}) = ${value}`);
    }

    tracer.clear();
    console.log(`Sum = ${total}`);
    return total;
}

assert.equal(M(3, 6), 123);
assert.equal(M(3, 7), 366);
assert.equal(M(3, 8), 1095);

M(4, 8);

assert.equal(M(4, 6), 23);
// assert.equal(M(5, 6), 13);
// assert.equal(M(6, 6),  9);
// assert.equal(M(7, 6),  7);
// assert.equal(M(8, 6),  7);

console.log('Tests passed');

// for(let handSize = MAX_ROOM+1; handSize > MAX_ROOM-10; handSize--)
// {
//     console.log(M(handSize, MAX_ROOM, true));
// }

// timeLogger.wrap('', _ => solve(10, 9, true));

//assert.equal(solve(10, 10, true), 10382);


`
      +-------+-------+-------+-------+-------+-------+
      |       |       |       |       |       |       |
START |   1   |   2   |   3   |   4   |   5   |   6   | FINISH
    4 |   3   |   1   |       |       |       |       |  
      +-------+-------+-------+-------+-------+-------+

hand = 3

3 cards => 1-0-0-0-0   // 3^1
12 cards => 1-1-0-0-0  // 3^2 + 3
39 cards => 1-1-1-0-0  // 3^3 + 3^2 + 3 ? 
120 cards => 1-1-1-1-0 // 3^4 + 3^3 + 3^2 + 3

hand = 4
3 cards  => 1-0-0-0-0 3 ( hand not full )
8 cards  => 1-1-0-0-0 
40 cards => 1-1-1-1-0 

3 cards  => 1-0-0-0-0-0 2^(r+1) - 1 (r+1 = 2)
7 cards  => 0-1-0-0-0-0 2^(r+1) - 1
15 cards => 0-0-1-0-0-0 
31 cards => 0-0-0-1-0-0
63 cards => 0-0-0-0-1-0

3 cards  => 1-0-0-0-0-0
8 cards  => 1-1-0-0-0-0
19 cards => 1-1-1-0-0-0 15 + (7-3)
40 cards => 1-1-1-1-0-0 31 + 15 - 7 + 3
83 cards => 1-1-1-1-1-0
`