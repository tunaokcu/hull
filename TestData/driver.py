import subprocess
import simplejson as json

def runJS(path="../Algorithms/Test.js", n=10):
    #Prepare the command
    commandStr = f"node {path} {n}"
    commandToRun = commandStr.split()

    #Run the command and capture output
    result = subprocess.run(commandToRun, capture_output=True, text=True)
    output = result.stdout.strip()
    return output

def jsonToList(jsonStr):
    return json.loads(jsonStr)