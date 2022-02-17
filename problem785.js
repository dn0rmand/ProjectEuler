const assert = require('assert');

require('tools/numberHelper');

function S(N)
{
    let total = 0;
    let found;

    const pairs = [];
    let prevX = 0, prevY = 0;

    const add = (x, y, z) => {
        found = true;
        total += x+y+z;
        if (pairs.length <= 50) {
            // pairs.push(`{ x:${x-prevX} , y: ${y-prevY} }`);
            pairs.push(x-prevX);
            prevX = x;
            prevY = y;
        }
    };

    for(let x = 1; x <= N; x++) {
        found = false;
        for(let y = x; !found && y <= N; y++) {
            let g1 = x.gcd(y);

            const A = 15;
            const B = -34*(x+y);
            const C = 15*(x*x + y*y) - 34*x*y;

            let delta = B*B - 4*A*C;
            if (delta < 0) {
                continue;
            }
            delta = Math.sqrt(delta);
            if (Math.floor(delta) !== delta) {
                continue;
            }

            let z = (delta - B) / (2*A);

            if (z >= y && z <= N && z === Math.floor(z) && g1.gcd(z) === 1) {
                add(x, y, z);
            } else {
                z = (-delta - B) / 2*A;

                if (z >= y && z <= N && z === Math.floor(z) && g1.gcd(z) === 1) {
                    add(x, y, z);
                }
            }
        }
    }

    console.log(pairs.join(', '));
    
    return total;
}

console.log(S(5000));
console.log(S(1000));

assert.strictEqual(S(100), 184);
console.log('Test passed');
