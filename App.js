import {generatePointsGuassian, generatePointsUniform} from "./Helper/Distributions.js";
//import { quickhull, graham, mergehull, jarvis } from "./Algorithms/Algorithms.js";
import {quickhull, graham, mergehull, jarvis} from "./Algorithms/Algorithms.js";

import Graphical from "./Graphical/Graphical.js";

export default class App{
    points;
    hull;
    algorithm;
    animated;
    constructor(){
        this.points = new Set();
        this.hull = [];
        this.algorithm = graham;

        this.animated = false; //in animated mode
        this.animationPlaying = false; //animation is playing(not paused)
        this.frames = []; //we will get this from the algorithm function

        this.graphical = new Graphical();

        this.tool = "pen";

        this.initUI();

        this.graphical.drawCoordinateSystem();
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

    lastFrame
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
        //Draw every point on screen
        let points = arrayifySet(this.points);

        //Set current point as that last point
        let currentPoint = frame[frame.length - 1];
        

        //Set incomplete line as the last line of the hull
        let incompleteLine =  frame.slice(-2)

        //Set completeLines as the rest of the lines
        let completeLines
        if (frame.length > 1){
            completeLines = frame.slice(0, -1)
        }



        this.graphical.render(points, currentPoint, incompleteLine, completeLines, this.coordinateSystemOn)  

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
    addPoints(points){
        points.forEach((point) => this.points.add(encode(point)))

        this.calculateHull();
    }

    calculateHull(){
        if (this.points.size >= 2){
            if (this.points.size == 2 && this.currentPoint.length == 0) { return; }
            let arr = arrayifySet(this.points);
            if (this.currentPoint.length > 0){
                arr.push(this.currentPoint)
            }
            const [hull, frames] = this.algorithm(arr, this.points.size)
            this.hull = hull;
            this.frames = frames;

        }
    }

    /*
    findHull(){
        if (!this.animated && this.points.length >= 3){
            this.hull = this.algorithm(this.points, this.points.length)
            this.graphical.drawHull(hull)
        }

        this.graphical.render();
    }*/
    generateGaussian(){
        this.addPoints(generatePointsGuassian(1000, 1));
        this.render();
    }
    generateUniform(){
        this.addPoints(generatePointsUniform(1000, 1));
        this.render();
    }

    render(){
        this.graphical.render(arrayifySet(this.points), this.currentPoint, this.incompleteLine, this.hull, this.coordinateSystemOn)  
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


    mousedownHandler(event, clipCoords){    

        let clipCoordsOriginal = clipCoords;
        clipCoords = this.calcDotPlacement(clipCoords);

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


    mousemoveHandler(event, clipCoords){

        let clipCoordsOriginal = clipCoords;
        clipCoords = this.calcDotPlacement(clipCoords);

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

    mouseupHandler(event, clipCoords){

        let clipCoordsOriginal = clipCoords;
        clipCoords = this.calcDotPlacement(clipCoords);

        switch (this.action){
            //Nothing
            case "": return; 


            //Dot placement
            case "DOT": 
                this.currentPoint = [];

                this.addPoints([clipCoords])
                this.calculateHull();

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

    clearScreen(){
        this.points = new Set();
        this.hull = [];
        this.state = [];
        this.handleSkipforward();
    }


    initUI(){
        document.getElementById("startAnimation").addEventListener(("click"), () => this.handleStartAnimation());
        document.getElementById("pauseAnimation").addEventListener(("click"), () => this.handlePauseAnimation());
        document.getElementById("continueAnimation").addEventListener(("click"), () => this.handleContinueAnimation());
        document.getElementById("skipForward").addEventListener(("click"), () => this.handleSkipforward());
        document.getElementById("+speed").addEventListener(("click"), () => this.increaseAnimationSpeed());
        document.getElementById("-speed").addEventListener(("click"), () => this.decreaseAnimationSpeed());

    
        document.getElementById("generateGaussian").addEventListener("click", () => this.generateGaussian());
        document.getElementById("generateUniform").addEventListener("click", () => this.generateUniform());
        document.getElementById("clear").addEventListener("click", () => this.clearScreen());
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

}

function encode(arr){
    return JSON.stringify(arr);
}

function decode(strArr){
    let arr = []
    strArr.forEach((str) => arr.push(JSON.parse(str)))
    return arr
}

function arrayifySet(set){
    return decode([...set])
}