export default function circle(center, radius, numOfPoints=20){
    let uStart = 0; 
    let uEnd = 2*Math.PI;
    let uDelta = 2*Math.PI/(360.0/numOfPoints);

    let points = [];

    for (let u = uStart; u < uEnd; u += uDelta){
        points.push(circleEquation(center, radius, u));
    }
    
    console.log([0, 1])
    console.log(points);
    return points;
}

function circleEquation(center, radius, u){
    return [center + radius*Math.cos(u), center + radius*Math.sin(u)];
}