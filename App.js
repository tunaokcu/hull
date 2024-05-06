import {generatePointsGuassian, generatePointsUniform} from "./Helper/Distributions.js";
//import { quickhull, graham, mergehull, jarvis } from "./Algorithms/Algorithms.js";
import {quickhull, mergehull, jarvis} from "./Algorithms/Algorithms.js";
import graham from "./Algorithms/Graham.js";

import Graphical from "./Graphical/Graphical.js";
import ActionsLog from "./ActionsLog.js";
import circle from "./Helper/Circle.js";
import { load, save } from "./SaveLoadHandler.js";

const POINT_RANGE = 1;

let currentCanvasCoords;
let CANVAS_WIDTH, CANVAS_HEIGHT;

const ALGORITHMS = {
    jarvis: {
        algorithm: jarvis,
        description: `<b>Jarvis march</b>, also known as the <b>gift wrapping algorithm</b>, is an <b>O(nh)</b> time algorithm where n is the number of total points and h is the number of points on the hull. 
                        This algorithm is fast when a constant number of points are on the hull. It's worst case running time is realized when every point in the point set is on the hull. <br>
                        <b>Press c</b> to place a circle on the screen and observe this worst case running time. `,
        title: `Jarvis March`
    },
    graham: {
        algorithm: graham,
        description: `<b>Graham's scan</b> is an optimal convex hull algorithm with a running time of <b>O(nlogn)</b> where n is the number of total points.`,
        title: `Graham's scan`
    },
    quickhull: {
        algorithm: quickhull,
        description: `<b>Quickhull</b> is a convex hull algorithm inspired by quicksort with a worst case running time of <b>O(n^2)</b> where n is the number of total points. It is, however, optimal on average.`,
        title: `Quickhull`
    }
}

export default class App{
    points;
    hull;
    algorithm;
    algoName;
    animated;
    constructor(){
        this.algoName = "";

        this.points = [];
        this.hull = [];
        this.setActiveAlgorithm("graham");

        this.animated = false; //in animated mode
        this.animationPlaying = false; //animation is playing(not paused)
        this.frames = []; //we will get this from the algorithm function

        this.graphical = new Graphical();

        this.tool = "pen";

        this.initUI();

        this.graphical.drawCoordinateSystem();

        this.initHandlers();
    }

    animationDelay = 1000;
    increaseAnimationSpeed(){
        if (this.animationDelay > 10){
            this.animationDelay /= 10
        }
    }
    
    decreaseAnimationSpeed(){
        this.animationDelay *= 10
    }

    lastFrame;
    animation(frameIndex=0){ 
        this.lastFrame = frameIndex > 0 ? frameIndex-1 : 0; 
        if (!this.animated){  this.handleSkipforward();       return; } //we went back to responsive mode
        if (!this.animationPlaying) {        return}// this.lastFrame = frameIndex;            return; }

        //Animation ran to completion. Call the hull render function and return
        if (this.frames.length - 1 == frameIndex){
            this.handleSkipforward(); 
            return;
        }
        
        //Draw and request callback 
        this.animationRender(this.frames[frameIndex]);
        setTimeout(() => this.animation(frameIndex+1), this.animationDelay);

    }

    animationRender(frame){
        //Set current point as that last point
        let currentPoint = frame[frame.length - 1];
        

        //Set incomplete line as the last line of the hull
        let incompleteLine =  frame.slice(-2)

        //Set completeLines as the rest of the lines
        let completeLines
        if (frame.length > 1){
            completeLines = frame.slice(0, -1)
        }



        this.graphical.render(this.points, currentPoint, incompleteLine, completeLines, this.coordinateSystemOn)  

    }

    startAnimation(){
        if (this.points.size < 3){ 
            alert("Need at least 3 points for a polygon.")
            this.handleSkipforward();
            return false;
        }

        this.animated = true;
        this.animationPlaying = true;
        this.tool = "cursor";//Now we cannot add new points

        //Start animation
        requestAnimationFrame(() =>this.animation())
        return true
    }

