export function findLowestAndHighest(points){
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
       else if (points[i][1] == points[highestPoint][1] && points[i][0] < points[highestPoint][0]){ //leftmost highest point
           highestPoint = i;
       }
    }

    return [lowestPoint, highestPoint];
}


function copy2DArr(arr){
    return arr.map((item) => item.slice());
}


