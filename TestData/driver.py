import subprocess
import simplejson as json

def runJS(path="../Algorithms/Graham.js"):
    #Prepare the command
    commandStr = f"node {path}"
    commandToRun = commandStr.split()

    print(commandToRun)
    #Run the command and capture output
    result = subprocess.run(commandToRun, capture_output=True, text=True)
    output = result.stdout.strip()
    return output

def jsonToList(jsonStr):
    return json.loads(jsonStr)


res = runJS("../Algorithms/Test.js")
print(res)