const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

const MAX = 10001;

class Fractran
{
    // static primes = [2,  3,  5,  7, 11, 13, 17, 19, 23, 29];

    constructor()
    {
        this.s2 = 1;
        this.s3 = 0;
        this.s5 = 0;
        this.s7 = 0;
        this.s11 = 0;
        this.s13 = 0;
        this.s17 = 0;
        this.s19 = 0;
        this.s23 = 0;
        this.s29 = 0;

        this.total = 1;
        this.steps = 0;
    }

    next()
    {
        let current = 13;

        while(true)
        {
            switch(current)
            {
                case 12:
                    this.s13++;
                    this.s11--;
                    this.steps++;

                case 1:
                {
                    this.s7--;
                    this.s13--;
                    this.s17++;
                    this.total--;
                    this.steps++;
                }

                case 2:
                {
                    if (this.s7)
                    {
                        const a = Math.min(this.s7, this.s5);
                        if (a) // can be more than 1
                        {    
                            this.s5 -= a;
                            this.s7 -= a;
                            this.s2 += a;
                            this.s3 += a;

                            this.steps += 2*a;
                        }

                        if (! this.s5)
                        {
                            if (! this.s3 || ! this.s17)
                            {
                                current = 10;
                                break;
                            }
                            this.s3--;
                            this.s17--;
                            this.s19++;
                            this.total--;
                            this.steps++;
                
                            current = 5;
                            break;
                        }
                    }

                    if (this.s5)
                    {
                        this.s5--;
                        this.s17--;
                        this.s2++;
                        this.s3++;
                        this.s13++;
                        this.total++;
                        this.steps++;
                        current = 11;
                    }
                    else
                        current = 10;

                    break;
                } 

                case 5:
                {
                    const a = this.s19;
                    const b = this.s2 - a;

                    this.s23 += a-1;
                    this.s5  += b+1;
                    this.s7++;
                    this.s11++;
                    this.s2  = 0;
                    this.s19 = 0;

                    this.steps += b + b + a + 2;
                    this.total += 2-a;

                    current = this.s3 ? 6 : 12;
                    break;
                }
    
                case 11:
                    this.s13--;
                    this.s11++;
                    this.steps++;

                case 6:
                {
                    const b = this.s3;

                    this.s11  = 1;
                    this.s3   = 0;
                    this.s7  += b;
                    this.steps += b+b;

                    current = 12;
                    break;
                }

                case 10:
                    this.total -= this.s17;
                    this.steps += this.s17;
                    this.s17 = 0;
                    if (this.s2 === this.total)
                        return;

                case 13:
                    this.s3 += this.s2 - 1;
                    this.s5 += this.s2 + 1;
                    this.s11++;
                    
                    this.total += 2 + this.s2 - this.s7;
                    this.steps += 3 + this.s2 + this.s7;

                    this.s2  = 0;
                    this.s7  = 1;

                    current = this.s3 ? 6 : 12;
                    break;

                default:
                    throw "ERROR";
            }
        }
    }
}

function solve(max, trace)
{
    const fractran = new Fractran();

    const tracer = new Tracer(100, trace);

    for(let primes = 0; primes < max; primes++)
    {
        tracer.print(_ => primes);
        fractran.next();
    }

    tracer.clear();
    
    return fractran.steps;
}

assert.equal(solve(200), 2460448206);
assert.equal(solve(1001), 667783584574);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(MAX, true));

console.log(`Answer is ${answer}`);