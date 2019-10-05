const assert = require('assert');
const timeLogger = require('tools/timeLogger');

const MAX = 1000000;

function preload(n)
{
    let valid = new Set();
    let max   = n*n*16;

    for(let x = 4; ; x += 4)
    {
        let v = x*x;
        if (v > max)
            break;
        valid.add(v);
    }
    return valid;
}

function isValid(a, b, c, d)
{
    if (a+b+c < d)
        return false;
    return true;
}

function M(a, b, c, d)
{
    if (! isValid(a, b, c, d))
        return -1;

    let A = (b+c+d-a);
    let B = (a+c+d-b);
    let C = (a+b+d-c);
    let D = (a+b+c-d);

    let k = (A*B*C*D);

    if (k <= 0)
        return -1;

    return k;
}

function SP(n, trace)
{
    let valid  = preload(n);
    let target = n*n*16;
    let total = 0;
    let m;

    let a, b, c, d;
    let aa, bb, cc;

    for (a = 1; ; a++)
    {
        if (trace)
            process.stdout.write(`\r${a}`);
        aa = false;
        let startB = a;

        for(b = startB; ; b++)
        {
            // if (trace)
            //     process.stdout.write(`\r${a} - ${b}`);
            bb = false;

            let startC = b;
            for (c = startC; ; c++)
            {
                cc = false;
                let  max = a+b+c;
                let startD = c;
                if ((a+b+c+c) & 1)
                    startD++

                for (d = startD; d <= max; d += 2)
                {
                    m = M(a, b, c, d);

                    if (m < 0)
                        break;
                    if (m > target)
                        continue;

                    if (valid.has(m))
                    {
                        total += (a+b+c+d);
                        if (a!=b && a!=c && a!=d && b!=c && b!=d && c!=d)
                            console.log(`${a} , ${b} , ${c} , ${d}`);
                    }
                    cc = true;
                }

                if (! cc)
                    break;

                bb = true;
            }

            if (! bb)
                break;

            aa = true;
        }
        if (! aa)
            break;
    }

    if (trace)
        console.log('\r');

    return total;
}

assert.equal(SP(10), 186);
assert.equal(SP(100), 23238)
// assert.equal(SP(1000), 2603226);

console.log('End of tests');

let answer = timeLogger.wrap('', () => {
    return SP(MAX, true);
})
console.log(`Answer for ${MAX} is ${answer}`);