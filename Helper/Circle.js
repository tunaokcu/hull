export default function circle(center, radius, numOfPoints=20){    
    let uStart = 0; 
    let uEnd = 2*Math.PI;
    let uDelta = (uEnd-uStart)/numOfPoints;

    let points = [];

    for (let i = 0; i < numOfPoints; i++){
        let u = uStart + i*uDelta;

        points.push(circleEquation(center,radius,u))
    }

    return points;
}

function circleEquation(center, radius, u){
    return [center[0] + radius*Math.cos(u), center[1] + radius*Math.sin(u)];
}