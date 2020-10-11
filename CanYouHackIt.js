const RBTree = require('bintrees').RBTree;
const clipboard = require('clipboardy');
const base64 = require('base-64');
const bz2 = require('bz2');
const extract = require('extract-zip');
const fs = require('fs');
const { type } = require('os');

function hexToString(hex)
{
    for(let i = 0; i < flag.length; i += 2)
    {
        const s = String.fromCharCode(flag[i],flag[i+1]);
        result.push(parseInt(s, 16));
    }
}

function stringToBytes(input)
{
    if (typeof(input) !== "string")
        throw "Not a string";

    const output = [];
    for(let i = 0; i < input.length; i++)
    {
        output.push(input.charCodeAt(i));
    }
    return Uint8Array.from(output);    
}

function hexToBytes(hex)
{
    if (typeof(hex) === "string")
        hex = stringToBytes(hex);

    const output = [];
    for(let i = 0; i < hex.length; i += 2)
    {
        const s = String.fromCharCode(hex[i],hex[i+1]);
        output.push(parseInt(s, 16));
    }

    return output;
}


function XOREncoding(input, xorKey)
{
    if (typeof(input) === "string")
        input = stringToBytes(input);
    if (typeof(xorKey) === "string")
        xorKey = stringToBytes(xorKey);

    const output = [];
    const xorLength = xorKey.length;

    for(let i = 0; i < input.length; i++)
    {
        const c = input[i] ^ xorKey[i % xorLength];
        output.push(c);
    }

    return String.fromCharCode(...output);
}

function encodingIsNotCryptography(input)
{
    input = stringToBytes(base64.decode(input));

    const output = bz2.decompress(input);
    const values = String.fromCharCode(...output).split(' ');
    const flag = [];
    for(const value of values)
    {
        flag.push(parseInt(value, 2));
    }

    const result = string.fromCharCode(...hexToBytes(flag));
    console.log(result);
}

async function canYouEvenBase64(input)
{
    const zipFileName = "$tmp.zip";
    const docFolder = "$tmp.dir";

    function cleanUp()
    {
        if (fs.existsSync(zipFileName))
            fs.unlinkSync(zipFileName);
        if (fs.existsSync(docFolder))
            fs.rmdirSync(docFolder, { recursive: true });
    }

    input = stringToBytes(base64.decode(input));

    try 
    {
        cleanUp();
        
        fs.writeFileSync(zipFileName, input);

        fs.mkdirSync(docFolder);
        const path = process.cwd() + '/' + docFolder;
        await extract("$tmp.zip", { dir: path});
        console.log('Extraction complete');

        const xorKey   = fs.readFileSync(`${docFolder}/xor_key.txt`);
        const flag     = fs.readFileSync(`${docFolder}/flag.txt`);
        const flagData = hexToBytes(flag);

        const result = XOREncoding(flagData, xorKey);
        console.log(result);
    } 
    catch (error) 
    {
        console.log(error);
    }
    finally
    {
        cleanUp();
    }
}

function bruteForce(pinLength)
{
    let foundIt = false;

    const log = console.log;

    console.log = (msg) => {
        if (msg.startsWith("Success"))
        {
            foundIt = true;
            console.log = log;
        }
    }

    async function sleep(ms) 
    {
        await new Promise(resolve => setTimeout(resolve, ms));
    }

    async function execute(pin, max)
    {
        while(!foundIt && pin < max)
        {
            let p = pin.toString();
            while (p.length < pinLength)
                p = '0' + p;

            BrutalForce_submit(p);

            await sleep(50);
            pin++;
        }
    }

    execute(0, 10**pinLength);
}

// To be injected and executed on the website
async function codeBreaker()
{
    async function findPosition(l)
    {
        let code = [l];
        while (code.length < 7)
            code.push('0');

        let strCode = code.join('');
        console.log(strCode);

        const refScore = await CodeBreaker_submit(strCode);

        for(let i = 1; i < 7; i++)
        {
            code[i] = l;
            code[i-1] = '0';

            strCode = code.join('');
            console.log(strCode);
            const score = await CodeBreaker_submit(strCode);

            if (score > refScore)
            {
                console.log(`${l} goes to position ${i}`);
                return i;
            }
        }
        
        return 0;
    }

    async function checkLetter(l)
    {
        let code = '';
        while (code.length < 7)
            code += l;
        console.log(code);
        const score = await CodeBreaker_submit(code);
        console.log(score);

        return Math.round(score / 14.285714285714285);
    }

    const scores = {};

    for(let l = 0; l < 10; l++)
    {
        const score = await checkLetter(l);
        if (score > 0)
            scores[l] = score;
    }

    const A = 'A'.charCodeAt(0);
    const Z = 'Z'.charCodeAt(0);

    for(let l = A; l <= Z; l++)
    {
        let c = String.fromCharCode(l);
        let score = await checkLetter(c);
        if (score > 0)
            scores[c] = score;
        else
            bad = c;

        c = c.toLowerCase();
        score = await checkLetter(c);
        if (score > 0)
            scores[c] = score;
        else
            bad = c;
    }

    const letters = Object.keys(scores);

    letters.sort((a, b) => scores[a] - scores[b]);

    console.log(letters.join(', '));

    const code = [];

    for(let l of letters)
    {
        const i = await findPosition(l);
        if (code[i] === undefined)
            code[i] = l;
    }

    console.log(code.join('-'));
}

