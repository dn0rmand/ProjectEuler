const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const announce = require('tools/announce');
const fs = require('fs');

require('tools/numberHelper');

const MAX      = 10n**18n;
const MODULO   = 1E9;
const MODULO_N = BigInt(MODULO);

const FILENAME = 'problem680.state';
const TMPFILE  = 'problem680.tmp';

class BinaryTree
{
    constructor(root, compare)
    {
        if (! root)
            throw "Root node expected";
        if (typeof(compare) != "function")
            throw "Compare expected";

        this.compare = compare;

        root.parent = undefined;
        root.left   = undefined;
        root.right  = undefined;

        this.root = root;
    }

    find(key)
    {
        let current = this.root;
        let cmp     = this.compare(key, current);

        while (current && cmp)
        {
            if (cmp > 0)
                current = current.right;
            else
                current = current.left;

            cmp = this.compare(key, current);
        }

        return current;
    }

    updateSize(current)
    {
        current.size = 1;
        if (current.left)
            current.size += current.left.size;
        if (current.right)
            current.size += current.right.size;

        if (current.parent)
            this.updateSize(current.parent);
    }

    insert(value)
    {
        if (! this.root)
        {
            this.root = value;
            value.parent = undefined;
            this.updateSize(value);
            return;
        }

        let current = this.root;
        let cmp     = this.compare(value, current);

        if (cmp == 0)
            throw "Duplicate!";

        while (true)
        {
            if (cmp > 0)
            {
                if (! current.right)
                {
                    value.parent = current;
                    current.right = value;
                    this.updateSize(value);
                    return;
                }
                current = current.right;
            }
            else
            {
                if (! current.left)
                {
                    value.parent = current;
                    current.left = value;
                    this.updateSize(value);
                    return;
                }
                current = current.left;
            }

            cmp = this.compare(value, current);
            if (cmp == 0)
                throw "Duplicate!";
        }
    }

    rotate(x)
    {
        let p = x.parent;
        let b = null;
        if (x === p.left)
        {
            p.left = b = x.right;
            x.right = p;
        }
        else
        {
            p.right = b = x.left;
            x.left = p;
        }
        x.parent = p.parent;
        p.parent = x;
        if (b)
        {
            b.parent = p;
        }
        if (x.parent)
        {
            if (p === x.parent.left)
            {
                x.parent.left = x;
            }
            else
            {
                x.parent.right = x;
            }
        }
        else
        {
            this.root = x;
        }
        this.updateSize(p);
        this.updateSize(x);
    }

    splay(x)
    {
        while (x.parent)
        {
            let p = x.parent;
            let g = p.parent;
            if (g)
                this.rotate((x === p.left) === (p === g.left) ? p : x);
            this.rotate(x);
        }
    }

    remove(key)
    {
        let node = this.find(key);
        if (! node)
            return false;

        if (! node.parent) // It's the root!!!
        {
            if (node.left && node.right)
            {
                this.root = node.left;
                node.right.parent = undefined;
                this.insert(node.right);
            }
            else if (node.right)
                this.root = node.right;
            else if (node.left)
                this.root = node.left;
            else
                this.root = undefined;

            if (this.root)
                this.root.parent = undefined;

            return true;
        }

        if (! node.left)
        {
            if (node.parent.left === node)
                node.parent.left = node.right;
            else if (node.parent.right === node)
                node.parent.right = node.right;
            else
                throw "Not possible";
        }
        else if (! node.right)
        {
            if (node.parent.left === node)
                node.parent.left = node.left;
            else if (node.parent.right === node)
                node.parent.right = node.left;
            else
                throw "Not possible";
        }
        else
        {
            if (node.parent.left === node)
            {
                node.parent.left = node.left;
                node.left.parent = node.parent;
                this.insert(node.right);
            }
            else if (node.parent.right === node)
            {
                node.parent.right = node.left;
                node.left.parent = node.parent;
                this.insert(node.right);
            }
            else
                throw "Not possible";
        }
    }

