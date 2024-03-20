
/*
let points be the list of points
let stack = empty_stack()

find the lowest y-coordinate and leftmost point, called P0
sort points by polar angle with P0, if several points have the same polar angle then only keep the farthest

for point in points:
    # pop the last point from the stack if we turn clockwise to reach this point
    while count stack > 1 and ccw(next_to_top(stack), top(stack), point) <= 0:
        pop stack
    push point to stack
end
*/
export default function graham(points){
    console.log("here")
    let newPoints = points.slice();

    let stack = []

    let centroid = findLowestLeftmost(newPoints);
    sortAccordingToCentroid(newPoints, centroid);
    
    for (const point of newPoints){
        while (stack.length > 1 && !left(stack[stack.length -2], stack[stack.length - 1], point)){
            stack.pop()
        }
        stack.push(point)
    }

    return [stack, []];
}
/*
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
    let n = newPoints.length;

    let hull = [newPoints[rightMostIndex]]
    let cur = rightMostIndex;
    let previous = (cur-1) % n

    let f = false
    let i = cur;
    //TODO
    while ((cur + 1)%n != rightMostIndex  || f){
        let next = (i+1) % n;
        let nextNext = (i+2) % n;
        
        console.log(next, nextNext, newPoints)
        if (left(newPoints[i], newPoints[next], newPoints[nextNext])){
            hull.push(newPoints[next])
        } else{
            hull.pop()   
        }
        i += 1;
    }


    return [hull, []];
}
*/
function findLowestLeftmost(points) {
    let leftmost = points[0]
    let j = 0;

    for (let i = 1; i < points.length; i++){
        if (points[i][0] < leftmost[0]){
            leftmost = points[i]
            j = i; 
        }
        else if (points[i][0] == leftmost[0] && points[i][1] < rightMost[1]){
            leftmost = points[i];
            j = i;
        }
    }

    return j;
}
function lexicographicSort(points) {
    let pointsCopy = points.slice();

    //Sort according to x, then y(to break up the ties).
    pointsCopy.sort((a, b) => a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);

    return pointsCopy;
}

function crossProduct(p1, p2, p3) {
    console.log(p1, p2, p3)
    return (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]);
    //return p1[0]*p2[1] + p3[0]*p1[1] + p2[0]*p3[1] - p3[0]*p2[1] - p1[0]*p3[1] - p2[0]*p1[1];
}

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
}

function sortAccordingToCentroid(points, centroid){
    points.sort((a, b) => {
        let angle = crossProduct(centroid, a, b);

        return angle == 0 ? -(distance(centroid, a) - distance(centroid, b)) : -angle;
    })
    
    /*
    let newPoints = []

    let i = 0;
    while (i < points.length){
        newPoints.push(points[i])
        while (i < points.length -1  && crossProduct(centroid, points[i], points[i+1]) === 0){
            i += 1
        } 
        i += 1
    }

    points = newPoints;*/
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


function left(p1, p2, p3) {
    return crossProduct(p1, p2, p3) > 0;
}

/*
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

    let n = newPoints.length;

    let i = (rightMostIndex + 1) % n;

    //TODO
    while (i != rightMostIndex && (i+1) % n != rightMostIndex){
        console.log(hull)
        let next = (i+1) % n;

        if (left(hull[hull.length-1], newPoints[i], newPoints[next])){
            hull.push(newPoints[next])
        } else{
            hull.pop()   
        }
        i = next;
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


function left(p1, p2, p3) {
    return crossProduct(p1, p2, p3) > 0;
}
*/