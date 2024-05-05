import { centroid, isInternalTo } from "./Geometry.js";
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

function merge(a, b){
    let hull1, hull2, frames1, frames2;

    [hull1, frames1] = a;
    [hull2, frames2] = b;

    //TODO
    let p1 = centroid(hull1);

    if (isInternalTo(p1, hull1)){

    }


}

