
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
136
153
171
190
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