    toggleAnimationPause(){ 
        this.animationPlaying = !this.animationPlaying;

        if (this.animationPlaying){
            this.animation();
        } else {
            requestAnimationFrame(() =>this.animation(this.lastFrame))
        }
    }

    skipAnimation(){
        this.calculateHull();
        this.render();

        this.animated = false;
        this.animationPlaying = false;
        this.tool = "pen";
    }

    replayAnimation(){ 
        if (!this.animated){ throw Error("The replay animation button should not be visible.")}
        //TODO the rest
    }
    

    /*
    replacePoint(point){
        //Delete last point
        console.log(this.points.delete(point));

        //Everything else is standard
        this.addPoints(point);
        
    }*/


    //Input is an array of points. Each point is a 2D array of xy coordinates.
    addPoints(addedPoints){
        //Add the points to the already existing array and calculate the new hull.
        this.points = this.points.concat(addedPoints)
        this.calculateHull();

        for (const point of addedPoints){
            this.LOG.addAction(`Added (${point[0].toFixed(2)}, ${point[1].toFixed(2)})`);
        }
    }

    //Calculate and rerender hull. Calculate frames as well.
    calculateHull(){
        //Point count is the number of points in the points array + 1 if a point is being dragged.
        let pointCount = this.points.length + (this.currentPoint.length === 0 ? 0 : 1);
        
        //Not enough to make a polygon, so return.
        if (pointCount < 3){
            return;
        }

        //! PROBABLY VERY BAD FOR PERFORMANCE: we are copying the arr before every calculation to avoid changing it. We should fix this somehow 
        let allPoints = this.points.slice();
        if (this.currentPoint.length > 0){
            allPoints.push(this.currentPoint)
        }

        // Calculate and set hull and animation frames
        [this.hull, this.frames] = this.algorithm(allPoints)
    }

    generateGaussian(event){
        event.preventDefault();

        let n = event.target.elements.gaussianNumber.value;
        let range = POINT_RANGE;

        document.getElementById("gaussianNumber").value = "";

        this.addPoints(generatePointsGuassian(n, range));
        this.render();
    }
    generateUniform(event){
        event.preventDefault();

        let n = event.target.elements.uniformNumber.value;
        let range = POINT_RANGE;

        document.getElementById("uniformNumber").value = "";


        this.addPoints(generatePointsUniform(n, range));
        this.render();
    }

    render(){
        this.graphical.render(this.points, this.currentPoint, this.incompleteLine, this.hull, this.coordinateSystemOn)  
    }

    action = ""; //can be PAN, DOT 
    mousedown = false;
    currentPoint = [];
    incompleteLine = [];
    coordinateSystemOn = true;
    lastMousePosition;

    calcDotPlacement(clipCoords){
        return  [clipCoords[0]/this.graphical.camera.currentZoom - this.graphical.camera.offsetX, clipCoords[1]/this.graphical.camera.currentZoom - this.graphical.camera.offsetY];
    }

    //TODO fix
    withinClip(clipCoords){
        return true;
        /*
        let w = 1/this.graphical.camera.currentZoom;

        let xStart =  - this.graphical.camera.offsetX;
        let xEnd = xStart + 2 * 1/*/
        return clipCoords[0] >= -1 && clipCoords[0] <= 1 && clipCoords[1] >= -1 && clipCoords[1] <= 1;
    }

    placeCircleAt(center, r = 0.5){
        this.addPoints(circle(center, r));
        this.render();
    }


    zoomIn(){
        this.graphical.camera.zoomIn(this.graphical.gl); 
        if (!this.animationPlaying){ 
            this.render()
        }
    }
    zoomOut(){
        this.graphical.camera.zoomOut(this.graphical.gl); 
        if (!this.animationPlaying){
            this.render();
        }
    }

