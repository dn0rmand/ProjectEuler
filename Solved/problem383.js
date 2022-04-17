const assert = require('assert');
const time   = require('@dn0rmand/project-euler-tools/src/timeLogger');
const MAX    = 10n ** 18n

// A180168		
// a(0) = 1, a(1) = 3.
// a(n) = 2*a(n-1) + 5*a(n-2) 

const powersOfFive = (function() 
{
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

function f(n)
{
    let n5 = n;
    let s  = 0;
    while (n5 > 0)
    {
        const d = (n5 % 5);
        n5 = (n5-d) / 5;
        s += d;
    }

    const k = (n-s) / 4; // 5-1
    return k;
}

function slowT5(N, trace)
{
    N = BigInt(N);

    let previous= -1n;
    let start   = 5n;

    for(let p of powersOfFive.keys())
    {
        if (p === N)
        {
            // N is a power of five, how convenient!
            return powersOfFive.get(p);
        }
        if (p > N)
            break;
        previous = start;
        start    = p
    }

    // move further

    const a0 = powersOfFive.get(previous); 
    const a1 = powersOfFive.get(start);

    const vs = [
        a1,
        3n * a0, 
        a0, 
        a0
    ];

    let answer   = a1;
    let position = start;

    while (position+start <= N && vs.length > 0)
    {
        answer    += vs.shift();
        position  += start;
    }

    if (position === N) // right on the dot :)
        return answer;

    N = Number(N);
    // finish up

    let  traceCount = 0;
    for(let i = Number(position)+5; i <= N; i += 5)
    {
        if (trace)
        {
            if (traceCount === 0)
                process.stdout.write(`\r${trace} - ${N-i}   `);
            if (traceCount++ > 100000)
                traceCount = 0;
        }

        let v1 = f(2*i - 1);
        let v2 = 2*f(i);
        if (v1 < v2)
            answer++;
    }

    if (trace)
        process.stdout.write('\r             \r');
    return answer;
}

function T5(N, trace)
{
    if (powersOfFive.get(N))
        return powersOfFive.get(N);

    let minPower = 1;
    let $A = [];

    function get(power)
    {
        const i = Number(power);

        if ($A[i] !== undefined)
            return $A[i];

        if (i <= minPower)
        {
            $A[i] = slowT5(N * (5n ** BigInt(power)), trace ? i : false);
            return $A[i];
        }

        return 2n * get(power-1n) + 5n * get(power-2n);
    }

    N = BigInt(N);

    if (N < 5)
        return 0n;

    let power  = 0n;
    while (N % 5n === 0n) 
    {
        power++;
        N /= 5n;
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
    for (let i = 0; i < 10; i++)
    {
        let values = [];

        for (let p = 5; p < 5**8; p *= 5)
        {
            let k = slowT5(2**i * p);
            values.push(k);
        }
        console.log(`${i} => ${ values.join(', ') }`);
    }
    process.exit(0);
}

// analyze();

assert.equal(f5(625000), 7);

assert.equal(T5(1600), 104);
assert.equal(time.wrap('T5(1E9)', () => T5(1E9)), 2408210);
assert.equal(time.wrap('T5(1E3)', () => T5(1000)), 68);
assert.equal(T5(3124),  128);

console.log('Tests passed');

const answer = time.wrap('', () => T5(MAX, true));

console.log(`Answer is ${answer}`);
console.log('Should be 22173624649806');