require('tools/numberHelper');

const assert    = require('assert');
const fs        = require('fs');
const readline  = require('readline');
const prettyTime = require('pretty-hrtime');

const MODULO = 1000000000;

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

const $duplicate    = {time:0n, calls:0n};
const $useVariable  = {time:0n, calls:0n};
const $replace      = {time:0n, calls:0n};
const $reduce       = {time:0n, calls:0n};
const $calculate    = {time:0n, calls:0n};

function resetTimer(timer)
{
    timer.time = 0n;
    timer.calls = 0n;
}

function logTime(timer, action)
{
    let start = process.hrtime.bigint();
    let result = action();
    let end = process.hrtime.bigint();
    timer.time += end-start;
    timer.calls++;

    return result;
}

function duplicate(expression)
{
    function inner(expression)
    {
        if (typeof(expression) == 'string')
            return expression;

        return {
            x: inner(expression.x),
            y: inner(expression.y)
        };
    }

    return logTime($duplicate, () => inner(expression));
}

function useVariable(expression, name)
{
    function inner(expression)
    {
        if (typeof(expression) === 'string')
            return expression === name;
        else if (inner(expression.x))
            return true;
        else if (inner(expression.y))
            return true;
        else
            return false;
    }

    return logTime($useVariable, () => inner(expression));
}

function replace(expression, variable, value)
{
    function inner(expression)
    {
        if (expression.notme)
            return;

        if (typeof(expression.x) === 'string')
        {
            if (expression.x === variable)
            {
                expression.x = value;
            }
        }
        else if (expression.x)
        {
            inner(expression.x);
        }

        if (typeof(expression.y) === 'string')
        {
            if (expression.y === variable)
            {
                expression.y = value;
            }
        }
        else if (expression.y && expression.y !== expression.x)
        {
            inner(expression.y);
        }
    }

    logTime($replace, () => { inner(expression); });
}

function reduce(root1, root2)
{
    function inner(exp1, exp2)
    {
        if (exp1 === exp2)
            return true;

        if (typeof(exp1.x) === 'string' && typeof(exp2.x) === 'string')
        {
            if (exp1.x !== exp2.x)
            {
                let v1 = exp1.x;
                let v2 = exp2.x;

                v2.notme = true;
                replace(root1, v1, v2);
                replace(root2, v1, v2);
                v2.notme = false;
            }
        }
        else if (typeof(exp1.x) === 'string' && typeof(exp2.x) !== 'string')
        {
            if (useVariable(exp2.x, exp1.x))
                return false;

            let v1 = exp1.x;
            let v2 = exp2.x;

            v2.notme = true;
            replace(root1, v1, v2);
            replace(root2, v1, v2);
            v2.notme = false;
        }
        else if (typeof(exp1.x) !== 'string' && typeof(exp2.x) === 'string')
        {
            if (useVariable(exp1.x, exp2.x))
                return false;

            let v1 = exp2.x;
            let v2 = exp1.x;

            v2.notme = true;
            replace(root1, v1, v2);
            replace(root2, v1, v2);
            v2.notme = false;
        }
        else if (! inner(exp1.x, exp2.x))
            return false;

        if (typeof(exp1.y) === 'string' && typeof(exp2.y) === 'string')
        {
            if (exp1.y !== exp2.y)
            {
                let v1 = exp1.y;
                let v2 = exp2.y;

                v2.notme = true;
                replace(root1, v1, v2);
                replace(root2, v1, v2);
                v2.notme = false;
            }
        }
        else if (typeof(exp1.y) === 'string' && typeof(exp2.y) !== 'string')
        {
            if (useVariable(exp2.y, exp1.y))
                return false;

            let v1 = exp1.y;
            let v2 = exp2.y;

            v2.notme = true;
            replace(root1, v1, v2);
            replace(root2, v1, v2);
            v2.notme = false;
        }
        else if (typeof(exp1.y) !== 'string' && typeof(exp2.y) === 'string')
        {
            if (useVariable(exp1.y, exp2.y))
                return false;

            let v1 = exp2.y;
            let v2 = exp1.y;

            v2.notme = true;
            replace(root1, v1, v2);
            replace(root2, v1, v2);
            v2.notme = false;
        }
        else if (! inner(exp1.y, exp2.y))
            return false;

        return true;
    }

    return logTime($reduce, () => {
        if (typeof(root1) === 'string' && typeof(root2) === 'string')
            return undefined;

        if (typeof(root1) === 'string')
        {
            if (useVariable(root2, root1))
                return undefined;

            return root2;
        }
        else if (typeof(root2) === 'string')
        {
            if (useVariable(root1, root2))
                return undefined;

            return root1;
        }
        else
        {
            root1 = duplicate(root1);
            root2 = duplicate(root2);

            if (! inner(root1, root2))
                return undefined;

            return root1;
        }
    });
}

function calculate(expression)
{
    function inner(expression)
    {
        if (typeof(expression) === 'string')
            return 0;

        if (expression.value !== undefined)
            return expression.value;

        let x = inner(expression.x);
        let y = inner(expression.y);

        let value = (1+x+y) % MODULO;

        value = (value.modMul(value, MODULO) + y) - x;
        while (value < 0)
            value += MODULO;
        while (value >= MODULO)
            value -= MODULO;

        expression.value = value;
        return value;
    }

    return logTime($calculate, () => inner(expression));
}

function solve(expressions)
{
    resetTimer($calculate);
    resetTimer($duplicate);
    resetTimer($reduce);
    resetTimer($replace);
    resetTimer($useVariable);

    let total = 0;
    let length = expressions.length;
    // length = Math.min(10, length);

    for (let i = 0; i < length-1; i++)
    {
        for (let j = i+1; j < length; j++)
        {
            process.stdout.write(`\r${i+1} - ${j+1}  `);
            let exp = reduce(expressions[i], expressions[j]);

            if (exp !== undefined)
            {
                let v1 = calculate(exp);
                total = (total + v1) % MODULO;
            }
        }
    }

    return total;
}

function test()
{
    let expressions = [
        new Parser('I(x,I(z,t))').parse(),
        new Parser('I(I(y,z),y)').parse(),
        new Parser('I(I(x,z),y)').parse(),
    ];
    total = solve(expressions);
    assert.equal(total, 26);
}

async function execute()
{
    function log(functionName, timer)
    {
        if (timer.calls > 0)
            console.log(`${functionName} : ${ timer.time } - ${ timer.calls } calls - avg = ${ timer.time / timer.calls }`);
        else
            console.log(`${functionName} : ${ timer.time }`);
    }

    let expressions = await loadData();

    let timer = process.hrtime();
    let total = solve(expressions);
    timer = process.hrtime(timer);

    console.log('Answer is', total, "calculated in ", prettyTime(timer, {verbose:true}));

    log('  Calculate', $calculate);
    log('  Duplicate', $duplicate);
    log('     Reduce', $reduce);
    log('    Replace', $replace);
    log('useVariable', $useVariable);
}

//test();
execute();
