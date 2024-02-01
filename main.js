import App from "./App.js";

let currentCanvasCoords;
let CANVAS_WIDTH, CANVAS_HEIGHT;

window.onload = () => {
    const APP = new App();

    CANVAS_WIDTH = document.getElementById("gl-canvas").width;
    CANVAS_HEIGHT = document.getElementById("gl-canvas").height;

    currentCanvasCoords = document.getElementById( "gl-canvas" ).getBoundingClientRect();    
    document.addEventListener("scroll", () => (currentCanvasCoords = document.getElementById( "gl-canvas" ).getBoundingClientRect()));

    // Dot placement, pan handler: mousedown, mousemove, mouseup
    document.addEventListener("mousedown", (e) => mousedownHandler(e, APP)); //? should be canvas
    document.addEventListener("mousemove", (e) => mousemoveHandler(e, APP)); 
    document.addEventListener("mouseup", (e) => mouseupHandler(e, APP)); //? should be canvas

    //Zoom handler
    document.addEventListener("wheel", (event) => zoomHandler(event, APP), {passive: false}); //the {passive: false} part is necessary for the zoomHandler to prevent default action
    
    //Button
    document.getElementById("findHull").addEventListener("click", () => APP.findHull());
    document.getElementById("generateGaussian").addEventListener("click", () => APP.generateGaussian());

}

function mousedownHandler(event, app){
    let clipCoords = clientToClip(event);
    if (clipCoords){
        app.mousedownHandler(event, clipCoords);
    }
}
function mousemoveHandler(event, app){
    let clipCoords = clientToClip(event);
    if (clipCoords){
        app.mousemoveHandler(event, clipCoords);
    }}
function mouseupHandler(event, app){
    let clipCoords = clientToClip(event);
    if (clipCoords){
        app.mouseupHandler(event, clipCoords);
    }}

//let intialMeasurement = 0;
function zoomHandler(event){
    if (event.ctrlKey && event.deltaY != 0){
        event.preventDefault();

        let direction = event.deltaY < 0 ? "up" : "down";
        if (direction === "up"){
            LOGICAL_DISPLAY.zoomIn();
        }
        else{
            LOGICAL_DISPLAY.zoomOut();
        }
    }
}

function clientToClip(event){
    return canvasToClip(clientToCanvas(event));
}

function clientToCanvas(event){
    //! ISSUE WITH getBoundingClientRect(): it returns VERY SLIGHTLY smaller values than it should 
    // Example: DOMRect {x: 7.997159004211426, y: 7.997159004211426, width: 899.9999389648438, height: 899.9999389648438, top: 7.997159004211426, …} instead of 8, 8, 900, 900
    // Apparently, it might have something to do with zooming in and out
    let res = [event.clientX - currentCanvasCoords.left, event.clientY - currentCanvasCoords.top]; 

    //Quick fix: it seems that we encounter this issue only when we click just outside the edge anyways, so this fix should work
    if (res[0] < 0 || res[1] < 0 || res[0] > CANVAS_WIDTH || res[1] > CANVAS_HEIGHT){
        return null;
    }
    return res;
}

function canvasToClip(canvasCoords){
    if (canvasCoords == null){ return null; }
   
    return [((-CANVAS_WIDTH) + 2*canvasCoords[0])/CANVAS_WIDTH,
                ((CANVAS_HEIGHT) - 2*canvasCoords[1])/CANVAS_HEIGHT]
}
