import Camera from "./Camera.js";
import { initShaders } from "./initShaders.js";
import { vec3, flatten } from "./MV.js";

const GL_VERTEX_SIZE = 4;
const VECTOR_DIMENSION = 2;

//We could use WebGL or plain JS canvas functions here
export default class Graphical{
    TRIAL_LINE_COLOR  = [0, 0, 1, 1];
    FINAL_LINE_COLOR =  [0.518 , 0.0, 0.678, 1];
    DOT_COLOR = [0.404, 0.929, 0.263, 1];
    DRAGGED_POINT_COLOR = [0,0,1, 0.8]
    COORDINATE_COLOR = [0, 0, 0, 1];


    BACKGROUND_COLOR = [0.992, 1, 0.961, 1.0]
    
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
        //constructor(gl, program, near=-10, far=10, radius=6, theta=0, phi=0.0,  left=-0.5, right=0.5, ytop=0.5, bottom=-0.5, at=vec3(0.0, 0.0, 0.0), up=vec3(0.0, 1.0, 0.0)){
        this.camera = new Camera(this.gl, this.program, -10, 10, 6, 0, 0.0,  -1.0, 1.0, 1.0, -1.0, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0))

        //Render offset
        //this.offset = 0;
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);


        //1D unflattened arrays
        this.points = []; 
        this.lines = []; 
        this.colors = [];
    }

    drawCoordinateSystem(){
        this.camera.keepObjectSizeConstant(this.gl);
        //Draw the lines
        let range = 0.8;

        let xLine = [[-range, 0], [range, 0]];
        let yLine = [[0, -range], [0, range]];
        let lines = [...xLine, ...yLine]

        let count = lines.length;

        //Buffer the vertices
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.vertexBuffer );
        this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(lines), this.gl.STATIC_DRAW);
        
        //Buffer the color
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.colorBuffer );
        this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten([].concat(...Array(count).fill(this.COORDINATE_COLOR))), this.gl.STATIC_DRAW);
        

        //Draw
        this.gl.drawArrays(this.gl.LINES, 0, count);


            //Draw the triangles
        let len = 0.01;
        let right = [[range, len], [range, -len], [range + 3*len, 0]]
        let left = [[-range, -len], [-range, len], [-range - 3*len, 0]]
        let up = [[len, range], [-len, range], [0, range + 3*len]]
        let down = [[-len, -range], [len, -range], [0, -range -3*len]]


        let triangles = [...right, ...left, ...up, ...down];
        count = triangles.length;
        
        //Buffer the vertices
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.vertexBuffer );
        this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(triangles), this.gl.STATIC_DRAW);
        
        //Buffer the color
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.colorBuffer );
        this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten([].concat(...Array(count).fill(this.COORDINATE_COLOR))), this.gl.STATIC_DRAW);
        

        //Draw
        this.gl.drawArrays(this.gl.TRIANGLES, 0, count);

    }

    SPLIT_FREQUENCY = 120000;
    //Points is a 2D array of points, dragged point is a single point array, incompleteLine is an array of exactly 2 points, completeLines is an array of 
    render(points=[], draggedPoint=[], incompleteLine=[], completeLines=[], coordinateSystemOn){  
        //Clear screen
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        //Draw coordinate system if it is on
        if (coordinateSystemOn){
            this.drawCoordinateSystem();
        }

        let count;


        this.camera.setMV(this.gl);
        //Draw points. Split up rendering.
        let n = points.length;
        let numOfSplits = Math.ceil(n / this.SPLIT_FREQUENCY);

        for (let i = 0; i < numOfSplits; i++){
            let start = i * this.SPLIT_FREQUENCY;
            let end = i == numOfSplits - 1 ? n : start + this.SPLIT_FREQUENCY;

            let curPoints = points.slice(start, end)
            //Buffer the vertices
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.vertexBuffer );
            this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(curPoints), this.gl.STATIC_DRAW);
            
            //Buffer the color
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.colorBuffer );
            this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten([].concat(...Array(curPoints.length).fill(this.DOT_COLOR))), this.gl.STATIC_DRAW);
            
            count = curPoints.length;

            //Draw
            this.gl.drawArrays(this.gl.POINTS, 0, count);

            // Unbind buffers
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        }

        //Draw lines
        if (completeLines.length != 0){
            //Buffer the vertices
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.vertexBuffer );
            this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(completeLines), this.gl.STATIC_DRAW);
            

            //Buffer the color
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.colorBuffer );
            this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten([].concat(...Array(completeLines.length).fill(this.FINAL_LINE_COLOR))), this.gl.STATIC_DRAW);

            count = completeLines.length;

            //Draw
            this.gl.drawArrays(this.gl.LINE_LOOP, 0, count);
            
            // Unbind buffers
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        }
        
        //Draw draggedPoint
        if (draggedPoint.length != 0){
            //Buffer the vertices
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.vertexBuffer );
            this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(draggedPoint), this.gl.STATIC_DRAW);
            
            //Buffer the color
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.colorBuffer );
            this.gl.bufferData( this.gl.ARRAY_BUFFER, (flatten(this.DRAGGED_POINT_COLOR)), this.gl.STATIC_DRAW);
            
            //Draw
            this.gl.drawArrays(this.gl.POINTS, 0, 1);

            // Unbind buffers
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        }
        //Draw incompleteLine
        if (incompleteLine.length != 0){
            if (incompleteLine[0].length != 2) {  throw Error("Line should consist of two points")}
            //Buffer the vertices
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.vertexBuffer );
            this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(incompleteLine), this.gl.STATIC_DRAW);
            
            //Buffer the color
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.colorBuffer );
            this.gl.bufferData( this.gl.ARRAY_BUFFER, (flatten(this.TRIAL_LINE_COLOR.concat(this.TRIAL_LINE_COLOR))), this.gl.STATIC_DRAW);
            
            //Draw
            this.gl.drawArrays(this.gl.LINES, 0, 2);

            // Unbind buffers
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        }
    }

    drawHull(hullLines){
        this.lines = [].concat(...hullLines)


        let n = this.lines.length * 2;
    }

    clearScreen(keep){

    }
}
