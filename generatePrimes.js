const sqlite = require('better-sqlite3');
const primes = require('./tools/primes.js');

function getMaxPrime(db)
{
    let row = db.prepare("SELECT max(prime) p FROM primes").get();
    if (row != null && row.p != null)
        return row.p;    
    else
        return 0;
}

function generate(db, MAX)
{
    let start = getMaxPrime(db);
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
    // db.exec("DELETE from primes"); // delete all rows of table primes

    // let start = getMaxPrime(db);
    let command = db.prepare("INSERT INTO primes (prime) VALUES (?)");

    function readFile(index)
    {
        const fs = require('fs');
        const readline = require('readline');
    
        const fileName = "/Users/dnormand/Downloads/Primes/2T_part" + index + ".txt";
        const readInput = readline.createInterface({
            input: fs.createReadStream(fileName)
        });
    
        db.exec("BEGIN");
        
        readInput
        .on('line', (input) => { 
            let values = input.split('\t');
            for (let value of values)
            {
                let s = value.trim();
                if (s === "")
                    continue;

                let p = +s;
                command.run(p);
            }
        })
        .on('close', () => {
            db.exec("COMMIT");
            console.log('File '+index+' Done');
            if (index < 200)
            {
                readFile(index+1);
            }
            else
            {
                db.close();
                process.exit(0);
            }
        });
    }

    readFile(104);
}

const TARGET = Math.pow(10, 14);

const db = new sqlite('data/primes.sqlite3', { fileMustExist: true });

loadFromFile(db);

// generate(db, TARGET);