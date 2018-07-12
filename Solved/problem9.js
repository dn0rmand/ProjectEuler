function check(a, b)
{
    if (b <= a)
        return false;

    let c = 1000 - a - b;
    if (c <= b)
        return false;

    let result = (a*a + b*b) - (c*c);
    if (result !== 0)
        return false;

    return true;
}

for (let a = 0; a < 1000; a++)
{
    for (let b = a+1; b < 1000; b++)
    {
        if (check(a, b))
        {
            let c = 1000-a-b;
            console.log(a + ', ' + b + ', ' + c);
            console.log('Product is ' + a*b*c )
        }
    }
}
