from pyhull.convex_hull import ConvexHull
from driver import runJS, jsonToList


def testForNpoints(n=10):
    #Catch output
    [input, output] = runJS(n=n).split("\n")

    #Parse to list
    [input, output] = [jsonToList(input), jsonToList(output)]

    #Try using pyhull.convex_hull, our ground truth/oracle
    hull = ConvexHull(input)
    groundTruth = sorted(hull.points)

    print(input , "\n", output, "\n ------")
    print(output, "\n", groundTruth)
    assert groundTruth == output


testForNpoints(10)