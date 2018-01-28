function check(value, power)
{
    let v = value.toString();

    let sum = 0;
    for(let i = 0; i < v.length; i++)
    {
        let c = +(v[i]);
        c = Math.pow(c, power);
        sum += c;
    }
    return sum === value;
}

function *find(power)
{
    let n = Math.pow(9, power);

    let i = 1;
    while(true)
    {
        i++;

        if (check(i, power))
            yield i;
        
        let l = i.toString().length; // number of digits
        if (i > l * n)
            break;
    }
}

function test()
{
    function assert(condition)
    {
        if (! condition)
            throw "Calculation error!";
    }

    assert(check(1634, 4));
    assert(check(8208, 4));
    assert(check(9474, 4));

    let iterator = find(4);
    
    assert(iterator.next().value === 1634);
    assert(iterator.next().value === 8208);
    assert(iterator.next().value === 9474);
    assert(iterator.next().done);

    console.log("Tests passed")
}

test();

let iterator = find(5);
let count    = 0;
let sum      = 0;

for(let v = iterator.next(); ! v.done ; v = iterator.next())
{
    sum += v.value;
    count++;
}

console.log(count  + ' numbers that can be written as the sum of fifth powers of their digits.');
console.log("Their sum is " + sum);