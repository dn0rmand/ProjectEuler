const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

require('@dn0rmand/project-euler-tools/src/bigintHelper');

class State
{
    static pool = [];

    constructor()
    {
        this.larry  = [];
        this.robin  = [];
        this.score  = 0n;
        this.count  = 1n;
    }

    release()
    {
        State.pool.push(this);
    }

    static create()
    {
        if (State.pool.length > 0)
            return State.pool.pop();

        return new State();
    }

    clone()
    {
        let s = State.create();

        s.larry = [...this.larry];
        s.robin = [...this.robin];
        s.score  = this.score;
        s.count  = this.count;

        return s;
    }

    reorder()
    {
        let l = [];
        let r = [];
        let lr = new Map();

        let v = 1;
        const length = this.larry.length;

        for(let i = 0; i < length; i++)
        {
            let n = this.robin[i];
            let x = this.larry.indexOf(n);
            if (x < 0)
            {
                r[i] = v++;
            }
            else
            {
                lr.set(x, i);
            }
        }
        for(let i = 0; i < length; i++)
        {
            if (! lr.has(i))
                l[i] = v++;
        }
        lr.forEach((i, x) => {
            r[i] = v;
            l[x] = v;
            v++;
        });

        this.larry = l;
        this.robin = r;
    }

    get key()
    {
        this.reorder();

        let pow = 1n;
        let k   = 0n;
        
        this.larry.reduce((a, v) => {
            k += BigInt(v)*pow;
            pow *= 10n;
            return a;
        }, 0);
        this.robin.reduce((a, v) => {
            k += BigInt(v)*pow;
            pow *= 10n;
        }, 0);

        k = (k * 1000n)

        if (this.score < 0n)
            return -k + this.score;
        else
            return k + this.score;
    }

    getScore()
    {
        let score = this.score * this.count;
        if (score < 0)
            return -score;
        else
            return score;
    }

    call_larry(number)
    {
        const index = this.larry.findIndex((value) => value === number);
        if (index < 0)
        {
            this.larry.push(number);
            if (this.larry.length > 5)
                this.larry.shift();

            return 0n;
        }
        else
        {
            this.larry.splice(index, 1);
            this.larry.push(number);

            return 1n;
        }
    }    

    call_robin(number)
    {
        if (! this.robin.includes(number))
        {
            this.robin.push(number);
            if (this.robin.length > 5)
                this.robin.shift();

            return 0n;
        }
        else
        {
            return 1n;
        }
    }    

    call(number)
    {
        const diff = this.call_larry(number) - this.call_robin(number);
        if (diff != 0)
            this.score += diff;
        return this;
    }    
}

function solve(steps)
{
    let states   = new Map();
    let newStates= new Map();

    states.set(0, new State());

    let check = true;

    for(let step = 1; step <= steps; step++)
    {
        process.stdout.write(`\r${step} - ${states.size}`);
        
        newStates.clear();

        for(let state of states.values())
        {
            for(let number = 1; number <= 10; number++)
            {
                let s = state.clone().call(number);
                let k = s.key;

                if (check && k > Number.MAX_SAFE_INTEGER || k < Number.MIN_SAFE_INTEGER)
                {
                    check = false;
                    console.log("\rYES ... BIGINT really needed");
                }

                let o = newStates.get(k);
                if (o !== undefined)
                {
                    o.count += s.count;
                    s.release();
                }
                else
                {
                    newStates.set(k, s);
                }
            }

            state.release();
        }

        [states, newStates] = [newStates, states];
    }

    let count = 0n;
    let score = 0n;
    
    states.forEach((v) => { 
        count += v.count; 
        score += v.getScore();
    });

    let result = score.divise(count, 10);

    console.log('');
    return result.toFixed(8);
}

let answer = timeLogger.wrap('', () => solve(50));
console.log('Answer is', answer);
