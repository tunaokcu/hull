from pyhull.convex_hull import ConvexHull, qconvex
from driver import runJS, jsonToList
import os
import math

def testForNpoints(n=10):
    #Reliably find correct relative path
    dirname = os.path.dirname(__file__)
    parentDir = os.path.abspath(os.path.join(dirname, '..'))
    filename = os.path.join(parentDir, "Algorithms\Test.js")

    #Catch output
    [input, output] = runJS(filename, n).split("\n")

    #Parse to list
    [input, output] = [jsonToList(input), jsonToList(output)]

    #Try using pyhull.convex_hull, our ground truth/oracle
    groundTruth = hullOracle(input)

    print(output, "\n", groundTruth)
    
    #printFormatted(input)
    if len(groundTruth) != len(output):
        print("Sizes of hulls not equal")
        return False  

    for i in range(len(groundTruth)):
        #For robustness
        if not (math.isclose(groundTruth[i][0], output[i][0]) and math.isclose(groundTruth[i][1], output[i][1])):
            print(f"Output at {i} differs")
            return False
        
def printFormatted(points):
    for point in points:
        print(point[0])
        print(point[1])

def hullOracle(points):
    hull = qconvex("p", points)[2:]

    #This mess parses the return value of hull    
    return sorted(list(map(lambda x: list(map(lambda a: float(a), x.split())), hull)))

def test(pointCount, testCount):
    for _ in range(testCount):
        if testForNpoints(pointCount) == False:
            return
    
    print("All tests successful")

test(100, 10);