import Platform from "./platform";

class FalsePlatform extends Platform {
    constructor(x, y) {
        super(x, y);
    }

    collide () {
    }

    draw (context) {
        context.fillStyle = "grey";
        context.fillRect(this._x, this._y, this._width, this._height);
    }
}

export default FalsePlatform;