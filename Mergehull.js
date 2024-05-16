import { centroid, left, pointIsInside } from '../Helper/Geometry.js';
import { grahamScan } from "./Graham.js";
import { absolutexAngle, negativexAngle, positivexAngle } from "./Jarvis.js";
import quickhull from "./QuickHull.js";

//The number of points for which mergehull calls a convex hull algorithm
const BASE_CASE = 6;
const HULL_ALGORITHM = quickhull;


export default function mergehull(points){
    let centroidPoint = centroid(points);
    //let result = points.sort( (a,b ) => comparePoints(a, b, centroidPoint));

    return  [mergehullPoints(points), []];
}

function mergehullPoints(points){
    if (points.length <= BASE_CASE){
        let center = centroid(points);
        let sorted = points.sort( (a,b ) => comparePoints(a, b, center));
        console.log("sorted: ", sorted);
        return grahamScan2(sorted)[0];
    }

    let mid = Math.floor(points.length/2);
    let h1 = mergehullPoints(points.slice(0, mid));
    let h2 = mergehullPoints(points.slice(mid));

    return merge(h1, h2);
}

function merge(h1, h2){
    let center1 = centroid(h1);
    console.log("h1", h1);
    console.log("h2", h2);
    console.log( pointIsInside(center1, h1), pointIsInside(center1, h2));
    let merged = (pointIsInside(center1, h2)) ? mergeInside(h1, h2, center1) : mergeOutside(h1, h2, center1);
    return grahamScan2(merged)[0];
}

function mergeInside(h1, h2, center1){

    let si1 = findSmallIndex(h1, center1);
    let si2 = findSmallIndex(h2, center1);
    let  i = 0;
    let  j = 0;
    let merged = [];
    let tempPoint;
    while (i < h1.length && j < h2.length){
        let nexti = (si1 + i) % h1.length;
        let nextj = (si2 + j) % h2.length;
        if (comparePoints(h1[nexti], h2[nextj], center1) < 0){
            tempPoint = h1[nexti];
            i++;
        }else{
            tempPoint = h2[nextj];
            j++;
        }
        merged = merged.concat([tempPoint]);
    }
    while (i < h1.length){
        merged = merged.concat([h1[(si1 + i) % h1.length]]);
        i++;
    }
    while (j < h2.length){
        merged = merged.concat([h2[(si2 + j) % h2.length]]);
        j++;
    }  

 //   console.log("merged: ", merged);
    return merged;
}

function mergeOutside(h1, h2, center1){
    let minindex = 0;
    let maxindex = 0;
    let mini = h2[0];
    let maxi = h2[0];
    let h2temp;
    let i;
    for(  i = 1; i < h2.length; i++){
        if ( comparePoints(h2[i], mini, center1) < 0){
            minindex = i;
            mini = h2[i];
        }
        if ( comparePoints(h2[i], maxi, center1) > 0){
            maxindex = i;
            maxi = h2[i];
        }
    }
    if( left(mini, h2[(i+1)%h2.length], center1) > 0){
        if ( minindex > maxindex){
            h2temp = h2.slice(minindex).concat(h2.slice(0, maxindex+1));
        }else{
            h2temp = h2.slice(minindex, maxindex+1);
        }
    }else{
        if ( minindex > maxindex){
            h2temp = h2.slice(maxindex).concat(h2.slice(0, minindex+1));
        }else{
            h2temp = h2.slice(maxindex, minindex+1);
        }
    }
    return mergeInside(h1, h2temp, center1);
}

function findSmallIndex(h, center){
    for( let i = 0; i < h.length; i++){
        if ( comparePoints(h[i], h[(i+1)%h.length], center) > 0){
            return (i+1)%h.length;
        }
    }
}

function comparePoints (a, b, o){ 
    let ax = a[0] - o[0];
    let ay = a[1] - o[1];
    let bx = b[0] - o[0];
    let by = b[1] - o[1];
    if (ay >= 0 && by < 0)
        return -1;
    if (ay < 0 && by >= 0)
        return 1;
    if (ay == 0 && by == 0){
        if (ax >= 0 && bx < 0)
            return -1;
        if (ax < 0 && bx >= 0)
            return 1;
        return 0;
    }
    let det = ax * by - bx * ay;
    if (det < 0)
        return 1;
    if (det > 0)
        return -1;
    let d1 = ax * ax + ay * ay;
    let d2 = bx * bx + by * by;
    return d1 > d2 ? -1 : 1;
}


export function grahamScan2(points){
    let stack = [];

    let rightmost = points[0];
    
    let maxindex = 0;
    for(let index = 1; index < points.length; index++){
        if ( points[index][0] > rightmost[0]){
            maxindex = index;
            rightmost = points[index];
        }
    }

    let plen = points.length;
    for (let i = 0; i < points.length; i++){
        let n = stack.length;

        while (n >= 2 && !left(stack[n-2], stack[n-1], points[(i + plen + maxindex) % plen])){
            stack.pop();
            n = stack.length;
        }

        stack.push(points[(i + plen + maxindex) % plen]);
    }

    while( stack.length > 3 && !left(stack[stack.length-2], stack[stack.length-1], stack[0])){
        stack.pop();
    }

  //  console.log("stack: ", stack);

    return [stack, []];
}

