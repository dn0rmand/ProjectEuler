const assert = require('assert');
const prettyTime= require("pretty-hrtime");
const announce = require('@dn0rmand/project-euler-tools/src/announce');

require('@dn0rmand/project-euler-tools/src/numberHelper');

const modulo     = 1000000007;

const LETTERS    = 1E5;
const MAX_LENGTH = 1E12;

class problem658
{
    constructor(letters, length, trace)
    {
        this.modulo      = 1000000007;
        this.factors     = new Uint32Array(letters);
        this.currentRow  = new Uint32Array(letters);
        this.previousRow = new Uint32Array(letters);
        this.letters     = Number(letters);
        this.length      = Number(length);
        this.trace       = trace === true;
    }

    A(l)
    {
        if (l == 0)
            return 1;
        if (l == 1) // avoid dividing by 0
            return (this.length + 1) % this.modulo;

        let total = l.modPow(this.length + 1, this.modulo) - 1;
        if (total < 0)
            total += this.modulo;
        total = total.modDiv(l-1, this.modulo);

        return total;
    }

    I()
    {
        let total = 0;

        for (let i = 1, j = this.letters-1; i <= this.letters; i++, j--)
        {
            if (this.trace)
                process.stdout.write(`\r${i}`);

            let f = this.A(j);

            let x = this.factors[j] || 0;
            let negative = (x < 0);
            if (negative)
                x = -x;

            let y = f.modMul(x, this.modulo);

            if (negative)
            {
                if (total < y)
                    total += this.modulo;

                total = (total - y) % this.modulo;
            }
            else
            {
                total = (total + y) % this.modulo;
            }
        }

        return total;
    }

    I2(letter)
    {
        let total = 0;
        let max = this.letters-letter;

        if (letter === 1)
        {
            for (let l = 0; l <= max; l++)
            {
                let v = (l & 1) ? this.modulo-1 : 1;
                this.currentRow[l] = v;
                total += v;
                if (total >= this.modulo)
                    total -= this.modulo;
            }
        }
        else // use previous row to figure it out
        {
            this.currentRow[0] = letter;
            total  = letter;
            for (let l = 1; l <= max; l++)
            {
                let v = this.previousRow[l];
                let v2 = this.currentRow[l-1];
                if (v >= v2)
                    v -= v2;
                else
                    v = v + this.modulo - v2;

                this.currentRow[l] = v;

                total += v;

                if (total >= this.modulo)
                    total -= this.modulo;
            }
        }
        this.factors[letter-1] = total;
    }

    S()
    {
        let timer = process.hrtime();
        let count = 0;
        let total;
        let max;
        let doTrace = (l) => {

        };
        if (this.trace)
        {
            doTrace = (letter) => {
                if (count === 0)
                    process.stdout.write(`\r${letter}`);
                if (count++ >= 999)
                    count = 0;
            }
        }

        for (let letter = 1; letter <= this.letters; letter++)
        {
            doTrace(letter);

            max = this.letters-letter;

            if (letter === 1)
            {
                total = 0;
                for (let l = 0; l <= max; l++)
                {
                    let v = (l & 1) ? this.modulo-1 : 1;
                    this.currentRow[l] = v;
                    total += v;
                    if (total >= this.modulo)
                        total -= this.modulo;
                }
            }
            else // use previous row to figure it out
            {
                this.currentRow[0] = letter;
                total  = letter;
                for (let l = 1; l <= max; l++)
                {
                    let v = this.previousRow[l];
                    let v2 = this.currentRow[l-1];
                    if (v >= v2)
                        v -= v2;
                    else
                        v = v + this.modulo - v2;

                    this.currentRow[l] = v;

                    total += v;

                    if (total >= this.modulo)
                        total -= this.modulo;
                }
            }
            this.factors[letter-1] = total;

            // this.I2(letter);

            // Switch rows to avoid allocating memory
            let r = this.currentRow;
            this.currentRow  = this.previousRow;
            this.previousRow = r;
        }
        timer = process.hrtime(timer);

        if (this.trace)
        {
            console.log("\rStep 1 done in", prettyTime(timer, {verbose:true}));
            console.log("Last step - Consolidation");
        }

        let result = this.I();

        if (this.trace)
            console.log('\rDone     ');

        return result;
    }

    static Solve(letters, length, trace)
    {
        let p = new problem658(letters, length, trace);
        return p.S();
    }
}

assert.equal(problem658.Solve(4,4), 406);
assert.equal(problem658.Solve(8,8), 27902680);
assert.equal(problem658.Solve(10,100), 983602076);

let timer = process.hrtime();
let answer = problem658.Solve(LETTERS, MAX_LENGTH, true);
timer = process.hrtime(timer);

timer = prettyTime(timer, {verbose:true});
console.log('Answer is', answer, 'calculated in', timer);
// announce(658, `Answer is ${answer} calculated in ${ timer}`);
console.log('Done');