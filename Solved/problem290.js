const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

function digitSum(n)
{
    let sum = 0;

    while (n > 0) {
        const d = n % 10;
        n = (n-d)/10;
        sum += d;
    }

    return sum;
}

function brute(n)
{
    const max = 10 ** n;

    let total = 0n;

    for(let value = 0; value <= max; value += 9)
    {
        if (digitSum(value) === digitSum(value * 137)) {
            total++;
        }
    }    

    console.log(total);
    return total;
}

function solve(n)
{
    const $memoize = [];

    function get(prefix, sum, sum137, length)
    {
        const diff = sum - sum137;

        let sub = $memoize[prefix];
        if (! sub) return undefined;
        let sub2 = sub.get(length);
        if (! sub2) return undefined;
        return sub2.get(diff);
    }

    function set(prefix, sum, sum137, length, value)
    {
        const diff = sum - sum137;

        let sub = $memoize[prefix];
        if (! sub) {
            sub = new Map();
            $memoize[prefix] = sub;
        }
        let sub2 = sub.get(length);
        if (! sub2) {
            sub2 = new Map();
            sub.set(length, sub2);
        }
        sub2.set(diff, value);
    }

    function inner(prefix, sum, sum137, length) 
    {
        if (length === 0) {
            sum137 += digitSum(prefix);
            return (sum === sum137 ? 1n : 0n);
        }

        let count = get(prefix, sum, sum137, length);
        if (count !== undefined) {
            return count;
        }
        count = 0n;
        for(let digit = 0; digit < 10; digit++) {
            const s137 = prefix + digit*137;
            const d137 = s137 % 10;
            const p137 = (s137-d137)/10;
            
            count += inner(p137, sum + digit, sum137 + d137, length-1);
        }

        set(prefix, sum, sum137, length, count);
        return count;
    }

    const total = inner(0, 0, 0, n);

    return total;
}

const answer = timeLogger.wrap('', _ => solve(18));

console.log(`Answer is ${answer}`);