function Tiles()
{
    // Inject and execute on the web site to generate the tile array to input in Tiles_Solve
    function Tiles_Dump(tiles)
    {
        tiles = tiles || Tiles_getGameBoard();

        let output = "\tconst startTiles = [\n";
        for(const row of tiles)
        {
            output += "\t\t[" + row.join(',') + "],\n"
            output = output.replace(',X', ',"X"');
        }
        output += "\t];\n";
        console.log(output);
    }

    function Tiles_Solve()
    {
        const SIZE = 5;

        // Replace with generated code from Tiles_Dump()
        const startTiles = [
            [6,10,14,5,8],
            [2,1,18,4,13],
            [11,17,16,3,15],
            [22,23,7,"X",24],
            [21,19,9,12,20],
        ];
        //

        const winningTiles = [
            [1, 2, 3, 4, 5],
            [6, 7, 8, 9, 10],
            [11, 12, 13, 14, 15],
            [16, 17, 18, 19, 20],
            [21, 22, 23, 24, 'X'],
        ];

        function makeKey(tiles)
        {
            const MAX = 20100000n;
            const key = tiles.reduce((a, r) => 
            {
                const v = r.reduce((a, v) => a*30 + (v === 'X' ? 0 : v), 0);
                return a * MAX +  BigInt(v);
            }, 0n);
            return key;
        }

        function findEmptyPosition(tiles)
        {
            for(let y = 0; y < tiles.length; y++)
            for(let x = 0; x < tiles[y].length; x++)
                if (tiles[y][x] === 'X')
                    return {x, y};

            throw "Not found";
        }

        function clone(tiles, x1, y1, x2, y2)
        {
            if (x2 < 0 || x2 >= SIZE || y2 < 0 || y2 >= SIZE)
                return undefined;
                
            const newTiles = tiles.map((row, y) => {
                if (y !== y1 && y !== y2)
                    return row;
                else
                    return row.map(v => v)
            });

            newTiles[y1][x1] = newTiles[y2][x2];
            newTiles[y2][x2] = 'X';
            return newTiles;
        }

        function $getScore(value, x, y)
        {
            const v = (value === 'X') ? (SIZE*SIZE)-1 : value-1;
            const x0 = v % SIZE;
            const y0 = (v-x0) / SIZE;

            return Math.abs(x-x0) + Math.abs(y-y0);
        }

        function getScore(tiles)
        {        
            if (! tiles)
                return Number.MAX_SAFE_INTEGER;

            const s = tiles.reduce((a, row, y) => a + row.reduce((b, v, x) => b + $getScore(v, x, y), 0), 0);
            return s;
        }

        const winningKey = makeKey(winningTiles);

        let visited = new Set();

        function isVisited(tiles)
        {
            const key = makeKey(tiles);

            if (visited.has(key))
            {
                return true;
            }
            else
            {
                visited.add(key);
                return false;
            }
        }

        const visitedSize = () => visited.size

        const states = new RBTree(function(a, b) { return a.score - b.score; });

        states.insert({
            tiles: startTiles, 
            score: getScore(startTiles),
            moves: undefined, 
            ...findEmptyPosition(startTiles)
        });

        let solved = undefined;
        let best   = Number.MAX_SAFE_INTEGER;
        let traceCount = 0;

        visited1.add(startTiles);

        while(states.size > 0)
        {
            const top = states.min();
            states.remove(top);

            const { 
                tiles, 
                score, 
                x, 
                y,
                moves,  
            } = top;
            
            if (traceCount === 0 || score < best)
            {
                best = Math.min(best, score);
                // process.stdout.write(`\rScore: ${score} - Best: ${best} - States: ${states.length} - Visited: ${visitedSize()}        `);
                console.log(`Score: ${score} - Best: ${best} - States: ${states.size} - Visited: ${visitedSize()}`);
            }

            traceCount = (traceCount+1) % 10000;

            if (score === 0)
            {
                const k = makeKey(tiles);
                if (k !== winningKey)
                    throw "ERROR";

                Tiles_Dump(tiles);
                solved = moves;
                break;
            }

            const movesCount = moves ? moves.count : 0;

            const tilesL = clone(tiles, x, y, x-1, y);
            const scoreL = getScore(tilesL);
            if (scoreL <= score+2 && ! isVisited(tilesL))
            {
                states.insert({
                    tiles: tilesL, 
                    score: scoreL, 
                    x: x-1, 
                    y: y, 
                    moves: { 
                        move:'L', 
                        count: movesCount+1,
                        next: moves 
                    }
                });
            }

            const tilesR = clone(tiles, x, y, x+1, y);
            const scoreR = getScore(tilesR);
            if (scoreR <= score+2 && ! isVisited(tilesR))
            {
                states.insert({
                    tiles: tilesR, 
                    score: scoreR, 
                    x: x+1, 
                    y: y, 
                    moves: { 
                        move:'R', 
                        count: movesCount+1,
                        next: moves 
                    }
                });
            }

            const tilesU = clone(tiles, x, y, x, y-1);
            const scoreU = getScore(tilesU);
            if (scoreU <= score+2 && ! isVisited(tilesU))
            {
                states.insert({
                    tiles: tilesU, 
                    score: scoreU, 
                    x: x, 
                    y: y-1, 
                    moves: { 
                        move:'U', 
                        count: movesCount+1,
                        next: moves 
                    }
                });
            }

            const tilesD = clone(tiles, x, y, x, y+1);
            const scoreD = getScore(tilesD);
            if (scoreD <= score+2 && ! isVisited(tilesD))
            {
                states.insert({
                    tiles: tilesD, 
                    score: scoreD, 
                    x: x, 
                    y: y+1, 
                    moves: {
                        move:'D', 
                        count: movesCount+1,
                        next: moves 
                    }
                });
            }
        }

        console.log('');
        if (solved)
        {
            const moves = [];
            while(solved)
            {
                moves.unshift(solved.move);
                solved = solved.next;
            }
            const result = moves.join(',');
            clipboard.writeSync(result);
            console.log(`\n\n${result}\n\n`)
        }
        else
        {
            console.log('Sorry can not solve it');
        }
    }
}

