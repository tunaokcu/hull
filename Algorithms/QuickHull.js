import { generatePointsUniform } from "../Helper/Distributions.js";
import {onOrLeft, right, det, left} from "./Geometry.js";

let EPSILON = 0.00001;//Number.MIN_VALUE;

export default function quickhull(points)
{ 
    let l0 = findPointWithMinX(points);
    let r0 = findPointWithMaxX(points);

    let S1 = pointsToTheLeft(points, l0, r0);
    let S2 = pointsToTheLeft(points, r0, l0);

    let result = quickhullContinuation(S1, l0, r0).concat(quickhullContinuation(S2, r0, l0)).concat([l0, r0]);

    //To see if the hull is correct WHEN the dupes are eliminated
    result = [...new Set(result)];

    return [result, []]
}

function quickhullContinuation(S, l, r){
    if (S.length == 0){
        return [];
    }else{
        let h = furthest(S, l, r);

        let S1 = pointsToTheLeft(S, l, h);


        let S2 = pointsToTheLeft(S, h, r);
        

        //QUICKHULL(S(1), l, h) + (QUICKHULL(S(2), h, r) -h)
        return quickhullContinuation(S1, l, h).concat(quickhullContinuation(S2, h, r)).concat([h]);
    }
    /*
    //S === {l, r} represented in code
    if (S.length === 2 && ((pointEquals(S[0], l) && pointEquals(S[1], r)) || (pointEquals(S[1], l) && pointEquals(S[0], r)))){
        return [l, r];
    }*/

}

function furthest(points, l, r){
    let h = points[0];
    let largestArea = det(l, r, h);

    for (let i = 1; i < points.length; i++){
        let curPoint = points[i];
        let curArea = det(l, r, curPoint);

        if (curArea > largestArea){
            largestArea = curArea;
            h = curPoint;
        }
    }

    return h;
}

//Points in arr on or to the left of the line p-q
function pointsToTheLeft(arr, p, q){
    return arr.filter((point) => left(p, q, point))
}

function pointsToTheRight(arr, p, q){
    return arr.filter((point) => right(p, q, point))
}

function removePoint(points, pointToRemove){
    if (points != null && points.length > 1){
        return points.filter(point => !pointEquals(point, pointToRemove));
    }
    return points;
}

function findPointWithMinX(points){
    let minPoint = points[0];

    for (let i = 1; i < points.length; i++){
        let curPoint = points[i];
        
        if (curPoint[0] < minPoint[0] || (curPoint[0] == minPoint[0] && curPoint[1] < minPoint[1])){
            minPoint = curPoint;
        } 
    }

    return minPoint;
}

function findPointWithMaxX(points){
    let maxPoint = points[0];

    for (let i = 1; i < points.length; i++){
        let curPoint = points[i];
        
        if (curPoint[0] > maxPoint[0] || (curPoint[0] == maxPoint[0] && curPoint[1] > maxPoint[1])){
            maxPoint = curPoint;
        }
    }

    return maxPoint;
}


function pointEquals(p, q){
    return (p[0] === q[0] && p[1] === q[1]);
}
