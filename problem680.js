const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const BTree = require('btreejs');

require('tools/numberHelper');

const MODULO   = 1E9;
const MODULO_N = BigInt(MODULO);

// const MODINV_2 = Number(2).modInv(MODULO);
// const MODINV_6 = Number(6).modInv(MODULO);

function modProd(a, b)
{
    let x = a*b;
    if (x > Number.MAX_SAFE_INTEGER)
    {
        x = Number((BigInt(a)*BigInt(b)) % MODULO_N);
    }
    return x;
}

class Section
{
    static compare(s1, s2)
    {
        if (s1.start < s2.start)
            return -1;
        if (s1.start > s2.start)
            return 1;
        return 0;
    }

    constructor(start, end)
    {
        this.start = start;
        this.end   = end;
        this.min   = start;
        this.max   = end;
        this.next  = null;
        this.prev  = null;
    }

    split(index)
    {
        let s2 = new Section(index, this.end);

        s2.next = this.next;
        s2.prev = this;
        if (s2.next)
            s2.next.prev = s2;
        this.next = s2;

        s2.max = this.max;
        this.end = index-1n;

        let offset = index - this.start - 1n;

        if (this.min < this.max)
        {
            this.max = this.min + offset;
            s2.min = this.max+1n;
        }
        else
        {
            this.max = this.min - offset;
            s2.min = this.max-1n;
        }
    }

    joinNext()
    {
        let count = 0n;
        while (this.next)
        {
            let offset1 = this.min > this.max ? -1n : 1n;
            let offset2 = this.next.min > this.next.max ? -1n : 1n;

            if (offset1 != offset2)
                break;

            if (this.max+offset1 === this.next.min)
            {
                this.max = this.next.max;
                this.end = this.next.end;
                this.next = this.next.next;
                if (this.next)
                    this.next.prev = this;
                count++;
            }
            else
                break;
        }
        return count;
    }

    joinPrev()
    {
        let count = 0n;
        while (this.prev)
        {
            let offset1 = this.min > this.max ? -1n : 1n;
            let offset2 = this.prev.min > this.prev.max ? -1n : 1n;

            if (offset1 != offset2)
                break;

            if (this.prev.max + offset1 === this.min)
            {
                this.min = this.prev.min;
                this.start = this.prev.start;
                this.prev     = this.prev.prev;
                if (this.prev)
                    this.prev.next = this;

                count++;
            }
            else
                break;
        }
        return count;
    }

    sum()
    {
        let N = Number((this.end - this.start) % MODULO_N);
        let I = Number(this.start % MODULO_N);
        let X = Number(this.min % MODULO_N);

        let C1 = (N+1) % MODULO;
        let C2 = N.modMul(N+1, MODULO) / 2; // .modMul(MODINV_2, MODULO);
        let C3 = N.modMul(N+1, MODULO).modMul(N+N+1, MODULO) / 6; // .modMul(MODINV_6, MODULO);

        let IX = I.modMul(X, MODULO);

        let total;

        if (this.min < this.max)
            total = C1.modMul(IX, MODULO) + C2.modMul(X+I, MODULO) + C3;
        else
            total = C1.modMul(IX, MODULO) + C2.modMul(X-I, MODULO) - C3;

        total = total % MODULO;
        return total;
    }
}

const Tree = BTree.create(2, Section.compare);

class SpecialArray
{
    constructor(length)
    {
        length = BigInt(length);
        this.length  = length;
        this.section = new Section(0n, length-1n, length);
        this.count   = 1n;

        // this.tree = new Tree();
        // this.tree.put(section);
    }

    getFibonacci()
    {
        if (this.$f0 === undefined)
        {
            this.$f0 = 1n;
            return 1n;
        }

        if (this.$f1 === undefined)
        {
            this.$f1 = 1n;
            return 1n;
        }

        let f = (this.$f0 + this.$f1) % this.length;
        this.$f0 = this.$f1;
        this.$f1 = f;

        return f;
    }

    executeStep(i)
    {
        let start = this.getFibonacci();
        let end   = this.getFibonacci();

        if (start === end)
            return; // no-op

        if (start > end)
            [start, end] = [end, start];

        let firstSection = this.section;

        while (start > firstSection.end)
        {
            firstSection = firstSection.next;
            if (firstSection === null)
                throw "ERROR";
        }

        if (start > firstSection.start)
        {
            firstSection.split(start);
            firstSection = firstSection.next;
            // this.tree.put(firstSection);
            this.count++;
        }

        let lastSection = firstSection;

        while (end > lastSection.end)
        {
            lastSection = lastSection.next;
            if (lastSection === null)
                throw "ERROR";
        }

        if (end < lastSection.end)
        {
            lastSection.split(end+1n);
            // this.tree.put(lastSection.next);
            this.count++;
        }

        if (lastSection === firstSection) // easy one :)
        {
            let x = firstSection.min;
            firstSection.min = firstSection.max;
            firstSection.max = x;

            this.count -= firstSection.joinNext();
            this.count -= firstSection.joinPrev();
            return;
        }

        let info = [];
        for (let s = firstSection; s != lastSection.next; s = s.next)
        {
            info.push({
                len: s.end - s.start,
                min: s.max,
                max: s.min
            });
        }
        let idx = firstSection.start;
        for (let s = firstSection; s != lastSection.next; s = s.next)
        {
            let i = info.pop();
            s.start = idx;
            s.end   = idx + i.len;
            s.max   = i.max;
            s.min   = i.min;

            idx     = s.end+1n;
        }

        this.count -= firstSection.joinPrev();
        for (let s = firstSection; s && s.end <= end; s = s.next)
        {
            this.count -= s.joinNext();
        }
    }

    sum()
    {
        let total = 0;
        let s = this.section;
        while (s != null)
        {
            total = (total + s.sum()) % MODULO;
            s = s.next;
        }
        return total;
    }

    print()
    {
        let result = [];

        let s = this.section;
        while (s != null)
        {
            let i = s.min;
            let offset = s.min > s.max ? -1n : 1n;
            for (let j = s.start; j <= s.end; j++)
            {
                result.push(Number(i));
                i += offset;
            }
            s = s.next;
        }

        return result.join(', ');
    }
}

function buildA(n)
{
    return new SpecialArray(n);
}

function R(n, k, trace)
{
    let A = buildA(n);

    // console.log(`0: ${A.print()}`);
    // step 1 is a no-op
    for (let step = 1; step <= k; step++)
    {
        if (trace)
            process.stdout.write(`\r${step} - ${A.count}`);
        A.executeStep(step);
        // console.log(`${step}: ${A.print()}`);
    }

    let total = A.sum();

    if (trace)
        process.stdout.write('\r\n');
    return total;
}

timeLogger.wrap('', () => {
    assert.equal(R(5, 4), 27);
    assert.equal(R(1E2, 1E2), 246597);
    assert.equal(R(1E4, 1E4), 249275481640 % MODULO);
});

console.log('Tests passed');

let answer = timeLogger.wrap('', () => {
    return R(1E6, 1E4, true);
});

console.log('Answer is', answer);
