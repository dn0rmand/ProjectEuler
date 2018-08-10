// Totient maximum
// Problem 69 
// Euler's Totient function, φ(n) [sometimes called the phi function], is used to determine the number of numbers less 
// than n which are relatively prime to n. For example, as 1, 2, 4, 5, 7, and 8, are all less than nine and relatively prime 
// to nine, φ(9)=6.

// n	Relatively Prime	φ(n)	n/φ(n)
// 2	1	                1       2
// 3	1,2	                2	    1.5
// 4	1,3	                2       2
// 5	1,2,3,4	            4       1.25
// 6	1,5	                2	    3
// 7	1,2,3,4,5,6	        6	    1.1666...
// 8	1,3,5,7	            4	    2
// 9	1,2,4,5,7,8	        6	    1.5
// 10	1,3,7,9 	        4	    2.5
// It can be seen that n=6 produces a maximum n/φ(n) for n ≤ 10.

// Find the value of n ≤ 1,000,000 for which n/φ(n) is a maximum.

const assert  = require("assert");
const totient = require("../tools/totient.js");
const maximum = 1000000;

function Test()
{
    assert.equal(totient.PHI(2), 1);
    assert.equal(totient.PHI(3), 2);
    assert.equal(totient.PHI(4), 2);
    assert.equal(totient.PHI(5), 4);
    assert.equal(totient.PHI(6), 2);
    assert.equal(totient.PHI(7), 6);
    assert.equal(totient.PHI(8), 4);
    assert.equal(totient.PHI(9), 6);
    assert.equal(totient.PHI(10),4);
}

totient.initialize(maximum);
Test();

let max = 0;
let nMax = 0;

for (let n = 1; n <= maximum; n++)
{
    let phi = totient.PHI(n);
    let value = n / phi;
    if (value > max)
    {
        max = value;
        nMax = n;
    }
}

console.log("The value of n ≤ 1,000,000 for which n/φ(n) is a maximum is "+nMax);