import {angle, distance, left, right} from './Geometry.js';
import { absolutexAngle } from './Jarvis.js';

export default function graham(points){
    if (points.length < 3) return;

    //This bottomMost point is going to be internal anyways(it's literally on the hull) so we can skip finding the centroid
    let bottomMost = minYmaxX(points);

    //This will mutate the array
    sortLexicographically(points, bottomMost);

    return grahamScan(points);
    
}

export function grahamScan(points){
    let stack = [];

    //animation
    let frames = [];

    for (let i = 0; i < points.length; i++){
        let n = stack.length;

        while (n >= 2 && !left(stack[n-2], stack[n-1], points[i])){
            frames.push(stack.slice().concat([points[i]]));
            stack.pop();
            n = stack.length;
        }

        frames.push(stack.slice());
        stack.push(points[i]);
        frames.push(stack.slice());
    }

    return [stack, frames];
}

function minYmaxX(points){
    let bottomMost = points[0];

    for(let i=1; i < points.length; i++){
        if (points[i][1] < bottomMost[1] || points[i][1] == bottomMost[1] && points[i][0] > bottomMost[0]){
            bottomMost = points[i]
        }
    }

    return bottomMost;
}

//Sort on 1)polar angle 2)distance from referencePoint
function sortLexicographically(points, referencePoint){
    points.sort((a, b) =>{
        let angleDiff = absolutexAngle(referencePoint, a) - absolutexAngle(referencePoint, b);

        //If the difference in polar angles is equal, sort according to distance
        return angleDiff == 0 ? distance(referencePoint, a) - distance(referencePoint, b) : angleDiff;
    });
}

console.log(absolutexAngle([0,0], [1, 0]))