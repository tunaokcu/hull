//This test runner discards duplicates, only focusing on whether only the correct points are found

import { removeArrayDuplicates } from "./Utility.js";
import { generateIntPointsUniform, generatePointsUniform } from "../Helper/Distributions.js";
import jarvis from "./Jarvis.js";
import quickhull from "./QuickHull.js";
import graham from "./Graham.js";
import mergehull from "./Mergehull.js";

function runTest(arr, algoName){
    let algorithm;
    let algorithms = {
        jarvis: jarvis,
        quickhull: quickhull,
        graham: graham,
        mergehull: mergehull
    }

    algorithm = algorithms[algoName];

    //Run the algorithm 
    let res = algorithm(arr)[0];

    //Remove dupes
    res = removeArrayDuplicates(res);

    //Sort
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
let arr = JSON.parse(process.argv[3]);

runTest(arr, algoName);