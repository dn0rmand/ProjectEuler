const assert = require('assert');
const fs = require('fs');
const readline = require('readline');

const readInput = readline.createInterface({
    input: fs.createReadStream('data/p424_kakuro200.txt')
});

readInput
.on('line', (line) => { 
    let kakuro = parse(line);
    buildConstraints(kakuro);
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

                    let sum = {
                        type: 'sum',
                        col: col,
                        row: row,
                        h: s.sum
                    };
                    if (line[i] === ',')
                    {
                        i++;
                        assert.equal(line[i], 'v');
                        i++;
                        s = parseSum(i);
                        i = s.index;
                        sum.v = s.sum;
                    }
                    board[row][col] = sum;
                }
                else if (line[i] === 'v')
                {
                    i++;
                    let s = parseSum(i);
                    i = s.index;
                    board[row][col] = {
                        type: 'sum',
                        col: col,
                        row: row,
                        v : s.sum
                    };                    
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

function buildConstraints(kakuro)
{
    let size = kakuro.size;
    let constraints = [];
    let maxLetters  = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9];
    let minLetters  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    function process(s, r, c, rr, cc)
    {
        let max   = 9;
        let total = 0;   

        while (true)        
        {
            r += rr;
            c += cc;

            if (r >= size || c >= size)
                break;

            let x = kakuro[r][c];
            if (x === 'X' || x.type === 'sum')
                break;
            if (x >= 'A' && x <= 'J')
                minLetters[x.charCodeAt(0)-letterA] = 1;
            total += max;
            max--;
        }

        if (s.length === 1)
        {
            total = Math.min(total, 9);
            let l = s.charCodeAt(0) - letterA;
            if (maxLetters[l] > total)
                maxLetters[l] = total;
        }
        else 
        {
            if (total > 99)
                total = 99;

            let l1 = s.charCodeAt(0) - letterA;
            let l2 = s.charCodeAt(1) - letterA;
            let m  = maxLetters[l1] = Math.min(maxLetters[l1], Math.floor(total/10));
            if (l1 === l2)
            {
                let mm = m*10 + m;
                if (mm > total)
                {
                    maxLetters[l1]  = --m;
                    total = m*10 + m;
                }
                else
                    total = mm;
            }
        }

        return total;
    }

    for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
    {
        let o = kakuro[r][c];
        if (o.type !== "sum") continue;

        if (o.v !== undefined)
        {
            o.vMax = process(o.v, r, c, 1, 0);
        }
        if (o.h !== undefined)
        {
            o.hMax = process(o.h, r, c, 0, 1);
        }
        constraints.push(o);
    }
    kakuro.constraints = constraints;
    kakuro.maxLetters  = maxLetters;
    kakuro.minLetters  = minLetters;
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
        if (o.h !== undefined && o.hMax !== undefined)
        {
            let v = evaluate(o.h, letters);
            if (v > o.hMax)
                return false;
        }
        if (o.v !== undefined && o.vMax !== undefined)
        {
            let v = evaluate(o.v, letters);
            if (v > o.vMax)
                return false;
        }
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
            if (o.type === 'sum')
            {
                let oo = {
                    type: 'sum', 
                    col: c,
                    row: r,                   
                };

                if (o.v !== undefined)
                    oo.v = evaluate(o.v, letters);
                if (o.h !== undefined)
                    oo.h = evaluate(o.h, letters);
                k2[r][c] = oo;
                constraints.push(oo);
            }
            else if (o === 'X' || o === ' ')
                k2[r][c] = o;
            else
                k2[r][c] = evaluate(o, letters);
        }
    }

    return k2;
}

function solveConstraints(kakuro, horizontal)
{
    function getCells(constraint, cells, used)
    {
        let r   = constraint.row;
        let c   = constraint.col;
        let max = horizontal ? constraint.h : constraint.v;

        if (horizontal)
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
            }
            else
                cells.push({c:c, r:r});

            if (horizontal)
                c++;
            else
                r++;
        }

        return max;
    }

    let didSomething = false;

    for (let constraint of kakuro.constraints)
    {
        if (horizontal && constraint.h === undefined)
            continue;
        else if (! horizontal && constraint.v === undefined)
            continue;

        let cells = [];
        let used  = [];
        
        let max = getCells(constraint, cells, used);

        if (cells.length === 0)
        {
            if (max !== 0)
                return false;
        }
        else if (cells.length === 1)
        {                    
            if (max < 0 || max >= 10 || used[max] === 1)
                return false;

            let cell = cells[0];
            kakuro[cell.r][cell.c] = max;
            if (! solveConstraints(kakuro, horizontal))
            {
                kakuro[cell.r][cell.c] = ' ';
                return false;
            }
            didSomething = true;
        }
        else
        {
            didSomething = true;

            let cc = cells[0];

            for (let x = 1; x < 10; x++)
            {
                if (used[x] !== 1 && x < max)
                {
                    kakuro[cc.r][cc.c] = x;
                    if (solveConstraints(kakuro, horizontal))
                        return true;
                }
            }

            kakuro[cc.r][cc.c] = ' ';
            return false;
        }
    }

    if (! didSomething && horizontal)
        return solveConstraints(kakuro, false);

    return true;
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
            // Check with those letter
            if (! validateConstraints(kakuro, letters))
                return false;
            
            let k2 = apply(kakuro, letters);

            if (! solveConstraints(k2, true))
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