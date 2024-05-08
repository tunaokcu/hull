export {generatePointsGuassian, generatePointsUniform, generateIntPointsUniform}

//https://online.stat.psu.edu/stat414/lesson/22/22.4


function generatePointsGuassian(n, range) {
    let points = new Array(n);

    for (let i = 0; i < n; i ++){
        points[i] = [generateGaussian(0, range), generateGaussian(0, range)]
    }
    return points;
}

//CREDIT: https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
/*
function generateGaussian(min, max, skew) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random()
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )

    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0) {
      num = generateGaussian(min, max, skew) // resample between 0 and 1 if out of range
    }else{
      num = Math.pow(num, skew) // Skew
      num *= max - min // Stretch to fill range
      num += min // offset to min
    }
    return num
  }
*/
/*
Credit: 
https://discourse.psychopy.org/t/javascript-gaussian-function/17724
https://github.com/errcw/gaussian/blob/master/lib/box-muller.js
*/
// Function from the gaussian repo, with a slight adjustment
function generateGaussian(mean,std){
  var _2PI = Math.PI * 2;
  var u1 = Math.random();
  var u2 = Math.random();
  
  var z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(_2PI * u2);
  //var z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(_2PI * u2);

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

function generateIntPointsUniform(n, range){
  return generatePointsUniform(n, range).map((point) => [Math.ceil(point[0]), Math.ceil(point[1])]);
}