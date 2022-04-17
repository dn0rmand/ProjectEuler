const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');
const timeLogger  = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer      = require('@dn0rmand/project-euler-tools/src/tracer');

timeLogger.wrap('Loading lots of primes', _ => primeHelper.initialize(12E8, true));

function isPractical(title, n)
{    
    let product = 1;
    let bad     = false;

    primeHelper.factorize(n, (p, f) => {
        if (product === 1) {
            if (p !== 2) {
                bad = true;
                return false;
            }
            previousP = 2;
            previousF = f;
            product   = (2**(f+1) - 1); 
        } else if (p >= 1+product) {
            bad = true;
            return false;
        } else {
            product *= (p**(f+1) - 1) / (p - 1); 
        }
    });

    return !bad;
}

function *getParadiseNumbers()
{
    const allPrimes = primeHelper.allPrimes();
    const tracer    = new Tracer(1, true);

    for(let i = 0; i < allPrimes.length-4; i++)
    {
        const p1 = allPrimes[i];
        const p2 = allPrimes[i+1];
        const p3 = allPrimes[i+2];
        const p4 = allPrimes[i+3];

        if (p2-p1 === 6 && p3-p2 === 6 && p4-p3 === 6) {            
            const n = p1+9;
            tracer.print(_ => n);
            if (isPractical('n-8', n-8) && 
                isPractical('n-4', n-4) && 
                isPractical('n'  , n) && 
                isPractical('n+4', n+4) && 
                isPractical('n+8', n+8)) {
                tracer.clear();
                yield n;
            }
        }
    }
}

function solve()
{
    let count = 0;
    let total = 0;
    const tracer = new Tracer(1, true);

    tracer.print(_ => count);
    for(const n of getParadiseNumbers()) {
        total += n;
        count++;
        tracer.print(_ => `${count} - ${n}`);
        if (count === 4) {
            break;
        }
    }
    tracer.clear();
    if (count !== 4) {
        throw `Nope!!!! found only ${count} numbers`;
    }
    return total;
}

const answer = timeLogger.wrap('Solving', _ => solve());
console.log(`Answer is ${answer}`);