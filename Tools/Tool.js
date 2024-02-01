class Tool{
    constructor(app){
        this.app = app;
    }
    transititonInto(){

    }

    transitionOutOf(){
        
    }
}

class Cursor extends Tool{
    mouseupHandler(event, canvasCoords){
        this.app.graphical.drawPoints([canvasCoords])
        this.app.points.push(clipCoords);
    }
}

class Pen extends Tool{

}

export {Cursor, Pen}