const fs = require('fs');

if (process.argv.length < 3) {
    console.log('missing problem number');
    process.exit(-1);
}

const problemId = +process.argv[2];
const filename = `problem${problemId}.js`;

if (fs.existsSync(filename)) {
    console.log(`File ${filename} already exists`);
    process.exit(-1);
}

if (fs.existsSync(`Solved/${filename}`)) {
    console.log(`Problem ${problemId} already solved`);
    process.exit(-1);
}

if (fs.existsSync(`Abandonned/${filename}`)) {
    console.log(`Problem ${problemId} was abandonned`);
    process.exit(-1);
}

class Writer {
    constructor(filename) {
        this.file = fs.openSync(filename, 'w');
    }

    writeLine(line) {
        fs.writeSync(this.file, line);
        fs.writeSync(this.file, '\n');
    }

    writeLines(lines) {
        for (const line of lines) {
            this.writeLine(line);
        }
    }

    close() {
        fs.close(this.file);
    }
}

const writer = new Writer(filename);

writer.writeLines([
    "const assert = require('assert');",
    "const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');",
    '',
    'const MAX = 1e6;',
    '',
    'function solve(max, trace) {',
    '    const tracer = new Tracer(trace);',
    '    for (let n = 0; n < max; n++) {',
    '        tracer.print(() => max - n);',
    '    }',
    '    tracer.clear();',
    '    return max;',
    '}',
    '',
    'assert.strictEqual(solve(10), 10);',
    '',
    "console.log('Tests passed');",
    '',
    "const answer = TimeLogger.wrap('', () => solve(MAX));",
    'console.log(`Answer is ${answer}`);',
]);

writer.close();

console.log(`${filename} created`);
