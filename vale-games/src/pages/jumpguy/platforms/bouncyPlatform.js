import Platform from "./platform";
import { CANVAS } from "../constants";

class BouncyPlatform extends Platform {
    #y;
    #bounceMultiplier;

    constructor(x, y, bounceMultiplier = 1.86) {
        super(x, y);
        this.#bounceMultiplier = bounceMultiplier;
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
            guyRef.jump(this.#bounceMultiplier);
        }
    }

    draw (context) {
        context.fillStyle = "green";
        context.fillRect(this._x, this._y, this._width, this._height);
    }
}

export default BouncyPlatform;