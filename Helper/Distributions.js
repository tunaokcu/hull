export {generatePointsGuassian, generatePointsUniform}

//https://online.stat.psu.edu/stat414/lesson/22/22.4


function generatePointsGuassian(n, range) {
    let points = [];

    for (let i = 0; i < n; i ++){
        points.push([])
        points[i].push(generateGaussian(-range, range, 1))
        points[i].push(generateGaussian(-range, range, 1))
    }
    return points;
}

//TODO understand and rewrite
//CREDIT: https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
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

function generatePointsUniform(n, range){
    let points = [];

    for (let i = 0; i < n; i ++){
        points.push([])
        points[i].push((Math.random() * 2 * range) -range)
        points[i].push((Math.random() * 2 * range) -range)
    }
    return points;
}

