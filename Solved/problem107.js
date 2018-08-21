// Minimal network

/*

-,16,12,21,-,-,-
16,-,-,17,20,-,-
12,-,-,28,-,31,-
21,17,28,-,18,19,23
-,20,-,18,-,-,11
-,-,31,19,-,-,27
-,-,-,23,11,27,-

*/

const assert    = require('assert');
const fs        = require('fs');
const readline  = require('readline');

const readInput = readline.createInterface({
    input: fs.createReadStream('../data/p107_network.txt')
});

const network = {
};

const excluded = {
};

function key(value)
{
    const A = "A".charCodeAt(0);

    let x = value % 10;
    let y = (value - x)/10;

    return String.fromCharCode(A+y) + String.fromCharCode(A+x);
}

function getWeight()
{
    let sum = 0;

    for(let key1 of Object.keys(network))
    {
        let connections = network[key1];
        for(let key2 of Object.keys(connections))
        {
            sum += connections[key2];
        }
    }

    sum /= 2;

    return sum;
}

function isValid()
{
    let visited = [];
    let count = 0;

    function navigate(pt)
    {
        if (visited[pt] === 1)
            return;
        visited[pt] = 1;
        count++;
        if (count > max)
            return;

        let k = key(pt);
        let connections = network[k];
        for(let p2 = 0; p2 <= max; p2++)
        {
            if (p2 === pt)
                continue;
            let k2 = key(p2);
            if (connections[k2] !== undefined)
                navigate(p2);
            if (count > max)
                return;
        }
    }

    navigate(0); // from 0 should be able to reach all other points

    return count > max;
}

function optimize()
{
    function isExcluded(k1, k2)
    {
        if (k1 === k2)
            return true;

        let ka = k1 + '-' + k2;
        let kb = k2 + '-' + k1;

        return excluded[ka] === 1 || excluded[kb] === 1;
    }

    function exclude(k1, k2)
    {
        let ka = k1 + '-' + k2;
        let kb = k2 + '-' + k1;

        excluded[ka] = excluded[kb] = 1;
    }

    let max = -1;
    let maxKey1, maxKey2;

    let keys = Object.keys(network);

    for(let source of keys)
    for(let target of keys)
    {
        if (isExcluded(source, target))
            continue;

        let value = network[source][target];
        if (value === undefined)
            continue;

        if (value >= max)
        {
            max = value;
            maxKey1 = source;
            maxKey2 = target;
        }
    }

    if (max < 0)
        return false;

    assert.equal(network[maxKey1][maxKey2], max);
    assert.equal(network[maxKey2][maxKey1], max);

    delete network[maxKey1][maxKey2]; 
    delete network[maxKey2][maxKey1];

    if (! isValid())
    {
        // put it back
        network[maxKey1][maxKey2] = max; 
        network[maxKey2][maxKey1] = max;
    
        exclude(maxKey1, maxKey2);
    }

    return true;
}

let max  = 0;
let line = 0;

readInput
.on('line', (input) => { 

    var connections = input.split(',');
    var target = 0;
    var net = {};

    network[key(line)] = net;

    for(connection of connections)
    {
        if (connection !== '-')
            net[key(target)] = +connection;

        target++;
    }
    max = line;
    line++;
})

.on('close', () => {
    assert.ok(isValid());

    let before = getWeight();

    while (optimize(network));

    let after = getWeight();

    assert.ok(isValid());
    console.log('Saved ' + (before - after)); // 259679

    process.exit(0);
});
