# A Python program to print all 
# combinations of given length
from itertools import combinations

def mods(l, n):
    vv = []

    for v in l:
        vv.append(v % n)

    vv.sort()

    last = -1
    s = []
    c = 0
    for x in vv:
        if x == last:
            c = c + 1
        else:
            if c > 0:
                s.append(c)
            last = x
            c = 1

    if c > 0:
        s.append(c)

    s.sort()
    return "".join(str(x) for x in s)

def A(n, q):
    r = range(1, (n*q)+1)
    comb = combinations(r, n)

    # Print the obtained combinations
    total = 0
    d = dict()

    for i in list(comb):
        if (sum(i) % n) == 0:
            total = total+1
            m = mods(i, n)
            if m in d:
                d[m] += 1
            else:
                d[m] = 1

    k = list(d.keys())
    k.sort()

    for v in k:
        print(v,"=>",d[v])

    return total

def PRT(n, q):
    print("A(", n, ",", q , ")")
    total = A(n, q)
    print("A(", n, ",", q , ") = ", total)
    return total

PRT(5,2)
PRT(7,2)
PRT(11,2)

PRT(5,3)
PRT(7,3)
PRT(11,3)