    update(data)
    {
        /*
        let self = this;

        function validate(parent, data)
        {
            if (! parent || ! data)
                return;

            let cmp = self.compare(data, parent, true);
            if (cmp < 0)
            {
                if (data != parent.left)
                    console.log('OOOPS');
            }
            else if (cmp > 0)
            {
                if (data != parent.right)
                    console.log('OOOPS');
            }
        }

        validate(data.parent, data);
        validate(data, data.left);
        validate(data, data.right);
        */
    }

    clear()
    {
        this.root = undefined;
    }

    search(key, predicate)
    {
        let res = this.root;

        while(res != null)
        {
            if (predicate(res))
            {
                return res;
            }

            var c = this.compare(key, res);

            let p = res;

            if(c === 0)
                return res;
            else if (c < 0)
                res = res.left;
            else if (c > 0)
                res = res.right;
            else
                return res;

            if (res == null)
                console.log('WHAT!!! ',p,key);
        }

        return null;
    }

    get size()
    {
        if (this.root)
            return this.root.size || 1;
        else
            return 0;
    }
}

class Section
{
    static compare(n1, n2, updating)
    {
        if (n1.end < n2.start)
            return -1;
        if (n2.end < n1.start)
            return 1;
        if (n1.end === n2.end && n1.start === n2.start)
            return 0;

        if (updating === true)
            return 0;

        throw "No way!";
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

    get direction()
    {
        if (this.start < this.end)
            return 1n;
        else if (this.start > this.end)
            return -1n;
        else
            return 0n;
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
            s2.min   = this.max+1n;
        }
        else
        {
            this.max = this.min - offset;
            s2.min   = this.max-1n;
        }
    }

    joinNext()
    {
        let count = 0;
        while (this.next)
        {
            let ok = false;
            if (this.direction === 0n && this.max === (this.next.min-this.next.direction))
                ok = true;
            else if (this.next.direction === 0 && this.next.min === (this.max + this.direction))
                ok = true;
            else if (this.direction === this.next.direction && (this.max+this.direction) === this.next.min)
                ok = true;
            if (! ok)
                break;

            this.max  = this.next.max;
            this.end  = this.next.end;
            this.next = this.next.next;
            if (this.next)
                this.next.prev = this;
            count++;
        }
        return count;
    }

    sum()
    {
        let N = this.end - this.start;
        let I = this.start;

        let X = this.min;

        let C1 = N+1n;
        let k  = N*C1;
        let C2 = k / 2n;
        let C3 = (k*(N+N+1n))/6n;

        let IX = I * X;

        let total;

        if (this.min < this.max)
            total = (C1 * IX) + (C2 * (X+I)) + C3;
        else
            total = (C1 * IX) + (C2 * (X-I)) - C3;

        return Number(total % MODULO_N);
    }
}

