// Sub-string divisibility
// Problem 43 
// The number, 1406357289, is a 0 to 9 pandigital number because it is made up of each of the digits 0 to 9 in 
// some order, but it also has a rather interesting sub-string divisibility property.

// Let d1 be the 1st digit, d2 be the 2nd digit, and so on. In this way, we note the following:

// d2d3d4=406 is divisible by 2
// d3d4d5=063 is divisible by 3
// d4d5d6=635 is divisible by 5
// d5d6d7=357 is divisible by 7
// d6d7d8=572 is divisible by 11
// d7d8d9=728 is divisible by 13
// d8d9d10=289 is divisible by 17
// Find the sum of all 0 to 9 pandigital numbers with this property.

function hasProperty(value)
{
    function div(v, d)
    {
        return (v - (v % d)) / d;
    }

    function check(v, d)
    {
        return ((v % 1000) % d) === 0;
    }

    if (! check(div(value, 1000000), 2)) 
        return false;
    if (! check(div(value, 100000), 3))
        return false;
    if (! check(div(value, 10000), 5))
        return false;
    if (! check(div(value, 1000), 7))
        return false;
    if (! check(div(value, 100), 11))
        return false;
    if (! check(div(value,10), 13))
        return false;
    if (! check(value, 17))
        return false;

    return true;
}

function *combinaisons()
{
    let used  = [];

    function *innerCombinaisons(current, length)
    {
        if (length > 9)
        {
            yield current;
            return;
        }

        for(let i = 0; i < 10; i++)
        {
            let d = i;
            if (used[d])
                continue;

            used[d] = 1;
            yield* innerCombinaisons(current*10 + d, length+1)
            used[d] = 0;
        }
    }

    yield* innerCombinaisons(0, 0);
}

function solve()
{
    let iterator = combinaisons();
    let sum = 0;

    for(let v = iterator.next(); !v.done; v = iterator.next())
    {
        if (hasProperty(v.value))
            sum += v.value;
    }
    return sum;
}

console.log('Sum of all 0 to 9 pandigital numbers with this property is ' + solve());