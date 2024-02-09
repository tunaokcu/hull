import jarvis, {negativexAngle, positivexAngle} from "./Jarvis.js"

window.onload = () => {
    /*
    (0, 3)
    (4, 4)
    (3, 1)
    (0, 0) 
    */


    
    //console.log(positivexAngle([0, 0], [-1, 1]))
    //console.log(negativexAngle([0,0], [-1, -1])) //should be pi / 4
    //console.log(positivexAngle([0, 0], [-1, 0.1]));
    console.log("expected: ", Math.PI * 3/4, " result: ", negativexAngle([0, 0], [1, -1]))
    console.log("expected: ", Math.PI, " result: ", negativexAngle([0, 0], [1, 0]))
    console.log("expected: ", 0, " result: ", negativexAngle([0, 0], [-1, 0]))
    console.log("expected: ", Math.PI / 2, " result: ", negativexAngle([0, 0], [0, -1]))


    console.log("expected: ", Math.PI * 3/4, " result: ", positivexAngle([0, 0], [-1, 1]))
    console.log("expected: ", Math.PI, " result: ", positivexAngle([0, 0], [-1, 0]))
    console.log("expected: ", 0, " result: ", positivexAngle([0, 0], [1, 0]))
    console.log("expected: ", Math.PI / 2, " result: ", positivexAngle([0, 0], [0, 1]))

    console.log(positivexAngle([0, 0], [-1,-1]))

}

function positiveVsNegativeTest(){
    let caseVsExpected = [
        {case: [[0, 0], [1, 1]], expected: Math.PI/4},
        {case: [[0, 0], [0, 1]], expected: Math.PI / 2},
        {case: [[0, 0], [1, 0]], expected: 0},
        {case: [[0, 0], [-1, 1]], expected: 3*Math.PI / 4},
        {case: [[0, 0], [-1, -1]], expected: 3*Math.PI / 2}

    ]

    for (const test of caseVsExpected){
        console.log(positivexAngle(...test.case), test.expected)
        console.log(negativexAngle(...test.case), test.expected)
        console.log("----");
    }
}

function positiveTest(){
    let caseVsExpected = [
        {case: [[0, 0], [1, 1]], expected: Math.PI/4},
        {case: [[0, 0], [0, 1]], expected: Math.PI / 2},
        {case: [[0, 0], [1, 0]], expected: 0},
        {case: [[0, 0], [-1, 1]], expected: 3*Math.PI / 4},
        {case: [[0, 0], [-1, -1]], expected: 3*Math.PI / 2}

    ]

    for (const test of caseVsExpected){
        console.log(positivexAngle(...test.case), test.expected)
    }
}

function negativeTest3(){
    console.log(negativexAngle([-1, -1], [-1, 0.8]))
}

function jarvisTest(){
    let testValues = [[0, 3], [1, 1], [2, 2], [4, 4], [0, 0], [1, 2], [3, 1], [3, 3]]
    console.log(jarvis(testValues)[0]);
    console.log("(0, 3) (4, 4) (3, 1) (0, 0)");
    console.log(jarvis(testValues)[0]);

}
function negativeTest(){
    let caseVsExpected = [
        {case: [[0, 0], [-1, -1]], expected: Math.PI/4},
        {case: [[0, 0], [0, 1]], expected: 3 * Math.PI / 2 },
        {case: [[0, 0], [-1, 0]], expected: 0},
        {case: [[0, 0], [1, -1]], expected: 3*Math.PI / 4},
        {case: [[0,0], [1,0]], expected:Math.PI}
    ]

    for (const test of caseVsExpected){
        console.log(negativexAngle(...test.case), test.expected)
    }
}

function negativeTest2(){
    console.log(negativexAngle([0, 0], [1, -1]));
    console.log(negativexAngle([0, 0], [1.2, -1])); //should be more
    console.log(negativexAngle([0, 0], [1.2, -0.8])); //should be more

}