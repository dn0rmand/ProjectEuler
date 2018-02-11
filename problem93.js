const digits    = [1, 2, 3, 4];
const operators = [ '+', '-', '*', '/'];
const templates = [
    "X#X#X#X",
    "X#(X#X)#X",
    "X#X#(X#X)",
    "X#(X#X#X)",
    "(X#X)#(X#X)"
]; 
const allTemplates = [];
const allDigitSet  = [];
let   evaluateNumbers ;

function *generateAllTemplates()
{
    for(let template of templates)
    {
        for (let op1 of operators)
        {
            let t1 = template.replace('#', op1);
            for (let op2 of operators)
            {
                let t2 = t1.replace('#', op2);
                for (let op3 of operators)
                {
                    let t3 = t2.replace('#', op3);
                    yield t3;
                }
            }
        }
    }
}

function *generateDigitSet(digitSet)
{
    if (digitSet.length === 4)
    {
        yield Array.from(digitSet);
    }
    else
    {
        for(let digit of digits)
        {
            if (! digitSet.includes(digit))
            {
                digitSet.push(digit);
                yield *generateDigitSet(digitSet);
                digitSet.pop();
            }
        }
    }
}

function isValidNumber(value, cache)
{
    if (! Number.isFinite(value))
        return false;

    if (value > 0 && Math.floor(value) === Math.ceil(value))
    {
        if (cache === undefined)
            return true;
        if (cache.has(value))
            return false;
        cache.set(value, value);
        return true;
    }

    return false;
}

function generateFunction()
{    
    let cache   = new Map();
    let numbers = [];

    let fn = "let result = function(digits) {\n";
    fn += "function *evaluateNumbers() {\n" 
    fn += "\t let value;\n";
    fn += "\t let cache = new Map();\n"

    for (let template of allTemplates)
    for (let digits of allDigitSet)
    {
        let t = template;
        for(let digit of digits)
        {
            t = t.replace('X', "digits[" + (digit-1) + "]");
        }
        fn += "\t value = " + t + ";\n";        
        fn += "\t if (isValidNumber(value, cache))\n\t\t yield value\n";
    }
    fn += "};\n";
    fn += "return evaluateNumbers();"
    fn += "}\n";
    fn += "result;";
    evaluateNumbers = eval(fn);
}

function initialize()
{
    for (let t of generateAllTemplates())
        allTemplates.push(t);

    for (let set of generateDigitSet([]))
        allDigitSet.push(set);

    generateFunction();
}

function calculate(digits)
{    
    let values = evaluateNumbers(digits);
    let numbers = [];

    for(let value of values)
    {
        numbers.push(value);
    }

    numbers.sort((v1, v2) => { return v1-v2; });
    let count = 0, maxCount = 0;

    for(let i = 1; i < numbers.length; i++)
    {
        if (numbers[i] === numbers[i-1] + 1)
        {
            if (count === 0)
                count = 1;
            count++;
            if (count > maxCount)
                maxCount = count;
        }
        else
        {
            count = 0;
        }
    }

    return maxCount;
}

function *select4Digits()
{
    for(let d1 = 1; d1 <= 9; d1++)
        for(let d2 = d1+1; d2 <= 9; d2++)
            for(let d3 = d2+1; d3 <= 9; d3++)
                for(let d4 = d3+1; d4 <= 9; d4++)
                    yield [d1, d2, d3, d4];
}

initialize();
let count = calculate([1,2,3,4]);
console.log("1,2,3,4 -> " + count);

let maxCount = 0;
let maxSet   = undefined;

for (let digitSet of select4Digits())
{
    let count = calculate(digitSet);
    if (count > maxCount)
    {
        maxCount = count;
        maxSet = digitSet;
    }
}

console.log(maxSet.toString() + ' -> ' + maxCount);
