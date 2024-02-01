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
        this.points = [];
        this.hull = [];
        this.algorithm = jarvis;

        this.animated = false;
        this.animationPlaying = false;
        this.paused = false;

        this.graphical = new Graphical();

        this.tool = "pen";
    }

    toggleAnimated(){ this.animated = !this.animated; }

    replayAnimation(){ 
        if (!this.animated){ throw Error("The replay animation button should not be visible.")}
        //TODO the rest
    }
    togglePause(){
        if (!(this.animated && this.animationPlaying)){ throw Error("The pause toggle button should not be visible.")}
        //TODO the rest
    }

    replaceLastPoint(point){
        //Pop last point
        this.points.pop();
        this.graphical.eraseLastPoint();

        //Everything else is standard
        this.addPoints([point]);
        
    }

    //Input is an array of points. Each point is a 2D array of xy coordinates.
    addPoints(points){
        this.points = this.points.concat(points);
        this.graphical.drawPoints(points);

        if (!this.animated && this.points.length >= 3){
            let hull = this.algorithm(this.points, this.points.length)
            this.graphical.drawHull(hull)
        }

        console.log("here")
        this.graphical.render();

    }

    findHull(){
        if (!this.animated && this.points.length >= 3){
            let hull = this.algorithm(this.points, this.points.length)
            this.graphical.drawHull(hull)
        }

        this.graphical.render();
    }
    generateGaussian(){
        this.addPoints(generatePointsGuassian(1000, 1));
    }

    mousedown = false;

    mousedownHandler(event, clipCoords){
        switch(this.tool){ 
            case "pen":
                this.addPoints([clipCoords])
                this.mousedown = true;
                break;
            case "cursor":

                break;
        }
    }
    mousemoveHandler(event, clipCoords){
        switch(this.tool){ 
            case "pen":
                if (this.mousedown){
                    this.replaceLastPoint(clipCoords)
                }
                break;
            case "cursor":

                break;
        }
    }
    mouseupHandler(event, clipCoords){
        switch(this.tool){ 
            case "pen":
                this.addPoints([clipCoords])
                this.mousedown = false;
                break;
            case "cursor":

                break;
        }
    }

}