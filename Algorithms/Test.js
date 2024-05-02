import { generateIntPointsUniform } from "../Helper/Distributions.js";
import jarvis from "./Jarvis.js";

function runTest(n, algorithm=jarvis,range=100){
    //Generate random points
    let arr = generateIntPointsUniform(n, range);

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