import {flatten, vec3, mat4, lookAt, ortho, mult, rotate, translate, scale4} from "./MV.js";

//!THIS IS ORTHOGRAPHIC
export default class Camera{
    
    constructor(gl, program, near=-10, far=10, radius=6, theta=0, phi=0.0,  left=-0.5, right=0.5, ytop=0.5, bottom=-0.5, at=vec3(0.0, 0.0, 0.0), up=vec3(0.0, 1.0, 0.0)){
        this.setMatrices(near, far, radius, theta, phi, left, right, ytop, bottom, at, up);

        this.modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
        this.projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

        this.setShaderMatrices(gl);
    }

    
    keepObjectSizeConstant(gl){ return;
        console.log(this.initalMV);

        let newMV = mult(this.modelViewMatrix, scale4(1/this.currentZoom, 1/this.currentZoom, 0, 0));

        gl.uniformMatrix4fv( this.modelViewMatrixLoc, false, flatten(newMV));//flatten(this.initalMV));//flatten(mat4()));//flatten(lookAt( vec3( this.radius*Math.sin(this.theta)*Math.cos(this.phi), this.radius*Math.sin(this.theta)*Math.sin(this.phi), this.radius*Math.cos(this.theta)), this.at, this.up )) );

    }
    setMatrices(near=-10, far=10, radius=6.0, theta=0.0, phi=0.0,  left=-2.0, right=2.0, ytop=2.0, bottom=-2.0, at=vec3(0.0, 0.0, 0.0), up=vec3(0.0, 1.0, 0.0)){
        this.near = near;
        this.far = far;

        this.radius = radius;
        this.theta = theta;
        this.phi = phi;


        this.left = left;
        this.right = right;
        this.ytop = ytop;
        this.bottom = bottom;

        this.at=at;
        this.up=up;

        var eye = vec3( radius*Math.sin(theta)*Math.cos(phi), radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
        
        this.modelViewMatrix = lookAt( eye, at, up );
        this.projectionMatrix = ortho( left, right, bottom, ytop, near, far );//ortho(-10, 10, -10, 10, -100, 100);// ortho( left, right, bottom, ytop, near, far );

        this.initalMV = this.modelViewMatrix;
    }

    offsetX = 0;
    offsetY = 0;
    move(gl, vector){
        this.offsetX += vector[0]/this.currentZoom;
        this.offsetY += vector[1]/this.currentZoom;
        this.modelViewMatrix = mult(this.modelViewMatrix, translate(vector[0]/this.currentZoom, vector[1]/this.currentZoom, 0, 0));
        gl.uniformMatrix4fv( this.modelViewMatrixLoc, false, flatten(this.modelViewMatrix) );
    }
    
    updeMatrices(){
        var eye = vec3( this.radius*Math.sin(this.theta)*Math.cos(this.phi), this.radius*Math.sin(this.theta)*Math.sin(this.phi), this.radius*Math.cos(this.theta));

        this.modelViewMatrix = lookAt( eye, this.at, this.up );
        this.projectionMatrix = ortho( this.left, this.right, this.bottom, this.ytop, this.near, this.far );
    }

    setShaderMatrices(gl){
        gl.uniformMatrix4fv( this.modelViewMatrixLoc, false, flatten(this.modelViewMatrix) );
        gl.uniformMatrix4fv( this.projectionMatrixLoc, false, flatten(this.projectionMatrix) );
    }

    setProjectionMatrix(gl){
        gl.uniformMatrix4fv( this.projectionMatrixLoc, false, flatten(this.projectionMatrix) );
    }

    setMV(gl){
        gl.uniformMatrix4fv( this.modelViewMatrixLoc, false, flatten(this.modelViewMatrix) );
    }

    currentZoom = 1.0;
    #ZOOM_FACTOR = 2;

    zoomIn(gl){
        this.currentZoom *= this.#ZOOM_FACTOR;

        this.left /= this.#ZOOM_FACTOR;
        this.right /= this.#ZOOM_FACTOR;
        this.ytop /= this.#ZOOM_FACTOR;
        this.bottom /= this.#ZOOM_FACTOR;

        this.projectionMatrix = ortho( this.left, this.right, this.bottom, this.ytop, this.near, this.far );
        gl.uniformMatrix4fv( this.projectionMatrixLoc, false, flatten(this.projectionMatrix) );
    }
    zoomOut(gl){
        this.currentZoom /= this.#ZOOM_FACTOR;

        this.left *= this.#ZOOM_FACTOR;
        this.right *= this.#ZOOM_FACTOR;
        this.ytop *= this.#ZOOM_FACTOR;
        this.bottom *= this.#ZOOM_FACTOR;

        this.projectionMatrix = ortho( this.left, this.right, this.bottom, this.ytop, this.near, this.far );
        gl.uniformMatrix4fv( this.projectionMatrixLoc, false, flatten(this.projectionMatrix) );
    }

    //Angles should be in degrees, not radians.
    rotate(gl, rotateBy){
        //Rotate
        this.modelViewMatrix = mult(this.modelViewMatrix, rotate(rotateBy[0], 1, 0, 0));
        this.modelViewMatrix = mult(this.modelViewMatrix, rotate(rotateBy[1], 0, 1, 0));
        this.modelViewMatrix = mult(this.modelViewMatrix, rotate(rotateBy[2], 0, 0, 1));

        gl.uniformMatrix4fv( this.modelViewMatrixLoc, false, flatten(this.modelViewMatrix) );
    }

}
