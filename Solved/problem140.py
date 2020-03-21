
import math 

def loadGS():
    g1 = 1
    g2 = 4
    yield g1
    yield g2
    for l in range(0, 1000):
        g = g1+g2
        yield g
        g1 = g2
        g2 = g

GS = [g for g in loadGS()]

def calculate(a, b):
    total = 0
    x = a / b
    X = x
    for g in GS:
        total += g*X
        X *= x
        if total > 211345370:
            return 211345371
    
    return total

def generate():
    max    = 200000
    min    = 1E-10
    values = {}
    count  = 4
    values[2] = 1
    values[5] = 1
    values[21]= 1
    values[42]= 1

    yield 2
    yield 5
    yield 21
    yield 42

    a = 92406
    while count < 7:
        a += 1
        if count > 6:
            return

        print(f"\r{max-a}: {a}", end="")

        start = int(a * 1.6155)
        end   = int(a * 1.6667)
        step  = 1
        if (a % 2) == 0:
            if (start % 2) == 0:
                start += 1
            step = 2

        for b in range(start, end+step, step):

            if math.gcd(a, b) != 1:
                continue

            v = calculate(a, b)
            if v > 211345370:
                continue
            if v < 1:
                break

            n = int(round(v))

            if abs(v - n) <= min and not n in values:
                print(f"\r{a}/{b} => {n} - {v} ")
                count = count+1
                values[n] = n
                yield n


def solve():
    values = sorted([v for v in generate()])
    print(values)

solve()
