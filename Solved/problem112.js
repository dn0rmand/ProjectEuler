// Bouncy numbers
// Problem 112 
// Working from left-to-right if no digit is exceeded by the digit to its left it is called an increasing number; 
// for example, 134468.

// Similarly if no digit is exceeded by the digit to its right it is called a decreasing number; for example, 66420.

// We shall call a positive integer that is neither increasing nor decreasing a "bouncy" number; for example, 155349.

// Clearly there cannot be any bouncy numbers below one-hundred, but just over half of the numbers below one-thousand (525) 
// are bouncy. In fact, the least number for which the proportion of bouncy numbers first reaches 50% is 538.

// Surprisingly, bouncy numbers become more and more common and by the time we reach 21780 the proportion of bouncy numbers 
// is equal to 90%.

// Find the least number for which the proportion of bouncy numbers is exactly 99%.

const assert = require('assert');

function isBouncy(number)
{
    if (number < 100)
        return false;

    let diff = 0;
    let previous = number % 10;    
    number = (number - previous) / 10;
    while (number != 0)
    {
        let current = number % 10;
        
        number  = (number - current) / 10;

        let diff2 = previous > current ? 1 : (previous < current ? -1 : 0);
        previous = current;
        if (diff2 !== 0)
        {
            if (diff === 0)
                diff = diff2;
            else if (diff2 != diff)
                return true;
        }
    }
    return false;
}

function solve()
{
    let count = 0;
    let value = 99;

    while (true)
    {
        value++;

        if (isBouncy(value))
            count++;

        if (value === 538)
        {
            assert.equal(count/value, 0.5);
        }
        else if (value === 21780)
        {
            assert.equal(count/value, 0.9);
            break;
        }
    }

    while(true)
    {
        value++;
        
        if (isBouncy(value))
            count++;
        
        let percent = count / value;
        if (percent === 0.99)
        {
            console.log(value);
            break;
        }
    }
}

assert.equal(isBouncy(134468), false);
assert.equal(isBouncy(66420), false);
assert.equal(isBouncy(155349), true);

solve();