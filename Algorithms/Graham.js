import {left, right} from './Geometry.js';

export default function graham(points){
    if (points.length < 3) return;

    let leftmost = points[0];
    for (let i = 1; i < points.length; i++){
        if (points[i][0] < leftmost[0]){
            leftmost = points[i];
        }
    }

    let rightmost = points[0];
    for (let i = 1; i < points.length; i++){
        if (points[i][0] > rightmost[0]){
            rightmost = points[i];
        }
    }

    let above = [];
    let below = [];

    for (let i = 0; i < points.length; i++){
        if (left(leftmost, rightmost, points[i])){
            above.push(points[i]);
        } else if (right(leftmost, rightmost, points[i])){
            below.push(points[i]);
        }
    }
    above.push(rightmost);
    below.push(leftmost);
    above.sort((a, b) => a[0] - b[0]);
    below.sort((a, b) => b[0] - a[0]);

    let upperhull = [leftmost, above[0]];
    for (let i = 1; i < above.length; i++){
        while (upperhull.length >= 2 && left(upperhull[upperhull.length - 2], upperhull[upperhull.length - 1], above[i])){
            upperhull.pop();
        }
        upperhull.push(above[i]);
    }

    let lowerhull = [rightmost, below[0]];
    for (let i = 1; i < below.length; i++){
        while (lowerhull.length >= 2 && left(lowerhull[lowerhull.length - 2], lowerhull[lowerhull.length - 1], below[i])){
            lowerhull.pop();
        }
        lowerhull.push(below[i]);
    }

    return [upperhull.concat(lowerhull), []];
}