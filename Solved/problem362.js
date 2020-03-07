const assert        = require('assert');
const primeHelper   = require('tools/primeHelper')();
const timeLogger    = require('tools/timeLogger');

const MAX       = 1E10;
const MAX_PRIME = Math.ceil(Math.sqrt(MAX))+1;

console.log('Initializing primes ...')
primeHelper.initialize(MAX_PRIME, true);
primeHelper.countPrimes(MAX);
console.log('primes initialized');

const allPrimes  = primeHelper.allPrimes();
// const primeMap   = allPrimes.reduce((a, p) => { a[p] = 1; return a; }, []);
const $calculate = new Map(); 

function calculate(primes)
{
    function makeNumber(previous, value, index, remaining)
    {
        if (remaining <= 0)
            return 0;

        if (index >= primes.length)
            return 0;

        let total = 0;
        for(let i = index; i < primes.length; i++)
        {
            let prime = primes[i];

            if (prime.count > 0)
            {
                prime.count--;;   
                const v = value * prime.prime;

                if (v >= previous)
                    total += countNumbers(v, remaining-1);

                total += makeNumber(previous, v, i+1, remaining-1);
                prime.count++;
            }
        }
        
        return total;
    }

    function countNumbers(previous, remaining)
    {
        if (remaining === 0)
            return 1;

        return makeNumber(previous, 1, 0, remaining);
    }

    const { key, total } = primes.reduce((a, v) => { 
        a.total += v; 
        a.key    = (a.key * 50n) + BigInt(v);
        return a; 
    }, { key:0n, total:0 } );

    let answer = $calculate.get(key);
    
    if (answer === undefined)
    {        
        primes = primes.map((a, i) => { 
                    return { prime: allPrimes[i], count: a }; 
                 });

        answer = countNumbers(1, total);
        $calculate.set(key, answer);
    }

    return answer;
} 

function Fsf(N, min, trace)
{
    min = min || N;

    let total = 0;
    let factors = [];
    
    function doCalculation(powers)
    {
        powers.sort((a, b) => a - b);
        return calculate(powers);
    }

    function inner(value, index)
    {
        if (value > N)
            return;

        if (value >= min)
        {
            total += doCalculation(factors.slice());
        }

        if (min === 2 && N > MAX_PRIME * value)
        {
            const maxPrime    = Math.floor(N / value);
            const extraPrimes = primeHelper.countPrimes(maxPrime) - allPrimes.length;
            const powers      = factors.slice();
            powers.push(1);
            const count       = doCalculation(powers);

            total += count * extraPrimes;
        }

        for(let i = index; i < allPrimes.length; i++)
        {            
            const p = allPrimes[i];

            let v = value * p;
            if (v > N)
                break;

            let f = factors.length;
            factors.push(0);

            while (v <= N)
            {
                factors[f]++;
                if (trace && value === 1)
                    process.stdout.write(`\r${p}^${factors[f]}  `);

                inner(v, i+1);
                v *= p;
            }

            factors.pop();
        }
    }

    inner(1, 0);
    if (trace)
        process.stdout.write(`\r                 \r`);
    return total;
}

function S(max, trace)
{
    const total = Fsf(max, 2, trace);
    return total;
}

function solve(max, expected)
{
    const M = +max;
    const answer = timeLogger.wrap('', () => S(M, expected === undefined));
    if (expected)
    {
        console.log(`S(${max}) = ${answer}`);
        if (expected)
            assert.equal(answer, expected);
    }
    else
        console.log(`Answer is ${answer}`);
}

assert.equal(Fsf(54), 2);
assert.equal(S(100), 193);

console.log("Tests passed");

solve('1E5', 783685);
solve('1E6', 11626006);
solve('1E7', 168329190);
// solve('1E8', 2388394374);

solve(MAX);