export {generatePointsGuassian, generatePointsUniform}

//https://online.stat.psu.edu/stat414/lesson/22/22.4
function generatePointsGuassian(n, range) {
    let points = new Array(n);

    for (let i = 0; i < n; i ++){
        points[i] = [generateGaussian(0, range), generateGaussian(0, range)]
    }
    return points;
}


/*
Credit: 
https://discourse.psychopy.org/t/javascript-gaussian-function/17724
https://github.com/errcw/gaussian/blob/master/lib/box-muller.js
*/
// Function from the gaussian repo, with a slight adjustment
function generateGaussian(mean,std){
  
  var z0 = Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos( Math.PI * 2 * Math.random());

  return z0 * std + mean;
}

function generatePointsUniform(n, range){
    let points = [];

    for (let i = 0; i < n; i ++){
        points.push([])
        points[i].push((Math.random() * 2 * range) -range)
        points[i].push((Math.random() * 2 * range) -range)
    }
    return points;
}

