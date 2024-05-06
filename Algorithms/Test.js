import { generateIntPointsUniform, generatePointsUniform } from "../Helper/Distributions.js";
import jarvis from "./Jarvis.js";
import quickhull from "./QuickHull.js";
import graham from "./Graham.js";
import mergehull from "./Mergehull.js";

function runTest(n, algoName="quickhull",range=100){
    let algorithm;
    let algorithms = {
        jarvis: jarvis,
        quickhull: quickhull,
        graham: graham,
        mergehull: mergehull
    }

    algorithm = algorithms[algoName];

    //Generate random points
    let arr = generatePointsUniform(n, range);
    
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

let algoName = process.argv[2];
let n = parseInt(process.argv[3]);

runTest(n, algoName);