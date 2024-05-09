from pyhull.convex_hull import qconvex
import os
import math
from deltaDebugger import hullDebugger
import subprocess
from utility import uniformRandom, removeDupes, jsonToList
from datetime import datetime
import re

#Finds absolute path relative to THIS FOLDER.... do NOT call externally 
def findAbsolutePath(relative):
    dirname = os.path.dirname(__file__)
    filename = os.path.abspath(os.path.join(dirname, relative))
    return filename 

def runTestJS(algorithmName, arr):
    #Find path to Test.js
    filename = findAbsolutePath("..\Algorithms\Test.js")

    #Prepare command
    commandlineArgs = ["node", filename, algorithmName, str(arr)]

    #Capture and parse output
    output = subprocess.run(commandlineArgs, capture_output=True, text=True)

    output = output.stdout.strip()
    output = output.split("\n")[-1]

    output = jsonToList(output)

    return output

def compareHulls(hullTested, groundTruth):
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


def hullOracle(points):
    hull = qconvex("p", points)[2:]

    return sorted(list(map(lambda x: list(map(lambda a: float(a), x.split())), hull)))

def test(algorithm, pointCount, testCount, log=False):
    for _ in range(testCount):
        if testRandom(algorithm, pointCount, log) == False:
            return
    
    print("All tests successful")


def testRandom(algorithm, n=10, log=False):
    arr = uniformRandom(n)

    return arrayTest(arr, algorithm)


def arrayTest(array, algorithm):
    output = runTestJS(algorithm, array)
    
    #Try using pyhull.convex_hull, our ground truth/oracle
    groundTruth = hullOracle(array)

    return compareHulls(output, groundTruth)

def testRandomWithoutDupes(algorithm, n=10):
    arr = uniformRandom(n)
    return arrayTestWithoutDupes(arr, algorithm)

def randomTestWithoutDupes(algorithm, pointCount, testCount):
    #String cleaning
    algorithm = algorithm.strip().capitalize()

    #Get foldername
    foldername = f"Bugs{algorithm}"

    #Get filename 

    #split_date = date.split(r' |-')
    datePostfix = "-".join(str(datetime.now()).split(":"))

    filename = f"{datePostfix}run"
    succesful = 0

    for i in range(testCount):
        arr = uniformRandom(pointCount, 100)
        output = runTestJS(algorithm, arr)
        output = removeDupes(output)
        output = sorted(output)

        passed = compareHulls(hullOracle(arr), output)

        if not passed:
            
            curFilename = filename + str(i)

            path = findAbsolutePath(f".\{foldername}\{curFilename}.txt")

            with open(path, "w") as file:
                file.write(str(output))

            minimized = hullDebugger(output, hullOracle)
            path = findAbsolutePath(f".\{foldername}\{curFilename}minimized.txt")

            with open(path, "w") as file:
                file.write(str(minimized))

        else:
            succesful += 1
    
    if succesful == testCount:
        print(f"All runs sucessful({testCount})")
    else:
        print(f"{succesful}/{testCount} successful. You can find buggy test cases as well as their minimized versions at {foldername}")
 

def arrayTestWithoutDupes(array, algorithm):
    output = runTestJS(algorithm, array)
    output = removeDupes(output)
    
    #Try using pyhull.convex_hull, our ground truth/oracle
    groundTruth = hullOracle(array)

    return compareHulls(output, groundTruth)



randomTestWithoutDupes("graham", 100, 100)