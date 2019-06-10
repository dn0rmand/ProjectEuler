// https://www.hackerrank.com/challenges/organizing-containers-of-balls/problem

const assert = {
    problem: 0,
    equal: function(value, expected)
    {
        this.problem++;
        if (value !== expected)
            console.log(`Answer to problem ${this.problem} is incorrect`);
    }
}

function pickingNumbers(a)
{
    let maxLength = 0;

    for (let i = 0; i < a.length; i++)
    {
        let min = a[i];
        let max = a[i];
        let length = 0;
        let X = [];
        for (let j = 0; j < a.length; j++)
        {
            let v = a[j];
            if (Math.abs(v-min) <= 1 && Math.abs(v-max) <= 1)
            {
                min = Math.min(v, min);
                max = Math.max(v, max);
                if (Math.abs(max-min) > 1)
                    throw "ERROR";
                length++;
                X.push(v);
            }
        }
        if (length > maxLength)
            maxLength = length;
    }

    return maxLength;
}


assert.equal(pickingNumbers([4,6,5,3,3,1]), 3);
assert.equal(pickingNumbers([1,2,2,3,1,2]), 5);

console.log('Success');

process.exit(0);

function luckyNumbers()
{
    let buffer = { value:1 }

    let ptr = buffer;
    for (let v = 3; v < 700; v+=2)
    {
        let t = { value : v }
        ptr.next = t;
        ptr = t;
    }

    ptr = buffer.next;
    while (ptr != undefined)
    {
        let skip = ptr.value-1;
        let p2 = buffer;

        while (p2 != undefined)
        {
            let p3 = p2.next;
            if (p3 === undefined)
                break;
            skip--;
            if (skip === 0)
            {
                p2.next = p3.next;
                skip = ptr.value;
            }
            p2 = p3;
        }

        ptr = ptr.next;
    }

    ptr = buffer.next;
    while (ptr != undefined)
    {
        console.log(ptr.value);
        ptr = ptr.next;
    }

    console.log('done');
}

function triangleNumbers()
{
    for (let n = 1; ; n++)
    {
        let v = (n*(n+1))/2;
        if (v > 700)
            break;
        if (v > 125)
            console.log(v);
    }

    console.log('Done');
}

triangleNumbers();

/*
153
210
253
300
325


351
378
406
435
465
496
528
561
595
666
*/