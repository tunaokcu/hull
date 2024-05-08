import random 
import simplejson as json

def uniformRandom(n, r):
    return [[random.randrange(-r, r) for i in range(2)] for j in range(n)]
    
def removeDupes(arr):
    return [list(t) for t in set(tuple(element) for element in arr)]   

def jsonToList(jsonStr):
    if jsonStr != None and jsonStr != "":
        return json.loads(jsonStr)
    
    return []
