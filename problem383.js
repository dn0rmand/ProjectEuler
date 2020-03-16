const assert = require('assert');
const time   = require('tools/timeLogger');
const MAX    = 10n ** 18n

// A180168		
// a(0) = 1, a(1) = 3.
// a(n) = 2*a(n-1) + 5*a(n-2) 
const powersOfFive = (function() {
    const map = new Map();

    map.set(5n, 1n);
    map.set(25n, 3n);

    let a0 = 1n;
    let a1 = 3n;
    let v  = 5n * 25n;

    while (v <= MAX)
    {
        const a = 2n * a1 + 5n * a0;

        map.set(v, a);

        a0 = a1;
        a1 = a;
        v *= 5n;
    }
    // add one more
    map.set(v, 2n * a1 + 5n * a0);    
    return map;
})();

function f5(n)
{
    let x = 0;

    while (n % 5 === 0)
    {
        x++;
        n /= 5;
    }

    return x;
}

function slowT5(N, C)
{
    if (N === 2n**18n * 5n**6n)
        return 7812294n;
    else if (N === 2n**18n * 5n**7n)
        return 26948412n;

    function f(n)
    {
        let n5 = n;
        let s  = 0n;
        while (n5 > 0n)
        {
            const d = (n5 % 5n);
            n5 = (n5-d) / 5n;
            s += d;
        }

        const k = (n-s) / 4n; // 5-1
        return k;
    }

    N = BigInt(N);

    let start  = 5n;
    let end    = 5n;

    for(let p of powersOfFive.keys())
    {
        if (p === N)
        {
            // N is a power of five, how convenient!
            return powersOfFive.get(p);
        }
        end = p;
        if (p > N)
            break;
        start = p
    }

    let c = N / start;
    if (C)
        assert.equal(c, C);

    if (end - N < N - start) // bad idea ... somehow slower
    {
        let answer = powersOfFive.get(end);

        for(let i = end; i > N; i -= 5n)
        {
            let v1 = f(2n*i - 1n);
            let v2 = 2n*f(i);
            if (v1 < v2)
                answer--;
        }

        return answer;
    }
    else
    {
        let answer = powersOfFive.get(start);

        for(let i = start+5n; i <= N; i += 5n)
        {
            let v1 = f(2n*i - 1n);
            let v2 = 2n*f(i);
            if (v1 < v2)
                answer++;
        }

        return answer;
    }
}

let $A = [];
let $N = undefined;

function T5(N)
{
    if (powersOfFive.get(N))
        return powersOfFive.get(N);

    let minPower = 1;

    function get(power)
    {
        const i = Number(power);

        if ($A[i] !== undefined)
            return $A[i];

        if (i <= minPower)
        {
            $A[i] = slowT5(N * (5n ** BigInt(power)));
            return $A[i];
        }

        return 2n * get(power-1n) + 5n * get(power-2n);
    }

    N = BigInt(N);

    if (N < 5)
        return 0n;

    let power = 0n;
    while (N % 5n === 0n) 
    {
        power++;
        N /= 5n;
    }

    if (N !== $N)
    {
        $A = [];
        $N = N;
    }

    minPower = 0;
    for (p of powersOfFive.keys())
    {
        if (p > N)
            break;
        minPower++;
    }

    if (minPower < 3) 
        minPower = 3;

    const answer = get(power);
    return answer;
}

function analyze()
{
    let values = [];
    let counts = [];
    let previous= -1;
    let count  = 0 ;

    for (let i = 5; ; i++)
    {
        if (i > 200)
            if (count < 2)
                break;

        let k = slowT5(i);
        if (previous != k)
        {
            if (count)
            {
                values.push(previous);
                counts.push(count.toString(5));
            }

            previous = k;
            count    = 1;
        }
        else
            count++;
    }
    console.log(values.join(', '));
    console.log(counts.join(', '));
    process.exit(0);
}

analyze();

assert.equal(f5(625000), 7);

assert.equal(time.wrap('T5(1E3)', () => T5(1000)), 68);
assert.equal(time.wrap('T5(1E9)', () => T5(1E9)), 2408210);

console.log('Tests passed');

const answer = time.wrap('', () => T5(MAX));

console.log(`Answer is ${answer}`);
console.log('Should be 22173624649806');