const assert = require('assert');
const prettyTime= require("pretty-hrtime");
const announce = require('tools/announce');

require('tools/numberHelper');

const modulo     = 1000000007;
const MODULO     = 1000000007n;

const LETTERS    = 1E4;
const MAX_LENGTH = 1E12;

class problem658
{
    constructor(letters, length, trace)
    {
        this.$factorials = [];
        this.$modInverse = [];
        this.modulo      = 1000000007;
        this.factors     = new Uint32Array(letters);
        this.currentRow  = new Uint32Array(letters);
        this.previousRow = new Uint32Array(letters);
        this.letters     = Number(letters);
        this.length      = Number(length);
        this.trace       = trace === true;

        this.loadFactorials();
    }

    loadFactorials()
    {
        if (this.trace)
            console.log('Loading factorials and associated modulo inverse');
        let current = 1;
        this.$factorials[0] = current;

        for (let i = 1; i <= this.letters; i++)
        {
            current = current.modMul(i, this.modulo);

            if (current === 0) // maybe
                current = this.modulo;
            this.$factorials[i] = current;
            this.$modInverse[current] = current.modInv(modulo);
            if (this.$modInverse[i] === undefined)
                this.$modInverse[i] = i.modInv(modulo);
        }
        if (this.trace)
            console.log('Factorials loaded');
    }

    C(n, r)
    {
        let t  = this.$factorials[n];
        let b1 = this.$modInverse[this.$factorials[n-r]];
        let b2 = this.$modInverse[this.$factorials[r]];
        t = t.modMul(b1, modulo).modMul(b2, modulo);
        return t;
    }

    C2(n, r)
    {
        let t = this.$factorials[n];
        let b = this.$modInverse[this.$factorials[r]];
        t = t.modMul(b, modulo);
        return t;
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

    I1(letters)
    {
        let negative = true;
        let CCache   = [];
        for (let j = letters-1; j >= 0; j--)
        {
            negative = ! negative;
            let x  = CCache[letters-j];
            if (x === undefined)
            {
                x = this.C(letters, j);
                CCache[j] = x;
            }

            let sn = negative ? '-' : '+';
            let r = letters-j;
            // if (r > j)
            //     r = j;

            let sx = `${sn}${x}` + (this.$info[j] || '');
            this.$info[j] = sx;

            let s = (this.factors[j] || 0) + (negative ? -x : x);
            if (s >= this.modulo || s <= -this.modulo)
                s %= this.modulo;

            this.factors[j] = s;
        }
    }

    I2(letter)
    {
        let total = 0;
        if (letter === 1)
        {
            for (let l = 0; l <= this.letters-letter; l++)
            {
                let v = (l & 1) ? this.modulo-1 : 1;
                this.currentRow[l] = v;
                total += v;
                if (total >= this.modulo)
                    total -= this.modulo;
                else if (total < 0)
                    total += this.modulo;
            }
        }
        else // use previous row to figure it out
        {
            this.currentRow[0] = letter;
            total  = letter;
            for (let l = 1; l <= this.letters-letter; l++)
            {
                let v = this.previousRow[l] - this.currentRow[l-1];
                if (v >= this.modulo)
                    v -= this.modulo;
                else if (v < 0)
                    v += this.modulo;

                this.currentRow[l] = v;

                total += v;

                if (total >= this.modulo)
                    total -= this.modulo;
                else if (total < 0)
                    total += this.modulo;
            }
        }
        this.factors[letter-1] = total;
    }
/*
    C(n  , r)   = n! / (r! * (n-r)!)
    C(n+1, r+1) = n!*(n+1)*(n-r) / (r! * (r+1) * (n-r)! ) = C(n,r) * [ (n+1)*(n-r) / (r+1) ]

    C(n, 1) = n
*/

    S()
    {
        // if (this.length === MAX_LENGTH && this.letters < 50)
        // {
        //     for (let l = 1; l <= this.letters; l++)
        //     {
        //         this.I1(l);
        //     }
        // }

        let timer = process.hrtime();

        for (let l = 1; l <= this.letters; l++)
        {
            if (this.trace)
                process.stdout.write(`\r${l}`);

            this.I2(l);

            // Switch rows to avoid allocating memory
            let r = this.currentRow;
            this.currentRow  = this.previousRow;
            this.previousRow = r;
        }
        timer = process.hrtime(timer);

        if (this.length === MAX_LENGTH && this.letters < 50)
        {
            console.log(`Factors for ${ this.letters } letters`);
            for (let l = 1; l <= this.letters; l++)
            {
                let v = this.factors[this.letters-l];
                if (v > (modulo / 2))
                    v = v - modulo;
                let s = v >= 0 ? '+' : ''
                console.log(`${l} = ${s}${v}`);// = ${this.$info[this.letters-l]}`);
            }
            console.log('');
        }

        if (this.trace)
        {
            console.log("\rStep 1 done in", prettyTime(timer, {verbose:true}));
            console.log("Last step - Consolidation");
        }

        let total = this.I();

        if (this.trace)
            console.log('\rDone     ');

        return total;
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

// problem658.Solve(5, MAX_LENGTH);
// problem658.Solve(6, MAX_LENGTH);
// problem658.Solve(7, MAX_LENGTH);
// problem658.Solve(8, MAX_LENGTH);
// problem658.Solve(9, MAX_LENGTH);
// problem658.Solve(10, MAX_LENGTH);

let timer = process.hrtime();
let answer = problem658.Solve(LETTERS, MAX_LENGTH, true);
timer = process.hrtime(timer);

timer = prettyTime(timer, {verbose:true});
console.log('Answer is', answer, 'calculated in', timer);
// announce(658, `Answer is ${answer} calculated in ${ timer}`);
console.log('Done');