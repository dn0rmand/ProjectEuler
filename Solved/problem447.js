const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');
const primeHelper = require('tools/primeHelper')();

require('tools/numberHelper');

timeLogger.wrap('Loading primes', _ => primeHelper.initialize(1E7));

const MODULO = 1000000007;
const INVTWO = Number(2).modInv(MODULO);

const $G = new Map();

function SUM(v) 
{
    return v & 1 ? ((v+1)/2).modMul(v, MODULO) : (v/2).modMul(v+1, MODULO);
}

function G(n)
{
    let total =  $G.get(n);
    
    if (total !== undefined) {
        return total;
    }

    total = 0;

    const stop = Math.floor(Math.sqrt(n));

    for(let k = 1; k <= stop; k++) {
        const x = Math.floor(n / k) * k;
        total = (total + x) % MODULO;
    }

    const maxD = Math.floor(n / (stop+1));

    let minSum = SUM(n);

    for(let d = 1; d <= maxD; d++) {
        const maxSum = minSum;
        const min = Math.floor(n / (d+1));
        
        minSum = SUM(min);

        const sum = (maxSum - minSum + MODULO) % MODULO;

        total = (total + d.modMul(sum, MODULO)) % MODULO;
    }

    $G.set(n, total);

    return total;
}

function F(n, trace)
{
    const allPrimes = primeHelper.allPrimes();

    function generate(callback) 
    {
        const tracer = new Tracer(50, trace);

        function inner(value, hh, index)
        {
            if (value <= n) {

                if (! index && trace) {
                    timeLogger.wrap('Calculating', _ => callback(value, (MODULO + hh % MODULO) % MODULO));
                }
                else {
                    callback(value, (MODULO + hh % MODULO) % MODULO);
                }

                for(let i = index; i < allPrimes.length; i++) {
                    if (! index)
                        tracer.print(_ => allPrimes.length - i);

                    const p = allPrimes[i];
                    const v = value*p*p;
                    if (v > n) {
                        break;
                    }

                    inner(v, hh * -p, i+1);
                }
            }
        }

        inner(1, 1, 0);

        tracer.clear();
    }

    let total  = 0;

    generate((i, hh) => {
        const k  = Math.floor(n / i);
        const gg = G(k);
        total = (total + hh.modMul(gg, MODULO)) % MODULO;
    });

    total = (total + MODULO - SUM(n)) % MODULO;

    return total;
}

assert.strictEqual(timeLogger.wrap('', _ => F(1E3)), 184078);
assert.strictEqual(timeLogger.wrap('', _ => F(1E7)), 638042271);

console.log('Test passed');

const answer = timeLogger.wrap('', _ => F(1E14, true));
console.log(`Answer is ${answer}`);
