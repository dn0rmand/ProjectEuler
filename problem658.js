const assert = require('assert');
const prettyTime= require("pretty-hrtime");
const announce = require('tools/announce');

require('tools/numberHelper');

const modulo     = 1000000007;
const MODULO     = 1000000007n;

const LETTERS    = 1E7; // 1E7;
const MAX_LENGTH = 1E12;

// const $modInverse = (function() {
//     let result = new Uint32Array(modulo);

//     console.log('Preloading modulo inverse')
//     for (let i = 1; i < modulo; i++)
//     {
//         result[i] = i.modInv(modulo);
//     }
//     console.log('Modulo inverse loaded')
//     return result;
// })();

class problem658
{
    constructor(letters, length, trace)
    {
        this.$factorials = [];
        this.$modInverse = [];
        this.modulo      = 1000000007;
        this.factors     = [];
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

            let x = this.factors[j];
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
            let x = CCache[letters-j];
            if (x === undefined)
            {
                x = this.C(letters, j);
                CCache[j] = x;
            }
            let s = (this.factors[j] || 0) + (negative ? -x : x);
            if (s >= this.modulo || s <= -this.modulo)
                s %= this.modulo;

            this.factors[j] = s;
        }
    }

    S()
    {
        let timer = process.hrtime();
        for (let l = 1; l <= this.letters; l++)
        {
            if (this.trace)
                process.stdout.write(`\r${l}`);

            this.I1(l);
        }
        timer = process.hrtime(timer);

        if (this.trace)
        {
            console.log("\rStep 1 done in", prettyTime(timer, {verbose:true}));
            console.log("Last step - Consolidation");
        }

        let total = this.I();

        if (this.trace)
            console.log('Done');

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

let timer = process.hrtime();
let answer = problem658.Solve(LETTERS, MAX_LENGTH, true);
timer = process.hrtime(timer);

timer = prettyTime(timer, {verbose:true});
console.log('Answer is', answer, 'calculated in', timer);
// announce(658, `Answer is ${answer} calculated in ${ timer}`);
console.log('Done');