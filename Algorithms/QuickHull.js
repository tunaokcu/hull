//NOTE: the core of the code for this algorithm was taken from https://www.geeksforgeeks.org/quickhull-algorithm-convex-hull/. We did this to see how quickly we can come up with a
//prototype for the app. In the final version these algorithms will also be authored by us.
export default function quickhull(a,n)
{ 
    //let hull = new Set();
    // a[i].second -> y-coordinate of the ith point
    if (n < 3)
    {
        console.log("Convex hull not possible");
        return;
    }
 
    hull = new Set();

    
    // Finding the point with minimum and
    // maximum x-coordinate
    let min_x = 0, max_x = 0;
    for (let i=1; i<n; i++)
    {
        if (a[i][0] < a[min_x][0])
            min_x = i;
        if (a[i][0] > a[max_x][0])
            max_x = i;
    }
 
    // Recursively find convex hull points on
    // one side of line joining a[min_x] and
    // a[max_x]
    quickHull(a, n, a[min_x], a[max_x], 1);
 
    // Recursively find convex hull points on
    // other side of line joining a[min_x] and
    // a[max_x]
    quickHull(a, n, a[min_x], a[max_x], -1);
 
    
    let res = [...Array.from(hull)]
    return res;
}


 
 
// The code is contributed by Nidhi goel

// JavaScript program to implement Quick Hull algorithm
// to find convex hull.
 
// Stores the result (points of convex hull)
let hull = new Set(); 
 
// Returns the side of point p with respect to line
// joining points p1 and p2.
function findSide(p1, p2, p)
{
    let val = (p[1] - p1[1]) * (p2[0] - p1[0]) -
            (p2[1] - p1[1]) * (p[0] - p1[0]);
 
    if (val > 0)
        return 1;
    if (val < 0)
        return -1;
    return 0;
}
 
// returns a value proportional to the distance
// between the point p and the line joining the
// points p1 and p2
function lineDist(p1, p2, p)
{
    return Math.abs ((p[1] - p1[1]) * (p2[0] - p1[0]) -
            (p2[1] - p1[1]) * (p[0] - p1[0]));
}
 
// End points of line L are p1 and p2. side can have value
// 1 or -1 specifying each of the parts made by the line L
function quickHull(a, n, p1, p2, side)
{
    let ind = -1;
    let max_dist = 0;
 
    // finding the point with maximum distance
    // from L and also on the specified side of L.
    for (let i=0; i<n; i++)
    {
        let temp = lineDist(p1, p2, a[i]);
        if ((findSide(p1, p2, a[i]) == side) && (temp > max_dist))
        {
            ind = i;
            max_dist = temp;
        }
    }
 
    // If no point is found, add the end points
    // of L to the convex hull.
    if (ind == -1)
    {
        hull.add(p1);
        hull.add(p2);
        return;
    }
 
    // Recur for the two parts divided by a[ind]
    quickHull(a, n, a[ind], p1, -findSide(a[ind], p1, p2));
    quickHull(a, n, a[ind], p2, -findSide(a[ind], p2, p1));
}
 
