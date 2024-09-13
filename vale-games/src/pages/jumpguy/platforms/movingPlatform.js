import Platform from "./platform";
import { CANVAS } from "../constants";

class MovingPlatform extends Platform {
    constructor(x, y, slideSpeed = 1) {
        super(x, y,);
        this._slideSpeed = slideSpeed;
        this._direction = 1;
    }

    update (speed, guyRef, deletePlatform) {
        super.update(speed, guyRef, deletePlatform);

        if ((this._x <= 20) || (this._x >= CANVAS.width - this._width - 20)) {
            this._direction *= -1;
        }

        // console.log(this._slideSpeed);
        this._x += this._slideSpeed * this._direction;
    }

    draw (context) {
        context.fillStyle = "skyblue";
        context.fillRect(this._x, this._y, this._width, this._height);
    }
}

export default MovingPlatform;