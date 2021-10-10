const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

function makeKey(w, h) 
{ 
    if (w < h)
        return w*100 + h;
    else
        return h*100 + w; 
}

function sum(n) 
{
    return (n*(n+1))/2;
}

function countRegular(width, height) 
{
    return sum(width) * sum(height);
}

function countSpecial(width, height)
{
    const $$count = [];

    function count(w, h)
    {
        const key = makeKey(w, h);
        if ($$count[key] !== undefined) {
            return $$count[key];
        }

        function isValid(x, y)
        {
            for(let iy = 0; iy < h; iy++) {
                const xx = x + (0.5*iy);
                const yy = y + (0.5*iy);

                if (xx >= width || yy >= height) {
                    return false;
                }

                for(let ix = 0; ix < w; ix++) {
                    const x1 = xx+(0.5*ix);
                    const y1 = yy-(0.5*ix);
                    if (x1 >= width || y1 <= 0) {
                        return false;
                    }
                }
            }

            return true;
        }

        let total = 0;
        for(let x = 1; x < width; x++) {
            for(let y = 0.5; y < height; y++) {
               if (isValid(x, y)) {
                   total++;
               }         
            }         
        }

        for(let x = 0.5; x < width; x++) {
            for(let y = 1; y < height; y++) {
               if (isValid(x, y)) {
                   total++;
               }         
            }         
        }

        $$count[key] = total;

        return total;
    }

    let total = 0;

    for(let w = 1; ; w++) {
        let subTotal1 = 0;
        for(let h = 1; ; h++) {
            let subTotal2 = count(w, h);
            if (subTotal2 === 0) 
                break;
            subTotal1 += subTotal2;
        }
        if (subTotal1 === 0)
            break;
        total += subTotal1;
    }

    return total;
}

$count = [];

function count(width, height)
{
    const k = makeKey(width, height);
    if ($count[k] === undefined) {
        $count[k] = countRegular(width, height) + countSpecial(width, height);
    }
    return $count[k];
}

function solve(width, height, trace)
{
    let total = 0;

    const tracer = new Tracer(1, trace);

    for(let w = 1; w <= width; w++) {
        for(let h = 1; h <= height; h++) {
            tracer.print(_ => `${w}x${h}`);
            total += count(w, h);
        }
    }
    tracer.clear();
    return total;
}

assert.strictEqual(solve(3, 2), 72);
assert.strictEqual(solve(6, 4), 2584);
assert.strictEqual(solve(10, 7), 48664);

console.log("Tests passed");

const answer = timeLogger.wrap('', _ => solve(47, 43, true));

console.log(`Answer is ${answer}`);
