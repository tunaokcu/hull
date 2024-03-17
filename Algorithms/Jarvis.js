/*
    Ref: pg 222
    March up, march down
*/

//Use https://leetcode.com/problems/erect-the-fence/ to test


module.exports =  function jarvis(points){
    // There must be at least 3 points 
     if (points.length < 3) return; 
        
     // Initialize animation frames, current hull, current frame
     let hull = []; 
     let frames = [];
 
     // Find the indices of the lowest and highest points to the LEFT
     let lowestPoint = 0;
     let highestPoint = 0;

     
     for (let i = 1; i < points.length; i++){
        if (points[i][1] < points[lowestPoint][1]){ 
            lowestPoint = i; 
        }
        
        else if (points[i][1] == points[lowestPoint][1] && points[i][0] > points[lowestPoint][0]){ //rightmost lowest point
            lowestPoint = i
        }
        
        if (points[i][1] > points[highestPoint][1]){ 
            highestPoint = i; 
        }
        else if (points[i][1] == points[highestPoint][1] && points[i][0] > points[highestPoint][0]){
            highestPoint = i;
        }
     }
     
     let currentPoint = lowestPoint;

     // March up     
     do {
        //!INCOMPREHENSIBLE BUG !!!!! "before" is empty, "pushing" is just one array, "after" has three arrays.. how????
        console.log("before:", hull)
        console.log("pushing", points[currentPoint])
        hull.push(points[currentPoint]);
        console.log("after:", hull)

        frames.push(hull.slice())
        console.log(frames)
        console.log(points[currentPoint])
        console.log("----")

         let lowestAngledPoint = null;
         for (let i = 0; i < points.length; i++){
             if (i == currentPoint) { continue; }
            
             frames.push([...hull, points[i]])
             if (positivexAngle(points[currentPoint], points[i]) < 0){ continue; } //No need to consider
             if ((lowestAngledPoint == null ||  positivexAngle(points[currentPoint], points[i]) < positivexAngle(points[currentPoint], points[lowestAngledPoint]))){
                 lowestAngledPoint = i;
                 //We keep the point         
             }
             else if (lowestAngledPoint != null && positivexAngle(points[currentPoint], points[i]) == positivexAngle(points[currentPoint], points[lowestAngledPoint]) && distanceBetween(points[currentPoint], points[i]) < distanceBetween(points[currentPoint], points[lowestAngledPoint]))
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
             if (negativexAngle(points[currentPoint], points[i]) >= 0 && (lowestAngledPoint == null ||  negativexAngle(points[currentPoint], points[i]) < negativexAngle(points[currentPoint], points[lowestAngledPoint]))){
                 lowestAngledPoint = i;
                 //We keep the point          
             }
             else if (lowestAngledPoint != null && negativexAngle(points[currentPoint], points[i]) == negativexAngle(points[currentPoint], points[lowestAngledPoint]) && distanceBetween(points[currentPoint], points[i]) < distanceBetween(points[currentPoint], points[lowestAngledPoint]))
             {
                 lowestAngledPoint = i
             }
         }

         currentPoint = lowestAngledPoint;
     } while(currentPoint != lowestPoint)
     

     console.log(frames)
     return [hull, frames]
}



function distanceBetween(start, end){
    let vectorY = end[1] - start[1];
    let vectorX = end[0] - start[0];

    return Math.sqrt(vectorY**2 + vectorX**2);
}

function positivexAngle(start, end){
    let vectorY = end[1] - start[1];
    let vectorX = end[0] - start[0];

    return Math.atan2(vectorY, vectorX);
}


function negativexAngle(start,end){
    let vectorY = end[1] - start[1];
    let vectorX = end[0] - start[0];

    if (vectorY == 0) { 
        if (vectorX > 0){
            return Math.PI; 
        }
        else if (vectorX < 0 ){
            return 0;
        }
    }

    return Math.atan2(-vectorY, -vectorX);
}

