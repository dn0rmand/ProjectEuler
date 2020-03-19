const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const timeLogger = require('tools/timeLogger');

const MAX_NUMBER = 1e12;

let allPrimes = undefined;

function p2q3(callback)
{
    for(const q of allPrimes)
    {
        const q3 = q*q*q;
        if (q3 > MAX_NUMBER)
            break;

        for(const p of allPrimes)
        {
            if (q != p)
            {
                const p2 = p * p;
                if (p2 > MAX_NUMBER)
                    break;

                const v = q3 * p2;
                if (v <= MAX_NUMBER)
                    callback(v);
                else
                    break;
            }
        }
    }
}

function isPrimeProof(value)
{
    let left= 0;
    let pow = 10;
    let pow0= 1;

    while (value > 0)
    {
        const d = value % pow;

        value -= d;
        const sub = value + left;

        for(let digit = 0; digit < pow; digit += pow0)
        {
            const v = sub + digit;
            if (v > MAX_NUMBER)
                return false; // in case
            if (primeHelper.isPrime(v))
                return false;
        }

        left += d;
        if ((left & 1) === 0)
            return true;
        if (left % 5 === 0)
            return true;

        pow0 = pow;
        pow *= 10;
    }
    return true;
}

function has200(value)
{
    let previous1 = -1;
    let previous2 = -1;

    while(value > 0)
    {
        const d = value % 10;
        value = (value-d)/10;
        if (d === 2 && previous1 === 0 && previous2 === 0)
            return true;
        previous1 = previous2;
        previous2 = d;
    }

    return false;
}

function with200(filterOut, callback)
{
    p2q3((value) => {
        if (filterOut(value))
            return;

        if (has200(value))
        {
            if (isPrimeProof(value))
                callback(value);
        }
    });
}

function solve(position)
{
    const values = [];
    primeHelper.initialize(1E6, true);
    allPrimes = primeHelper.allPrimes();

    function filterOut(value)
    {
        if (values.length >= position && value > values[position-1])
            return true;
    }

    with200(filterOut, (value) =>
    {
        if (values.length < position)
        {
            values.push(value);
            if (values.length === position)
                values.sort((a, b) => a-b);
        }
        else if (values[position-1] > value)
        {
            values[position-1] = value;
            values.sort((a, b) => a-b);
        }
    });

    if (values.length < position)
        throw "Failed ... didn't find enough values";

    return values[position-1];
}

const answer = timeLogger.wrap('', () => solve(200));

console.log(`Answer is ${answer}`);
