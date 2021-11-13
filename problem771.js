const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');
const PreciseNumber = require('tools/preciseNumber');

require('tools/numberHelper');

const MODULO = 1000000007;

const log = base => n => Math.log(n) / Math.log(base);

const triangle = n => {
    n -= 4;
    if (n & 1) {
        return n * ((n+1)/2);
    } else {
        return (n/2)*(n+1);
    }
}

const getMaxLength = (k,N) => {
    const v = log(k)(N);
    return Math.floor(v);
};

function fastG(n, minLength, isValid)
{
    const $inner = [];

    if (! isValid) {
        isValid = (a1, a2, length) => length >= minLength;
    }

    minLength = Math.max(minLength || 5, 4);

    function get(length, a1, a2)
    {
        let a = $inner[length];
        if (! a) return;
        a = a[a1];
        if (a) {
            return a[a2]
        }
    }

    function set(length, a1, a2, total)
    {
        let a = $inner[length];
        if (! a) {
            a = $inner[length] = [];
        }
        let b = a[a1];
        if (! b) {
            b = a[a1] = [];
        }

        b[a2] = total;
    }

    function inner(a1, a2, length) 
    {        
        length = Math.min(minLength, length);

        let total = get(length, a1, a2);
        if (total !== undefined) {
            return total;
        }

        total = isValid(a1, a2, length) ? 1 : 0;

        const A2 = a2*a2;
        
        const start = Math.max(a2+1, Math.ceil((A2 - 2)/a1));
        const end   = Math.min((A2+2)/a1, n)

        for(let a3 = start; a3 <= end; a3++) {
            total = (total + inner(a2, a3, length+1)) % MODULO;
        }

        set(length, a1, a2, total);
        return total;
    }

    let total = 0;
    for(let a1 = 1; a1 < n-(minLength-2); a1++) {
        for(let a2 = a1+1; a2 < n-(minLength-3); a2++) {
            total = (total + inner(a1, a2, 2)) % MODULO;
        }
    }

    return total;
}


function slowG(n)
{
    minLength = 5;

    const sequence = [];

    function isRegular(s) 
    {
        for(let i = 1; i < s.length; i++) {
            if (s[i] !== s[i-1]+1) {
                return false;
            }
        }
        return true;
    }

    function isGeometric(s)
    {
        let k = PreciseNumber.create(BigInt(s[2]), BigInt(s[1]));
        for(let i = 2; i < s.length-1; i++) {
            const v = k.times(s[i-1]);
            if (v.divisor !== 1n) { return false; }
            if (Number(v.numerator) !== s[i]) {
                return false;
            } 
        }
        const v = Math.floor(Number(k.times(s[s.length-2]).valueOf()));
        return v === s[s.length-1];
    }

    function isA(s)
    {
        let k = PreciseNumber.create(BigInt(s[2]-s[0]), BigInt(s[1]));
        for(let i = 2; i < s.length; i++) {
            const v = k.times(s[i-1]).plus(s[i-2]);
            if (v.divisor !== 1n) { return false; }
            if (Number(v.numerator) !== s[i]) {
                return false;
            } 
        }
        return true;
    }

    function isB(s)
    {
        let k = PreciseNumber.create(BigInt(s[2]+s[0]), BigInt(s[1]));
        for(let i = 2; i < s.length; i++) {
            const v = k.times(s[i-1]).minus(s[i-2]);
            if (v.divisor !== 1n) { return false; }
            if (Number(v.numerator) !== s[i]) {
                return false;
            } 
        }
        return true;
    }

    function isPower2(s)
    {
        for(let k = 1; k <= s[0]; k++) {
            if (s[0] % k !== 0) {
                continue;
            }
            let v = 1;
            while (v*k < s[0]) { 
                v *= 2; 
            }
            let found = true;
            for(const x of s) {
                if (x !== v*k) {
                    found = false;
                    break;
                }
                v *= 2;
            }
            if (found) {
                return true;
            }
        }
        return false;
    }

    function isFibonacci(s) 
    {
        let v1 = 1;
        let v2 = 2;
        while (v1 < s[0]) {
            [v1, v2] = [v2, v1+v2];
        }
        for(let v of s) {
            if (v !== v1) { return false; }
            [v1, v2] = [v2, v1+v2];
        }
        return true;
    }

    function exists(subSequence)
    {
        if (isRegular(subSequence)) {
            return true;
        }
        if (isFibonacci(subSequence)) {
            return true;
        }
        if (isPower2(subSequence)) {
            return true;
        }
        if (isA(subSequence)) {
            return true;
        }
        if (isB(subSequence)) {
            return true;
        }
        if (isGeometric(subSequence)) {
            return true;
        }

        for(let seq of sequence) {
            let first = subSequence[0];
            let idx   = seq.indexOf(first);
            if (idx >= 0) {
                let found = true;
                for(let i = 0; i < subSequence.length; i++) {
                    if (subSequence[i] !== seq[idx+i]) {
                        found = false;
                        break;
                    }
                }
                if (found) { 
                    return true; 
                }
            }
        }
    }

    function inner(a1, a2, length, values) 
    {        
        let total = 0;

        const A2 = a2*a2;
        
        const start = Math.max(a2+1, Math.ceil((A2 - 2)/a1));
        const end   = Math.min((A2+2)/a1, n)

        for(let a3 = start; a3 <= end; a3++) {
            total = (total + inner(a2, a3, length+1, [...values, a3])) % MODULO;
        }

        if (length > 4) {
            if (! exists(values)) {
                sequence.push(values);
            }
            total++;
        }

        return total;
    }

    let total = 0;
    for(let a1 = 1; a1 < n-3; a1++) {
        for(let a2 = a1+1; a2 < n-2; a2++) {
            total = (total + inner(a1, a2, 2, [a1, a2])) % MODULO;
        }
    }

    sequence.sort((a, b) => a.join(',').localeCompare(a.join(',')));

    return total;
}

