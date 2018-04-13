// Factorial trailing digits
// Problem 160 
// For any N, let f(N) be the last five digits before the trailing zeroes in N!.
// For example,

// 9! = 362880 so f(9)=36288
// 10! = 3628800 so f(10)=36288
// 20! = 2432902008176640000 so f(20)=17664

// Find f(1,000,000,000,000)

const assert = require('assert');
const bigInt = require('big-integer');
const prettyHrtime = require("pretty-hrtime");

function normal(max)
{
    let result = bigInt(1);
    for (let value = 2; value <= max; value++)
    {
        let v = value;
        while (v % 10 === 0)
            v /= 10;
        result = result.times(v);
    }

    while (result.mod(10).isZero())
        result = result.divide(10);

    result = result.mod(100000).valueOf();

    console.log('assert.equal(f2(' + max +'), ' + result + ');');
}

function f3(max)
{
    let x = max;
    let pow = 0;
    while (x > 0 && x % 10 === 0)
    {
        pow++;
        x /= 10;
    }

    let m = Math.min(max, 99999);
    let factors = [];

    for (let i = 0; i <= m; i++)
        factors[i] = 0;

    for (let value = max; value >= 2; value--)
    {
        let v = value;
        while ((v % 10) === 0)
            v /= 10;

        v %= 100000;
        factors[v]++;
    }

    console.log()

    let result = 1;

    for (let v = 0; v < factors.length; v++)
    {
        let count = factors[v];

        while (count-- > 0)
        {
            result *= v;
            while ((result % 10) === 0)
                result /= 10;

            result %= 1000000000;            
        }        
    }

    result %= 100000;
    return result;
}

function f2(max)
{
    function getCount()
    {
        let x = max;
        let pow = 0;
        while (x > 0 && x % 10 === 0)
        {
            pow++;
            x /= 10;
        }

        if (pow <= 5)
            return pow;

        pow -= 5;
        x = 0;
        while (pow-- > 0)
        {
            x = x*10+10;
        }
        x += 5;

        return x;
    }

    let maxPower = getCount();

    function multiply(value, factor)
    {
        const modulo = 1000000000;

        value *= factor;
        while ((value % 10) === 0)
            value /= 10;

        value %= modulo;  
        return value;          
    }

    function applyFactor(result, value)
    {
        const modulo = 1000000000;

        if (value % 10 === 0)
            return result;

        let power;

        if (value > 10000)
            power = maxPower-4 
        else if (value > 1000)
            power = maxPower-3;
        else if (value > 100)
            power = maxPower-2;
        else if (value > 10)
            power = maxPower-1;
        else
            power = maxPower;
        
        if (power <= 0)
            return result;

        let ref = result;
        for(let p = 0; p < power; p++)
        {
            ref = multiply(ref, value);
        }   

        return ref;
    }

    let result = 1;

    for (let v = 2; v < 100000; v++)
    {
        result = applyFactor(result, v);
    }

    result %= 100000;
    return result;
}

assert.equal(f2(100), 16864);
assert.equal(f2(1000), 53472);
assert.equal(f2(10000), 79008);
assert.equal(f2(100000), 62496);
assert.equal(f2(1000000), 41952);
assert.equal(f2(10000000), 69792);

normal(1000000)

// console.log(f2(100000));
// console.log(f2(1000000));
// console.log(f2(10000000));
// console.log(f2(100000000));
// console.log(f2(1000000000));
// console.log(f2(10000000000));

// let answer = f2(1000000000000);
// console.log(answer);

console.log('Done');