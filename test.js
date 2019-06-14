//134

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

function climbingLeaderboard(scores, alice)
{
    let ranks = [];

    let rank    = 1;
    let previous= scores[0];
    let iScores = 0;
    let iAlice  = alice.length;
    let current = alice[--iAlice];

    while (true)
    {
        if (current >= previous)
        {
            ranks.unshift(rank);
            if (iAlice === 0)
                break;

            current = alice[--iAlice];
        }
        else if (++iScores < scores.length)
        {
            let v = scores[iScores];
            if (v === previous)
                continue;
            rank++;
            previous = v;
        }
        else
        {
            rank++;
            for (let i = 0; i <= iAlice; i++)
                ranks.unshift(rank);
            break;
        }
    }

    return ranks;
}


assert.equal(climbingLeaderboard([100,100,50,40,40,20,10], [5, 25, 50, 120]), '6 4 2 1');
// assert.equal(encryption('feedthedog'), 'fto ehg ee dd');
// assert.equal(encryption('ifmanwasmeanttostayonthegroundgodwouldhavegivenusroots'), 'imtgdvs fearwer mayoogo anouuio ntnnlvt wttddes aohghn sseoau')
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