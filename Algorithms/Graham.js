export default function graham(points){
    let newPoints = points.slice();
    
    // Find the centroid
    let centroid = findCentroid(newPoints);

    // Sort lexicographically according to the polar angle(angle between point p and centroid) and distance between p and centroid(to break ties)
    sortAccordingToCentroid(newPoints, centroid); 

    // Get the rightmost lowest point 
    let rightMostIndex = findRightmost(newPoints)
    // and remove it from the points array
    //points = points.slice(1);

    let hull = [newPoints[rightMostIndex]]

    let i = (rightMostIndex + 1) % newPoints.length;

    //TODO
    while (i != rightMostIndex){

    }


    return [hull, []];
}

function lexicographicSort(points) {
    let pointsCopy = points.slice();

    //Sort according to x, then y(to break up the ties).
    pointsCopy.sort((a, b) => a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);

    return pointsCopy;
}

function crossProduct(p1, p2, p3) {
    return (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]);
}

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
}

function sortAccordingToCentroid(points, centroid){
    points.sort((a, b) => {
        let angle = crossProduct(centroid, a, b);

        return angle == 0 ? distance(centroid, a) - distance(centroid, b) : angle;
    })
}

function findCentroid(points){
    let centroid = points.reduce((sumOfPoints, point) => {
        return [sumOfPoints[0] + point[0], sumOfPoints[1] + point[1]];
    }, [0, 0])

    let n = points.length;

    return [centroid[0]/n, centroid[1]/n];
}

function findRightmost(points){
    let rightMost = points[0]
    let j = 0;

    for (let i = 1; i < points.length; i++){
        if (points[i][0] > rightMost[0]){
            rightMost = points[i]
            j = i; 
        }
        else if (points[i][0] == rightMost[0] && points[i][1] < rightMost[1]){
            rightMost = points[i];
            j = i;
        }
    }

    return j;
}
