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
  
    above.sort((a, b) => a[0] == b[0] ? b[1] - a[1] : a[0] - b[0]);
    below.sort((a, b) => b[0] == a[0] ? a[1] - b[1] : b[0] - a[0]);

    above.push(rightmost);
    below.push(leftmost);

    for(let i = 0; i < above.length - 1; i++){
        while( above[i][0] == above[i+1][0] && above[i][1] == above[i+1][1]){
            above.splice(i+1, 1);
            i--;
        }
    }

    for(let i = 0; i < below.length - 1; i++){
        while( below[i][0] == below[i+1][0] && below[i][1] == below[i+1][1]){
            below.splice(i+1, 1);
            i--;
        }
    }
    

    let upperhull = [leftmost, above[0]];
    let currentSize = 2;
    for (let i = 1; i < above.length; i++){
        while (currentSize >= 2 && left(upperhull[ currentSize - 2], upperhull[ currentSize - 1], above[i])){
            upperhull.pop();
            currentSize--;
        }
        upperhull.push(above[i]);
        currentSize++;
    }

    let lowerhull = [rightmost, below[0]];
    currentSize = 2;
    for (let i = 1; i < below.length; i++){
        while (currentSize >= 2 && left(lowerhull[ currentSize - 2], lowerhull[ currentSize - 1], below[i])){
            lowerhull.pop();
            currentSize--;
        }
        lowerhull.push(below[i]);
        currentSize++;
    }

    upperhull.pop();
    let hull = upperhull.concat(lowerhull);
    return [hull, []];
}