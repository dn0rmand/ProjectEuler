// A lagged Fibonacci sequence
// ---------------------------
// Problem 258 
// -----------
// A sequence is defined as:
//   - gk = 1, for 0 ≤ k ≤ 1999
//   - gk = gk-2000 + gk-1999, for k ≥ 2000.
//
// Find gk mod 20092010 for k = 10^18.

const assert = require('assert');
const bigInt = require('big-integer');
const prettyHrtime = require('pretty-hrtime');

const LAG     = 20; // 00;
const MODULO  = 20092010;
const MOD     = 0x10000000; // 2^28

function *GENERATE()
{
    let cache = [];
    let idx   = 0;

    for(let i = 0; i < LAG; i++)
    {
        cache.push(1);
    }

    while (1)
    {
        let v = (cache[idx] + cache[(idx+1) % LAG]);// % MODULO;

        yield v;

        cache[idx] = v;
        idx = (idx + 1) % LAG;
    }
}

function calculate(power, other)
{
    //let end = Math.pow(10, power);
    let end = LAG * power;
    if (other !== undefined)
        end += other;

    let expected = Math.pow(2, power);// % MODULO;

    if (end < LAG)
        return 1;

    let i = LAG-1;

    for (p of GENERATE())
    {
        i++;

        if (i === end)
        {            
            let diff = p - expected;
            let d1 = diff % LAG;
            let d2 = (diff - d1) / LAG;
            console.log(end + " = " + p + " - expected: " + expected + " - diff: " + (p - expected));
            return p;
        }
    }
}

calculate(LAG-1);
calculate(LAG);
calculate(LAG+1);
calculate(LAG+2);
calculate(LAG+3);
calculate(LAG+4);
calculate(LAG+LAG);

//console.log(calculate(10)); // 1815672

// let old = G(10000);
// let first= 10000;
// let k    = first;

// while (k <= 20000)
// {
//     k++;
//     let g = G(k);
//     if (g !== old)
//     {
//         console.log(first + ' to ' + (k-1) + ' -> ' + old);
//         first = k;
//         old = g;
//     }
// }

// console.log(first + ' to ' + (k-1) + ' -> ' + old);

// let max     = bigInt(10).pow(18);
// let power   = max.divide(LAG).valueOf();
// console.log(power);

// let offset  = 10;
// let sum     = bigInt(2).pow(offset);

// let total   = 1;

// while (power >= offset)
// {
//     total *= sum;
//     total %= MODULO;
//     power -= offset;
// }
// console.log(power);
// console.log(total.toString());

console.log('Done');
/*

 2000 to  3998 -> 2 - k = 1*2000 -> + 1 value
 		  3999 -> 3
 		  
 4000 to  5997 -> 4 - k = 2*2000 -> + 2 values
 		  5998 -> 5
 		  5999 -> 7
 		  
 6000 to  7996 -> 8  - k = 3*2000 -> + 3 values
 		  7997 -> 9
 		  7998 -> 12
 		  7999 -> 15
 		  
 8000 to  9995 -> 16 - k = 4 * 2000 -> + 4 values
 		  9996 -> 17
 		  9997 -> 21
 		  9998 -> 27
 		  9999 -> 31
 
10000 to 11994 -> 32 - k = 5 * 2000 -> + 5 values
 		 11995 -> 33
		 11996 -> 38
		 11997 -> 48
		 11998 -> 58
		 11999 -> 63

12000 to 13993 -> 64
14000 to 15992 -> 128
16000 to 17991 -> 256
		 17992 -> 257
		 17993 -> 265
		 17994 -> 293
		 17995 -> 349
		 17996 -> 419
		 17997 -> 475
		 17998 -> 503
		 17999 -> 511

18000 to 19990 -> 512 - k = 9 * 2000 -> + 9 values
		 19991 -> 513
		 19992 -> 522
		 19993 -> 558
		 19994 -> 642
		 19995 -> 768
		 19996 -> 894
		 19997 -> 978
		 19998 -> 1014
		 19999 -> 1023

((2 ^ 5000000000)^100000) mod 20092010
		
1787109376
19012496		 
		 
*/