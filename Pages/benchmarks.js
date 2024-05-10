import jarvis from "../Code/Algorithms/Jarvis.js";
import quickhull from "../Code/Algorithms/QuickHull.js";
import graham from "../Code/Algorithms/Graham.js";
import mergehull from "../Code/Algorithms/Mergehull.js";
import { generatePointsGuassian, generatePointsUniform } from "../Code/Helper/Distributions.js";
//import Chart from 'chart.js/auto';

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
        
        testAndChartResults(start, end, delta);
    });

}

function clearResults(){
    document.getElementById("results").innerHTML = `<div style='width: 800px;'><canvas id='chart'></canvas></div>`;
}

function getChartData(start, end, delta){
    let iterations = parseInt(Math.ceil((end-start) / parseFloat(delta)));
    let pointsGaussian = generatePointsGuassian(end, 10);
    //let pointsUniform = generatePointsUniform(end, 10);

    let jarvisData = [];
    let grahamData = [];
    let quickhullData = [];

    let curJarvis, curGraham, curQuickhull;

    for (let i = 0; i < iterations; i++){
        start += delta;

        //Cap at end
        start = start > end ? end : start;

        [curJarvis, curGraham, curQuickhull] = testChart(start, pointsGaussian.slice(start));//, pointsUniform.slice(start));
        jarvisData.push(curJarvis);
        grahamData.push(curGraham);
        quickhullData.push(curQuickhull);
    }   




    return [jarvisData, grahamData, quickhullData];
}

function testChart(numberOfPoints, points){
    return [
        {x: numberOfPoints, y: time("jarvis", points)},
        {x: numberOfPoints, y: time("graham", points)},
        {x: numberOfPoints, y: time("quickhull", points)}
    ]
}
function testAndChartResults(start, end, delta){
    
    //let htmlElem = "<div style='width: 800px;''><canvas id='chart'></canvas></div>";
    let htmlElem = document.getElementById("chart");

    let [jarvisData, grahamData, quickhullData] = getChartData(start, end, delta);
    






  // <block:setup:1>
  const DATA_COUNT = 7;
  const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};
  
  const data = {
    datasets: [
      {
        label: 'Jarvis',
        data: jarvisData,
        yAxisID: 'y',
      },
      {
        label: 'Graham',
        data: grahamData,
        yAxisID: 'y1',
      },
      {
        label: 'Quickhull',
        data: quickhullData,
        yAxisID: 'y2',
      }
    ]
  };
  // </block:setup>
  
  // <block:config:0>
  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      stacked: false,
      plugins: {
        title: {
          display: true,
          text: 'Chart.js Line Chart - Multi Axis'
        }
      },
      scales: {
        x: {
            type: 'linear'
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
  
          // grid line settings
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        },
        y2: {
            type: 'linear',
            display: true,
            position: 'right',
    
            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          }
      }
    },
  };

  new Chart(htmlElem, config);


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

       return parseInt(dur);
}