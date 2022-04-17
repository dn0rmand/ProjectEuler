const timeLog = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Sorted = require('sorted');

const MAX = 150000;

function isNumberPrime(n, root) 
{
    if (n < 2n || n % 1n || n % 2n === 0n || n % 3n === 0n)
        return false;

    for (let i = 5n; i <= root; i += 6n) 
    {
        if (n % i === 0n || n % (i + 2n) == 0n) 
        {
            return false;
        }
    }

    return true;
}
  
function getDivisors(value, root)
{
    let divisors = [1n];
    if (value > 1n)
        divisors.push(value);

    if (value <= 2n)
        return divisors;

    if (isNumberPrime(value, root))
        return divisors; 

    let max   =  root;
    let start = 2n;
    let steps = 1n;
    if ((value & 1n) !== 0n)
    {
        start = 3n;
        steps = 2n;
    }

    for(let i = start; i < max; i+=steps)
    {
        if ((value % i) == 0n)
        {
            let res = value / i;
            if (res > i)
                divisors.push(res);

            divisors.push(i);

            if (res < max)
                max = res;
        }
    }

    return divisors;
}

// p(p+d)(p+(p^2+1)/d) d divisors of p

function buildSequence(index)
{
    let map  = new Set();

    let p = 1n;

    for(; map.size < index; p++)
    {
        process.stdout.write(`\r${map.size}   `);

        let P = (p*p)+1n;
        for (let d of getDivisors(P, p+1n))
        {
            const a = (p*(p+d)) * (p + (P/d));

            if (! map.has(a))
                map.add(a);
        }
    }

    let values  = Sorted([...map.keys()]);
    values.elements.length = index;

    let current = values.get(index-1);

    process.stdout.write(`\r${current} `);

    let notMoved = 0;

    for(; ; p++)
    {
        let P = (p*p)+1n;
        for (let d of getDivisors(P, p+1n))
        {
            const a = (p*(p+d)) * (p + (P/d));

            if (a < current && ! map.has(a))
            {                
                map.add(a);
                values.push(a);
                values.length = index;
                values.elements.length = index;
                current = values.get(index-1);
                process.stdout.write(`\r${current} `);
                notMoved = 0;
            }
        }
        if (++notMoved > 100)
            break;
    }
    process.stdout.write('\r                \r');
    return current;
}

const answer = timeLog.wrap('', () => buildSequence(MAX)); // add so extra in case the order is incorrect
console.log(`Answer is ${answer}`);