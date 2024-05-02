import subprocess
from pyhull.convex_hull import ConvexHull

commandToRun = "node Algorithms/Graham.js".split()
print(commandToRun)
subprocess.run(commandToRun)