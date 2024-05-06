/*
    Ref: pg 222
    March up, march down
*/

import { findLowestAndHighest } from "./Utility.js";
import { distance } from "./Geometry.js";

//Use https://leetcode.com/problems/erect-the-fence/ to test


export default function jarvis(points){
    // There must be at least 3 points 
     if (points.length < 3) return; 
        
     // Initialize animation frames, current hull, current frame
     let hull = []; 
     let frames = [];
 
     // Find the indices of the lowest and highest points to the LEFT
     const [lowestPoint, highestPoint] = findLowestAndHighest(points);
     
     let currentPoint = lowestPoint;

     // March up     
     do {
        hull.push(points[currentPoint]);

        frames.push(hull.slice())

         let lowestAngledPoint = null;
         for (let i = 0; i < points.length; i++){
             if (i == currentPoint) { continue; }
            
             frames.push([...hull, points[i]])
             if (positivexAngle(points[currentPoint], points[i]) < 0){ continue; } //No need to consider
             if ((lowestAngledPoint == null ||  positivexAngle(points[currentPoint], points[i]) < positivexAngle(points[currentPoint], points[lowestAngledPoint]))){
                 lowestAngledPoint = i;
                 //We keep the point         
             }
             else if (lowestAngledPoint != null && positivexAngle(points[currentPoint], points[i]) == positivexAngle(points[currentPoint], points[lowestAngledPoint]) && distance(points[currentPoint], points[i]) > distance(points[currentPoint], points[lowestAngledPoint]))
             {
                 lowestAngledPoint = i
             }
         }
         
         currentPoint = lowestAngledPoint;
     } while(currentPoint != highestPoint)
     
     
     // March down
    currentPoint = highestPoint;
     do {
         hull.push(points[currentPoint]);
     

         let lowestAngledPoint = null;
         for (let i = 0; i < points.length; i++){
             if (i == currentPoint) { continue; }

             frames.push([...hull, points[i]])

            /*
            if (lowestAngledPoint == null || negativexAngle(points[currentPoint], points[i]) >= 0 && (lowestAngledPoint == null ||  negativexAngle(points[currentPoint], points[i]) < negativexAngle(points[currentPoint], points[lowestAngledPoint]))){
                 lowestAngledPoint = i;
                 //We keep the point          
             }*/
            if ((lowestAngledPoint == null ||  negativexAngle(points[currentPoint], points[i]) > negativexAngle(points[currentPoint], points[lowestAngledPoint]))){
                lowestAngledPoint = i;
                //We keep the point         
            }
             else if (lowestAngledPoint != null && negativexAngle(points[currentPoint], points[i]) == negativexAngle(points[currentPoint], points[lowestAngledPoint]) && distance(points[currentPoint], points[i]) > distance(points[currentPoint], points[lowestAngledPoint]))
            {
                lowestAngledPoint = i
            }
         }

         currentPoint = lowestAngledPoint;
     } while(currentPoint != lowestPoint)
     

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



export {positivexAngle, negativexAngle}

