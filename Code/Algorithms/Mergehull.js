import { centroid, distance, pointIsInside } from '../Helper/Geometry.js';
import { grahamScan } from "./Graham.js";
import { absolutexAngle, negativexAngle, positivexAngle } from "./Jarvis.js";
import quickhull from "./QuickHull.js";

//The number of points for which mergehull calls a convex hull algorithm
const BASE_CASE = 10;
const HULL_ALGORITHM = quickhull;

export default function mergehull(points){
    let n = points.length; 

    if (n <= BASE_CASE){
        return HULL_ALGORITHM(points);
    }

    let arrSize = Math.ceil(n/2);

    //Divide up into [0, arrSize-1] and [arrSize, n]
    let arr1 = points.slice(0, arrSize);
    let arr2 = points.slice(arrSize, n);

    return merge(mergehull(arr1), mergehull(arr2));
}

//TODO we need to have split hulls appear at the same time
function merge(a, b){
    let hull1, hull2, frames1, frames2;
    let mergedHull, mergedFrames;

    mergedHull = [];
    mergedFrames = [];

    [hull1, frames1] = a;
    [hull2, frames2] = b;

    //TODO
    //A point inside hull1
    let p1 = centroid(hull1);

    //Is the point inside hull2 as well?
    if (pointIsInside(p1, hull2)){
        //Then vertices occur in sorted angular order about p1
        //Start by finding the first negative x angle of each hull
        let start1, end1;
        let start2, end2;

        start1 = findIndexOfFirstNegativeAngle(hull1, p1);
        start2 = findIndexOfFirstNegativeAngle(hull2, p1);


        end1 = start1;//(start1 + hull1.length -1) % hull1.length;
        end2 = start2;//(start2 + hull2.length -1) % hull2.length;

        let pointer1 = start1;
        let pointer2 = start2;
        let advancingPointer1 = false;
        let advancingPointer2 = true;
        let hull1Finished = false;
        let hull2Finished = false;

        //First occuring one in CCW
        if (absolutexAngle(p1, hull1[start1]) < absolutexAngle(p1, hull2[start2])){
            advancingPointer1 = true;
            advancingPointer2 = false;
        }

        //!If after advancing a pointer we reach start, we have finished iterating through that hull.
        while (!hull1Finished && !hull2Finished){
            if (absolutexAngle(p1, hull1[pointer1]) < absolutexAngle(p1, hull2[pointer2])){
                mergedHull.append(hull1[pointer1]);

                pointer1 = (pointer1 + 1) % hull1.length;

                if (pointer1 == end1){
                    hull1Finished = true;
                    return;
                }
            }
            else if (absolutexAngle(p1, hull1[pointer1]) > absolutexAngle(p1, hull2[pointer2])){
                mergedHull.append(hull2[pointer2]);

                pointer2 = (pointer2 + 1) % hull2.length;

                if (pointer2 == end2){
                    hull2Finished = true;
                    return;
                }
            }
            //Angles equal so advance farthest
            else{
                if (distance(p1, hull1[pointer1]) > distance(p2, hull2[pointer2])){
                    mergedHull.append(hull1[pointer1]);

                    pointer1 = (pointer1 + 1) % hull1.length;

                    if (pointer1 == end1){
                        hull1Finished = true;
                        return;
                    }   
                } else {
                    mergedHull.append(hull2[pointer2]);

                    pointer2 = (pointer2 + 1) % hull2.length;
    
                    if (pointer2 == end2){
                        hull2Finished = true;
                        return;
                    }
                }
            }
        }

        if(!hull1Finished){
            while (pointer1 != end1){
                mergedHull.append(hull1[pointer1]);
                pointer1 = (pointer1 + 1) % hull1.length;
            }
        }else if(!hull2Finished){
            while (pointer2 != end1){
                mergedHull.append(hull2[pointer2]);
                pointer2 = (pointer2 + 1) % hull2.length;
            }
        }
    } else {
        //TODO
    }

    //TODO graham scan
    let finalHull = grahamScan(mergedHull);

    return [finalHull, []]
}

function findIndexOfFirstNegativeAngle(hull, origin){
    for (let i = 0; i < hull.length; i++){
        if (positivexAngle(origin, hull[i]) <= 0){
            return i;
        }
    }
}