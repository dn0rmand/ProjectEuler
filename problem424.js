const assert = require('assert');
const fs = require('fs');
const readline = require('readline');

const readInput = readline.createInterface({
    input: fs.createReadStream('data/p424_kakuro200.txt')
});

readInput
.on('line', (line) => { 
    let kakuro = parse(line);
    updateConstraints(kakuro);
    let result = solve(kakuro);
    console.log(result);
})
.on('close', () => {
    console.log('Done');
    process.exit(0);
});

const letterA = "A".charCodeAt(0);

function parse(line)
{
    function parseSum(i)
    {
        let sum = '';
        while (line[i] >= 'A' && line[i] <= 'J')
        {
            sum += line[i];
            i++;
        }
        return {index: i, sum: sum};
    }

    let size = +(line[0]);

    assert.ok(size === 6 || size === 7);
    assert.equal(line[1], ',');
    
    let board = [];
    board.size = size;
    board.constraints = [];

    for (let i = 0; i < size; i++)
        board.push([]);

    let col = 0, row = 0;
    for (let i = 2; i < line.length; i += 2)
    {
        let c = line[i];
        switch (c)
        {
            case 'X': 
                board[row][col] = 'X'; 
                break;
            case 'O':
                board[row][col] = ' '; 
                break;
            case '(':
                i++;
                if (line[i] === 'h')
                {
                    i++;
                    let s = parseSum(i);
                    i = s.index;

                    board.constraints.push({
                        horizontal: true,
                        col: col,
                        row: row,
                        value: s.sum
                    });
                    if (line[i] === ',')
                    {
                        i++;
                        assert.equal(line[i], 'v');
                        i++;
                        s = parseSum(i);
                        i = s.index;
                        board.constraints.push({
                            vertical: true,
                            col: col,
                            row: row,
                            value: s.sum
                        });
                    }
                    board[row][col] = 'X';
                }
                else if (line[i] === 'v')
                {
                    i++;
                    let s = parseSum(i);
                    i = s.index;
                    board.constraints.push({
                        vertical: true,
                        col: col,
                        row: row,
                        value: s.sum
                    });

                    board[row][col] = 'X';                    
                }
                else
                    throw "Syntax error";
                
                assert.equal(line[i], ')');
                break;

            default:
                if (c >= 'A' && c <= 'J')
                    board[row][col] = c; 
                else
                    throw "Syntax error";
                break;
        }

        if (i+1 < line.length)
        {
            assert.equal(line[i+1], ',');

            col = (col + 1) % size;
            if (col === 0)
                row++;
        }
    }

    return board;
}

function updateConstraints(kakuro)
{
    let size = kakuro.size;
    let maxLetters  = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9];
    let minLetters  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    function process(constraint)
    {
        constraint.cells = new Set();

        let s = constraint.value;
        let r = constraint.row;
        let c = constraint.col;
        let cc = 0;
        let rr = 0;
        if (constraint.vertical)
            rr = 1;
        else if (constraint.horizontal)
            cc = 1;

        let max   = 9;
        let min   = 1;
        let totalMax = 0;   
        let totalMin = 0;

        while (true)        
        {
            r += rr;
            c += cc;

            if (r >= size || c >= size)
                break;

            let x = kakuro[r][c];
            if (x === 'X')
                break;

            let cell = r + '-' + c;
            constraint.cells.add(cell);

            totalMin += min;
            totalMax += max;
            max--;
            min++;
            if (x >= 'A' && x <= 'J')
            {
                let l = x.charCodeAt(0)-letterA;
                minLetters[l] = Math.max(minLetters[l], 1);
            }
        }

        if (s.length === 1)
        {
            totalMax = Math.min(totalMax, 9);
            totalMin = Math.max(totalMin, 1);
            let l = s.charCodeAt(0) - letterA;
            if (maxLetters[l] > totalMax)
                maxLetters[l] = totalMax;
        }
        else 
        {
            if (totalMax > 99)
                totalMax = 99;
            if (totalMin < 1)
                totalMin = 1;

            let l1 = s.charCodeAt(0) - letterA;
            let l2 = s.charCodeAt(1) - letterA;
            let m1  = maxLetters[l1] = Math.min(maxLetters[l1], Math.floor(totalMax/10));
            // let m2  = minLetters[l1] = Math.max(minLetters[l1], Math.floor(totalMin/10));
            if (l1 === l2)
            {
                let mm = m1*10 + m1;
                if (mm > totalMax)
                {
                    maxLetters[l1]  = --m1;
                    totalMax = m1*10 + m1;
                }
                else
                    totalMax = mm;

                // mm = m2*10 + m2;
                // if (mm < totalMin)
                // {
                //     maxLetters[l1]  = ++m2;
                //     totalMin = m1*10 + m2;
                // }
                // else
                //     totalMin = mm;
            }
        }

        return { min: totalMin, max: totalMax };
    }

    for (let constraint of kakuro.constraints)
    {
        let info = process(constraint);

        constraint.max = info.max;
        constraint.min = info.min;

        let l = constraint.value;
        l = l.charCodeAt(0)-letterA;

        minLetters[l] = Math.max(minLetters[l], 1);    
    }

    kakuro.maxLetters  = maxLetters;
    kakuro.minLetters  = minLetters;

    kakuro.constraints.sort( (c1, c2) => {
        let s1 = c1.cells.size;
        let s2 = c2.cells.size;

        for (let c of c1.cells)
        {
            if (c2.cells.has(c))
                return 0;
        }

        if (s1 === s2)
            return 1;
        else
            return s1-s2;
    });
}

