import { generateIntPointsUniform, generatePointsUniform } from "../Helper/Distributions.js";
import jarvis from "./Jarvis.js";
import quickhull from "./QuickHull.js";

function runTest(n, algorithm=quickhull,range=100){
    //Generate random points
    let arr = generatePointsUniform(n, range);

    arr = [[-95, -16], [-93, 36], [-92, 82], [-81, -89], [-77, 96], [4, 100], [38, -98], [57, 98], [59, -99], [67, 98], [84, -59], [94, 30], [100, -29], [100, -1]];
    //Log arr
    console.log(JSON.stringify(arr));

    //Run the algorithm 
    let res = algorithm(arr)[0];
    lexicographicSort(res);

    //Log normalized hull
    console.log(JSON.stringify(res));
}

function lexicographicSort(arr){
    arr.sort(function(a,b) {
        if( a[0] == b[0]) return a[1]-b[1];
        return a[0]-b[0];
    });
}

let commandLineArgs = parseInt(process.argv.slice(2));
runTest(commandLineArgs);