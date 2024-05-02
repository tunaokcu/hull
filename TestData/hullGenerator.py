from pyhull.convex_hull import ConvexHull, qconvex
from driver import runJS, jsonToList
import os

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
    #?????????? through a cursory testing I have found out that this module gives incorrect outputs
    groundTruth = hullOracle(input)

    print(output, "\n", groundTruth)
    
    #printFormatted(input)
    if len(groundTruth) != len(output):
        print("Sizes of hulls not equal")
        return 

    for i in range(len(groundTruth)):
        if groundTruth[i] != output[i]:
            print(f"Output at {i} differs")
            return 
        
def printFormatted(points):
    for point in points:
        print(point[0])
        print(point[1])

def hullOracle(points):
    hull = qconvex("p", points)[2:]

    #This mess parses the return value of hull    
    return sorted(list(map(lambda x: list(map(lambda a: int(a), x.split())), hull)))




testForNpoints(100)