class SpecialArray
{
    constructor(length)
    {
        length = BigInt(length);
        this.length  = length;
        this.section = new Section(0n, length-1n, 1n);
        this.count   = 1;

        this.tree = new BinaryTree(this.section, Section.compare);
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

    import(nodes)
    {
        if (!nodes || nodes.length === 0)
            throw "Nodes collection cannot be empty";

        this.section = nodes[0];
        this.count = nodes.length;
        this.tree.clear();
        this.insert(nodes, 0, nodes.length-1);
        assert.equal(this.count, this.tree.size);
    }

    reload()
    {
        if (! fs.existsSync(FILENAME))
            return 1;

        let data = fs.readFileSync(FILENAME);

        data = JSON.parse(data);
        let nodes = [];
        let previous = undefined;

        for(let n of data.nodes)
        {
            let section = new Section(BigInt(n.start), BigInt(n.end));

            section.min = BigInt(n.min);
            section.max = BigInt(n.max);
            section.prev = previous;
            if (previous)
                previous.next = section;

            nodes.push(section);
            previous = section;
        }

        this.import(nodes);
        this.$f0 = BigInt(data.f1);
        this.$f1 = BigInt(data.f2);

        // assert.equal(this.sum(), data.sum);
        return data.step;
    }

    rebalance(stepNumber, doSave)
    {
        let nodes = [];
        let current = this.section;
        let total = 0;
        while (current)
        {
            nodes.push(current);
            current.parent = undefined;
            current.left   = current.right = undefined;

            // total += current.joinNext();
            current = current.next;
        }
        // if (total > 0)
        //     console.log(`${total} nodes reclaimed`);

        if (doSave)
        {
            let obj = {
                step: stepNumber,
                f1: this.$f0.toString(),
                f2: this.$f1.toString(),
                // sum: this.sum(),
                nodes: []
            };
            for(let n of nodes)
            {
                let n2 = {
                    start: n.start.toString(),
                    end: n.end.toString(),
                    min: n.min.toString(),
                    max: n.max.toString()
                };
                obj.nodes.push(n2);
            }
            obj = JSON.stringify(obj);

            fs.writeFileSync(TMPFILE, obj);
            if (fs.existsSync(FILENAME))
                fs.unlinkSync(FILENAME);
            fs.renameSync(TMPFILE, FILENAME);
        }

        this.import(nodes);
    }

    doSearch()
    {
        let start = this.getFibonacci();
        let end   = this.getFibonacci();

        if (start === end)
            return { f: undefined, l: undefined }; // no-op

        if (start > end)
            [start, end] = [end, start];

        let firstSection = this.tree.search({start:start, end:start}, (data) => {
            return (data.start <= start && data.end >= start);
        });

        if (start > firstSection.start)
        {
            firstSection.split(start);
            firstSection = firstSection.next;
            this.tree.insert(firstSection);
            this.count++;
        }

        let lastSection = this.tree.search({start:end, end:end}, (data) => {
            return (data.start <= end && data.end >= end);
        });

        // if (lastSection.start > end)
        //     lastSection = lastSection.prev;
        // if (lastSection.end < end)
        //     lastSection = lastSection.next;

        if (end < lastSection.end)
        {
            lastSection.split(end+1n);
            this.tree.insert(lastSection.next);
            this.count++;
        }

        this.tree.splay(lastSection);

        if (start != firstSection.start)
            throw `ERROR: firstSection.end doesn't match - ${firstSection.start} instead of ${start}`;
        if (end != lastSection.end)
            throw `ERROR: lastSection.end doesn't match - ${lastSection.end} instead of ${end}`;

        return {f: firstSection, l: lastSection};
    }

    reverseSection(firstSection, lastSection)
    {
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

                this.tree.update(s);
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

                this.tree.update(s);
                this.tree.update(e);
            }
        }
    }

    executeStep()
    {
        let searchResult = this.doSearch();
        let { f:firstSection, l:lastSection } = searchResult;
        if (firstSection === undefined)
            return;

        if (lastSection === firstSection) // easy one :)
        {
            let x = firstSection.min;
            firstSection.min = firstSection.max;
            firstSection.max = x;
        }
        else
            this.reverseSection(firstSection, lastSection);
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
    let serialize = 0;

    let firstStep = 1;
    if (trace)
        firstStep = A.reload();

    // step 1 is a no-op
    for (let step = firstStep; step <= k; step++)
    {
        if (++rebalance >= 1000)
        {
            rebalance = 0;
            if (trace)
                process.stdout.write('\rRebalancing ..');
            let save = false;
            if (++serialize >= 10)
            {
                serialize = 0;
                save = trace;
            }
            A.rebalance(step, save); // if tracing then save state because were are actually solving the problem.
        }

        if (trace)
            process.stdout.write(`\r${step} - ${A.count}`);

        A.executeStep();
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
    // assert.equal(R(MAX, 1E4), 775212724);
});

console.log('Tests passed');

let answer = timeLogger.wrap('', () => {
    return R(MAX, 1E6, true);
});
console.log('Answer is', answer);
// announce(680, `Answer is ${answer}`);
// 1e18 , 1e5 => 185318867
