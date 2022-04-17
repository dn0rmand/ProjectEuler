const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const prettyTime= require("pretty-hrtime");

const MODULO = 7n ** 10n;
const MAX    = 10n ** 16n;

class Fib
{
    constructor(x, y, width, height, area)
    {
        this.area = area;
        this.x    = x;
        this.y    = y;
        this.width = width;
        this.height= height;
        this.sum   = 0n;
    }

    get right() { return this.x + this.width - 1n; }

    fits(n)
    {
        return this.right <= n;
    }

    moveTo(x, y)
    {
        const F = new Fib(x, y, this.width, this.height, this.area);

        F.sum = this.moveSum(x, y);

        return F;
    }

    moveSum(x, y)
    {
        const offset = (x - this.x) + (y - this.y);
        return this.sum + this.area * offset;
    }

    get totalSum()
    {
        const H = (this.y - 3n);
        const W = this.width;

        const C = this.x * W * H;
        const X = H * ((W*(W-1n)) / 2n)
        const Y = W * (((this.y * (this.y - 1n)) / 2n) - 3n);

        return this.sum + C + X + Y;
    }

    mergeSums(F0, x, y)
    {
        const A = F0.width * this.height;
        const B = 2n * (x + y + this.width) + (F0.width + this.height - 2n);
        const s = (A * B) / 2n;

        return s;
    }

    merge(F0)
    {
        const F = new Fib(this.x + this.width,
                         this.y + this.height,
                         this.width + F0.width,
                         this.height + F0.height,
                         (F0.width  * this.height) + F0.area + this.area);

        F.sum = F0.moveSum(F.x + this.width, F.y + this.height) +
                this.moveSum(F.x, F.y) +
                this.mergeSums(F0, F.x, F.y);

        return F;
    };
}

function S2(N)
{
    let F0 = new Fib(5n, 3n, 2n, 1n, 2n);
    let F1 = new Fib(7n, 4n, 3n, 2n, 4n);

    F0.sum = 2n*3n + (5n+6n);
    F1.sum = 3n*4n + (7n+8n+9n) + 5n + 9n;

    let total = F0.sum + F1.totalSum;

    const fibonacci = [F0, F1];

    while (true)
    {
        const F = F1.merge(F0);

        if (! F.fits(N))
        {
            let {x, y} = F;

            while (x <= N && fibonacci.length > 0)
            {
                const f = fibonacci.pop().moveTo(x, y);

                if (f.fits(N))
                {
                    total += f.totalSum;
                    x += f.width;
                    y += f.height;
                }
            }
            if (x === N)
            {
                const f = new Fib(x, y, 1n, 1n, 1n);
                f.sum = f.x + f.y;
                x += 1n;
                total += f.totalSum;
            }

            if (x-1n !== N)
                throw "ERROR";

            return total;
        }
        else
        {
            fibonacci.push(F);

            F0 = F1;
            F1 = F;

            total += F.totalSum;

            if (F.right === N)
                return total;
        }
    }
}

function S(N, trace)
{
    N = BigInt(N);

    const s1 = ((N**3n - 2n*N**2n - 9n*N + 18n) / 2n) + 5n;
    const s2 = S2(N, trace);

    const total = (s1 - s2) % MODULO;

    return Number(total);
}

assert.equal(S(10), 211);
assert.equal(S(50), 28389);
assert.equal(S(10000), 230312207313n % MODULO);
assert.equal(S(1000000), 131546468);
assert.equal(S(10000000), 38318073);

console.log('Tests passed');

const answer = timeLogger.wrap('', () => S(MAX, true));
console.log('Answer is', answer);
