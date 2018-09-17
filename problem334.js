const assert = require('assert');
const bigInt = require('big-integer');

class Bowls
{
    constructor(beans)
    {
        this.bowls = new Map;
        this.min   = 0;
        this.max   = beans.length-1;
        this.position = 0;
        this.progress = 0;

        for (let i = 0; i < beans.length; i++)
        {
            this.bowls.set(i, beans[i]);
        }
    }

    get(index)
    {
        if (index < this.min || index > this.max)
            return 0;
        else
            return this.bowls.get(index);
    }

    set(index, value)
    {
        this.bowls.set(index, value);

        if (index < this.min || index > this.max)
        {
            if (index < this.min)
                this.min = index;
            if (index > this.max)
                this.max = index;

            if (this.progress === 0)
                process.stdout.write('\rMIN:' + this.min + ' - MAX:' + this.max);

            this.progress = (this.progress + 1) % 100;
        }

        return value;
    }

    steps()
    {
        let i = this.position;

        while (true)
        {
            let beans = this.get(i);
            if (beans > 1)
            {
                let remaining = beans & 1;
                let count     = (beans - remaining) / 2;

                this.set(i, remaining);

                let v1 = this.set(i-1, this.get(i-1) + count);
                let v2 = this.set(i+1, this.get(i+1) + count);

                if (v1 > v2)
                    this.position = i-1;
                else
                    this.position = i+1;

                return count;
            }

            i = i+1;
            if (i > this.max)
                i = this.min;
            if (i === this.position) // when round
                break;
        }

        return 0;
    }
}

function *sequence()
{
    const MODULO = 2048;

    let t = 123456;

    while (true)
    {
        if ((t & 1) === 0)
        {
            t = t/2;
        }
        else
        {
            t = ((t-1)/2) ^ 926252;
        }

        let b = (t % MODULO) + 1;
        yield b;
    }
}

function getBeans()
{
    let beans = [];
    for (let b of sequence())
    {
        beans.push(b);
        if (beans.length === 1500)
            break;
    }
    return beans;
}

function solve(beans)
{
    let bowls   = new Bowls(beans);
    let total   = 0;
    let extra   = bigInt.zero;

    while (true)
    {
        let steps = bowls.steps();
        if (steps === 0)
            break;

        let t = total + steps;
        if (t > Number.MAX_SAFE_INTEGER)
        {
            extra = extra.plus(total).plus(steps);
            console.log(' BigInt required');
            total = 0;
        }
        else
            total = t;
    }

    return total;
}

console.log('[2, 3]');
assert.equal(solve([2, 3]), 8);
console.log('');
console.log('[289, 145]');
assert.equal(solve([289, 145]), 3419100);
console.log('');

let answer = solve(getBeans());
console.log('');
console.log('Answer is', answer);
