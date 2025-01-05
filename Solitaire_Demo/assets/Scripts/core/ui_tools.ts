import { UITransform } from "cc";
import { Size } from "cc";
import { Vec3 } from "cc";
import { Node } from "cc";

declare module "cc" {
    interface Node {
        setPositionX( x : number ) : void;
        setPositionY( y : number ) : void;
        getContentSize() : Size;
        setContentSize( size : Size) : void;
        setWidth( width : number ) : void;
        setHeight( height : number ) : void;
    }
}

Node.prototype.setPositionX = function( x : number ){
    let position = this.position
    this.position = new Vec3( x, position.y, 0 )
}

Node.prototype.setPositionY = function( y : number ){
    let position = this.position
    this.position = new Vec3( position.x, y, 0 )
}

Node.prototype.getContentSize = function(){
    let transform = this.getComponent( UITransform )
    if (transform != null) {
        return new Size( transform.width, transform.height )
    }else {
        return new Size( 0, 0 )
    }
}

Node.prototype.setContentSize = function( size : Size){
    let transform = this.getComponent( UITransform )
    if (transform != null) {
        transform.setContentSize( size )
    }
}

Node.prototype.setWidth = function (width:number) {
    let size = this.getContentSize()
    this.setContentSize( new Size(width, size.height) )
}

Node.prototype.setHeight = function (height:number) {
    let size = this.getContentSize()
    this.setContentSize( new Size(size.width, height) )
}