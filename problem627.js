// Counting products
// Problem 627

// Consider the set S of all possible products of n positive integers not exceeding m , 
// that is S={ x1x2…xn|1 ≤ x1,x2,...,xn ≤ m }

// Let F(m,n) be the number of the distinct elements of the set S

// For example, F(9,2)=36 and F(30,2)=308.

// Find F(30,10001) mod 1000000007.

const assert = require('assert');
const bigInt = require('big-integer');

function F(m, n)
{
    let visited = new Map();

    function inner(value, start, count)
    {
        if (count === n)
        {
            if (value > Number.MAX_SAFE_INTEGER)
                throw "Too big";
            if (! visited.has(value))
                visited.set(value);
            return;
        }

        for (let x = start; x >= 1 ; x--)
        {
            inner(value * x, x, count+1);
        }
    }

    inner(1, m, 0);
    return visited.size;
}

function test()
{
    assert.equal(F(9, 2), 36);
    assert.equal(F(30,2), 308);    
    console.log("Tests passed");
}

function test1()
{
    let previous = F(9, 1);
    let a = 2;

    for (let i = 2; i < 10; i++)
    {
        a++;
        let v = F(9, i);
        let expected = previous + Math.pow(a, 3);
        console.log("F(9, " + i + ") = " + v + " ?= " + expected);
        previous = v;    
    }
}

function test2()
{
    // 308 -> 1909 -> 8679 -> 31856 -> 99814
    //    1601    6770   23177
    // 

    // 1601 = 6^4 + 6^3 + 6^2 +6^1 + 47
    // 8679 = 4*1909 + 3*347 + 2*1

    let prev = F(30, 1);
    console.log("F(30, 1) = " + prev); 
    for (let i = 2; i <= 5; i++)
    {
        let v = F(30, i);
        let d = v - prev;
        console.log("F(30, " + i + ") = " + v + " => " + d);
        prev = v;
    }    
}

function test3()
{
    console.log("F(30, 2) = "  + F(30,2));
    console.log("F(30, 3) = "  + F(30,3));
    console.log("F(30, 5) = "  + F(30,5));
    console.log("F(30, 7) = "  + F(30,7));
    console.log("F(30, 13) = " + F(30,11));
    console.log("F(30, 17) = " + F(30,13));
}

test();
test3();
// assert.equal(F(9, 2), 36);
// assert.equal(F(30,2), 308);

//let result = F(30,10001);

console.log('Done');
