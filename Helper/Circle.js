let cached = new Map();


export default function circle(center, radius, numOfPoints=20){   
    let points = [];

    //If already cached, take cache
    if (cached.has(numOfPoints)){
        points = cached.get(numOfPoints);
    }
    //Else, cache unit circle
    else{

        let uDelta = 2*Math.PI/numOfPoints;


        for (let i = 0; i < numOfPoints; i++){
            let u =i*uDelta;

            points.push(unitCircle(u));
        }

        cached.set(numOfPoints, points);
    }

    //Rescale, shift, and return

    return points.map((point) => [point[0]*radius + center[0], point[1]*radius + center[1]])
}

function unitCircle(u){
    return [Math.cos(u),Math.sin(u)];

}
function circleEquation(center, radius, u){
    return [center[0] + radius*Math.cos(u), center[1] + radius*Math.sin(u)];
}