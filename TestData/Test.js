import jarvis from "../Code/Algorithms/Jarvis.js";
import quickhull from "../Code/Algorithms/QuickHull.js";
import graham from "../Code/Algorithms/Graham.js";
import mergehull from "../Code/Algorithms/Mergehull.js";

function runTest(arr, algoName){
    let algorithm;
    let algorithms = {
        Jarvis: jarvis,
        Quickhull: quickhull,
        Graham: graham,
        Mergehull: mergehull
    }

    algorithm = algorithms[algoName];

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
let arr = JSON.parse(process.argv[3]);

runTest(arr, algoName);