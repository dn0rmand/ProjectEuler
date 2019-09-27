const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const RBTree = require('bintrees').BinTree;
const announce = require('tools/announce');

require('tools/numberHelper');

const MAX      = 10n**18n;
const MODULO   = 1E9;
const MODULO_N = BigInt(MODULO);

class Section
{
    static compare(n1, n2)
    {
        let cmp = n1.start - n2.start;
        if (cmp > 0)
            return 1;
        else if (cmp < 0)
            return -1;
        else
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
        let N = (this.end - this.start) % MODULO_N;
        let I = this.start % MODULO_N;
        let X = this.min % MODULO_N;

        let C1 = N+1n;
        let k  = (N*C1) % MODULO_N;
        let C2 = k / 2n;
        let C3 = ((k*(N+N+1n))/6n) % MODULO_N;

        let IX = (I * X) % MODULO_N;

        let total;

        if (this.min < this.max)
            total = (C1 * IX) % MODULO_N + (C2 * (X+I)) % MODULO_N + C3;
        else
            total = (C1 * IX) % MODULO_N + (C2 * (X-I)) % MODULO_N - C3;

        total = total % MODULO_N;
        return Number(total);
    }
}

class SpecialArray
{
    constructor(length)
    {
        length = BigInt(length);
        this.length  = length;
        this.section = new Section(0n, length-1n, length);
        this.count   = 1;

        this.tree = new RBTree(Section.compare);
        this.tree.insert(this.section);
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

    insert(nodes, start, end)
    {
        if (end < start)
            return;

        if (start === end)
        {
            this.tree.insert(nodes[start]);
            return;
        }
        let middle = Math.ceil((end+start) / 2);

        this.tree.insert(nodes[middle]);
        this.insert(nodes, start, middle-1);
        this.insert(nodes, middle+1, end);
    }

    rebalance()
    {
        let nodes = [];
        let current = this.section;
        while (current)
        {
            nodes.push(current);
            current.joinNext();
            current = current.next;
        }
        let diff = this.count - nodes.length;
        if (diff > 1)
            console.log(`${diff} nodes reclaimed`);
        this.count = nodes.length;
        this.tree.clear();
        this.insert(nodes, 0, nodes.length-1);

        assert.equal(this.count, this.tree.size);
    }

    search(start)
    {
        let res  = this.tree._root;
        let data = {start: start};

        while(res !== null)
        {
            if (res.data.start <= start && res.data.end >= start)
                return res.data;

            var c = this.tree._comparator(data, res.data);
            if(c === 0) {
                return res.data;
            }
            else {
                res = res.get_child(c > 0);
            }
        }

        return null;
    }

    executeStep(i)
    {
        let start = this.getFibonacci();
        let end   = this.getFibonacci();

        if (start === end)
            return; // no-op

        if (start > end)
            [start, end] = [end, start];

        let firstSection = this.search(start);

        // Fix possible tree error
        while (start < firstSection.start)
        {
            firstSection = firstSection.prev;
            if (firstSection === null)
                throw "ERROR";
        }

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
            this.tree.insert(firstSection);
            this.count++;
        }

        let lastSection = this.search(end);

        while (end > lastSection.end)
        {
            lastSection = lastSection.next;
            if (lastSection === null)
                throw "ERROR";
        }

        while (end < lastSection.start)
        {
            lastSection = lastSection.prev;
            if (lastSection === null)
                throw "ERROR";
        }

        if (end < lastSection.end)
        {
            lastSection.split(end+1n);
            this.tree.insert(lastSection.next);
            this.count++;
        }

        if (lastSection === firstSection) // easy one :)
        {
            let x = firstSection.min;
            firstSection.min = firstSection.max;
            firstSection.max = x;
            return;
        }

        let s_idx = firstSection.start;
        let e_idx = lastSection.end;
        let s = firstSection, e = lastSection;

        for (; s_idx <= e_idx; s = s.next, e = e.prev)
        {
            if (e === s)
            {
                let x = s.min;

                s.start = s_idx;
                s.end   = e_idx;
                s.min   = s.max;
                s.max   = x;
                break;
            }
            else
            {
                let is = { len: s.end - s.start, min: s.min, max: s.max };

                s.start = s_idx;
                s.end   = s_idx + (e.end - e.start);
                s.max   = e.min;
                s.min   = e.max;

                e.end   = e_idx;
                e.start = e_idx - is.len;
                e.max   = is.min;
                e.min   = is.max;

                s_idx   = s.end+1n;
                e_idx   = e.start-1n;
            }
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
    let rebalance = 0;

    // step 1 is a no-op
    for (let step = 1; step <= k; step++)
    {
        if (++rebalance > 10000)
        {
            rebalance = 0;
            A.rebalance();
        }

        if (trace)
            process.stdout.write(`\r${step} - ${A.count}`);

        A.executeStep(step);
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
    return R(MAX, 1E6, true);
});
// 1E8, 1E4 => 941879399
// 1E8, 1E5 => 851985380
console.log('Answer is', answer);
announce(680, `Answer is ${answer}`);
