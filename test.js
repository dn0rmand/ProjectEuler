//134

// https://www.hackerrank.com/challenges/organizing-containers-of-balls/problem

const assert = {
    problem: 0,
    equal: function(value, expected)
    {
        // if (expected > Number.MAX_SAFE_INTEGER)
        //     throw "ERROR: Expected too big";
        // if (value > Number.MAX_SAFE_INTEGER)
        //     throw "ERROR: value too big";

        this.problem++;
        if (value !== expected)
            console.log(`Answer to problem ${this.problem} is incorrect`);
    }
}

// Complete the countLuck function below.
function countLuck(matrix, k)
{
    let $waved;
    let $visited = {};

    function get(x, y)
    {
        if (x < 0 || x >= matrix.length)
            return 'X';
        if (y < 0 || y >= matrix[x].length)
            return 'X';
        let k = x+'.'+y;
        if ($visited[k])
            return $visited[k];
        return matrix[x][y];
    }

    function set(x, y, value)
    {
        if (x < 0 || x >= matrix.length)
            return;
        if (y < 0 || y >= matrix[x].length)
            return;
        let k = x+'.'+y;
        $visited[k] = value;
    }

    function findPath(x, y, waved)
    {
        if ($waved) // already found path
            return $waved;

        if (get(x, y) == 'X')
            return;
        if (get(x, y) == '*')
        {
            $waved = waved;
            return;
        }
        let w = -1;
        if (get(x+1, y) != 'X') w++;
        if (get(x-1, y) != 'X') w++;
        if (get(x, y+1) != 'X') w++;
        if (get(x, y-1) != 'X') w++;

        if (w > 1)
            w = 1;
        if (w < 0)
            w = 0;

        set(x, y, 'X'); // prevent going in a loop
        findPath(x+1, y, waved+w);
        findPath(x-1, y, waved+w);
        findPath(x, y+1, waved+w);
        findPath(x, y-1, waved+w);
        set(x, y, '.');
    }

    let x, y;

    for (let i = 0; i < matrix.length; i++)
    {
        if (x != undefined && y != undefined)
            break;
        for (let j = 0; j < matrix[i].length; j++)
        {
            if (matrix[i][j] == 'M')
            {
                x = i;
                y = j;
                break;
            }
        }
    }

    if (x == undefined || y == undefined)
        return "What?"

    findPath(x, y, 0);
    if ($waved == k)
        return "Impressed"
    else
        return "Oops!"
}

assert.equal(countLuck(['*.M', '.X.'], 1), "Impressed");
assert.equal(countLuck(['.X.X......X',
                        '.X*.X.XXX.X',
                        '.XX.X.XM...',
                        '......XXXX.'], 3), "Impressed");
assert.equal(countLuck(['*..', 'X.X', '..M'], 1), "Oops!");

// process.exit(0);

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
    for (let n = 1; n <= 25 ; n++)
    {
        let v = (n*(n+1))/2;
        if (v > 171)
            console.log(v);
    }

    console.log('Done');
}

triangleNumbers();

/*
210
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