import Platform from "./platform";
import { CANVAS } from "../constants";

class DestroyPlatform extends Platform {
    id;
    
    constructor(x, y, id, destroy) {
        super(x, y);
        this.id = id
        this.destroy = destroy;
    }

    collide (guyRef) {
        // collision causes a self destro!
        let guyCoords = guyRef.getAreaCoords();

        let isAtHeight = (guyCoords.y + guyCoords.height) >= this._y && guyCoords.y < this._y;
        let isInPlatformBounds = (guyCoords.x + guyCoords.width) > this._x && guyCoords.x < (this._x + this._width);

        if (isAtHeight && isInPlatformBounds) {
            this.destroy(this.id);
        }

        return isAtHeight && isInPlatformBounds;
    }

    draw (context) {
        context.fillStyle = "red";
        context.fillRect(this._x, this._y, this._width, this._height);
        context.strokeRect(this._x, this._y, this._width, this._height);
    }
}

export default DestroyPlatform;