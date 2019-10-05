const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const announce = require('tools/announce');
const fs = require('fs');
const zlib = require('zlib');

const MAX      = 10n**18n;
const MODULO   = 1E9;
const MODULO_N = BigInt(MODULO);

const FILENAME = 'problem680.state';
const TMPFILE  = 'problem680.tmp';

class BinaryTree
{
    constructor(compare)
    {
        if (typeof(compare) != "function")
            throw "Compare expected";

        this.compare = compare;
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

    calculateSize(root)
    {
        if (! root)
            return 0;
        root.size = this.calculateSize(root.left) + this.calculateSize(root.right) + 1;

        return root.size;
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

    constructor(tree, start, end)
    {
        this.tree  = tree;
        this.start = start;
        this.end   = end;
        this.min   = start;
        this.max   = end;
        this.next  = null;
        this.prev  = null;
        this.size  = 1;
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
        let s2 = new Section(this.tree, index, this.end);

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

        // put in tree

        s2.parent = this;
        s2.right  = this.right
        this.right = s2;
        if (s2.right)
            s2.right.parent = s2;
    }

    joinNext()
    {
        let count = 0;
        while (this.next)
        {
            let ok = false;
            if (this.direction === 0n && this.next.direction === 0n)
            {
                if (this.max+1n === this.next.min)
                    ok = true;
                else if (this.max-1n === this.next.min)
                    ok = true;
            }
            else if (this.direction === 0n && this.max === (this.next.min-this.next.direction))
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
        this.tree = new BinaryTree(Section.compare);

        length = BigInt(length);

        this.length    = length;
        this.section   = new Section(this.tree, 0n, length-1n, 1n);
        this.count     = 1;
        this.tree.root = this.section;
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
            return undefined;

        if (start === end)
            return nodes[start];

        let middle = Math.ceil((end+start) / 2);
        let r = nodes[middle];

        r.left = this.insert(nodes, start, middle-1);
        r.right= this.insert(nodes, middle+1, end);

        if (r.left)
            r.left.parent = r;
        if (r.right)
            r.right.parent = r;

        r.size = 1 + (r.left ? r.left.size : 0) + (r.right ? r.right.size : 0);
        return r;
    }

    import(nodes)
    {
        if (!nodes || nodes.length === 0)
            throw "Nodes collection cannot be empty";

        this.section = nodes[0];
        this.count = nodes.length;
        this.tree.clear();
        this.tree.root = this.insert(nodes, 0, nodes.length-1);
        if (this.count != this.tree.size)
            this.tree.calculateSize(this.tree.root);
        assert.equal(this.count, this.tree.size);
    }

    export(stepNumber, nodes)
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

        let deflated = zlib.deflateSync(obj);

        fs.writeFileSync(TMPFILE, deflated);
        if (fs.existsSync(FILENAME))
            fs.unlinkSync(FILENAME);
        fs.renameSync(TMPFILE, FILENAME);
    }

    reload()
    {
        if (! fs.existsSync(FILENAME))
            return 1;

        let data = fs.readFileSync(FILENAME);
        let mark = '{"step"';
        let unzipped = false;
        for (let i = 0; i < mark.length; i++)
        {
            let c = mark.charCodeAt(i);
            if (data[i] != c)
            {
                if (unzipped)
                    throw "Invalid file";
                unzipped = true;
                data = zlib.inflateSync(data);
                i = -1;
                continue;
            }
        }

        data = JSON.parse(data);
        let nodes = [];
        let previous = undefined;

        for(let n of data.nodes)
        {
            let section = new Section(this.tree, BigInt(n.start), BigInt(n.end));

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

            total += current.joinNext();
            current = current.next;
        }
        if (total > 1)
            console.log(`${total} nodes reclaimed`);

        if (doSave)
            this.export(stepNumber, nodes);

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
            this.count++;
        }

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
        let islen, ismin, ismax;

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
                islen = s.end - s.start;
                ismin = s.min;
                ismax = s.max;

                s.start = s_idx;
                s.end   = s_idx + (e.end - e.start);
                s.max   = e.min;
                s.min   = e.max;

                e.end   = e_idx;
                e.start = e_idx - islen;
                e.max   = ismin;
                e.min   = ismax;

                s_idx   = s.end+1n;
                e_idx   = e.start-1n;
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
}

function R(n, k, trace)
{
    let A = new SpecialArray(n);
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
announce(680, `Answer is ${answer}`);
