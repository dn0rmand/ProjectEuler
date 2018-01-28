const MAX = 28123;

function* getDivisors(value)
{
    yield 1;
    let max = value;
    for(let i = 2; i < max; i++)
    {
        if ((value % i) == 0)
        {
            yield i;
            let res = value / i;
            if (res < max)
                max = res;
            if (res != i)
                yield res;
        }
    }
}

const cache = [];

function d(n)
{
    if (cache[n] !== undefined)
        return cache[n];

    let divisors = getDivisors(n);
    let sum = 0;
    for(let div = divisors.next(); !div.done; div = divisors.next())
    {
       sum += div.value;
    }

    cache[n] = sum;
    return sum;
}

function isPerfect(n)
{
    return d(n) === n;
}

function isDeficient(n)
{
    return d(n) < n;
}

function isAbundant(n)
{
    return d(n) > n;
}

function isSumable(n)
{
    let middle = (n >> 1)+1
    for (i = 1; i <= middle; i++)
    {
        let v1 = i;
        let v2 = n-i;

        if (isAbundant(v1) && isAbundant(v2))
        {
            return true;
        }
    }
    return false;
}

if (! isPerfect(28))
    throw "Incorrect calculation";

if (! isAbundant(12))
    throw "Incorrect calculation";

if (! isSumable(MAX))
    throw "Incorrect calculation";

let v = MAX;

while (isSumable(v))
    v--;
console.log("Limit is " + (v+1));

let total = 0;
for(let i = 0; i < MAX; i++)
{
    if (! isSumable(i))
        total += i;
}

console.log("Sum of all integers that are not the sum of two abundant numbers: " + total);