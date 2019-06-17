require('tools/numberHelper');

const assert    = require('assert');
const fs        = require('fs');
const readline  = require('readline');
const prettyTime = require('pretty-hrtime');

class Parser
{
    constructor(line)
    {
        this.input = line;
        this.index = 0;
    }

    peekChar()
    {
        if (this.index < this.input.length)
            return this.input[this.index];
        return '\0';
    }

    getChar()
    {
        if (this.index < this.input.length)
            return this.input[this.index++];
        return '\0';
    }

    getToken()
    {
        let c = this.getChar();

        if (c == 'I')
            return 'I';

        if (c >= 'a' && c <= 'z')
        {
            let token = c;
            while (this.peekChar() >= 'a' && this.peekChar() <= 'z')
            {
                token += this.getChar();
            }
            if (token == 'aa,')
                console.log('What?');
            return token;
        }
        else if (c === ',' || c === '(' || c === ')')
            return c;
        else
            throw 'Syntax error';
    }

    parse()
    {
        let t = this.getToken();
        if (t === 'I')
        {
            assert.equal(this.getToken(), '(');
            let x = this.parse();
            assert.equal(this.getToken(), ',');
            let y = this.parse();
            assert.equal(this.getToken(), ')');

            return {x: x, y: y};
        }
        else if (t[0] >= 'a' && t[0] <= 'z')
        {
            return t;
        }
        else
            throw "Either a variable or function I was expected";
    }
}

async function loadData()
{
    return new Promise((resolve, error) => {
        const readInput = readline.createInterface({
            input: fs.createReadStream('data/p674_i_expressions.txt')
        });

        let expressions = [];
        readInput
        .on('line', (line) => {
            let parser = new Parser(line);

            let expression = parser.parse();
            expressions.push(expression);
        })
        .on('close', () => {
            resolve(expressions);
        });
    });
}

function solve(expressions)
{
    for (let i =   0; i < expressions.length; i++)
    {
        let exp1 = expressions[i];
        for (let j = i+1; j < expressions.length; j++)
        {
            let exp2 = expressions[j];
        }
    }
}

function test()
{
    let expressions = [
        new Parser().parse('I(x,I(z,t))'),
        new Parser().parse('I(I(y,z),y)'),
        new Parser().parse('I(I(x,z),y)'),
    ];
    total = solve(expressions);
    assert.equal(total, 26);
}

async function execute()
{
    let expressions = await loadData();

    let timer = process.hrtime();
    let total = solve(expressions);
    timer = process.hrtime(timer);

    console.log('Answer is', total, "calculated in ", prettyTime(timer, {verbose:true}));
}

// test();
execute();

