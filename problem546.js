const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

require('tools/numberHelper');

const MODULO = 1E9 + 7;

let $F = new Map();
let $FK = 0;

function FF(K, n, trace)
{
    if (n < K) 
        return n+1;

    if ($FK !== K) {
        $F.clear();
        $FK = K;
    }

    let total = $F.get(n);
    if (total !== undefined)
        return total;
    
    total = 0;
    let end = (n - (n % K));
    let extra = (n - end) + 1;
    let x = 0;

    const tracer = new Tracer(1000, trace);
    for(let i = 0; i < end; i += K) {
        tracer.print(_ => n - i);
        const v = FF(K, x++).modMul(K, MODULO);
        total = (total + v) % MODULO;
    } 

    if (extra) {
        total = (total + FF(K, x).modMul(extra, MODULO)) % MODULO;
    }
    tracer.clear();

    $F.set(n, total);

    return total;
}

function F(base, n, trace)
{    
    if (n < base) 
        return (n+1); // % MODULO;

    if ($FK !== base) {
        $F.clear();
        $FK = base;
    }

    let total = $F.get(n);
    if (total !== undefined)
        return total;
    
    const x = (n - (n % base)) / base;
    
    total = 0;

    const tracer = new Tracer(1000, trace);

    let m = Math.min(x, base);

    total = base * ( (m*(m+1))/2 );

    let start = base;

    for(let k = 1; k <= 10; k++) {
        if (base > k && x >= start) {
            start += base;
    		m = Math.min(x, (k+1)*base) - k*base;
    		
            let subTotal = (k+1)*m*(m+1+k*base)/2;        
            total = (total + base*subTotal) % MODULO;
        }
    }

    for(let i = start; i < x; i++) {
        tracer.print(_ => x-i);
        total = (total + base.modMul(F(base, i), MODULO)) % MODULO;
    }

    if (n % base === 0n) {
        total = (total + F(base, x)) % MODULO;
    }
    else {
        const p = (n % base)+1;
        total = (total + p.modMul(F(base, x), MODULO)) % MODULO;
    }
    tracer.clear();

    $F.set(n, total);

    return total;    
}

function solve(n)
{
    let total = 0;
    const tracer = new Tracer(1, true);
    for(let k = 2; k <= 10; k++) {
        tracer.print(_ => k);
        total = (total + F(k, n, true)) % MODULO;
    }
    tracer.clear();
    return total;
}

function analyze()
{
    // assert.strictEqual(timeLogger.wrap('', _ => a(2 * 1000)), 264830889564 % MODULO);

    const values2 = [];
    const values4 = [];

    for(let n = 0; n < 50; n++) {
        values2.push(F(2, n));
        values4.push(F(4, n));
    }

    console.log(values2.join(', '));
    console.log(values4.join(', '));
    process.exit();
}

// analyze();

assert.strictEqual(F(7, 700), 215882);

assert.strictEqual(F(5, 10), 18);
assert.strictEqual(F(7, 100), 1003);
assert.strictEqual(timeLogger.wrap('', _ => F(2, 1000)), 264830889564 % MODULO);

console.log('Tests passed');

const answer = timeLogger.wrap('1E5', _ => solve(1E5));

console.log(`Answer is ${answer}`);

`
N = A*k + B

F(N) = k*F(0) + k*F(1) ... + k*F(A-1) + (B+1)*F(A)

1 = 0*k + 1
F(1) = 2*F(0)
2 = 0*k + 2
F(2) = 2*F(0)+F(1)

F(N) = k*k*(k+1)/2 + k*F(k) + ... + k*F(A-1) + (B+1)*F(A)

k = 1*k + 0
F(k) = k*F(0) + 2*F(0)
F(k+1) = k*F(0) + 4*F(0)
F(k+2) = k*F(0) + 6*F(0)

F(k+k-1) = k*F(0) + 2*k*F(0)

F(k)+...+F(2*k-1) = k*(k*F(0) + (k * k+1))

F(2*k)   = k*F(0) + k*F(1) + 1*F(2)  = k*1 + k*2 + 1*3
F(2*k+1) = k*F(0) + k*F(1) + 2*F(2)  = k*1 + k*2 + 2*3

F(2*k)+...+F(2*k+k-1) = 3*(m*k + (m*(m+1))/2
`