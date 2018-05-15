import math
import decimal

def isTriangular(num):
    d = decimal.Decimal((num*8)+1).sqrt()
    if math.floor(d) != d: 
        return False
    return (d % 2) == 1

def M(x):
    return x * (x+2)

def solve1(count):
    current = 0
    sum     = 0

    print(count)
    while True:
        current += 1
        v = M(current)
        if isTriangular(v):
            sum += current
            count -= 1
            print("{0} - {1} - {2}".format(count, current, v))
            if count == 0:
                return sum

def next1(values):
    x = values[0]
    y = values[1]
    x1 = (3*x) + (4*y) + 5
    y1 = (2*x) + (3*y) + 3
    return (x1, y1)

def next2(values):
    x = values[0]
    y = values[1]
    x1 = (3*x) - (4*y) - 3
    y1 = (-2*x) + (3*y) + 1
    return (x1, y1)

def solve(count):
    v11 = (-1,0)
    v12 = (0,-2)
    v13 = (0,0)
    v14 = (-1,-2)

    v21 = (-1,0)
    v22 = (0,-2)
    v23 = (0,0)
    v24 = (-1,-2)

    result = 0
    last   = 0

    while count > 0:
        v11 = next1(v11)
        v12 = next1(v12)
        v13 = next1(v13)
        v14 = next1(v14)

        v21 = next1(v21)
        v22 = next1(v22)
        v23 = next1(v23)
        v24 = next1(v24)

        values = [ v11[1], v12[1], v13[1], v14[1], v21[1], v22[1], v23[1], v24[1]]
        values.sort()
        values.reverse()

        while count > 0 and len(values) > 0:
            v = values.pop()
            if v > last:
                last = v
                result += v
                count -= 1
                print(count)

    return result

result = solve(40)
print("The answer is {}".format(result))