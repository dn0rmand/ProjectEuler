const timeLog = require('tools/timeLogger');

const MAX_LIMITS = 100;
const TARGET     = 0.5

const limits = (function()
{
    let total  = (Math.PI*Math.PI)/6;

    const limits = [];

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

    let v = 1;
    for (let i = 0; i <= MAX_LIMITS; i++, v /= 2)
        probabilities[i+1] = v;

    return probabilities;
})();

function p(MAX_DEEP)
{
    let result = 0;

    const inner = (value, i) =>
    {
        if (value > TARGET)
        {
            result += probabilities[i];
            return;
        }

        if (i >= MAX_DEEP)
            return;

        if ((value + limits[i+1]) > TARGET)
            inner(value, i+1);
        else if ((value + limits[i]) < TARGET)
            return;

        inner(value + preCalculation[i], i+1);
    }

    inner(0, 1);

    return result.toFixed(8);
}

let answer = timeLog.wrap('', () => p(30));

console.log('Answer is', answer);