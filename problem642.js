const assert = require('assert');

const MAX = 820182018; // 20 1820182018
const $prime  = new Uint32Array(MAX);
const $values = new Uint32Array(MAX);

function makeMap(n)
{
    let max = n / 2

    for (let p = 2; p <= max; p++)
    {
        if ($prime[p] === 0)
        {
            let i = p*2
            while (i <= n)
            {
                $prime[i] = p;
                i = i + p
            }
        }
    }

    let sum   = 0;
    for (let p = 2; p <= n; p++)
    {
        sum = (sum + ($prime[p] || p)) % 1E9;
        $values[p] = sum;
    }
}

function F(n)
{
    return $values[n];
}

makeMap(MAX);

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