import Camera from "./Camera.js";
import { initShaders } from "./initShaders.js";
import { vec3, flatten } from "./MV.js";

const GL_VERTEX_SIZE = 4;
const VECTOR_DIMENSION = 2;

//We could use WebGL or plain JS canvas functions here
export default class Graphical{
    TRIAL_LINE_COLOR  = [0, 0, 1, 1];
    FINAL_LINE_COLOR =  [1, 0, 0, 1];
    DOT_COLOR = [0, 1, 0, 1];

    BACKGROUND_COLOR = [0.8, 0.8, 0.8, 1.0]
    
    constructor(canvasId="gl-canvas"){
        this.initializegl(canvasId);
    }

    initializegl(canvasId){
        let canvas = document.getElementById(canvasId);
        this.gl = canvas.getContext('webgl');
        if ( !this.gl ) { alert( "WebGL isn't available" ); } 

        //Set dimensions, color
        this.gl.viewport( 0, 0, canvas.width, canvas.height );
        this.gl.clearColor( ...this.BACKGROUND_COLOR );   

        //Initialize shaders
        this.program = initShaders( this.gl, "vertex-shader", "fragment-shader" );
        this.gl.useProgram( this.program );   

        //Create and initialize vertex and color bufferS
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
            //this.gl.bufferData(this.gl.ARRAY_BUFFER, 2*GL_VERTEX_SIZE, this.gl.DYNAMIC_DRAW);

        this.vPosition = this.gl.getAttribLocation( this.program, "vPosition" );
        this.gl.vertexAttribPointer( this.vPosition, 2, this.gl.FLOAT, false, 0, 0 );
        this.gl.enableVertexAttribArray( this.vPosition );

        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
            //this.gl.bufferData(this.gl.ARRAY_BUFFER, 2*GL_VERTEX_SIZE, this.gl.DYNAMIC_DRAW);

        this.vColor = this.gl.getAttribLocation( this.program, "vColor" );
        this.gl.vertexAttribPointer( this.vColor, 4, this.gl.FLOAT, false, 0, 0 ); 
        this.gl.enableVertexAttribArray( this.vColor );

        //Set camera up
        //this.camera = new Camera(this.gl, this.program, -10, 10, 6, 0, 0.0,  -30.0, 30.0, 30.0, -30.0, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0))

        //Render offset
        //this.offset = 0;
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);


        //1D unflattened arrays
        this.points = []; 
        this.lines = []; 
        this.colors = [];
    }

    drawCoordinateSystem(){

    }

    drawTrialLine(start, finish){

    }
    
    drawFinalLine(start, finish){

    }

    eraseLastPoint(){
        this.points.pop();
        this.points.pop();
    }
    
    drawPoints(pointArray){
        //Add points to points array
        this.points = this.points.concat(...pointArray)

    }

    render(){  
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        let count;

        //Draw points and lines
        
        if (this.points.length != 0){
            //Buffer the vertices
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.vertexBuffer );
            this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(this.points), this.gl.STATIC_DRAW);
            
            //Buffer the color
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.colorBuffer );
            this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten([].concat(...Array(this.points.length/2).fill(this.DOT_COLOR))), this.gl.STATIC_DRAW);
            
            count = this.points.length / 2;


            //Draw
            this.gl.drawArrays(this.gl.POINTS, 0, count);
        
        }
        if (this.lines.length != 0){
            //Buffer the vertices
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.vertexBuffer );
            this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(this.lines), this.gl.STATIC_DRAW);
            

            //Buffer the color
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.colorBuffer );
            this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten([].concat(...Array(this.points.length/2).fill(this.FINAL_LINE_COLOR))), this.gl.STATIC_DRAW);

            count = this.lines.length/2;

            //Draw
            this.gl.drawArrays(this.gl.LINE_LOOP, 0, count);
            
        }
    }

    drawHull(hullLines){
        this.lines = [].concat(...hullLines)


        let n = this.lines.length * 2;
    }

    clearScreen(keep){

    }
}
