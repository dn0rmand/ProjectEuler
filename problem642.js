const assert = require('assert');

function F(n)
{
    let prime = new Map();
    let sum   = 0;
    let max = n / 2

    for (let p = 2; p <= max; p++)
    {
        if (! prime.has(p))
        {
            let i = p*2
            while (i <= n)
            {
                prime.set(i, p);
                i = i + p
            }
        }
    }

    for (let p = 2; p <= n; p++)
    {
        sum = (sum + (prime.get(p) || p)) % 1E9;
    }

    return sum
}

assert.equal(F(10), 32);
assert.equal(F(100), 1915);
assert.equal(F(10000), 10118280);

let s = F(1);

for (let i = 2; i < 20; i++)
    s = s + ', ' + F(i);

console.log(s);
// console.log(F(201820182018));

// gpf(n)=if(n<4, n, n=factor(n)[, 1]; n[#n]);
// a(n)=sum(k=2, n, Mod(gpf(k), 1000000000))
// a(10000)
// a(201820182018)