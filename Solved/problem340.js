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

const MODULO = 1000000000n;

const FOUR = 4n;
const THREE= 3n;
const TWO  = 2n;
const ONE  = 1n;
const ZERO = 0n;

class CrazyFunction extends Object
{
    constructor(a, b, c)
    {
        super();
        this.a = a;
        this.b = b;
        this.c = c;

        this.four_ac = 4 * (a - c);
        this.four_a_three_c = 4*a - 3*c;
    }
    
    F(n)
    {
        if (n <= this.b)
        {
            let v  = this.b - n;
            let factor = ((v - (v % this.a)) / this.a);

            let x = n + this.four_ac + factor * this.four_a_three_c;
            return x;
        }
        else
            return n-this.c;
    }
}

function S(a, b, c)
{
    if (typeof(a) != 'bigint')
        a = BigInt(a);
    if (typeof(b) != 'bigint')
        b = BigInt(b);
    if (typeof(c) != 'bigint')
        c = BigInt(c);

    let four_ac        = FOUR*(a-c);
    let four_a_three_c = FOUR*a - THREE*c;    
    let factor         = (b - (b % a)) / a;
    let total          = four_ac + factor*four_a_three_c;

    total += (b * four_ac) + ((b*(b+ONE))/TWO);

    let diff = a * ((factor*(factor-ONE))/TWO);

    if (b % a !== ZERO)
        diff += (factor * (b % a));

    diff *= four_a_three_c;
    total = (total+diff) % MODULO;

    return Number(total);
}

function test()
{
    let cf = new CrazyFunction(50, 2000, 40);

    assert.equal(cf.F(0), 3240);
    assert.equal(cf.F(2000), 2040);

    assert.equal(S(50, 2000, 40), 5204240);
}

test();

let answer = S(21n ** 7n, 7n ** 21n, 12n ** 7n);
console.log("Answer is", answer);