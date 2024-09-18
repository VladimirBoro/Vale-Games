import Platform from "./platform";
import { CANVAS } from "../constants";

class MovingPlatform extends Platform {
    constructor(x, y, stage, slideSpeed = 1) {
        super(x, y,);
        this._slideSpeed = slideSpeed;
        this._direction = 1;
        this.stage = stage;
    }

    update (speed, guyRef, deletePlatform) {
        super.update(speed, guyRef, deletePlatform);

        if ((this._x <= 0) || (this._x >= CANVAS.width - this._width)) {
            this._direction *= -1;
        }

        // console.log(this._slideSpeed);
        let multiplier = 1 + (this.stage / 10);
        this._x += this._slideSpeed * this._direction * multiplier;
    }

    draw (context) {
        context.fillStyle = "skyblue";
        context.fillRect(this._x, this._y, this._width, this._height);
    }
}

export default MovingPlatform;