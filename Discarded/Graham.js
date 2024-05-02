import DCLL from "../DS/DCLL.js";
import { findLowestAndHighest } from "./Utility.js";

export default function graham(pointsArr){
    //Find centroid, sort according to centroid
    let centroid = findCentroid(pointsArr);
    let points = sortAccordingToCentroid(pointsArr, centroid);

    //Turn into list
    let hullList = new DCLL(points);

    //Find lowest leftmost in list
    let start = hullList.head;
    let cur = start;
    while (cur !== hullList.head){
        let curContents = cur.contents;
        let startContents = start.contents;

        if (curContents[1] < startContents[1]){
            start = cur;
        }
        else if (curContents[1] === startContents[1] && curContents[0] < startContents[0]){
            start = cur;
        }

        cur = cur.next;
    }

    let v = start;
    let w = v.prev;
    let f = false;

    while (v.next !== start || f == false){
        if (v.next = w){
            f = true;
        }

        if (left(v.contents, (v.next).contents, ((v.next).next).contents)){
            v = v.next;
        } else {
            //Delete v.next
            v.next = (v.next).next;
            ((v.next).next).prev = v;

            //Backtrack
            v = v.prev;
        }
    }

    /*
    let start = findLowestLeftmost(points);
    let centroid = findCentroid(points);

    console.log(points);
    points = sortAccordingToCentroid(points, centroid);
    console.log(points);

    let hull = [];
    let n = 0;

    //return [hull, []]
    //console.log(points);
    for (const point of points){
        n = hull.length;

        while (n > 1 && !left(hull[n-2], hull[n-1], point)){
            hull.pop()
        }
        hull.push(point);
    }
    */

    //Arrayify manually starting with "start"
    let hullArray = [start.contents]
    cur = start.next;

    while (cur != start){
        hullArray.push(cur.contents)
        cur = cur.next
    }

    return [hullArray, []]
}

function prev(points, i){
    let n = points.length;

    return (i-1+n) % n
}

function next(points, i){
    let n = points.length;

    return (i+1) % n
}

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

function crossProduct(p1, p2, p3) {
    return det(p1, p2, p3);
}

function det(p1, p2, p3) {
    let x0, x1, x2, y0, y1, y2;

    [x0, y0] = p1;
    [x1, y1] = p2;
    [x2, y2] = p3;

    return x0*y1 + x2*y0 + x1*y2 - x2*y1 - x0*y2 - x1*y0;
}

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
}

function sortAccordingToCentroid(points, centroid){
    //const [lowest, highest] = findLowestAndHighest(points);

    //TODO split into two and sort

    return points.sort((a, b) => {
        /*
        We have a line centroid-a-b.
        For b to come after a, this has to be a left turn. In this case we return minus.
        If crossProduct(centroid, a ,b ) = 0, however, the one with the smallest distance from centroid should come first
        */

        let angle = left(centroid, a, b) ? 1 : 0;

        return angle == 0 ? -(distance(centroid, a) - distance(centroid, b)) : angle;
    })
    

}

function findCentroid(points){
    let centroid = points.reduce((sumOfPoints, point) => {
        return [sumOfPoints[0] + point[0], sumOfPoints[1] + point[1]];
    }, [0.0, 0.0])

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