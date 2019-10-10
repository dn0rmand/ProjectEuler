const assert = require('assert');
const timeLog = require('tools/timeLogger');

const MODULO = 1000000007;
const MAX = 1E7;

/*
class State
{
    constructor(p2, p3, p5)
    {
        this.p2 = +p2;
        this.p3 = +p3;
        this.p5 = +p5;
    }
}

class Machine
{
    constructor(p2, p3, p5)
    {
        this.map = [];
        this.newStates = [];
        this.states = [new State(p2, p3, p5)];
    }

    record(p2, p3, p5)
    {
        if (p2 < 0 || p3 < 0 || p5 < 0)
            return;

        let m2 = this.map[p2];
        if (! m2)
            m2 = this.map[p2] = [];
        let m3 = m2[p3];
        if (! m3)
            m3 = m2[p3] = [];

        if (! m3[p5])
        {
            m3[p5] = true;
            this.newStates.push(new State(p2, p3, p5));
        }
    }

    process()
    {
        this.newStates = [];
        this.map = [];
        for (let state of this.states)
        {
            this.record(state.p2-1, state.p3  , state.p5);
            this.record(state.p2  , state.p3-1, state.p5);
            this.record(state.p2  , state.p3  , state.p5-1);
        }
        this.states = this.newStates;
        this.map = [];
        this.newStates = [];
    }

    execute(count)
    {
        count = +count;
        while(count--)
            this.process();

        return this.result;
    }

    get result() { return this.states.length % MODULO; }
}
*/

function part2(p5, p3, p2)
{
    let count = (p2+p3+p5);
    if (count & 1)
        return 0;

    count /= 2;
    let v = [p2, p3, p5];
    v.sort((a,b) => a-b);

    let v0 = v[0];
    let v1 = v[1];

    if (v0+v1 <= count)
        return ((v0+1)*(v1+1)) % MODULO;

    let N  = v[0]+v[1]-count;
    let N2 = (N*N) % MODULO;

    v0 -= N;

    let r = ((v0+1)*(v1+1) + N*v1 - N2) % MODULO;
    return r;
}

function solve(n, trace)
{
    function part1()
    {
        let total = 0;
        for(let x = 0; ; x++)
        {
            let f2 = 5*x;
            if (f2 > n)
                break;
            if (trace)
                process.stdout.write(`\r${ n - f2 }    `);
            let ystart = 0;

            if ((n - f2) & 1) // odd ?
                ystart++;

            for(let y = ystart; ; y += 2)
            {
                let f3 = 3*y;
                let target = n - f2 - f3;
                if (target < 0)
                    break;
                let z = target / 2;
                let t = part2(x, y, z);
                if (t)
                    total = (total + t) % MODULO;
            }
        }

        if (trace)
            console.log('\r');
        return total;
    }

    return part1();
}

assert.equal(solve(10), 4);
assert.equal(solve(100), 3629);
assert.equal(solve(1000), 25808429);
assert.equal(solve(10000), 9403972);
console.log('Tests passed');

let answer = timeLog.wrap('', () => {
    return solve(MAX, true);
});
console.log('Answer is', answer);