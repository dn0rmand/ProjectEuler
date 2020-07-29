const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');
const { start } = require('repl');
const { trace } = require('console');

const MAX_PRIME = 104743; // Prime #10001

primeHelper.initialize(MAX_PRIME);

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

    set previous(value)
    {
    }

    //  |-------------------------^
    //  v                         |
    // 12 -> 1 -> 2 -> 6 -> 6 -> 12
    //  |              6 <- 6     ^
    //  |                   ^     |
    //  |-> 4 -> 5 -> 8 --> 9 ----|
    //  |        5 <- 8
    //  v
    // 10 -> 13 -> 14 -> 6, 12

    next()
    {
        const goto = label => {};
        const min = (a, b) => a < b ? a : b;

        this.$previous = -1;

        let label = 12;

        goto(`label13`);

        do
        {
label1:
            if(this.s7 && this.s13)
            {
                this.previous = 1;
                const a = min(this.s7, this.s13);

                this.s7  -= a;
                this.s13 -= a;
                this.s17 += a;
                this.total -= a;
                this.steps += a;
                goto('label2');
            }
             
label2:
            if (this.s5 && this.s17)
            {
                this.previous = 2;

                if (this.s7)
                {
                    const a = min(this.s7, this.s5);

                    this.s5 -= a;
                    this.s7 -= a;
                    this.s2 += a;
                    this.s3 += a;

                    this.steps += 2*a;

                    if (! this.s5)
                    {
                        this.previous = 4;
                        const a = min(this.s3, this.s17);
        
                        this.s3    -= a;
                        this.s17   -= a;
                        this.s19   += a;
                        this.total -= a;
                        this.steps += a;
            
                        goto(`label5`);
                        continue;
                    }
                }

                const a = min(this.s5, this.s17);

                this.s5  -= a;
                this.s17 -= a;
                this.s2  += a;
                this.s3  += a;
                this.s13 += a;
                this.total += a;
                this.steps += a;
            } 

label5:
            if (this.s2 && this.s19)
            {
                this.previous = 5;
                const a = min(this.s2, this.s19);

                this.s2    -= a;
                this.s19   -= a;
                this.s23   += a;
                this.total -= a;
                this.steps += a;

                continue;
            }
             
label6:
            if (this.s3 && this.s11)
            {
                this.previous = 6;
                const a = min(this.s3, this.s11);

                this.s3    -= a;
                this.s11   -= a;
                this.s29   += a;
                this.total -= a;
                this.steps += a;

                continue;
            }
            
label7:
            if (this.s29)
            {
                this.previous = 7;
                this.s29--;
                this.s7++;
                this.s11++;
                this.total++;
                this.steps++;

                continue;
            }
             
 label8:
           if (this.s23)
            {
                this.previous = 8;
                this.s23--;
                this.s5++;
                this.s19++;
                this.total++;
                this.steps++;

                continue;
            }
            
label9:
            if (this.s19)
            {
                this.previous = 9;
                this.s19--;
                this.s7++;
                this.s11++;
                this.total++;
                this.steps++;

                continue;
            }

label10:
            if (this.s17)
            {
                this.previous = 10;
                this.total -= this.s17;
                this.steps += this.s17;
                this.s17 = 0;
                if (this.s2 === this.total)
                    return;

                continue;
            }
            
label11:
            if (this.s13)
            {
                this.previous = 11;
                this.s13--;
                this.s11++;
                this.steps++;

                continue;
            }
            
label12:
            if (this.s11)
            {
                this.previous = 12;
                this.s13++;
                this.s11--;
                this.steps++;

                continue;
            }
            
label13:
            this.s3 += this.s2 - 1;
            this.s5 += this.s2 + 1;
            this.s11++;
            
            this.total += 2 + this.s2 - this.s7;
            this.steps += 3 + this.s2 + this.s7;

            this.s2  = 0;
            this.s7  = 1;            
        }
        while(1);
    }
}

/*
Step 1 reached from steps 12, 2
Step 2 reached from steps 1
Step 3 reached from steps 1
Step 4 reached from steps 1
Step 5 reached from steps 4, 8
Step 6 reached from steps 11, 14, 7, 9
Step 7 reached from steps 6
Step 8 reached from steps 5
Step 9 reached from steps 8
Step 10 reached from steps 1
Step 11 reached from steps 3
Step 12 reached from steps 14, 7, 9
Step 13 reached from steps 10
Step 14 reached from steps 13
Step 15 has no previous step
*/

function solve()
{
    const fractran = new Fractran();

    const tracer = new Tracer(1, true);

    for(let primes = 0; primes < 200; primes++)
    {
        tracer.print(_ => primes);
        fractran.next();
    }

    tracer.clear();
    
    return fractran.steps;
}

const answer = timeLogger.wrap('', _ => solve());

assert.equal(answer, 2460448206);

console.log(`Answer is ${answer}`);