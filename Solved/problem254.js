const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');

const MAX_SF = 150;
const factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880];

function addDigits(n)
{
    let total = 0;

    if (n > Number.MAX_SAFE_INTEGER) {
        n = BigInt(n);
        while (n > 0n) {
            const digit = n % 10n;
            n = (n - digit) / 10n;
            total += Number(digit);
        }
    } else {
        n = Number(n);
        while (n > 0) {
            const digit = n % 10;
            n = (n - digit) / 10;
            total += digit;
        }
    }
    return total;
}

function generateSGMap()
{
    const tracer = new Tracer(1, true);

    const sgMap = []; 

    const counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const f9 = factorials[9];

    function inner(value, digit, sum, length) 
    {
        let v = value;
        let s = sum;

        for(let l = length; l >= 0; l--) {
            const $sg = addDigits(s);
            if ($sg <= MAX_SF) {   
                const old = sgMap[$sg];
                if (!old || v < old.value) {
                    sgMap[$sg] = {
                        value: v,
                        f: s,
                        sum: addDigits(v)
                    };
                }
            }
            v = v*10n + 9n;
            s += f9;
        }
        tracer.print(_ => value);

        if (length) {
            for(let d = digit; d < 9; d++) {
                if (d < 9 && counts[d] >= d) {
                    continue;
                }

                let v = value*10n;
                if (d !== 1 || value === 0n) {
                    v += BigInt(d);
                }
                counts[d]++;
                inner(v, d, factorials[d] + sum, length-1);
                counts[d]--;
            }
        }
    }

    // Calculate till 63
    inner(0n, 1, 0, 45);

    // now calculate 64...150 based on the f of 63 ( f = sum of factorial of digits of the value )
    let f = sgMap[63].f.toString().split('').map(v => +v);

    for(let sf = 64; sf <= MAX_SF; sf++) {
        if (f[0] === 9) {
            f.unshift(1);
        } else {
            f[0]++;
        }
        let ff = BigInt(f.join(''));
        let sum = 0;
        for(let digit = 9; digit > 0; digit--) {
            const x = ff % BigInt(factorials[digit]);
            if (x !== ff) { 
                let count = Number((ff - x) / BigInt(factorials[digit]));
                ff = x;

                sum += count * digit;
            }
        }
        if (sgMap[sf]) {
            assert.strictEqual(sum, sgMap[sf].sum);
        } else {
            sgMap[sf] = { sum };
        }
    }

    tracer.clear();
    return sgMap;
}

let $sgMap = [];

function f(n)
{
    if (n === 0) {
        return 1; // special case
    }

    let total = 0;
    while (n > 0) {
        const digit = n % 10;
        n = (n - digit) / 10;
        total += factorials[digit];
    }
    return total;
}

function sf(n) 
{
    return addDigits(f(n));
}

function g(i) 
{
    for(let n = 1; ; n++) {
        const v = sf(n);
        if (v === i) {
            return n;
        }
    }
}

function sg(i)
{
    if ($sgMap[i]) {
        return $sgMap[i].sum;
    }

    let total = `${g(i)}`.split('');
    
    total = total.reduce((a, v) => a + (+v), 0);

    return total;
}

function ssg(max, trace)
{
    const tracer = new Tracer(1, trace);

    let total = 0n;
    for(let i = 1; i <= max; i++) {
        tracer.print(_ => `${i} of ${max}`);
        total += BigInt(sg(i));
    }
    tracer.clear();
    return total;
}

assert.strictEqual(g(20), 267);
assert.strictEqual(g(5), 25);

assert.strictEqual(sg(5), 7);
assert.strictEqual(ssg(20), 156n);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => {
    $sgMap = generateSGMap();
    return ssg(MAX_SF, true);
});

console.log(`Answer is ${answer}`);
