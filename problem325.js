const assert = require('assert');
const prettyTime= require("pretty-hrtime");

require('tools/numberHelper');
require('tools/bigintHelper');

const MODULO = 7n ** 10n;
const MAX    = 10n ** 16n;

const GOLDEN_RATIO = (3+Math.sqrt(5))/2;

function bruteForce(N)
{
    function canWin(x, y)
    {
        if (x > y)
            [x, y] = [y, x];

        if (y % x == 0)
            return true;
        for(let i = 1; ; i++)
        {
            let v = i*x;
            if (v > y)
                break;
            if  (v == y)
                return true;

            if (isLosing(x, y - v))
                return true;
        }

        return false;
    }

    function isLosing(x, y)
    {
        if (x > y)
            [x, y] = [y, x];

        if (y % x == 0)
            return false;

        for(let i = 1; ; i++)
        {
            let v = i*x;
            if (v > y)
                break;
            if  (v == y)
                return false;

            if (! canWin(x, y - v))
                return false;
        }

        return true;
    }

    function F(v)
    {
        if (v < 10)
            return '  ' + v;
        else if (v < 100)
            return ' ' + v;
        else
            return '' + v;
    }

    let graph = new Array(N+1);
    let total = 0;

    graph[0] = new Array(N+1);
    graph[0].fill(' ');

    for (let x = 1; x <= N; x++)
    {
        graph[x] = new Array(N+1);
        graph[x].fill(' ');

        for (let y = x+1; y <= N; y++)
        {
            if (isLosing(x, y))
            {
                graph[x][y] = '#';
                total += (x+y);
            }
            else
            {
                graph[x][y] = '.';
            }
        }
    }

    let dots = 0;
    for (let x = graph.length-1; x > 2 ; x--)
    {
        var a = graph[x];
        if (a)
        {
            let d = a.reduce((a, v, y) => a += (v == '.' ? x+y : 0), 0);
            console.log(a.join(''), ':', F(x));
            dots += d;
        }
    }

    return {total, dots};
}

function S0(N, trace)
{
    // sum x = 3 .. N-1 ( sum y = x+1 .. N ( x+y) )
    const EXPECTED_STEPS = Math.ceil(Number(N) / GOLDEN_RATIO)+1;

    function evenSum(N)
    {
        let n  = N / 2n;
        return n*(n+1n);
    }

    function oddSum(N)
    {
        return (N*(N+1n) / 2n) - evenSum(N);
    }

    function *growing()
    {
        let previous = { value: 1};
        let first = { value:1 };
        let last  = first;
        let count = 1;
        let remainingSteps = EXPECTED_STEPS;

        while (true)
        {
            let l = last;

            last = previous;
            last.next = undefined;
            previous = first;

            yield first.value;
            remainingSteps--;

            if (first.value == 1)
            {
                count++;
                l.next = {value: 0, next: last};
            }
            else
            {
                l.next = last;
                previous.value = 1;
            }
            first = first.next;

            if (count >= remainingSteps)
            {
                if (trace)
                    process.stdout.write('\rLoaded enough fibonacci words\n');
                break;
            }
        }

        while (first !== undefined)
        {
            yield first.value;
            first = first.next;
        }

        throw "Ran out of value!!!!";
    }

    N = BigInt(N);

    let top     = 5n;
    let bottom  = 2n*N - 1n;
    let total   = 0n;
    let traceCount = 0;

    for(let grow of growing())
    {
        if (trace === true)
        {
            if (traceCount++ == 0)
                process.stdout.write(`  \r${bottom - top}`);
            if (traceCount >= 500000)
                traceCount = 0;
        }

        if (top & 1n) // odd
        {
            sum = oddSum(bottom) - oddSum(top-2n);
        }
        else
        {
            sum = evenSum(bottom) - evenSum(top-2n);
        }

        if (sum <= 0n)
            break;

        total = (total + sum) % MODULO;

        bottom--;
        if (grow)
            top += 5n;
        else
            top += 3n;

    }

    if (trace)
        process.stdout.write('\r       \r');

    return Number(total);
}

class Fib
{
    constructor(x, y, width, height, area)
    {
        this.area = area;
        this.x    = x;
        this.y    = y;
        this.width = width;
        this.height= height;
    }

    get right() { return this.x + this.width - 1n; }

    fits(n)
    {
        return this.right <= n;
    }

    moveTo(x, y)
    {
        let F = new Fib(x, y, this.width, this.height, this.area);

        F.sum = this.moveSum(x, y);

        return F;
    }

    moveSum(x, y)
    {
        let offset = (x - this.x) + (y - this.y);
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
        let F = new Fib(this.x + this.width,
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

    let s2 = F0.sum + F1.totalSum;

    const fibonacci = [F0, F1];

    while (true)
    {
        let F = F1.merge(F0);

        if (! F.fits(N))
        {
            let {x, y} = F;

            while (x <= N && fibonacci.length > 0)
            {
                let f = fibonacci.pop();
                f = f.moveTo(x, y);

                if (f.fits(N))
                {
                    s2 += f.totalSum;
                    x += f.width;
                    y += f.height;
                }
            }

            if (x-1n !== N)
                throw "ERROR";

            return s2;
        }
        else
        {
            fibonacci.push(F);

            F0 = F1;
            F1 = F;

            s2 += F.totalSum;

            if (F.right === N)
                return s2;
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

function analyse(n)
{
    const totalRef = S0(n);
    const total    = S(n);

    assert.equal(total, totalRef);
}

analyse(35);
analyse(56);
analyse(90);
analyse(832041);

analyse(50);


// assert.equal(S(10), 211);
assert.equal(S(50), 28389);
// assert.equal(S(10000), 230312207313n % MODULO);
assert.equal(S(1000000), 131546468);
assert.equal(S(10000000), 38318073);

let timer = process.hrtime();
let answer = S(MAX, true);

timer = process.hrtime(timer);
console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));
