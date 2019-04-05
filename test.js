
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

/*

135
141
159
163
169
171
189

201
219
235
241
259
261
267
273
283
285
289
303
307
319
327
331
339
361
367
385
391 <----
399
409
415
421
427
433
451
463
475
477
483
487
489
495
511
517
519
529
535
537
541
553
559
577
579
583
591
613
615
619
639 <----
645
651
673
679
685
693
699
*/