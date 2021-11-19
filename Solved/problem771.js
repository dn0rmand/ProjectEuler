const timeLogger = require('tools/timeLogger');
const primeHelper = require('tools/primeHelper')(1E5);

require('tools/bigintHelper');

const MODULO = 1000000007;
const MODULO_N = BigInt(MODULO);
const MAX = 10n**18n;

function assert(value, expected, title)
{
    expected %= MODULO;
    if (value !== expected) {
        console.log(`${title} is incorrect. Expected ${expected} but got ${value}.`);
        process.exit(-1);
    }
}

const triangle = n => ((n-4n) * (n-3n)) / 2n;

function G(n, trace)
{
    n = BigInt(n);

    const exceptions = [
        [1n,2n,3n,4n,6n,9n],
        [1n,2n,3n,5n,9n,16n],
        [1n,2n,4n,7n,12n],
        [1n,2n,4n,9n,20n],
        [1n,2n,6n,17n,48n],
        [1n,2n,6n,19n,60n],
    ];

    function addExceptions()
    {
        let total = 0n;
        for(const exception of exceptions) 
        {
            let length = exception.length;
            while (length >= 5 && exception[length-1] > n) 
            { 
                length--; 
            }
            if (length >= 5) {
                total += triangle(BigInt(length));
            }
        }
        return total;
    }

    function getLength(k, direction, a0, a1)
    {
        let length = 0n;
        a0 = a0 || 0n;
        a1 = a1 || 1n;

        const start = a1;

        while(true) 
        {
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

        if (start !== 1n && direction === 0n) {
            // Can I add 1 at the start

            const x = start*(start - k);
            if (x >= -2n && x <= 2n) {
                length += 1n ;
            }
        }

        return length;
    }

    function getSpecialCount()
    {
        let length = 1n;
        let a1 = 2n;

        while(a1 <= n) 
        {
            length++;
            a1 = 3n*a1;
        }

        return length > 4n ? length-4n : 0n;
    }

    let total = triangle(n) + addExceptions() + getSpecialCount()

    // a(n) = k * a(n-1);
    for(let k = 2n; ; k++) 
    {
        let count = 0n;

        for(let l = 5n; ; l++) {
            const max = n / k**(l-1n);
            const c   = max - (max/k); 
            if (c === 0n) {
                break;
            }
            count += c * (l-4n);
        }

        if (! count) {
            break;
        }

        const phi = BigInt(primeHelper.PHI(Number(k)));
        total += count * phi;
    }

    // a(n) = k * a(n-1) + a(n-2);
    for(let k = 1n; ; k++) // k=1 => Fibonacci
    { 
        let l1 = getLength(k, 1n);
        let l2 = k < 3n ? getLength(k, 1n, 1n, 1n) : 0n;
        if (l1 < 5n && l2 < 5n) { 
            break;
        }
        if (l1 >= 5n)
            total += triangle(l1);
        if (l2 >= 5n)
            total += triangle(l2);
    }

    // a(n) = k * a(n-1) - a(n-2);
    for(let k = 3n; ; k++) // with 2 it's 1,2,3,4,... which is already counted
    { 
        let l1 = getLength(k, -1n);
        let l2 = k < 5n ? getLength(k, -1n, 1n, 1n) : 0n;
        if (l1 < 5n && l2 < 5n) { 
            break;
        }
        if (l1 >= 5n)
            total += triangle(l1);
        if (l2 >= 5n) 
            total += triangle(l2);
    }

    return Number(total % MODULO_N);
}

assert(G(6), 4, 'G(6)');
assert(G(10), 26, 'G(10)');
assert(G(100), 4710, 'G(1e2)');
assert(G(1000), 496805, 'G(1e3)');
assert(G(1e4), 49967133, 'G(1e4)');
assert(G(1e5), 4999669432, 'G(1e5)');
assert(G(1e6), 499996691239, 'G(1e6)');
assert(G(1e7), 49999966908763, 'G(1e7)');
assert(G(1e8), 4999999669087015, 'G(1e8)');

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => G(MAX, true));
console.log(`Answer is ${answer}`);
