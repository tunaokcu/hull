import jarvis from "../Code/Algorithms/Jarvis.js";
import quickhull from "../Code/Algorithms/QuickHull.js";
import graham from "../Code/Algorithms/Graham.js";
import mergehull from "../Code/Algorithms/Mergehull.js";
import { generatePointsGuassian, generatePointsUniform } from "../Code/Helper/Distributions.js";


let algorithms = {
    jarvis: jarvis,
    quickhull: quickhull,
    graham: graham,
    mergehull: mergehull
}



window.onload = () => {
    document.getElementById("generateBenchmark").addEventListener("submit", (event) => {
        event.preventDefault();
        
        clearResults();

        let start = parseInt(event.target.elements.startNumber.value);
        let end = parseInt(event.target.elements.endNumber.value);
        let delta = parseInt(event.target.elements.diff.value);
        
        testAndLogResults(start, end, delta);
    });

}

function clearResults(){
    document.getElementById("results").innerHTML = "";
}

function testAndLogResults(start, end, delta){
    let iterations = parseInt(Math.ceil((end-start) / parseFloat(delta)));
    
    let pointsGaussian = generatePointsGuassian(end, 10);
    let pointsUniform = generatePointsUniform(end, 10);

    let htmlElem = "";

    for (let i = 0; i < iterations; i++){
        start += delta;

        //Cap at end
        start = start > end ? end : start;

        htmlElem += test(start, pointsGaussian.slice(start), pointsUniform.slice(start));
    }   

    document.getElementById("results").innerHTML = htmlElem;

}

//Returns res as html str
function test(numberOfPoints, pointsGaussian, pointsUniform){


    let res = "For " + numberOfPoints + " points generated according to Gaussian and uniform distributions, the algorithms performed as follows: <br>"

    res += "Jarvis March: " + time("jarvis", pointsGaussian) + ", " +  time("jarvis", pointsUniform) + "<br>";
    res += "Graham Scan: " + time("graham", pointsGaussian) +  ", " +  time("jarvis", pointsUniform) + "<br>";
    res += "Quickhull: " + time("quickhull", pointsGaussian) +  ", " +  time("jarvis", pointsUniform) + "<br>";

    res += "<hr>";

    return res 
}

//Time given algo
function time(algoName, points){
       //Start timer
       let start = window.performance.now();

        algorithms[algoName](points);

       //Stop timer
       let end = window.performance.now();

       let dur = (end - start);

       return parseInt(dur)+ " ms";
}