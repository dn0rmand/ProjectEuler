const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');

const MAX = 120000;

function generatePairs()
{
    const pairs = [];
    const indexes = [];

    const add = (x, y) => {
        let a = indexes[x];
        if (! a) {
            indexes[x] = a = new Set();
        }
        a.add(y);
    }

    const tracer = new Tracer(100, true);
    for(let x = 1; x < MAX; x++) {
        tracer.print(_ => MAX-x);
        const x2 = x*x;
        for(let y = x+1; x+y < MAX; y++) {
            const v = Math.sqrt(x2 + y*y + x*y);
            if (Math.floor(v) === v) {
                add(x, y);
                add(y, x);
                pairs.push({ x, y });
            }
        }
    }
    tracer.clear();
    return { pairs, indexes };
}

function solve()
{
    const { pairs, indexes } = timeLogger.wrap('Generating pairs', _ => generatePairs());    
    const found = []
    let total = 0;

    for(let i = 0; i < pairs.length; i++) {
        const { x, y } = pairs[i];      

        const zs = [...indexes[x].values()].filter(z => indexes[y].has(z));

        for(const z of zs) {
            if (z !== x && z !== y && x+y+z <= MAX) {
                const k = x+y+z;
                if (! found[k]) {
                    found[k] = 1;
                    total += k;
                }
            }
        }
    }

    return total;
}

const answer = timeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer}`);
