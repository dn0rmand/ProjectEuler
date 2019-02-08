from sys import stdout
import numpy
from numpy.core.numeric import concatenate, isscalar, binary_repr, identity, asanyarray, dot
from numpy.core.numerictypes import issubdtype

# from numpy.linalg import matrix_power as matrixPower

MODULO = int(1000000007)
MAX_M  = int(1E12)
MAX_N  = int(5000)

def createMatrix(size):
    matrix = numpy.zeros((size, size), dtype=numpy.uint64)

    for i in range(0, size):
        for j in range(0, size):
            if i+j-size >= 0:
                matrix[i][j] = 1
    return matrix

def createVector(size):
    vector = numpy.ones((size, 1), dtype=numpy.uint64)
    return vector

def matrixMod(m, modulo):
    return m % modulo

def multiply(A, B, modulo):
    return matrixMod(A @ B, modulo)
    # for kk in range(0, m):
    #     for i in range(0, m):
    #         s = 0
    #         for k in range(0, m):
    #             x = A[i][k]
    #             y = B[k][kk]
    #             s += (x * y)
    #             if s > modulo:
    #                 s = s % modulo

    #         result[i][kk] = s

    return result


def matrixPower(M, n, mod_val, trace):
    # Implementation shadows numpy's matrix_power, but with modulo included and use of Strassen multiplication
    M = asanyarray(M)

    from numpy.linalg import inv

    if n==0:
        M = M.copy()
        M[:] = identity(M.shape[0])
        return M
    elif n<0:
        M = inv(M)
        n *= -1

    result = matrixMod(M, mod_val)
    if n <= 3:
        for _ in range(n-1):
            result = multiply(result, M, mod_val)
        return result

    # binary decompositon to reduce the number of matrix
    # multiplications for n > 3
    beta = binary_repr(n)
    Z, q, t = M, 0, len(beta)
    while beta[t-q-1] == '0':
        if trace:
            stdout.write('\r' + str(t-q-1) + ' ')
        Z = multiply(Z, Z, mod_val)
        if Z.min() < 0:
            print('ERROR')
        q += 1
    result = Z
    for k in range(q+1, t):
        if trace:
            stdout.write('\r' + str(t-k-1) + ' ')
        Z = multiply(Z, Z, mod_val)
        if Z.min() < 0:
            print('ERROR')
        if beta[t-k-1] == '1':
            result = multiply(result, Z, mod_val)
            if result.min() < 0:
                print('ERROR')

    return result

def T(n, m, trace = False):
    matrix = createMatrix(n)
    vector = createVector(n)
    matrix = matrixPower(matrix, m, MODULO, trace)
    vector = matrix @ vector

    max = int(vector[n-1][0].max())
    max = max % MODULO
    if trace:
        print('')
    return max


assert T(3,4) == 8
assert T(5,5) == 246
assert T(10, 100) == 862820094
assert T(100,10) == 782136797

print("Tests passed")

print('Asnwer is', T(MAX_N, MAX_M, True), '737148354')