    addPointByForm(event){
        //Prevent reload
        event.preventDefault();

        //Parse x and y 
        let x = parseFloat(event.target.elements.xCoord.value);
        let y = parseFloat(event.target.elements.yCoord.value);

        //Add point (x, y), show changes
        this.addPoints([[x, y]])
        this.render();

        //Clear the form fields after submission
        document.getElementById("xCoord").value = "";
        document.getElementById("yCoord").value = "";

    }

    clearScreen(){
        this.LOG.clearLog();
        this.LOG.addAction("Cleared screen. ");

        this.points = [];
        this.hull = [];
        this.state = [];
        this.handleSkipforward();
    }


    initUI(){
        this.LOG = new ActionsLog("actionsLog");

        document.getElementById("button-group").addEventListener("click", (event) => this.handleAlgorithmSwitch(event));

        document.getElementById("startAnimation").addEventListener(("click"), () => this.handleStartAnimation());
        document.getElementById("pauseAnimation").addEventListener(("click"), () => this.handlePauseAnimation());
        document.getElementById("continueAnimation").addEventListener(("click"), () => this.handleContinueAnimation());
        document.getElementById("skipForward").addEventListener(("click"), () => this.handleSkipforward());
        document.getElementById("+speed").addEventListener(("click"), () => this.increaseAnimationSpeed());
        document.getElementById("-speed").addEventListener(("click"), () => this.decreaseAnimationSpeed());

    
        document.getElementById("generateGaussian").addEventListener("submit", (event) => this.generateGaussian(event));
        document.getElementById("generateUniform").addEventListener("submit", (event) => this.generateUniform(event));
        document.getElementById("addPoint").addEventListener("submit", (event) => this.addPointByForm(event));
        document.getElementById("clear").addEventListener("click", () => this.clearScreen());

        this.instantiateSaveLoadButtons();
    }

    instantiateSaveLoadButtons(){
        //SAVE LOAD HANDLER INIT

        let saveLoad = document.getElementById("SaveLoad");
        let saveButton = saveLoad.getElementsByTagName("button")[0];
        let loadForm = document.getElementById("LoadForm");
    
        saveButton.addEventListener("click", () => (save(this.points, `${this.algoName}Points.txt`)));
        loadForm.addEventListener("change", (event) => (loadHandler(event, this)));
        document.getElementById("Load").addEventListener("submit", (e) => (e.preventDefault()));
    
    
        function loadHandler(event, context){
            console.log("caught")
            let file = event.target.files[0];

            event.preventDefault();
            let fr = new FileReader();
            fr.onload = () => {
                //Clear points
                context.clearScreen();

                //Log "loaded" message
                context.LOG.addAction( `Loaded ${file.name}`)
                context.addPoints(load(fr.result));
                context.calculateHull();
                context.render();
            }
    
            fr.readAsText(loadForm.files[0])
        }
    }

    
    handleStartAnimation(){
        document.getElementById("startAnimation").style.display = "none"
        document.getElementById("+speed").style.display = "inline"
        document.getElementById("-speed").style.display = "inline"
        document.getElementById("pauseAnimation").style.display = "inline"
        document.getElementById("skipForward").style.display = "inline"
        this.startAnimation();

    }
    handleContinueAnimation(){
        document.getElementById("continueAnimation").style.display = "none"
        document.getElementById("pauseAnimation").style.display = "inline"
        document.getElementById("+speed").style.display = "inline"
        document.getElementById("-speed").style.display = "inline"
        this.toggleAnimationPause();
    }
    handlePauseAnimation(){
        document.getElementById("continueAnimation").style.display = "inline"
        document.getElementById("pauseAnimation").style.display = "none"
        document.getElementById("+speed").style.display = "none"
        document.getElementById("-speed").style.display = "none"
        this.toggleAnimationPause();
    }
    handleSkipforward(){
        document.getElementById("continueAnimation").style.display = "none"
        document.getElementById("pauseAnimation").style.display = "none"
        document.getElementById("skipForward").style.display = "none"
        document.getElementById("startAnimation").style.display = "inline"
        document.getElementById("+speed").style.display = "none"
        document.getElementById("-speed").style.display = "none"
        this.skipAnimation();
    }

