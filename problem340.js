// Crazy Function
// --------------
// Problem 340 
//------------
// For fixed integers a, b, c, define the crazy function F(n) as follows:
// F(n) = n - c for all n > b 
// F(n) = F(a + F(a + F(a + F(a + n)))) for all n ≤ b.

// Also, define S(a, b, c) = sum F(n) for n=0 to b.

// For example, if a = 50, b = 2000 and c = 40, then F(0) = 3240 and F(2000) = 2040.
// Also, S(50, 2000, 40) = 5204240.

// Find the last 9 digits of S(2^17, 7^21, 12^7).

const assert = require('assert');

class CrazyFunction extends Object
{
    constructor(a, b, c)
    {
        super();
        this.a = a;
        this.b = b;
        this.c = c;

        this.cache = new Map();
    }
    
    F(n, recursive)
    {
        if (n <= this.b)
        {
            let x;
            // let result = this.cache.get(n);
            // if (result !== undefined)
            //     return result;
    
            if (recursive !== true)
            {
                x = 4*this.a + n - 4*this.c;
            }
            else
            {
                x = this.F(this.a + n, true);
                x = this.F(this.a + x, true);
                x = this.F(this.a + x, true);
                x = this.F(this.a + x, true);
            }
            // this.cache.set(n, x);
            return x;
        }
        else
            return n-this.c;
    }
}

function S(a, b, c)
{
    let cf = new CrazyFunction(a, b, c);

    let total = 0;

    for(let n = 0; n <= b; n++)
        total += cf.F(n) % 1000000000;

    return total;
}

function test()
{
    let cf = new CrazyFunction(50, 2000, 40);

    let v1 = cf.F(1900, true);
    let v2 = cf.F(1900, false);

    //assert.equal(v1, v2);

    let old = cf.F(0);

    for (let i = 1; i <= 4000; i++)
    {
        let n = cf.F(i);
        if (n !== old+1)
            console.log(i + " => " + old + ' - ' + n + " (" + (old+1 - n) + ")");
        old = n;
    }

    console.log(2405-1325);// 50-40
    console.log(1325 + " = " + cf.F(1325));
    console.log((2345-cf.c) + " = " + cf.F(2345));

    assert.equal(cf.F(0), 3240);
    assert.equal(cf.F(2000), 2040);
    assert.equal(S(50, 2000, 40), 5204240);
}

test();

let answer = S(Math.pow(2,17), Math.pow(7,21), Math.pow(12,7));

console.log("Done");