/*
    Ref: pg 222
    March up, march down
*/

import { findLowestAndHighest } from "./Utility.js";
import { distance, pointsEqual } from "./Geometry.js";
import { minYmaxX, maxYminX } from "./Utility.js";

//Use https://leetcode.com/problems/erect-the-fence/ to test


export default function jarvis(points){
    // There must be at least 3 points 
     if (points.length < 3) return; 
        
     // Initialize animation frames, current hull, current frame
     let hull = []; 
     let frames = [];
 
     // Find the value of the lowest point
     let lowestPoint = minYmaxX(points);
     let highestPoint = maxYminX(points);


     let currentPoint = lowestPoint;
     // March up     
     do {
        hull.push(currentPoint);

        frames.push(hull.slice())

        let lowestAngledPoint = null;
        for (let i = 0; i < points.length; i++){
            frames.push([...hull, points[i]])

            //They are either equal or they make a negative angle
            if (pointsEqual(currentPoint, points[i]) || negativexAngle(currentPoint, points[i]) > 0){
                continue;
            }
            if (lowestAngledPoint == null){
                lowestAngledPoint = points[i];
                continue;
            }
            

            //Either makes a smaller angle or makes the same angle but is further away
            let makesSmallerAngle = positivexAngle(currentPoint, points[i]) < positivexAngle(currentPoint, lowestAngledPoint);
            let makesSameAngle = positivexAngle(currentPoint, points[i]) == positivexAngle(currentPoint, lowestAngledPoint);
            let isFurtherAway =  distance(currentPoint, points[i]) > distance(currentPoint, lowestAngledPoint)

            if(makesSmallerAngle || (makesSameAngle && isFurtherAway)){
                lowestAngledPoint = points[i];
            }
        
        }
         
         currentPoint = lowestAngledPoint;
     } while(!pointsEqual(currentPoint, highestPoint))

    
    currentPoint = highestPoint;
    // March up     
    do {
        hull.push(currentPoint);

        frames.push(hull.slice())

        let lowestAngledPoint = null;
        for (let i = 0; i < points.length; i++){
            frames.push([...hull, points[i]])

            //They are either equal or they make a positive angle
            if (pointsEqual(currentPoint, points[i]) || positivexAngle(currentPoint, points[i]) > 0){
                continue;
            }
            if (lowestAngledPoint == null){
                lowestAngledPoint = points[i];
                continue;
            }
            

            //Either makes a smaller angle or makes the same angle but is further away
            let makesSmallerAngle = negativexAngle(currentPoint, points[i]) > negativexAngle(currentPoint, lowestAngledPoint);
            let makesSameAngle = negativexAngle(currentPoint, points[i]) == negativexAngle(currentPoint, lowestAngledPoint);
            let isFurtherAway =  distance(currentPoint, points[i]) > distance(currentPoint, lowestAngledPoint)

            if(makesSmallerAngle || (makesSameAngle && isFurtherAway)){
                lowestAngledPoint = points[i];
            }
        
        }
        
        currentPoint = lowestAngledPoint;

    } while(!pointsEqual(currentPoint, lowestPoint))
     return [hull, frames]
}


function positivexAngle(start, end){
    let vectorY = end[1] - start[1];
    let vectorX = end[0] - start[0];

    return Math.atan2(vectorY, vectorX);
}

function negativexAngle(start, end){
    let vectorY = end[1] - start[1];
    let vectorX = end[0] - start[0];

    return Math.atan2(-vectorY, vectorX);
}

function absolutexAngle(start, end){
    let angle = positivexAngle(start, end);

    if (angle < 0){
        return -angle + Math.PI;
    }
    return angle;
}

export {positivexAngle, negativexAngle, absolutexAngle}