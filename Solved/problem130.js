const primeHelper = require('tools/primeHelper')();

primeHelper.initialize(1E6);

function gcd(a, b)
{
    while (b !== 0)
    {
        let c = a % b;
        a = b;
        b = c;
    }
    return a;
};

function A(n)
{
    let x = 1, k = 1;

    while (x !== 0)
    {
        x = (x * 10 + 1) % n;
        k++;
    }
    return k
}

function solve()
{
    let total = 0;
    let count = 0;
    for (let n = 2; count < 25; n++)
    {
        if (primeHelper.isKnownPrime(n))
            continue;
        if (gcd(n, 10) === 1)
        {
            k = A(n);
            if ((n-1) % k === 0)
            {
                total += n;
                count++;
            }
        }
    }

    return total;
}

let answer = solve();

console.log('Answer is', answer);
console.log('Done');
