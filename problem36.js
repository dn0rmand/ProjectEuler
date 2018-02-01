function isPalindrome(value, base)
{
    let s = value.toString(base);

    for(let i=0, j=s.length-1; i<j; i++, j--)
    {
        if (s[i] != s[j])
            return false;
    }
    return true;
}

if (! isPalindrome(585, 10))
    console.log("Doesn't work in base 10");
if (! isPalindrome(585, 2))
    console.log("Doesn't work in base 2");

let sum = 0
for (let i = 1; i < 1000000; i++)
{
    if (isPalindrome(i, 10) && isPalindrome(i, 2))
    {
        sum += i;
    }
}
// for(let i = 1; i < 1000; i++)
// {

// }
console.log('Sum of the palindromic (base 2 and 10) numbers less than one million is ' + sum);
