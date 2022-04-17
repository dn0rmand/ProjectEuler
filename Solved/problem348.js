const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

const MAX_LENGTH = 9;
const MAX = 10**MAX_LENGTH;

const squares = timeLogger.wrap('Loading squares', _ => {
    const squares = new Set();
    for(let i = 2; ; i++) {
        const i2 = i*i;
        if (i2 >= MAX) {
            break;
        }
        squares.add(i2);
    }
    return squares;
});

const cubes = timeLogger.wrap('Loading cubes', _ => {
    const cubes = new Set();
    for(let i = 2; ; i++) {
        const i3 = i*i*i;
        if (i3 >= MAX) {
            break;
        }
        cubes.add(i3);
    }
    return cubes;
});

const palindromes = timeLogger.wrap('Generate palindromes', _ => {
    let palindromes = [];

    for(let size = 1; size <= MAX_LENGTH; size++) {
        palindromes[size] = [];
    }

    for(let i = 0; i < 10; i++) {
        palindromes[1].push(`${i}`);
    }
    for(let i = 0; i < 10; i++) {
        palindromes[2].push(`${i}${i}`);
    }

    for(let size = 3; size <= MAX_LENGTH; size++) {
        const inner = palindromes[size-2];
        for(const p of inner)
        {
            for(let i = 0; i < 10; i++) {
                palindromes[size].push(`${i}${p}${i}`);
            }
        }
    }

    palindromes = palindromes.flat();

    const result = new Set();

    palindromes.forEach(p => {
        if (p[0] !== '0') {
            result.add(+p);
        }
    });

    return [...result.keys()].sort((a, b) => a-b);
});

function solve()
{
    let total = 0;
    let found = 0;

    for(const palindrome of palindromes) {
        let count = 0;
        for(const cube of cubes) {            
            const remain = palindrome - cube;
            if (remain <= 1) 
                break;
            if (squares.has(remain)) {
                count++;
                if (count > 4) {
                    break;
                }
            }
        }
        if (count === 4) {
            found++;
            total += palindrome;
            if (found === 5) {
                return total;
            }
        }
    }

    return "That didn't work";
}

const answer = timeLogger.wrap('Solving', _ => solve());

console.log(`Answer if ${answer}`);