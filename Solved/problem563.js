const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const allPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23];

const MAX_SIZE = 2300000000000000;
const MAX_WIDTH= Math.ceil(Math.sqrt(MAX_SIZE) * 1.1);

const MAX_M = 100;

function generateSizes(callback)
{
    function inner(value, index)
    {
        callback(value);            

        for(let i = index; i < allPrimes.length; i++) {
            const p = allPrimes[i];

            let v = value * p;
            if (value > MAX_SIZE) break;

            while (v <= MAX_WIDTH) {
                inner(v, i+1);
                v *= p;
            }
        }
    }

    inner(1, 0);
}

function solve()
{
    const sizes = [];
    generateSizes((value) => sizes.push(value));
    sizes.sort((a, b) => a-b);

    const areas = new Map();

    const tracer = new Tracer(3000, true);

    for(let iw = 0; iw < sizes.length; iw++) {
        tracer.print(_ => sizes.length - iw);

        const w = sizes[iw];
        const maxl = w * 1.1;
        for(let il = iw; il < sizes.length; il++) {
            const l = sizes[il];
            if (l > maxl) break;
            const area = l*w;
            if (area > MAX_SIZE) 
                break;
            if (area % 40 === 0) {
                areas.set(area, (areas.get(area) || 0)+1); 
            }
        }
    }
    tracer.clear();
    
    const values = [0, 1];
    areas.forEach((count, area) => {
        if (count > MAX_M) {
            return;
        }
        if (!values[count] || values[count] > area) {
            values[count] = area;
        }
    });

    if (values.length != MAX_M+1) {
        throw "MAX_SIZE is too small";
    }
    const result = values.reduce((a, v) => a + BigInt(v), -1n); // -1n because should count from 2 not from 1

    return result;
}

const answer = timeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer}`)