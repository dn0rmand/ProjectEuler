
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
    max    = 100000
    min    = 1E-8
    values = {}
    count  = 0

    for a in range(1,max):
        print(f"\r{max-a}: {a}", end="")

        start = int(a * 1.6)
        end   = int(a * 2)
        step  = 1
        if (a % 2) == 0:
            if (start % 2) == 0:
                start += 1
            step = 2

        for b in range(start, end+step, step):
            # if b < start:
            #     continue
            # if b > end:
            #     break

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
                if count >= 5:
                    return


def solve():
    values = sorted([v for v in generate()])
    print(values)

solve()