    initHandlers(){
        let canvas = document.getElementById("gl-canvas");

        CANVAS_WIDTH = canvas.width;
        CANVAS_HEIGHT = canvas.height;
    
        currentCanvasCoords = canvas.getBoundingClientRect();    
        document.addEventListener("scroll", () => (currentCanvasCoords = canvas.getBoundingClientRect()));
    
        //Dot placement, pan handler: mousedown, mousemove, mouseup
        canvas.addEventListener("mousedown", (e) => this.mousedownHandler(e)); 
        document.addEventListener("mousemove", (e) => this.mousemoveHandler(e)); 
        document.addEventListener("mouseup", (e) => this.mouseupHandler(e)); 
        document.addEventListener("selectstart", (e) => this.highlightHandler(e));

        //Key release handlers(circle placement)
        document.addEventListener("keyup", (e) => this.keyreleaseHandler(e));
    
        //Zoom handler
        document.addEventListener("wheel", (e) => this.zoomHandler(e), {passive: false}); //the {passive: false} part is necessary for the zoomHandler to prevent default action
        document.addEventListener("keyup", (e) => {
            if (e.keyCode == 65){
                console.log("here")
                this.handleStartAnimation()
            }
        }, false);
    
        //Prevent right click menu
        document.addEventListener('contextmenu', (e) => { 
            e.preventDefault();
          }, false);
    }

    keyreleaseHandler(event){
        //Get coords
        let clipCoords = this.mouselocationForCircle;
        this.mouselocationForCircle = clipCoords;

        if(!clipCoords){
            return;
        }

        clipCoords = [parseFloat(clipCoords[0]), parseFloat(clipCoords[1])];

        switch(event.keyCode){
            case 67: //c -> circle placement
                this.placeCircleAt(clipCoords);
        }
    }

    mousedownHandler(event){
        let clipCoords = clientToClip(event);
        this.mouselocationForCircle = clipCoords;

        if (!clipCoords){
            return;
        }


        let clipCoordsOriginal = clipCoords;
        clipCoords = this.calcDotPlacement(clipCoords);
        this.mouselocationForCircle = clipCoords;

        if (this.withinClip(clipCoords)){
            switch (event.button){
                //Left click
                case 0: 
                    //Cannot add new dots while animated
                    if (this.animated) { return; }

                    this.currentPoint = clipCoords;
                    this.calculateHull();
                    this.render();

                    this.action = "DOT"
                    clearSelection();
                    
                    break;

                //Right click
                case 2: 

                    this.action = "PAN";

                    break;

                //Anything else
                default: return;
            }
        }

        this.lastMousePosition = clipCoordsOriginal;
    }

