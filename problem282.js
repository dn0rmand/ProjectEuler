const bigInt = require('big-integer');
const isPrime = require("./tools/isPrime.js");

const MOD    = 5764801;
const modulo = MOD * Math.pow(2, 8);

function A(m, n)
{
    if (m == 0)
        return n+1;
    
    if (n == 0)
    {
        v = A(m-1, 1);
        return v;
    }
    else
    {
        let x = A(m, n-1);
        v = A(m-1, x);
        return v;
    }
}

function A1(m, n)
{
    let s = [];

    s.push(m);

    let maxLength = 1;

    while (s.length > 0)
    {
        m = s.pop();
        while (true)
        {
            if(m == 0) 
            { 
                n++; 
                break;
            }
            else if(n == 0)
            {
                n++;
                m--;
            }
            else
            {
                s.push(m-1);
                if (s.length > maxLength)
                    maxLength = s.length;
                n--;
            }
        }
    }
    console.log(maxLength);
    return n;
}

function A2(m)
{
    if (m < 4)
    {
        return A(m, m);
    }
    else if (m === 4)
    {
        let v = bigInt(2).pow(bigInt(65536));
        v = bigInt(2).pow(v);
        v = bigInt(2).pow(v);
        return v.subtract(3);
    }
    else if (m === 5)
    {
        return 0;
    }
    else if (m === 6)
    {
        return 0;
    }
    else   
        throw "Not supported";
}

function Ackerman(m)
{
    return A1(m, m);
}

console.log('4,1 -> ' + A1(4,1));
console.log('4,2 -> ' + A1(4,2));

// for (let m = 0; m <= 6; m++)
// {
//     console.log("Ackerman(" + m + ", " + m + ") = " + Ackerman(m));
// }