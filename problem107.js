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

const assert = require('assert');
const fs = require('fs');
const readline = require('readline');

const readInput = readline.createInterface({
    input: fs.createReadStream('data/p107_network.txt')
});

const network = {
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

function optimize()
{
    for(let pt = max; pt > 0; pt--)
    {
        let min = Number.MAX_SAFE_INTEGER;
        let minK = 0;

        let k1 = key(pt);

        let connections = network[k1];
        for(let target = 0; target < pt; target++)
        {
            let k2 = key(target);
            let v = connections[k2];
            if (v != undefined && v < min)
            {
                min = v;
                minK = k2;
            }
        }
        for(let target = 0; target < pt; target++)
        {
            let k3 = key(target);
            if (k3 != minK && connections[k3] !== undefined)
            {
                delete connections[k3];
                delete network[k3][k1];
            }
        }
    }
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
    console.log("Data Loaded");
    let before = getWeight();
    optimize(network);
    let after = getWeight();

    console.log('Saved ' + (before - after));

    process.exit(0);
});
