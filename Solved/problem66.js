// Diophantine equation
// Problem 66 
// Consider quadratic Diophantine equations of the form:

// x^2 – Dy^2 = 1

// For example, when D=13, the minimal solution in x is 649^2 – 13×180^2 = 1.

// It can be assumed that there are no solutions in positive integers when D is square.

// By finding minimal solutions in x for D = {2, 3, 5, 6, 7}, we obtain the following:

// 3^2 – 2×2^2 = 1
// 2^2 – 3×1^2 = 1
// 9^2 – 5×4^2 = 1
// 5^2 – 6×2^2 = 1
// 8^2 – 7×3^2 = 1

// Hence, by considering minimal solutions in x for D ≤ 7, the largest x is obtained when D=5.

// Find the value of D ≤ 1000 in minimal solutions of x for which the largest value of x is obtained.

const assert = require('assert');
const bigInt = require('big-integer');
const squareRoot = require('@dn0rmand/project-euler-tools/src/squareRoot.js');

function evaluate(sequence)
{
    let size      = sequence.length;
    let numerator = bigInt(sequence[size-1]);
    let divisor   = bigInt(1);

    for (let i = size-1; i > 0; i--)
    {
        let x = numerator;
        numerator = divisor;
        divisor   = x;

        let a = sequence[i-1];

        numerator = divisor.multiply(a).add(numerator);
    }    
    return {
        numerator:numerator,
        divisor:divisor
    };
}

function getMinX(D, d)
{
    let sequence  = [d]; 
    let fractions = squareRoot(D);

    for(let a of fractions)
    {
        sequence.push(a);
        let obj = evaluate(sequence);
        let x = obj.numerator;
        let y = obj.divisor;

        let r = x.square().subtract(y.square().multiply(D));

        if (r.equals(1))
            return x; 
    }
}

function solve(min, max)
{
    let result = min;
    let maxX   = -1;

    for(let D = min; D <= max; D++)
    {
        let d = Math.sqrt(D);
        if (Math.floor(d) === d)
            continue;
        d = Math.floor(d);

        let x = getMinX(D, d);
        if (x.greater(maxX))
        {
            result = D;
            maxX   = x;
        }
    }

    return result;
}

let result = solve(2,1000);

console.log(result + " is the value of D ≤ 1000 in minimal solutions of x for which the largest value of x is obtained");