function goodG(n)
{
    const exceptions = [
        [1,2,3,4,6,9],
        [1,2,3,5,9,16],
        [1,2,4,7,12],
        [1,2,4,9,20],
        [1,2,6,17,48],
        [1,2,6,19,60],
    ];

    function addExceptions()
    {
        let total = 0;
        for(const exception of exceptions) {
            let length = exception.length;
            while (length >= 5 && exception[length-1] > n) { 
                length--; 
            }
            if (length >= 5) {
                total += triangle(length);
            }
        }
        return total;
    }

    let total = triangle(n) + addExceptions();

    function getFibonacciLength()
    {
        let length = 1;
        let a1 = 1, a2 = 2;
        while (a2 <= n) {
            length++;
            [a2, a1] = [a2+a1, a2];
        }
        return length;
    }

    function getLength(k, direction, a0, a1)
    {
        let length = 0;
        a0 = a0 || 0;
        a1 = a1 || 1;
        while(true) {
            length++;
            let a2 = k*a1 + direction*a0;
            if (a2 > n) {
                break;
            }
            if (a2 <= a1) {
                break; 
            }
            [a1, a0] = [a2, a1];
        }

        return length;
    }

    const old = total;
    
    // a(n) = k * a(n-1);
    for(let k = 2; ; k++) {
        const l = getMaxLength(k, n);
        if (l < 5) {
            break;
        }
        total += triangle(l);
    }

    console.log(total - old);
    
    // a(n) = k * a(n-1) + a(n-2);
    for(let k = 1; ; k++) { // k=1 => Fibonacci
        let l1 = getLength(k, +1);
        let l2 = getLength(k, +1, 1, 1);
        if (l1 < 5 && l2 < 5) { 
            break;
        }
        if (l1 >= 5)
            total += triangle(l1);
        if (l2 >= 5)
            total += triangle(l2);
    }

    // a(n) = k * a(n-1) - a(n-2);
    for(let k = 3; ; k++) { // with 2 it's 1,2,3,4,... which is already counted
        let l1 = getLength(k, -1);
        let l2 = getLength(k, -1, 1, 1);
        if (l1 < 5 && l2 < 5) { 
            break;
        }
        if (l1 >= 5)
            total += triangle(l1);
        if (l2 >= 5)
            total += triangle(l2);
    }

    // // a(n) = (x/y) * a(n-1)
    // for(let y = 2; ; y++) {
    //     let start = y**4;

    //     if (start > n) {
    //         break;
    //     }

    //     for(let length = 5; start <= n; length++, start *= y) {
    //         const maxX = Math.floor(Math.pow(n, 1/(length-1)));
    //         if (maxX <= y) { 
    //             break; 
    //         }
    //         const T = triangle(length);            
    //         for(let x = y+1; x <= maxX; x++) {
    //             if (x.gcd(y) === 1) 
    //             {
    //                 const end = 
    //                 total += T;
    //             }
    //         }        
    //     }
    // }

    return total;
}

const G = goodG;

// timeLogger.wrap('', _ => G(1E6));

// timeLogger.wrap('', _ => {
//     assert.strictEqual(G(6), 4);
//     assert.strictEqual(G(10), 26);
//     assert.strictEqual(G(100), 4710);
//     assert.strictEqual(G(1000), 496805);
// });

// console.log('Tests passed');

// const answer = timeLogger.wrap('', _ => G(1e5));
// console.log(`Answer is ${answer}`);

console.log(G(100));

let values = [
    26-G(1e1),
    4710-G(1e2),
    496805-G(1e3),
    49967133-G(1E4),
    4999669432-G(1E5),
    499996691239-G(1E6),
    49999966908763-G(1E7),
    4999999669087015-G(1E8),
];

console.log(values.join(', '));
// const l = require('tools/linearRecurrence');
// console.log(l(values));