    mousemoveHandler(event){
        let clipCoords = clientToClip(event);
        this.mouselocationForCircle = clipCoords;
        if (!clipCoords){
            return;
        }

        let clipCoordsOriginal = clipCoords;
        clipCoords = this.calcDotPlacement(clipCoords);
        this.mouselocationForCircle = clipCoords;

        switch (this.action){
            //Nothing
            case "": return; 


            //Dot placement
            case "DOT": 
                this.currentPoint = clipCoords
                this.calculateHull();
                this.render();

                break;
            
            //Panning
            case "PAN":
                let curMousePosition = clipCoordsOriginal;
                let moveVector = [curMousePosition[0] - this.lastMousePosition[0], curMousePosition[1] - this.lastMousePosition[1]]
                this.graphical.camera.move(this.graphical.gl, moveVector);
                if (!this.animationPlaying){
                    if (this.animated && this.frames) { this.animationRender(this.frames[this.lastFrame]) }
                    else { this.render() };
                }

                break;

            //Should be an error
            default: return;
        }
        

        this.lastMousePosition = clipCoordsOriginal;
    }
    mouseupHandler(event){
        event.preventDefault();
    
        let clipCoords = clientToClip(event);
        if (!clipCoords){
            return; 
        }

        let clipCoordsOriginal = clipCoords;
        clipCoords = this.calcDotPlacement(clipCoords);
        this.mouselocationForCircle = clipCoords;

        switch (this.action){
            //Nothing
            case "": return; 


            //Dot placement
            case "DOT": 
                this.currentPoint = [];

                this.addPoints([clipCoords])
                this.calculateHull();
                this.render();
                
                break;
            
            //Panning
            case "PAN":
                if (!this.animationPlaying){
                    if (this.animated && this.frames) { this.animationRender(this.frames[this.lastFrame]) }
                    else { this.render() };
                }
                break;

            //Should be an error
            default: return;
        }
        
        this.action = "";
        this.lastMousePosition = clipCoordsOriginal;
    }
    
    zoomHandler(event){
        if (event.ctrlKey && event.deltaY != 0){
            event.preventDefault();
    
            let direction = event.deltaY < 0 ? "up" : "down";
    
            if (direction === "up"){
                this.zoomIn();
            }
            else{
                this.zoomOut();
            }
        }
    }
    
    //If we are placing a dot, prevent text selection/highlighting
    highlightHandler(event){
        if (this.action === "DOT"){
            event.preventDefault();
        }
    }

    handleAlgorithmSwitch(event){
        if (event.target.tagName !== 'LABEL') {
            return;
        }
        event.stopPropagation();

        const targetId = event.target.getAttribute("for");

        this.setActiveAlgorithm(targetId);
    }

    setActiveAlgorithm(algoName){

        //Same button, not switching, do nothing
        if (this.algoName === algoName){
            return;
        }

        let buttonGroup = document.getElementById("button-group");
        let previousButton;
        if (this.algoName != ""){
            previousButton = buttonGroup.querySelector(`#${this.algoName}`);
            previousButton.checked = false;
        }

        //Get buttons
        let algorithmButton = buttonGroup.querySelector(`#${algoName}`);

        //Uncheck previous button, check new button
        algorithmButton.checked = true;

        //Set algoName
        this.algoName = algoName;

        //Set algorithm
        this.algorithm = ALGORITHMS[algoName]["algorithm"];
        
        //Recalculate and rerender(actually, no need to rerender if every algorithm works fine)
        this.calculateHull();
        //this.render();

        //Set description
        let descriptionElement = document.getElementById("algorithmInfo");
        descriptionElement.innerHTML = ALGORITHMS[algoName]["description"];

        //Set title
        let titleElement = document.getElementById("algorithmName");
        titleElement.innerHTML = "<b>" + ALGORITHMS[algoName]["title"] + "</b>";
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
    /*if (res[0] < 0 || res[1] < 0 || res[0] > CANVAS_WIDTH || res[1] > CANVAS_HEIGHT){
        return null;
    }*/
    return res;
}

function canvasToClip(canvasCoords){
    if (canvasCoords == null){ return null; }
   
    return [((-CANVAS_WIDTH) + 2*canvasCoords[0])/CANVAS_WIDTH,
                ((CANVAS_HEIGHT) - 2*canvasCoords[1])/CANVAS_HEIGHT]
}


function clearSelection() {
    var sel;
    if ( (sel = document.selection) && sel.empty ) {
        sel.empty();
    } else {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        var activeEl = document.activeElement;
        if (activeEl) {
            var tagName = activeEl.nodeName.toLowerCase();
            if ( tagName == "textarea" ||
                    (tagName == "input" && activeEl.type == "text") ) {
                // Collapse the selection to the end
                activeEl.selectionStart = activeEl.selectionEnd;
            }
        }
    }
}