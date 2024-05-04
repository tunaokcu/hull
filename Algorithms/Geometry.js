//TODO TEST

export {onOrLeft, left, right, crossProduct, det, distance, angle}

function onOrLeft(p1, p2, p3) {
    return crossProduct(p1, p2, p3) >= 0;
}


function left(p1, p2, p3) {
    return crossProduct(p1, p2, p3) > 0;
}

function right(p1, p2, p3) {
    return crossProduct(p1, p2, p3) < 0;
}

function crossProduct(p1, p2, p3) {
    return det(p1, p2, p3);
}

function det(p1, p2, p3) {
//console.log(p1, p2, p3);
    let x0, x1, x2, y0, y1, y2;

    [x0, y0] = p1;
    [x1, y1] = p2;
    [x2, y2] = p3;

    return x0*y1 + x1*y2 + x2*y0 - x2*y1 - x0*y2 - x1*y0;
}


function distance(p1, p2) {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
}


function angle(p, q, r){
    // Calculate vectors from p to q and p to r
    const vectorPQ = [q[0] - p[0], q[1] - p[1]];
    const vectorPR = [r[0] - p[0], r[1] - p[1]];

    // Calculate dot product of the two vectors
    const dotProduct = vectorPQ[0] * vectorPR[0] + vectorPQ[1] * vectorPR[1];

    // Calculate magnitudes of the vectors
    const magnitudePQ = Math.sqrt(vectorPQ[0] ** 2 + vectorPQ[1] ** 2);
    const magnitudePR = Math.sqrt(vectorPR[0] ** 2 + vectorPR[1] ** 2);

    // Calculate the cosine of the angle between the two vectors
    const cosineTheta = dotProduct / (magnitudePQ * magnitudePR);

    // Calculate the angle in radians
    const angleInRadians = Math.acos(cosineTheta);

    return angleInRadians
}