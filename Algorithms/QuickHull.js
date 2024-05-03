import { generatePointsUniform } from "../Helper/Distributions.js";
import {onOrLeft, right, det} from "./Geometry.js";

let EPSILON = 0.01;


export default function quickhull(points)
{ 
    let l0 = findPointWithMinX(points);
    let r0 = [l0[0], l0[1]-EPSILON];

    let result = quickhullContinuation(points, l0, r0);

    return removePoint(result, r0);
}

function quickhullContinuation(S, l, r){
    if (S.length < 2){
        return S;
    }
    //S === {l, r} represented in code
    if (S.length === 2 && ((pointEquals(S[0], l) && pointEquals(S[1], r)) || (pointEquals(S[1], l) && pointEquals(S[0], r)))){
        return [l, r];
    } else{
        let h = furthest(S, l, r);

        let S1 = pointsToTheLeft(S, l, h);
        let S2 = pointsToTheLeft(S, h, r);
        
        //QUICKHULL(S(1), l, h) + (QUICKHULL(S(2), h, r) -h)
        return quickhullContinuation(S1, l, h).concat(removePoint(quickhullContinuation(S2, h, r), h));
    }
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
    return arr.filter((point) => onOrLeft(p, q, point))
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
        
        if (curPoint[0] < minPoint[0]){
            minPoint = curPoint;
        }
    }

    return minPoint;
}


function pointEquals(p, q){
    return (p[0] === q[0] && p[1] === q[1]);
}


let testVal = generatePointsUniform(5, 10);
console.log(quickhull(testVal))