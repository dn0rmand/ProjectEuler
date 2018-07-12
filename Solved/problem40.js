const prettyHrtime = require("pretty-hrtime");

function *getDigits()
{
    let n = 0;
    let maxPow = 10;
    while (true)
    {
        let m = ++n;
        if (m > maxPow)
            maxPow *= 10;
        let doIt = false;
        let pow = maxPow;
        while (pow > 1)
        {
            if (m >= pow || doIt)
            {
                doIt = true;
                let x = m % pow;
                yield (m - x)/pow;
                m = x; 
            }
            pow /= 10;
        }
        yield m % 10;
        // let s = (n++).toString();
        // for(let i = 0; i < s.length; i++)
        //     yield s[i];
    }
}

function solve()
{
    let digits = getDigits();

    let index = 0;
    let d1,d10,d100,d1000,d10000,d100000,d1000000;

    for(let d = digits.next(), index = 1; index < 1000001 ; d = digits.next(), index++)
    {
        switch(index)
        {
            case 1:
                d1 = d.value; break;
            case 10:
                d10 = d.value; break;
            case 100:
                d100 = d.value; break;
            case 1000:
                d1000 = d.value; break;
            case 10000:
                d10000 = d.value; break;
            case 100000:
                d100000 = d.value; break;
            case 1000000:
                d1000000 = d.value; break;
        }
    }
digits.next();

    return (d1 * d10 * d100 * d1000 * d10000 * d100000 * d1000000);
}

let start = process.hrtime();
let result = solve();   
let end = process.hrtime(start);
console.log("Result is " + result + ", solved in " + prettyHrtime(end, {verbose:true}));
