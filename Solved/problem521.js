const assert = require('assert');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const BigMap = require('@dn0rmand/project-euler-tools/src/BigMap');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

require('@dn0rmand/project-euler-tools/src/numberHelper');

const MODULO    = 1E9;
const MAX       = 1E12;
const MAX_PRIME = Math.ceil(Math.sqrt(MAX))+1;

primeHelper.initialize(MAX_PRIME, true);

const allPrimes = primeHelper.allPrimes();
const lastPrime = allPrimes[allPrimes.length-1];

function sumPrimes(num, MODULO) 
{
    const r = primeHelper.sumPrimes(num);
    return Number(r % BigInt(MODULO));
}

function countNumbers(max, minPrime, trace)
{
    function inner(value, index, callback)
    {
        if (value > max)
            return;

        const m = Math.floor(max / value);
        if (m > lastPrime)
        { 
            const c = primeHelper.countPrimes(m) - allPrimes.length;
            if (c > 0)
                callback(c+1);
            else
                callback(1);
        }
        else 
        {
            callback(1);
        }

        for(let i = index ; i < allPrimes.length; i++)
        {
            const p = allPrimes[i];            
            let v = value * p;
            if (v > max)
                break;

            while (v <= max)
            {
                inner(v, i+1, callback);
                v *= p;
            }
        }
    }

    let total = 0;
    const tracer = new Tracer(1, trace);
    for(let i = 0; i < allPrimes.length; i++)
    {
        const p = allPrimes[i];
        if (p <= minPrime)
            continue;

        if (p > max)
            break;

        let v = p;
        let f = 1;

        while (v <= max)
        {
            tracer.print(_ => `${p}^${f}`);
            inner(v, i+1, value => {
                total = (total + p.modMul(value, MODULO)) % MODULO;
            });
            v *= p;
            f++;
        }
    }
    tracer.clear();
    return total;
}

function fastCount(maxLength, trace)
{
    let states = new BigMap();
    let newStates = new BigMap();

    states.set(0, {
        sum3: 0, 
        sum7: 0, 
        sum11: 0, 
        sum13: 0, 
        sum17: 0,
        sum19: 0,
        sum23: 0,
        count: 1
    });

    let total   = (10**maxLength) % MODULO;
    let ratio11 = -1;

    const tracer = new Tracer(1, trace);

    for(let l = 0; l < maxLength; l++) 
    {
        tracer.print(_ => `${maxLength-l} - ${states.size}`);
        
        newStates.clear();

        ratio11 *= -1;

        for(const state of states.values())
        {
            for(let digit = l === 0 ? 1 : 0; digit < 10; digit++)
            {
                let sum3 = (state.sum3  + digit) % 3;
                let sum7 = (state.sum7  + 5*digit) % 7;
                let sum11= (state.sum11 + ratio11*digit);
                let sum13= (state.sum13 + 4*digit) % 13;
                let sum17= (state.sum17*5 + 9*digit) % 17;
                let sum19= (state.sum19 + 2*digit) % 19;
                let sum23= (state.sum23 + 7*digit) % 23;

                while (sum11 < 0)
                    sum11 += 11;
                sum11 %= 11;

                if (digit % 2 === 0) {
                    // counted separatly
                }
                else if (sum3 === 0)
                    total = (total + 3*state.count) % MODULO;
                else if (digit % 5 === 0)
                    total = (total + 5*state.count) % MODULO;
                else if (sum7 === 0)
                    total = (total + 7*state.count) % MODULO;
                else if (sum11 === 0)
                    total = (total + 11*state.count) % MODULO;
                else if (sum13 === 0)
                    total = (total + 13*state.count) % MODULO;
                else if (sum17 === 0)
                    total = (total + 17*state.count) % MODULO;
                else if (sum19 === 0)
                    total = (total + 19*state.count) % MODULO;
                else if (sum23 === 0)
                    total = (total + 23*state.count) % MODULO;

                // fix sums
                sum7  = (10*state.sum7 + digit) % 7;
                sum13 = (10*state.sum13 + digit) % 13;
                sum17 = (10*state.sum17 + digit) % 17;
                sum19 = (10*state.sum19 + digit) % 19;
                sum23 = (10*state.sum23 + digit) % 23;

                const key = [sum3, sum7, sum11, sum13, sum17, sum19, sum23].reduce((a, v) => a*50 + v, 0);
                if (key > Number.MAX_SAFE_INTEGER)
                    throw "ERROR";

                const old = newStates.get(key);
                if (old)
                    old.count = (old.count + state.count) % MODULO;
                else
                    newStates.set(key, { 
                        sum3, 
                        sum7, 
                        sum11, 
                        sum13, 
                        sum17,
                        sum19,
                        sum23,
                        count: state.count 
                    });
            }
        }

        [states, newStates] = [newStates, states];
    }
    tracer.clear();
    return total;
}

function countExtraBig(max, trace)
{
    if (lastPrime >= max) 
        return 0;

    const totalSum = sumPrimes(max, MODULO, trace);

    const sum = allPrimes.reduce((a, p) => {
        a -= p;
        while (a < 0)
            a += MODULO; 
        return a;
    }, totalSum);

    return sum;
}

function S(n, trace)
{
    let length = 0;
    for (let nn = n; nn > 1; nn /= 10)
        length++;

    const bigOnes = countExtraBig(n, trace);
    const special = fastCount(length, trace);
    const others  = countNumbers(n, 23, trace);

    const total = (others + special + bigOnes) % MODULO;
    
    return total;
}

assert.strictEqual(S(100), 1257);
assert.strictEqual(S(1E4), 5786451);
assert.strictEqual(timeLogger.wrap('', _ => S(1E7, true)), 714961609);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => S(MAX, true));
console.log(`Answer is ${answer}`);