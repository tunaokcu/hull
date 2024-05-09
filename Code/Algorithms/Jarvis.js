/*
    Ref: pg 222
    March up, march down
*/

import { findLowestAndHighest } from '../Helper/Utility.js';
import { distance, isCCW, pointsEqual } from '../Helper/Geometry.js';
import { minYmaxX, maxYminX } from '../Helper/Utility.js';

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


console.log(isCCW(jarvis([[28, -4], [-29, 95], [12, 4], [22, -59], [6, -77], [-18, 99], [74, -21], [-40, -6], [-63, -28], [27, 94], [18, -96], [37, -23], [69, -76], [45, 53], [75, -86], [-32, 92], [42, 99], [8, 67], [-35, -40], [66, -92], [-23, 90], [-47, -88], [-84, -14], [51, -27], [39, 16], [-11, -66], [-6, -26], [63, -16], [85, 87], [41, -9], [-22, -48], [-25, 79], [81, -22], [25, -43], [-35, -3], [-42, 59], [98, 26], [-7, 13], [50, 59], [-92, 97], [-91, 17], [-94, -11], [-11, -70], [49, -92], [62, -26], [78, 74], [14, 88], [91, 67], [-82, 88], [88, 17], [86, 12], [-79, -3], [92, 54], [64, 59], [-4, 16], [83, 11], [57, -87], [-35, -32], [53, -9], [-64, 52], [25, -75], [58, 94], [-6, 87], [-41, 9], [-48, 98], [0, 27], [62, -20], [42, -81], [55, -62], [15, 20], [-47, 25], [-96, -51], [88, 74], [67, -78], [-99, 76], [42, 36], [-78, 1], [38, -33], [-29, 66], [-8, 45], [-13, -87], [19, 47], [-4, 69], [-21, 27], [-31, -20], [-68, 32], [94, -49], [-93, -25], [-89, 73], [-83, -66], [74, -100], [-84, 86], [-65, 61], [34, -35], [-84, 73], [-93, -5], [-90, 47], [-20, 57], [-29, 89], [-75, 82]])))
export {positivexAngle, negativexAngle, absolutexAngle}