export default function jarvis(points){
    return convexHull(points, points.length)
}

class Point 
{ 
    constructor(x, y) 
    { 
        this.x = x; 
        this.y = y; 
    } 
} 
  
// To find orientation of ordered triplet (p, q, r). 
    // The function returns following values 
    // 0 --> p, q and r are collinear 
    // 1 --> Clockwise 
    // 2 --> Counterclockwise 
function orientation(p, q, r) 
{ 
    let val = (q.y - p.y) * (r.x - q.x) - 
                  (q.x - p.x) * (r.y - q.y); 
         
        if (val == 0) return 0;  // collinear 
        return (val > 0)? 1: 2; // clock or counterclock wise 
} 
  
// Prints convex hull of a set of n points. 
function convexHull(points, n) 
{ 
    points = points.map((point) => new Point(point[0], point[1]));
    let state = [];

    
    // There must be at least 3 points 
    if (n < 3) return; 
        
    // Initialize Result 
    let hull = []; 
    let curHull = [];

    // Find the leftmost point 
    let l = 0; 
    for (let i = 1; i < n; i++) 
        if (points[i].x < points[l].x) 
            l = i; 
        
    // Start from leftmost point, keep moving  
    // counterclockwise until reach the start point 
    // again. This loop runs O(h) times where h is 
    // number of points in result or output. 
    let p = l, q; 
    do
    { 
        curHull.push(points[p]);
        state.push(curHull.map((point) => [point.x, point.y]))
        // Add current point to result 
        hull.push(points[p]); 
        
        // Search for a point 'q' such that  
        // orientation(p, q, x) is counterclockwise  
        // for all points 'x'. The idea is to keep  
        // track of last visited most counterclock- 
        // wise point in q. If any point 'i' is more  
        // counterclock-wise than q, then update q. 
        q = (p + 1) % n; 
            
        for (let i = 0; i < n; i++) 
        { 
            curHull.push(points[i])

            state.push(curHull.map((point) => [point.x, point.y]))
            curHull.pop();
            // If i is more counterclockwise than  
            // current q, then update q 
            if (orientation(points[p], points[i], points[q]) 
                                                == 2) 
                q = i; 
        } 
        
        // Now q is the most counterclockwise with 
        // respect to p. Set p as q for next iteration,  
        // so that q is added to result 'hull' 
        p = q; 
        
    } while (p != l);  // While we don't come to first  
                        // point 

    return [hull.map((point) => [point.x, point.y]), state];
} 