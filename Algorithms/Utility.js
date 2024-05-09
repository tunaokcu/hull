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

export function removeArrayDuplicates(array) {
    //return array.filter((item, index) => array.indexOf(item) === index);
    const uniquePoints = new Set(array.map(point => point.toString())); // Convert points to strings and use Set to remove duplicates
    const uniqueArray = Array.from(uniquePoints, point => point.split(',').map(parseFloat)); // Convert back to array of arrays
    return uniqueArray;
}

const PRECISION = 5;
export function pointToFixedPrecision(arr){
    return arr.map(num => parseFloat(num.toFixed(PRECISION)));
}

export function minYmaxX(points){
    let bottomMost = points[0];

    for(let i=1; i < points.length; i++){
        if (points[i][1] < bottomMost[1] || points[i][1] == bottomMost[1] && points[i][0] > bottomMost[0]){
            bottomMost = points[i]
        }
    }

    return bottomMost;
}

export function maxYminX(points){
    let topMost = points[0];

    for(let i=1; i < points.length; i++){
        if (points[i][1] > topMost[1] || points[i][1] == topMost[1] && points[i][0] < topMost[0]){
            topMost = points[i]
        }
    }

    return topMost;
}