function XOR(bruteForceIt)
{
    const keylengh = 6;

    function decodeInput(encodedData)
    {
        const input = [];

        for(let i = 0; i < encodedData.length-1; i+=2)
        {
            const s = encodedData[i]+ '' + encodedData[i+1];
            const v = parseInt(s, 16);
    
            input.push(v);
        }
        return input;
    }

    function bruteForce(input)
    {
        const validChars = " .abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        function *getKey(xorKey)
        {
            let index = xorKey.length;        
            if (index === keylengh)
            {
                yield xorKey;
                return;
            }
    
            for(const i of validChars)
            {
                const key = input[index] ^ i.charCodeAt(0);
                let good = true;
                for(let j = index; j < input.length; j += keylengh)
                {
                    const k = input[j] ^ key;
                    const c = String.fromCharCode(k);
                    if (!validChars.includes(c))
                    {
                        good = false;
                        break;
                    }
                }
                if (good)
                {
                    yield *getKey([...xorKey, key]);
                }
            }
        }
    
        for(const xorKey of getKey([]))
        {
            const str = XOREncoding(input, xorKey);
            console.log(str,' - ', String.fromCharCode(...xorKey));
        }         
    }

    function fromExpected(input, exectedOutput)
    {
        if (input.length !== exectedOutput.length)
            throw "ERROR";
    
        const xorKey = [];
        for(let i = 0; i < keylengh; i++)
        {
            const k = exectedOutput.charCodeAt(i) ^ input[i];
            xorKey[i] = k;        
        }
    
        // verify
    
        for(let i = 0; i < input.length; i++)
        {
            const c = String.fromCharCode(input[i] ^ xorKey[i % 6]);
            if (c !== exectedOutput[i])
                throw "Invalid key";
        }
    
        console.log("Key is", String.fromCodePoint(...xorKey));
    }

    const exectedOutput = "We have to stop optimizing for programmers and start optimizing for users.";
    const encodedData = "040f12112333364a46166236270542592d3527035f10382c3d0d121f2d37731a4016253732075f1c3036730b5c1d6236270b400d622a231e5b142b3f3a045559242a214a470a27372044";
    const input = decodeInput(encodedData);

    if (bruteForceIt)
    {
        bruteForce(input)
    }
    else
    {
        fromExpected(input, exectedOutput);
    }
}

// XOR(true);
// XOR(false);

//encodingIsNotCryptography("QlpoOTFBWSZTWaLVtdoAANzYAEAAQABgADAAtgM00Ep+pQJPVI3XicUQEVCEyTLNGNpo2Sxo0TTZprEYrBmS0JFpbEUbU3N0lFGDBFNmqmbbJQMW1611NauVmyvi7kinChIUWra7QA==");

/*
canYouEvenBase64(
    "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");
*/

/*

#define MAX_LEN 50

struct MESSAGE {
    unsigned short type;
    unsigned short message_len;
    char message[MAX_LEN];
}

*/

function lonelyBot(message)
{
    if (message.length > 50)
        throw "Message too long";

    const array = new Uint8Array(4+message.length);

    array[0] = 4;
    array[2] = message.length;
    for(let i = 0; i < message.length; i++)
    {
        array[4+i] = message.charCodeAt(i);
    }

    const msg = base64.encode(String.fromCharCode(...array));

    console.log(msg);
}

lonelyBot("What is the flag?");