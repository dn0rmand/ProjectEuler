const assert    = require('assert');
const timeLog   = require('tools/timeLogger');
const chart     = require('asciichart');

const bigNumber = require('bignumber.js');

const DIGITS = 80;

bigNumber.set({ DECIMAL_PLACES: DIGITS });

function smallNumber(value)
{
    let number = {
        value: value,

        toFixed:  function(n) { return this.value.toFixed(n); },
        toString: function(b) { return this.value.toString(b); },
        plus:     function(v) { return smallNumber(this.value + v.valueOf()); },
        dividedBy:function(v) { return smallNumber(this.value / v.valueOf()); },
        gt:       function(v) { return this.value > v.valueOf(); },
        valueOf:  function() { return this.value; }
    };

    return number;
}

// const FLOAT = bigNumber;
const FLOAT = bigNumber;
const DOUBLE= bigNumber;

const ONE = FLOAT(1);
const ZERO= FLOAT(0);

const CALCULATED = (function() {
    const values = [];

    for (let i = 1; i < 500; i++)
    {
        values[i] = ONE.dividedBy(i*i);
    }

    return values;
}());

function *binary(value)
{
    // let v = ONE;
    // let count = 2;

    // while (value.gt(0) && count < DIGITS+2)
    // {
    //     v = v.dividedBy(2);
    //     if (value.gte(v))
    //     {
    //         value = value.minus(v);
    //         // assert.equal(1, +(s[count]));
    //         yield 1;
    //     }
    //     else
    //     {
    //         // assert.equal(0, +(s[count]));
    //         yield 0;
    //     }
    //     count++;
    // }

    let s = DOUBLE(value).toString(2);
    for(let i = 2; i < s.length; i++)
        yield +(s[i]);
}

function f(x, max)
{
    if (x == 0)
        return 0;

    let sum = ZERO;
    let idx = 0;
    for (let d of binary(x))
    {
        idx++;
        if (idx >= 500)
            break;

        if (d)
        {
            sum = sum.plus(CALCULATED[idx]);

            if (max && sum.gt(max))
                return true;
        }
    }

    if (max)
    {
        return sum.gt(max);
    }
    else
        return sum;
}

function $p(a)
{
    const precision = 9;

    const STEP  = 10**-precision;
    const COUNT = 10**precision;

    let total  = 0;
    let last   = 0;
    let traceCount = 0;

    for(let x = 0.36; x < 1; x += STEP)
    {
        if (x > 0.5)
        {
            total++;
        }
        else if (f(x, a))
        {
            if (total == 0)
                console.log(`\r\nFirst = ${x.valueOf()}`);

            total++;
        }
        else
        {
            last = x;
        }

        if (traceCount++ == 0)
            process.stdout.write(`\r${x.toFixed(8)} - ${last.toFixed(8)}  `);

        if (traceCount >= 10000)
            traceCount = 0;
    }

    let probability = FLOAT(total).dividedBy(COUNT);
    return probability.toFixed(8);
}

function p(a, MAX_DEEP, trace)
{
    const MAX_SIZE = 1E4;
    const MAX_LIMITS = 60;

    let RESULT = 0;

    const limits = (function() {

        let total = (Math.PI*Math.PI)/6;
        let limits = [];

        for (let i = 1; i <= MAX_LIMITS; i++)
        {
            limits[i] = total;
            total -= 1/(i*i);
        }

        return limits;
    }());

    const preCalculation =  (function()
    {
        const preCalculation = [];
        for (let i = 1; i <= MAX_LIMITS; i++)
            preCalculation[i] = 1 / (i*i);
        return preCalculation;
    })();

    const probabilities =  (function()
    {
        const probabilities = [];
        for (let i = 0; i <= MAX_LIMITS; i++)
            probabilities[i+1] = 1 / (2**i);
        return probabilities;
    })();

    function possible(value, i)
    {
        value += limits[i];
        return (value > a);
    }

    let traceCount = 0;

    function add(i)
    {
        if (i > MAX_LIMITS)
            return;

        RESULT += probabilities[i];
        if (trace)
        {
            if (traceCount == 0)
                process.stdout.write(`\r${RESULT.toFixed(8)}  `);
            if (++traceCount > 200000)
                traceCount = 0;
        }
    }

    function inner1(value, i)
    {
        if (value > a)
        {
            add(i);
            return;
        }

        if (i > MAX_DEEP)
        {
            if (possible(value, i))
            {
                while (i <= MAX_LIMITS && value <= a)
                {
                    value += preCalculation[i++];
                }
                add(i-1);
            }
            return;
        }

        if  (possible(value, i+1))
        {
            inner1(value + preCalculation[i], i+1);
            inner1(value, i+1);
        }
        else if (possible(value, i))
        {
            inner1(value + preCalculation[i], i+1);
        }
    }

    function inner2(states, I)
    {
        for(let i = I; i <= MAX_DEEP; i++)
        {
            let newStates = [];
            let last = i == MAX_DEEP;

            for (let state of states)
            {
                if (possible(state, i+1))
                {
                    // Adding a 1
                    let n = state + preCalculation[i];
                    if (n > a)
                    {
                        add(i+1);
                    }
                    else if (! last)
                    {
                        newStates.push(n);
                    }
                    // Adding a 0
                    if (! last)
                        newStates.push(state);

                    // Check if exceeding ARRAY size
                    if (newStates.length >= MAX_SIZE)
                    {
                        inner2(newStates, i+1);
                        newStates = [];
                    }
                }
                else if (possible(state, i))
                {
                    // Adding a 1
                    let n = state + preCalculation[i];
                    if (n > a)
                    {
                        add(i+1);
                    }
                    else if (! last)
                    {
                        newStates.push(n);
                        if (newStates.length >= MAX_SIZE)
                        {
                            inner2(newStates, i+1);
                            newStates = [];
                        }
                    }
                }
            }

            states = newStates;
        }
    }

    RESULT = 0;
    inner1(0, 1);
    return RESULT.toFixed(8);
}

//assert.equal(p(0.5, 30), 0.54888289);

console.log('Test passed');

let answer = timeLog.wrap('', () => $p(0.5, 33, true));

console.log("Answer is", answer);

// 0.55594441
// 0.55627444
// 0.55619300
// 0.55619254
// 0.55601940
// 0.55620195
// 0.55620026
// 0.55619609
// 0.55619785
// 0.55710785
// 0.55923956
// 0.55923519