const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

const MAX_PRIME = 104743; // Prime #10001

primeHelper.initialize(MAX_PRIME);

class Fractran
{
    static primes = [2,  3,  5,  7, 11, 13, 17, 19, 23, 29];

    constructor()
    {
        this.state = [];

        for (let p of Fractran.primes)
            this.state[p] = 0;

        this.state[2] = 1;
        this.total = 1;
        this.steps = 0;
    }

    next()
    {
        do
        {
            this.steps++;

            let a, b;

            if (this.state[7] && this.state[13])
            {
                this.state[7]--;
                this.state[13]--;
                this.state[17]++;
                this.total--;
            }
            else if (this.state[5] && this.state[17])
            {
                this.state[5]--;
                this.state[17]--;
                this.state[2]++;
                this.state[3]++;
                this.state[13]++;
                this.total++;
            }
            else if (this.state[3] && this.state[17])
            {
                this.state[3]--;
                this.state[17]--;
                this.state[19]++;
                this.total--;
            }
            else if (this.state[2] && this.state[19])
            {
                this.state[23]++;
                this.state[2]--;
                this.state[19]--;
                this.total--;
            }
            else if (this.state[3] && this.state[11])
            {
                this.state[29]++;
                this.state[3]--;
                this.state[11]--;
                this.total--;
            }
            else if (this.state[29])
            {
                this.state[29]--;
                this.state[7]++;
                this.state[11]++;
                this.total++;
            }
            else if (this.state[23])
            {
                this.state[23]--;
                this.state[5]++;
                this.state[19]++;
                this.total++;
            }
            else if (this.state[19])
            {
                this.state[19]--;
                this.state[7]++;
                this.state[11]++;
                this.total++;
            }
            else if (a = this.state[17])
            {
                this.total -= a;
                this.steps += a-1;
                this.state[17] = 0;
            }
            else if (this.state[13])
            {
                this.state[13]--;
                this.state[11]++;
            }
            else if (this.state[11])
            {
                this.state[13]++;
                this.state[11]--;
            }
            else if (this.state[2])
            {
                this.state[2]--;
                this.state[3]++;
                this.state[5]++;
                this.total++;
            }
            else if (a = this.state[7])
            {
                this.total -= a;
                this.steps += a-1;
                this.state[7] = 0;
            }
            else
            {
                this.state[5]++;
                this.state[7]++;
                this.state[11]++;
                this.state[3]--;
                
                this.total += 2;
                this.steps += 2;
            }
        }
        while(this.state[2] !== this.total);
    }
}

function solve()
{
    const fractran = new Fractran();

    const tracer = new Tracer(1, true);
    let primes = 0;
    for(let primes = 0; primes < 200; primes++)
    {
        tracer.print(_ => primes);
        fractran.next();
    }

    return fractran.steps;
}

const answer = timeLogger.wrap('', _ => solve());

assert.equal(answer, 2460448206);

console.log(`Answer is ${answer}`);