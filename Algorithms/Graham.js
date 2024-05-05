import DCLL from "../DS/DCLL.js";
import { findLowestAndHighest } from "./Utility.js";

export default function graham(pointsArr){
    //Find centroid
    let centroid = centroidOfPoints(pointsCopy);

    //Shift according to centroid
    let shiftedPoints = shiftPoints(pointsArr, centroid);

    //Sort lexicographically on 1)polar angle 2)distance
    lexicographicSort(shiftedPoints);

    let pointsList = new DCLL(shiftPoints);

    
}


function shiftPoints(points, referencePoint){
    return points.map((point) => [point[0]-referencePoint[0], point[1]-referencePoint[1]])
}

//This function MUTATES the array
function lexicographicSort(points){
    /*
        A reference for JS's sort function:
        given a, b 
        return -1 if a < b 
                0 if a == b
                1 if a > b

        In our case:
            -1 if polarAngle(a) < polarAngle(b) or (polarAngle(a) == polarAngle(b) and euclideanDistance(a) < euclideanDistance(b))
            0 if polarAngle(a) == polarAngle(b) and euclideanDistance(a) == euclideanDistance(b)
            1 if polarAngle(a) > polarAngle(b)  or (polarAngle(a) == polarAngle(b) and euclideanDistance(a) > euclideanDistance(b))
    */

    let sortFunction = (a, b) => {
        if (polarAngle(a) < polarAngle(b)){
            return -1;
        }
        if (polarAngle(a) > polarAngle(b)){
            return 1; 
        }
        
        //Polar angles are equal
        if (euclideanDistance(a) < euclideanDistance(b)){
            return -1;
        }    
        if (euclideanDistance(a) > euclideanDistance(b)){
            return 1;
        }   

        //The distances are equal as well
        return 0;
    }

    //No need to return anything as we are mutating the array directly
    points.sort(sortFunction);
}      


//TODO
function polarAngle(p){
    return positivexAngle([0.0, 0.0], p);
}

function positivexAngle(start, end){
    let vectorY = end[1] - start[1];
    let vectorX = end[0] - start[0];

    return Math.atan2(vectorY, vectorX);
}


//!OBVIOUSLY WE DONT NEED SQRT FOR CORRECT COMPARISON, BUT JUST IN CASE WE END UP USING THIS SOMEWHERE ELSE
function euclideanDistance(p){
    return Math.sqrt(Math.pow(p[0], 2) + Math.pow(p[1], 2))
}