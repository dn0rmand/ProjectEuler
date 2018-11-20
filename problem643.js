// 2-Friendly
// ----------
// Problem 643 
// -----------
// Two positive integers a and b are 2-friendly when gcd(a,b)=2^t,t>0. For example, 24 and 40 are 2-friendly 
// because gcd(24,40)= 8 = 2^3 while 24 and 36 are not because gcd(24,36)=12=2^2*3 not a power of 2.

// Let f(n) be the number of pairs, (p,q), of positive integers with 1 ≤ p < q ≤ n such that p and q are 2-friendly. 
// You are given f(10^2)=1031 and f(10^6)=321418433 modulo 1000000007.

// Find f(10^11) modulo 1000000007.

const assert = require('assert');
const announce = require('tools/announce');
const primeHelper = require('tools/primeHelper')();

const MODULO    = 1000000007;
const MAX       = 1E11;
const MAX_PRIME = 1E8;

primeHelper.initialize(MAX_PRIME);

function f(n, trace)
{
    function count(b)
    {
        let c = 0;
    
        b *= 2;
        while (b <= n)
        {
            c++;
            b *= 2;
        }
    
        return c;
    }
    
    let max     = Math.floor(n / 2);
    let total   = 0;
    let loop    = 0;    
    let percent = "";

    for (let b = 2; b <= max; b++)
    {
        let coprimes = primeHelper.PHI(b);
        let times    = count(b);

        total = (total + (coprimes*times)) % MODULO;

        if (trace)
        {
            if (loop === 0)
            {
                let p = ((b * 100) / max).toFixed(0);
                if (p !== percent)
                {
                    percent = p;
                    process.stdout.write('\r'+p+'%');
                }
            }
            loop++;
            if (loop > 1000)
                loop = 0;
        }
    }

    if (trace)
        console.log('\r100%');
    return total;
}

assert.equal(f(1E2), 1031);
assert.equal(f(1E6), 321418433);

let answer = f(MAX, true);

announce(643, "Answer is " + answer);
console.log('Answer is', answer);
