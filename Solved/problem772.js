const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');
const primeHelper = require('tools/primeHelper')();

require('tools/numberHelper');

const MAX    = 1E8;
const MODULO = 1000000007;

timeLogger.wrap('Loading primes', _ => primeHelper.initialize(MAX));

//
// Brute force to find the OEIS 
//
function f(n, trace)
{
    function *makePartitions(value)
    {
        const partition = [];

        function *inner(value, max) 
        {
            if (value === 0) {
                yield partition;
                return;
            }
            for(let i = Math.min(max, value); i > 0; i--) {
                partition.push(i);
                yield *inner(value-i, i);
                partition.pop(i);
            }
        }

        yield *inner(value, n);
    }

    function canBalance(value, p)
    {
        const $inner = [];

        function get(value, index)
        {
            if ($inner[value])
                return $inner[value][index];
        }

        function set(value, index, result)
        {
            if (! $inner[value]) { $inner[value] = []; }
            $inner[value][index] = result;
        }

        function inner(value, index)
        {
            if (value < 0) { return false; }
            if (value === 0) { return true; }

            let r = get(value, index);
            if (r !== undefined) {
                return r;
            }

            for(let i = index; i < p.length; i++) {
                if (inner(value-p[i], i+1)) {
                    set(value, index, true);
                    return true;
                }
            }

            set(value, index, false);
            return false;
        }

        return inner(value/2, 0, p.length);
    }

    function isBalanced(value)
    {
        for(const p of makePartitions(value)) {
            if (! canBalance(value, p)) {
                return false;
            }
        }
        return true;
    }

    const tracer = new Tracer(1, trace);
    const start = (n % 2) === 0 ? n+2 : n+1;
    for(let i = start; ; i += 2) {
        tracer.print(_ => i);
        if (isBalanced(i)) {
            tracer.clear();
            return i;
        }
    }
}

// https://oeis.org/A051426
// a(n) = a(n-1)*lcm(a(n-1),2n)
function solve(n, trace)
{
    const tracer = new Tracer(1, trace);
   
    const LOGN = Math.log(n);

    let answer = 2;
    for(const prime of primeHelper.allPrimes()) {
        if (prime > n) {
            break;
        }
        tracer.print(_ => n - prime);
        const power = Math.floor(LOGN / Math.log(prime));
        answer = answer.modMul(prime.modPow(power, MODULO), MODULO);
    }

    tracer.clear();

    return answer;
}

assert.strictEqual(solve(1), 2);
assert.strictEqual(solve(2), 4);
assert.strictEqual(solve(3), 12);
assert.strictEqual(solve(4), 24);
assert.strictEqual(solve(5), 120);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(1e8, true));
console.log(`Answer is ${answer}`);