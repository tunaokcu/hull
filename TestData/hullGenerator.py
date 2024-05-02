from pyhull.convex_hull import ConvexHull
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
    print(type(input))
    hull = ConvexHull(input)
    print(hull.points)
    groundTruth = sorted(hull.points)

    
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

testForNpoints(5)