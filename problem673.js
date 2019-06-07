require('tools/numberHelper');

const assert    = require('assert');
const fs        = require('fs');
const readline  = require('readline');
const prettyHrtime = require('pretty-hrtime');

const MODULO = 999999937;
const TWO = 2;

function factorial(value)
{
    let result = 1;

    for (let i = 2; i <= value; i++)
        result = result.modMul(i, MODULO);
    return result;
}

async function loadBeds()
{
    return new Promise((resolve, error) => {
        const readInput = readline.createInterface({
            input: fs.createReadStream('data/p673_beds.txt')
        });

        let beds = {};
        readInput
        .on('line', (line) => {
            let v = line.split(',');
            v[0] = +(v[0]);
            v[1] = +(v[1]);

            beds[v[0]] = v[1];
            beds[v[1]] = v[0];
        })
        .on('close', () => {
            resolve(beds);
        });
    });
}

async function loadDesks()
{
    return new Promise((resolve, error) => {
        const readInput = readline.createInterface({
            input: fs.createReadStream('data/p673_desks.txt')
        });

        let desks = {};
        readInput
        .on('line', (line) => {
            let v = line.split(',');
            v[0] = +(v[0]);
            v[1] = +(v[1]);
            desks[v[0]] = v[1];
            desks[v[1]] = v[0];
        })
        .on('close', () => {
            resolve(desks);
        });
    });
}

function solve(studentCount, beds, desks)
{
    // Try to build chains

    function pop(map, student)
    {
        let s2 = map[student];
        delete map[student];
        if (s2)
            delete map[s2];
        return s2;
    }

    function follow(student)
    {
        let chain = [];
        let type  = '?';
        let isBed;

        chain.push(student);

        if (beds[student])
        {
            type  = 'B';
            isBed = true;
            student = pop(beds, student);
            chain.push(student);
        }
        else if (desks[student])
        {
            type  = 'D';
            isBed = false;
            student = pop(desks, student);
            chain.push(student);
        }
        else
            return [undefined, '?'] ;

        while (student)
        {
            student = pop(isBed ? desks : beds, student);
            isBed = ! isBed;

            if (student)
                chain.push(student);
        }

        return [chain, type];
    }

    let chainsPerType = {
        'B': {},
        'D': {},
        '.': {'1': []}
    };

    // Students not in the file

    for (let student = 1; student <= studentCount; student++)
    {
        if (! desks[student] && ! beds[student])
            chainsPerType['.'][1].push([student]);
    }

    // cycles are not per type.
    let cycles = {};

    for (let student = 1; student <= studentCount; student++)
    {
        let [chain, type] = follow(student);
        if (chain === undefined)
            continue;

        let length = chain.length;
        if ((length & 1) === 1)
            type = '.';

        if (chain[0] === chain[length-1])
        {
            chain.pop();
            length--;
            assert.equal(length & 1, 0);
            cycles[length] = cycles[length] || [];
            cycles[length].push(chain);
        }
        else
        {
            let s = ( chainsPerType[type][length] = chainsPerType[type][length] || [] );
            s.push(chain);
        }
    }

    let total = 1;

    // Process circles

    for (let k of Object.keys(cycles))
    {
        let l = +k;
        let c = cycles[k].length;

        let t = 1;

        t = t.modMul(factorial(c), MODULO);
        t = t.modMul(l.modPow(c, MODULO));

        // console.log(`${c} cycles of length ${l} -> ${t}`);

        total = total.modMul(t, MODULO);
    }

    // Process chains per type

    for (let type of ['B', 'D', '.'])
    {
        for (let k of Object.keys(chainsPerType[type]))
        {
            let l = +k;
            let c = chainsPerType[type][k].length;
            if (c === 0)
                continue;

            let t = 1;

            if (type !== '.')
                t = TWO.modPow(c, MODULO);

            t = t.modMul(factorial(c), MODULO);

            // console.log(`${c} chains of length ${l} and type ${type} -> ${t}`);

            total = total.modMul(t, MODULO);
        }
    }

    return total;
}

function test()
{
    let beds;
    let desks;
    let total;

    function add(values)
    {
        let map = {};
        for (let i = 0; i < values.length-1; i+=2)
        {
            map[values[i]] = values[i+1];
            map[values[i+1]] = values[i];
        }
        return map;
    }

    beds = add([2,13, 4,30, 5,27, 6,16, 10,18, 12,35, 14,19, 15,20, 17,26, 21,32, 22,33, 24,34, 25,28]);
    desks= add([1,35, 2,22, 3,36, 4,28,  5,25,  7,18,  9,23, 13,19, 14,33, 15,34, 20,24, 26,29, 27,30]);

    total = solve(36, beds, desks);
    assert.equal(total, 663552);

    beds = add([1, 2, 3, 4, 5,6]);
    desks= add([3, 6, 4, 5]);

    total = solve(6, beds, desks);
    assert.equal(total, 8);
}

async function execute()
{
    let beds = await loadBeds();
    let desks= await loadDesks();

    let total = solve(500, beds, desks);

    console.log('Answer is', total);
}

test();
execute();
