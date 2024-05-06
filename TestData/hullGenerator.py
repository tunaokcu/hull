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

def arrayTestWithoutDupes(array, algorithm):
    #Reliably find correct relative path
    dirname = os.path.dirname(__file__)
    parentDir = os.path.abspath(os.path.join(dirname, '..'))
    filename = os.path.join(parentDir, "Algorithms\TestWithoutDuplicates.js")

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

testVal = [[-97, -58], [-90, 1], [-79, 90], [-77, 93], [-65, -88], [-29, -97], [-6, -99], [31, 100], [44, 98], [57, 96], [70, -80], [87, -74], [96, 82], [100, -23], [100, 36]]
#print(hullDebugger(testVal, lambda x:arrayTest(x, "jarvis")))
#found using delta debugging
minimalTestVal = [[31, 100], [44, 98], [57, 96], [70, -80]]

#test("graham", 10, 10, log=False)
grahamBug = [[0.58, 0.47], [-0.88, 0.52], [-0.12, -0.21], [0.2, -0.62], [-0.65, -0.4], [0.42, -0.31], [0.19, 0.83], [0.49, -0.03], [-0.54, -0.65], [-0.53, 0.7], [0.74, 0.69], [0.79, -0.36], [-0.11, -0.72], [0.69, -0.75], [0.83, 0.29], [0.53, 0.81], [-0.31, 0.87], [-0.84, 0.27], [-0.89, -0.39], [0.6, 0.25], [0.57, 0.42], [0.48, 0.57], [0.35, 0.68], [0.18, 0.74], [0.01, 0.74], [-0.15, 0.68], [-0.29, 0.57], [-0.37, 0.42], [-0.4, 0.25], [-0.37, 0.08], [-0.29, -0.07], [-0.15, -0.18], [0.01, -0.24], [0.18, -0.24], [0.35, -0.18], [0.48, -0.07], [0.57, 0.08], [0.6, 0.25], [1.68, -0.54], [1.65, -0.37], [1.56, -0.22], [1.43, -0.11], [1.26, -0.05], [1.09, -0.05], [0.93, -0.11], [0.79, -0.22], [0.71, -0.37], [0.68, -0.54], [0.71, -0.71], [0.79, -0.86], [0.93, -0.98], [1.09, -1.04], [1.26, -1.04], [1.43, -0.98], [1.56, -0.86], [1.65, -0.71], [1.68, -0.54], [0.24, -1.04], [0.21, -0.87], [0.12, -0.72], [-0.01, -0.61], [-0.18, -0.55], [-0.35, -0.55], [-0.51, -0.61], [-0.65, -0.72], [-0.73, -0.87], [-0.76, -1.04], [-0.73, -1.21], [-0.65, -1.36], [-0.51, -1.47], [-0.35, -1.53], [-0.18, -1.53], [-0.01, -1.47], [0.12, -1.36], [0.21, -1.21], [0.24, -1.04], [-0.62, -0.32], [-0.65, -0.15], [-0.74, 0.0], [-0.87, 0.11], [-1.03, 0.17], [-1.21, 0.17], [-1.37, 0.11], [-1.5, 0.0], [-1.59, -0.15], [-1.62, -0.32], [-1.59, -0.49], [-1.5, -0.64], [-1.37, -0.75], [-1.21, -0.81], [-1.03, -0.81], [-0.87, -0.75], [-0.74, -0.64], [-0.65, -0.49], [-0.62, -0.32], [-0.28, 0.96], [-0.31, 1.13], [-0.4, 1.28], [-0.53, 1.39], [-0.7, 1.45], [-0.87, 1.45], [-1.03, 1.39], [-1.17, 1.28], [-1.25, 1.13], [-1.28, 0.96], [-1.25, 0.79], [-1.17, 0.64], [-1.03, 0.53], [-0.87, 0.47], [-0.7, 0.47], [-0.53, 0.53], [-0.4, 0.64], [-0.31, 0.79], [-0.28, 0.96], [1.57, 1.11], [1.54, 1.28], [1.45, 1.43], [1.32, 1.54], [1.16, 1.6], [0.98, 1.6], [0.82, 1.54], [0.69, 1.43], [0.6, 1.28], [0.57, 1.11], [0.6, 0.94], [0.69, 0.79], [0.82, 0.68], [0.98, 0.62], [1.16, 0.62], [1.32, 0.68], [1.45, 0.79], [1.54, 0.94], [1.57, 1.11], [2.28, 0.64], [2.25, 0.81], [2.17, 0.96], [2.03, 1.07], [1.87, 1.13], [1.7, 1.13], [1.53, 1.07], [1.4, 0.96], [1.31, 0.81], [1.28, 0.64], [1.31, 0.47], [1.4, 0.32], [1.53, 0.21], [1.7, 0.15], [1.87, 0.15], [2.03, 0.21], [2.17, 0.32], [2.25, 0.47], [2.28, 0.64], [0.57, 1.89], [0.54, 2.06], [0.45, 2.21], [0.32, 2.32], [0.16, 2.38], [-0.02, 2.38], [-0.18, 2.32], [-0.31, 2.21], [-0.4, 2.06], [-0.43, 1.89], [-0.4, 1.71], [-0.31, 1.56], [-0.18, 1.45], [-0.02, 1.39], [0.16, 1.39], [0.32, 1.45], [0.45, 1.56], [0.54, 1.71], [0.57, 1.89], [1.37, -1.57], [1.34, -1.39], [1.25, -1.24], [1.12, -1.13], [0.96, -1.07], [0.78, -1.07], [0.62, -1.13], [0.49, -1.24], [0.4, -1.39], [0.37, -1.57], [0.4, -1.74], [0.49, -1.89], [0.62, -2.0], [0.78, -2.06], [0.96, -2.06], [1.12, -2.0], [1.25, -1.89], [1.34, -1.74], [1.37, -1.57], [-1.2, -1.85], [-1.23, -1.68], [-1.32, -1.53], [-1.45, -1.42], [-1.62, -1.36], [-1.79, -1.36], [-1.95, -1.42], [-2.09, -1.53], [-2.17, -1.68], [-2.2, -1.85], [-2.17, -2.02], [-2.09, -2.17], [-1.95, -2.28], [-1.79, -2.34], [-1.62, -2.34], [-1.45, -2.28], [-1.32, -2.17], [-1.23, -2.02], [-1.2, -1.85], [-1.81, 0.24], [-1.84, 0.41], [-1.93, 0.56], [-2.06, 0.67], [-2.22, 0.73], [-2.4, 0.73], [-2.56, 0.67], [-2.69, 0.56], [-2.78, 0.41], [-2.81, 0.24], [-2.78, 0.07], [-2.69, -0.08], [-2.56, -0.19], [-2.4, -0.25], [-2.22, -0.25], [-2.06, -0.19], [-1.93, -0.08], [-1.84, 0.07], [-1.81, 0.24], [1.96, 2.22], [1.93, 2.39], [1.85, 2.54], [1.71, 2.65], [1.55, 2.71], [1.38, 2.71], [1.21, 2.65], [1.08, 2.54], [0.99, 2.39], [0.96, 2.22], [0.99, 2.05], [1.08, 1.9], [1.21, 1.78], [1.38, 1.72], [1.55, 1.72], [1.71, 1.78], [1.85, 1.9], [1.93, 2.05], [1.96, 2.22]]
grahamBugMinimized = [[-2.69, 0.56], [-2.78, 0.41], [-2.81, 0.24], [-2.78, 0.07], [-2.69, -0.08], [-2.56, -0.19], [-2.4, -0.25], [-2.22, -0.25], [-2.06, -0.19], [-1.93, -0.08], [-1.84, 0.07], [-1.81, 0.24], [1.96, 2.22], [1.93, 2.39], [1.85, 2.54], [1.71, 2.65], [1.55, 2.71], [1.38, 2.71], [1.21, 2.65], [1.08, 2.54], [0.99, 2.39], [0.96, 2.22], [0.99, 2.05], [1.08, 1.9], [1.21, 1.78], [1.38, 1.72], [1.55, 1.72], [1.71, 1.78], [1.85, 1.9], [1.93, 2.05], [1.96, 2.22]]#hullDebugger(grahamBug, lambda x: arrayTestWithoutDupes(x, "graham"))

print(compareHulls(grahamBugMinimized, hullOracle(grahamBugMinimized)))