import subprocess
import simplejson as json

def runJS(path="../Algorithms/Test.js", algorithm="quickhull", n=10, log=True):
    #Prepare the command
    commandToRun = ["node", path, algorithm, str(n)]

    #Run the command and capture output
    result = subprocess.run(commandToRun, capture_output=True, text=True)
    if log:
        print(result)
    output = result.stdout.strip()
    return output

def jsonToList(jsonStr):
    if jsonStr != None and jsonStr != "":
        return json.loads(jsonStr)
    
    return []
