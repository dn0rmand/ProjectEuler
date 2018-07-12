// Singular integer right triangles
// Problem 75 
// It turns out that 12 cm is the smallest length of wire that can be bent to form an integer sided right angle triangle in 
// exactly one way, but there are many more examples.

// 12 cm: (3,4,5)
// 24 cm: (6,8,10)
// 30 cm: (5,12,13)
// 36 cm: (9,12,15)
// 40 cm: (8,15,17)
// 48 cm: (12,16,20)

// In contrast, some lengths of wire, like 20 cm, cannot be bent to form an integer sided right angle triangle, and other 
// lengths allow more than one solution to be found; for example, using 120 cm it is possible to form exactly three different 
// integer sided right angle triangles.

// 120 cm: (30,40,50), (20,48,52), (24,45,51)

// Given that L is the length of the wire, for how many values of L ≤ 1,500,000 can exactly one integer sided right angle 
// triangle be formed?

/*
a+b+c=L => c = L-a-b

a^2+b^2 = (L-a-b)^2

(L-a-b)*(L-a-b) = L^2 - aL - Lb -aL + a^2 + ab - bL + ba + b^2
                = L^2 + a^2 + b^2 - 2aL - 2bL + 2ab
            
L^2 - 2La - 2Lx + 2ax = 0            
2(a - L)x = 2La - L^2            
x = (2La - L^2) / 2(a - L) 

b = (L^2 - 2La) / 2(L - a)
*/

const assert = require('assert');

function OneOnlyTriangle(L)
{
    let half  = (L+1) >> 1;
    let L2    = L * L;
    let _2L   = 2 * L;

    found = null;

    for (let A = 1; A < half; A++)
    {
        let B = (L2 - _2L*A) / (_2L - A - A);

        if (Math.floor(B) !== B)
            continue;

        // Verification

        let C = L-A-B;
        if (C < 1)
            continue;
        if ((A*A)+(B*B) !== C*C)
            continue;

        if (found == null)
            found = [A, B];
        else if (A === found[1] || B === found[0])
            return true;
    }
    return false;
}

assert.ok(OneOnlyTriangle(12));
assert.ok(OneOnlyTriangle(24));
assert.ok(OneOnlyTriangle(30));
assert.ok(OneOnlyTriangle(36));
assert.ok(OneOnlyTriangle(40));
assert.ok(OneOnlyTriangle(48));

let L = 3;
let count = 0;
while (L <= 1500000)
{
    if (OneOnlyTriangle(L))
        count++;
    L++;
}

console.log(count + " right angle triangle can be form when L ≤ 1,500,000");