function evaluate(s, letters)
{
    let value = 0;

    for (let i = 0; i < s.length; i++)
    {
        let v = letters[s.charCodeAt(i) - letterA];
        value = (value * 10)+v;
    }
    return value;
}

function validateConstraints(kakuro, letters)
{    
    for (let o of kakuro.constraints)
    {
        let v = evaluate(o.value, letters);
        if (v > o.max)
            return false;
        // if (v < o.min)
        //     return false;
    }
    return true;
}

function apply(kakuro, letters)
{
    let size = kakuro.size;
    let constraints = [];

    let k2 = [];
    k2.size = size;
    k2.constraints = constraints;

    for (let r = 0; r < size; r++)
    {
        k2[r] = [];
        for (let c = 0; c < size; c++)
        {       
            let o = kakuro[r][c];

            if (o === 'X' || o === ' ')
                k2[r][c] = o;
            else
                k2[r][c] = evaluate(o, letters);
        }
    }

    for (let c of kakuro.constraints)
    {
        constraints.push({
            row: c.row,
            col: c.col,
            horizontal: c.horizontal,
            vertical: c.vertical,
            value: evaluate(c.value, letters),
            max: c.max,
            min: c.min
        });
    }

    return k2;
}

function solveConstraints(kakuro, index)
{
    if (index === undefined)
        index = 0;

    function *possible(count, value, used)
    {
        used = Array.from(used);
        
        let values = [];

        function *inner(count, value, index)
        {
            if (count === 0)
            {
                yield values;
                return;
            }

            if (count === 1)
            {
                if (value > 9)
                    return;
                if (used[value] === 1)
                    return;
                values.push(value);
                yield values;
                values.pop(value);
                return;
            }

            for (let c = index; c < 10; c++)
            {
                if (c > value)
                    break;
                if (used[c] !== 1)
                {
                    used[c] = 1;
                    values.push(c);
                    yield *inner(count-1, value-c, c+1);
                    values.pop();
                    used[c] = 0;
                }
            }
        }

        yield *inner(count, value, 1);
    }

    function getCells(constraint, cells, used)
    {
        let r   = constraint.row;
        let c   = constraint.col;
        let max = constraint.max;
        // let min = constraint.min;

        if (constraint.horizontal)
            c++;
        else
            r++;

        while (c < kakuro.size && r < kakuro.size)
        {
            let o = kakuro[r][c];
            if (o === 'X' || o.type === 'sum')
                break;
            if (o !== ' ')
            {
                used[o]=1;
                max -= o;
                // min -= o;
                if (max < 0) // || min < 0)
                    break;
            }
            else
                cells.push({c:c, r:r});

            if (constraint.horizontal)
                c++;
            else
                r++;
        }

        if (cells.length === 0)
        {
            if (max !== 0) // || min !== 0)
                return -1;
        }
        // else if (cells.length === 1)
        // {
        //     if (max !== min)
        //         return -1;
        // }

        return max;
    }

    if (index >= kakuro.constraints.length)
        return true;

    let constraint = kakuro.constraints[index];

    let cells = [];
    let used  = [];
    
    let max = getCells(constraint, cells, used);

    if (cells.length === 0)
    {
        if (max === 0)
            return solveConstraints(kakuro, index+1);
    }
    else if (cells.length === 1)
    {                    
        if (max < 1 || max >= 10 || used[max] === 1)
            return false;

        let cell = cells[0];
        kakuro[cell.r][cell.c] = max;
        if (solveConstraints(kakuro, index+1))
            return true;
        kakuro[cell.r][cell.c] = ' ';
    }
    else
    {
        let cell = cells[0];

        assert.equal(kakuro[cell.r][cell.c], ' ');
        for (let ll = 1; ll < 10; ll++)
        {
            if (used[ll] !== 1)
            {
                kakuro[cell.r][cell.c] = ll;
                if (solveConstraints(kakuro, index))
                    return true;
            }
        }
        kakuro[cell.r][cell.c] = ' ';
        /*
        for (let vs of possible(cells.length, max, used))
        {
            for (let x = 0; x < cells.length; x++)
            {
                let cc = cells[x];
                kakuro[cc.r][cc.c] = vs[x];
            }
            if (solveConstraints(kakuro, index+1))
                return true;
        }
        // Rollback
        for (let x = 0; x < cells.length; x++)
        {
            let cc = cells[x];
            kakuro[cc.r][cc.c] = ' ';
        }
        */
    }

    return false;
}

function solve(kakuro)
{
    let values     = [];
    let letters    = [];
    let maxLetters = kakuro.maxLetters;
    let minLetters = kakuro.minLetters;

    function inner(index)
    {
        if (index === 10)
        {
            letters = [8, 4, 2, 6, 0, 3, 9, 5, 7, 1];
            // Check with those letter
            if (! validateConstraints(kakuro, letters))
                return false;
            
            let k2 = apply(kakuro, letters);

            if (! solveConstraints(k2, 0))
                return false;

            return true;
        }

        for (let i = minLetters[index]; i <= maxLetters[index]; i++)
        {
            if (values[i] !== 1)
            {
                values[i] = 1;
                letters[index] = i;
                if (inner(index+1) === true)
                    return true;
                values[i] = 0;
            }
        }

        return false;
    }

    if (! inner(0))
        throw "Cannot solve, Really?";

    let v = 0;
    for (let c of letters)
        v = v*10 + c;
    return v;
}