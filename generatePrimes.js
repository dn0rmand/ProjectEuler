const sqlite = require('better-sqlite3');
const primes = require('./tools/primes.js');

function generate(db, MAX)
{
    let start = 0;

    let row = db.prepare("SELECT max(prime) p FROM primes").get();
    if (row != null && row.p != null)
        start = row.p;

    let command = db.prepare("INSERT INTO primes (prime) VALUES (?)");

    for (let p of primes(start))
    {
        command.run(p);
        if (p > MAX) // set stop to 1 with the debugger to break.
            break;
    }

    db.close();
}

function loadFromFile(db)
{
    db.exec("DELETE from primes"); // delete all rows of table primes
    db.exec("BEGIN");

    let command = db.prepare("INSERT INTO primes (prime) VALUES (?)");

    const fs = require('fs');
    const readline = require('readline');

    const readInput = readline.createInterface({
        input: fs.createReadStream('/Users/dnormand/Desktop/primes.txt')
    });

    let count = 0;
    readInput
    .on('line', (input) => { 
        let p = +input;
        command.run(p);
        count++;
    })
    .on('close', () => {
        db.exec("COMMIT");
        db.close();
        console.log(count + " primes created");
        process.exit(0);
    });
}

const TARGET = Math.pow(10, 14);

const db     = new sqlite('data/primes.sqlite3', { fileMustExist: true });

generate(db, TARGET);