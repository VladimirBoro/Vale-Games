import { CANVAS, PLATFORM } from "../constants";

class Platform {
    constructor(x, y) {
        this._x = x;
        this._y = y;

        this._width = PLATFORM.width;
        this._height = PLATFORM.height;
    }

    get y() {
        return this._y;
    }

    update (speed, guyRef, deletePlatform) {

        if (this._y > CANVAS.height) {
            deletePlatform();
        }
        
        // slide er down same speed as guy's y speed
        if (!guyRef.falling) {
            this._y -= speed;
        }

        if (guyRef.falling && this.collide(guyRef)) {
            guyRef.jump();
        }
    }

    collide (guyRef) {
        let guyCoords = guyRef.getAreaCoords();

        let isAtHeight = (guyCoords.y + guyCoords.height) >= this._y && guyCoords.y < this._y;
        let isInPlatformBounds = (guyCoords.x + guyCoords.width) > this._x && guyCoords.x < (this._x + this._width);

        return isAtHeight && isInPlatformBounds;
    }

    draw (context) {
        context.fillStyle = "white";
        context.fillRect(this._x, this._y, this._width, this._height);
        context.strokeRect(this._x, this._y, this._width, this._height);
    }
}

export default Platform;