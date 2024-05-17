import {angle, distance, left, right} from '../Helper/Geometry.js';
import { absolutexAngle } from './Jarvis.js';
import {minYmaxX} from "../Helper/Utility.js"


export default function graham(points){
    if (points.length < 3) return;

    let leftmost = points[0];
    for (let i = 1; i < points.length; i++){
        if (points[i][0] < leftmost[0]){
            leftmost = points[i];
        }
    }

    let rightmost = points[0];
    for (let i = 1; i < points.length; i++){
        if (points[i][0] > rightmost[0]){
            rightmost = points[i];
        }
    }

    let above = [];
    let below = [];

    for (let i = 0; i < points.length; i++){
        if ( points[i] == leftmost || points[i] == rightmost) continue;
        if (left(leftmost, rightmost, points[i])){
            above.push(points[i]);
        } else if (right(leftmost, rightmost, points[i])){
            below.push(points[i]);
        }
    }
  

    above.sort((a, b) =>  a[0] - b[0]);
    below.sort((a, b) =>  b[0] - a[0]);

    for (let i = 0; i < above.length - 1; i++){
        if (above[i][0] == above[i+1][0] ){
            if (above[i][1] > above[i+1][1]){
                above.splice(i+1, 1);
            }else{
                above.splice(i, 1);
            }
        }
    }

    for (let i = 0; i < below.length - 1; i++){
        if (below[i][0] == below[i+1][0] ){
            if (below[i][1] > below[i+1][1]){
                below.splice(i, 1);
            }else{
                below.splice(i+1, 1);
            }
        }
    }


    above.push(rightmost);
    below.push(leftmost);
    
    let upperhull = [leftmost, above[0]];
    let currentSize = 2;
    for (let i = 1; i < above.length; i++){
        while (currentSize >= 2 && left(upperhull[ currentSize - 2], upperhull[ currentSize - 1], above[i])){
            upperhull.pop();
            currentSize--;
        }
        upperhull.push(above[i]);
        currentSize++;
    }

    let lowerhull = [rightmost, below[0]];
    currentSize = 2;
    for (let i = 1; i < below.length; i++){
        while (currentSize >= 2 && left(lowerhull[ currentSize - 2], lowerhull[ currentSize - 1], below[i])){
            lowerhull.pop();
            currentSize--;
        }
        lowerhull.push(below[i]);
        currentSize++;
    }

    upperhull.pop();
    lowerhull.pop();
    let hull = upperhull.concat(lowerhull);
    return [hull, []];
}

export function linear( p1, p2, p3){
    return (p2[0] - p1[0])*(p3[1] - p1[1]) - (p2[1] - p1[1])*(p3[0] - p1[0]);
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


//Sort on 1)polar angle 2)distance from referencePoint
function sortLexicographically(points, referencePoint){
    points.sort((a, b) =>{
        let angleDiff = absolutexAngle(referencePoint, a) - absolutexAngle(referencePoint, b);

        //If the difference in polar angles is equal, sort according to distance
        return angleDiff == 0 ? distance(referencePoint, a) - distance(referencePoint, b) : angleDiff;
    });
}

