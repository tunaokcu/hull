from pyhull.convex_hull import ConvexHull, qconvex
from driver import runJS, jsonToList
import os
import math
from deltaDebugger import hullDebugger
import json
import subprocess

def testForNpoints(algorithm, n=10, log=False):
    #Reliably find correct relative path
    dirname = os.path.dirname(__file__)
    parentDir = os.path.abspath(os.path.join(dirname, '..'))
    filename = os.path.join(parentDir, "Algorithms\Test.js")

    #Catch output
    unprocessedOutput =  runJS(filename, algorithm, n, log).strip().split("\n")
    [input, output] = [unprocessedOutput[0], unprocessedOutput[-1]]

    #Parse to list
    [input, output] = [jsonToList(input), jsonToList(output)]

    #Try using pyhull.convex_hull, our ground truth/oracle
    groundTruth = hullOracle(input)

    if (log):
        print("here")
        print(output, "\n", groundTruth)
    
    #printFormatted(input)
    if len(groundTruth) != len(output):
        print("Sizes of hulls not equal")
        print(output, "\n", groundTruth)
        return False  

    for i in range(len(groundTruth)):
        #For robustness
        if not (math.isclose(groundTruth[i][0], output[i][0]) and math.isclose(groundTruth[i][1], output[i][1])):
            print(f"Output at {i} differs")
            print(output, "\n", groundTruth)
            return False

def compareHulls(hullTested, groundTruth):
    #printFormatted(input)
    if len(groundTruth) != len(hullTested):
        print("Sizes of hulls not equal")
        print(hullTested, "\n", groundTruth)
        return False  

    for i in range(len(groundTruth)):
        #For robustness
        if not (math.isclose(groundTruth[i][0], hullTested[i][0]) and math.isclose(groundTruth[i][1], hullTested[i][1])):
            print(f"Output at {i} differs")
            print(hullTested, "\n", groundTruth)
            return False
        
    return True

def printFormatted(points):
    for point in points:
        print(point[0])
        print(point[1])

def hullOracle(points):
    hull = qconvex("p", points)[2:]

    #This mess parses the return value of hull    
    return sorted(list(map(lambda x: list(map(lambda a: float(a), x.split())), hull)))

def test(algorithm, pointCount, testCount, log=False):
    for _ in range(testCount):
        if testForNpoints(algorithm, pointCount, log) == False:
            return
    
    print("All tests successful")

def arrayTest(array, algorithm):
    #Reliably find correct relative path
    dirname = os.path.dirname(__file__)
    parentDir = os.path.abspath(os.path.join(dirname, '..'))
    filename = os.path.join(parentDir, "Algorithms\TestCustomized.js")

    #Prepare the command
    commandToRun = ["node", filename, algorithm, str(array)]

    #Run the command and capture output
    output = subprocess.run(commandToRun, capture_output=True, text=True)

    output = output.stdout.strip()
    output = output.split("\n")[-1]

    output = jsonToList(output)
    
    #Try using pyhull.convex_hull, our ground truth/oracle
    groundTruth = hullOracle(array)

    return compareHulls(output, groundTruth)

#TODO ccode a plain array runner for javascript functions
testVal = [[-97, -58], [-90, 1], [-79, 90], [-77, 93], [-65, -88], [-29, -97], [-6, -99], [31, 100], [44, 98], [57, 96], [70, -80], [87, -74], [96, 82], [100, -23], [100, 36]]
#print(hullDebugger(testVal, lambda x:arrayTest(x, "jarvis")))
#found using delta debugging
minimalTestVal = [[31, 100], [44, 98], [57, 96], [70, -80]]

#test("graham", 10, 10, log=False)
test("jarvis", 1000, 10)