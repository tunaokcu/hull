import { centroid, pointIsInside } from '../Helper/Geometry.js';
import { grahamScan } from "./Graham.js";
import { absolutexAngle, negativexAngle, positivexAngle } from "./Jarvis.js";
import quickhull from "./QuickHull.js";

//The number of points for which mergehull calls a convex hull algorithm
const BASE_CASE = 4;
const HULL_ALGORITHM = quickhull;

export default function mergehull(points){
    let n = points.length; 

    if (n <= BASE_CASE){
        let hull, frames;
        [hull, frames] = HULL_ALGORITHM(points);
        console.log(hull);
        return hull;
    }

    return [];
    console.log("why here?")
    let arrSize = Math.ceil(n/2);

    //Divide up into [0, arrSize-1] and [arrSize, n]
    let arr1 = points.slice(0, arrSize);
    let arr2 = points.slice(arrSize, n);

    return merge(mergehull(arr1), mergehull(arr2));
}

//TODO we need to have split hulls appear at the same time
function merge(a, b){
    let hull1, hull2;
    let mergedHull, mergedFrames;

    mergedHull = [];

    hull1 = a;
    hull2 = b;

    //A point inside hull1
    let p1 = centroid(hull1);

    //Is the point inside hull2 as well?
    console.log(pointIsInside(p1, hull2))
    mergedHull = pointIsInside(p1, hull2) ? mergeInside(hull1, p1, hull2) : mergeOutside(hull1, p1, hull2);

    //Graham scan
    let finalHull = grahamScan(mergedHull);

    return finalHull;
}

function mergeInside(hull1, p1, hull2){
    //Then vertices occur in sorted angular order about p1
    //Start by finding the first negative x angle of each hull
    let mergedHull = [];
    let start1, end1;
    let start2, end2;

    //Find smallest positive angles
    start1 = findIndexOfFirstPositiveAngle(hull1, p1);
    start2 = findIndexOfFirstPositiveAngle(hull2, p1);

    end1 = start1;
    end2 = start2;
    
    let pointer1 = start1;
    let pointer2 = start2;
    let hull1Finished = false;
    let hull2Finished = false;

    while (!hull1Finished && !hull2Finished){
        if (absolutexAngle(p1, hull1[pointer1]) <= absolutexAngle(p1, hull2[pointer2])){
            mergedHull.append(hull1[pointer1]);
            pointer1 = advancePointer(pointer1, hull1);

            if (pointer1 == end1){
                hull1Finished = true;
                break;
            }
        } else {
            mergedHull.append(hull2[pointer2]);
            pointer2 = advancePointer(pointer2, hull2);
    

            if (pointer2 == end2){
                hull2Finished = true;
                break;
            }
        }
    }

    while (!hull1Finished){
        mergedHull.append(hull1[pointer1]);
        pointer1 = advancePointer(pointer1, hull1);

        if (pointer1 == end1){
            hull1Finished = true;
            break;
        }
    }

    while (!hull2Finished){
        mergedHull.append(hull2[pointer2]);
        pointer2 = advancePointer(pointer2, hull2);

        if (pointer2 == end1){
            hull2Finished = true;
            break;
        }
    }
    
    console.log(mergedHull);
    return mergedHull;
}

function advancePointer(pointer, hull){
    return (pointer + 1) % hull.length;
}

function mergeOutside(hull1, p1, hull2){

}

function findIndexOfFirstPositiveAngle(hull, origin){
    if (positivexAngle(origin, hull[0]) == 0){
        return 0;
    }

    //Start is positive, go left 
    else if(positivexAngle(origin, hull[0]) > 0){
        let last = 0;

        for (let i = hull.length-1; i >= 0; i--){
            let negativity = negativexAngle(origin, hull[i]);

            if (negativity > 0) {
                return last;
            } else if (negativity == 0){
                return i;
            }

            last = i;
        }
    }
    //Start is negative, go right
    else{
        let last = 0;

        for (let i = 0; i < hull.length; i++){
            let positivity = positivexAngle(origin, hull[i]);

            if (positivity > 0) {
                return last;
            } else if (positivity == 0){
                return i;
            }

            last = i;
        }
    }
}
