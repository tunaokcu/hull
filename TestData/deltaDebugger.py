def hullDebugger(points, oracle):
    if len(points) <= 3:
        return points
    
    half = len(points) // 2
    
    arr1 = points[0:half]
    arr2 = points[half:]

    #Test on arr1 fails
    if not oracle(arr1):
        return hullDebugger(arr1, oracle)
    elif not oracle(arr2):
        return hullDebugger(arr2, oracle)
    else:
        return hullDebugger(arr1, oracle) + hullDebugger(arr2, oracle)