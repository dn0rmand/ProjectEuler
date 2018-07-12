const cache = [];
const MAX = 10000;

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

function* amicableNumbers()
{
    for (let i = 1; i < MAX; i++)
    {
        let v = d(i);
        if (v !== i && d(v) === i)
        {
            yield i;
        }
    }        
}

let d220 = d(220);
let d284 = d(284);

if (d220 != 284 || d284 != 220)
    throw "d(n) doesn't work!";

let amicables = amicableNumbers();
let sum = 0;
let count= 0;
for (let i = amicables.next(); ! i.done; i = amicables.next())
{
    count++;
    sum += i.value;
}

console.log("There are " + count + " amicable numbers under " + MAX);
console.log('Sum of all amicable numbers under ' + MAX + " is " + sum);