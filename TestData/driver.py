import subprocess
import simplejson as json

def runJS(path="../Algorithms/Test.js", n=10, log=False):
    #Prepare the command
    commandToRun = ["node", path, str(n)]

    #Run the command and capture output
    result = subprocess.run(commandToRun, capture_output=True, text=True)
    if log:
        print(result)
    output = result.stdout.strip()
    return output

def jsonToList(jsonStr):
    return json.loads(jsonStr)