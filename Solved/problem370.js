// Geometric triangles
// -------------------
// Problem 370 
// -----------
// Let us define a geometric triangle as an integer sided triangle with sides a ≤ b ≤ c so that 
// its sides form a geometric progression, i.e. b^2 = a * c 

// An example of such a geometric triangle is the triangle with sides a = 144, b = 156 and c = 169.

// There are 861805 geometric triangles with perimeter ≤ 1000000

// How many geometric triangles exist with perimeter ≤ 25000000000000 ?


/*

    b^2 = a * c

    b = p1^n1 * p2^n2 ... pi^ni

    b^2 => ni => 2ni
*/

const assert = require("assert");
const bigint = require('big-integer');

const MAX = 25000000000000

function fareySequence(perimeter, action)
{
    const gr = 1.6180339887498948482; //Golden ratio

    let d = Math.floor(Math.sqrt((perimeter / 3)));
    let a  = 1, b  = 1;
    let a0 = 1, b0 = 0;

    while (b / a <= gr)
    {
        let div = a*(a+b) + b*b;

        action(div);

        let h  = Math.floor((a0 + d) / a); // Generate next Farey sequence m2/n2 
        
        let b1 = h * b - b0;
        let a1 = h * a - a0;

        a0 = a;
        b0 = b;

        a = a1;
        b = b1;
    }
}

function solve(perimeter)
{
    let total = 0; // bigint(0);

    fareySequence(perimeter, (divisor) => {
        let count = Math.floor(perimeter / divisor);

        total += count;
    });

    return total;
}

assert.equal(solve(100), 42);
assert.equal(solve(1000000), 861805);

let total = solve(MAX);

console.log("There are " + total.valueOf() + " geometric triangles exist with perimeter ≤ 25000000000000 ")