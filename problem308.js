const primeHelper = require('tools/primeHelper')();
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

const MAX_PRIME = 104743; // Prime #10001

primeHelper.initialize(MAX_PRIME);

class Fractran
{
    decompile()
    {
        for(let op = 0; op < this.operators.length; op++)
        {
            let top = [];
            let bottom = [];
            
            this.operators[op].reduce((a, v, i) => {
                const p = this.primes[i];
                const pow = Math.abs(v) > 1 ? `^${Math.abs(V)}` : '';

                (v > 0 ? top : bottom).push(`${p}${pow}`);
                return 0;
            }, 0);

            let t = top.join("x");
            let b = bottom.join("x");
            if (t.length === 0)
                t = '1';
            if (b.length === 0)
                b = '1';

            if (t.length < b.length)
            {
                while (t.length < b.length)
                {
                    t = t + " ";
                    if (t.length < b.length)
                        t = " " + t;
                }
            }
            else
            {
                while (t.length > b.length)
                {
                    b = b + " ";
                    if (t.length > b.length)
                        b = " " + b;
                }
            }
            let line = '-'.repeat(t.length);
            let l = op < 10 ? ` ${op}` : `${op}`
            console.log(`    ${t}`)
            console.log(`${l}: ${line}`);
            console.log(`    ${b}`);
            console.log("");
        }
    }

    primeList(op, numerator, divisor)
    {
        const result = [];
    
        const addPrime = (p, f) => {
            let i = this.primes.indexOf(p);
            if (i < 0) 
                throw `ERROR: prime ${p} not found`;
            if (f < 0)
                this.references[i].push(op);
            result[i] = f;
        };

        primeHelper.factorize(numerator, (p, f) => addPrime(p, f));
        primeHelper.factorize(divisor, (p, f) => addPrime(p, -f));

        return result;
    }

    value()
    {
        return this.state.join(', ');
    }

    constructor()
    {
        this.primes        = [ 2,  3,  5,  7, 11, 13, 17, 19, 23, 29];
        //                     0   1   2   3   4   5   6   7   8   9
        this.references    = [[], [], [], [], [], [], [], [] ,[], []];
        this.usedOperators = [];

        this.operators = [
            this.primeList( 0, 17, 91), 
            this.primeList( 1, 78, 85), 
            this.primeList( 2, 19, 51), 
            this.primeList( 3, 23, 38), 
            this.primeList( 4, 29, 33), 
            this.primeList( 5, 77, 29), 
            this.primeList( 6, 95, 23), 
            this.primeList( 7, 77, 19),  
            this.primeList( 8, 1, 17), 
            this.primeList( 9, 11, 13), 
            this.primeList(10, 13, 11), 
            this.primeList(11, 15,  2), 
            this.primeList(12, 1,  7), 
            this.primeList(13, 55,  1)
        ];

        this.state    = new Int32Array(this.primes.length);
        this.state[0] = 1;
        this.steps    = 0;
        this.total    = 1;
    }

    next()
    {
        this.steps++;
        let newState = new Int32Array(this.primes.length);

        let possibleOps = new Set();
        for(let i = 0; i < this.primes.length; i++)
        {
            if (this.state[i] > 0)
                for(var o of this.references[i])
                    possibleOps.add(o);
        }

        possibleOps = [...possibleOps.values()].sort((a, b) => a-b);

        // 1,2,4 => 13

        for(let opId of possibleOps)
        {
            let op = this.operators[opId];
            let ok       = true;
            let good     = true;

            newState.fill(0);

            for(let i = 0; i < this.primes.length; i++)
            {
                newState[i] = this.state[i] + (op[i] || 0); 
                if (newState[i] < 0)
                {
                    good = false;
                    break;
                }
                if (i > 0 && newState[i] > 0)
                    ok = false;
            }

            if (good)
            {
                if (opId === 0)
                    console.log(opId, '-', possibleOps.join(', '));
                this.state = newState;
                return ok && this.state[0] > 0;
            }
        }

        // x5 & x11
        this.state[2]++;
        this.state[4]++;
        return false;
    }
}

function solve()
{
    const fractran = new Fractran();

    fractran.decompile();

    const tracer = new Tracer(1, true);
    let primes = 0;
    while(primes < 50)
    {
        if (fractran.next())
        {
            primes++;
            tracer.print(_ => primes);
        }
    }

    return fractran.steps;
}

const answer = timeLogger.wrap('', _ => solve());

console.log(`Answer is ${answer}`);