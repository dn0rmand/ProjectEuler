const assert      = require('assert');
const timeLog     = require('tools/timeLogger');
const primeHelper = require('tools/primeHelper')();

const MAX = 10n ** 14n;

primeHelper.initialize(1E7, true);
const allPrimes = primeHelper.allPrimes();

const ZERO  = 0n;
const ONE   = 1n;
const TWO   = 2n;
const THREE = 3n;

const TRACE_SPEED = 1000;

function setToArray(set)
{
    values = [...set];
    values.sort((a, b) => {
        if (a < b)
            return -1;
        if (a > b)
            return 1;
        return 0;
    })
    return values;
}

function loadValues(max)
{
    max = BigInt(max);
    let values = new Set();
    for(let p = 3n; 2n ** p <= max; p++)
    {
        for (let v = 2n; ; v++)
        {
            let vv = v ** p;
            if (vv > max)
                break;
            values.add(vv);
        }
    }
    values = setToArray(values);
    return values;
}

function loadPowers(max, power)
{
    power = BigInt(power);
    max   = BigInt(max);

    let map = new Set();

    for (let a = 3n; ; a++)
    {
        let A = a ** power;
        if (A > max)
            break;

        map.add(A);
    }
    if (map.size === 0)
        return undefined;

    return [setToArray(map), map];
}

function F(N, trace)
{
    N = BigInt(N);
    let total = 0;

    let maps  = new Map();

    if (trace)
        process.stdout.write('Loading powers ..');

    let values = loadValues(N);

    for (let pa = 2; ; pa++)
    {
        let map = loadPowers(N, pa);
        if (! map)
            break;
        maps.set(pa, map);
    }
    if (trace)
        console.log('.. Done');

    for (let C of values)
    {
        if (trace)
            process.stdout.write(`\rprocessing ${C}`);

        // calculate count for powers of 2

        for (let pa = 2; ; pa++)
        {
            let As = maps.get(pa);
            if (! As)
                break;

            let [vals, map] = As;
            for (let A of vals)
            {
                let B = C-A;
                if (B < A)
                    break;
                if (map.has(B))
                    total++;
            }
        }
    }

    return total;
}

function analyze()
{
    console.log(F(1E3));
    console.log(F(1E11));

    console.log(F(1E4));
    console.log(F(1E5));
    console.log(F(1E6));
    console.log(F(1E7));
    console.log(F(1E8));
    console.log(F(1E9));
}

function runTests()
{
    assert.equal(F(1E3), 7);
    assert.equal(F(1E5), 53);
    assert.equal(F(1E7), 287);
    assert.equal(F(1E9), 1429);
    assert.equal(F(1E10), 3231);

    // 1E12 -> 16066
    console.log('Tests passed');
}

analyze();
runTests();

let answer = timeLog.wrap("", () => {
    return F(MAX, true);
});
console.log('Answer is', answer);
