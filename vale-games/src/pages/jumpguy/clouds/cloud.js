import { CANVAS, CLOUD_FRAMES } from "../constants";
import cloudSprites from "../sprites/jumpguyclouds.png"

class Cloud {
    #x;
    #y;
    #cloudImage;
    #cloudType;

    constructor(x, y, cloudType) {
        this.#x = x;
        this.#y = y;

        this.#cloudImage = new Image();
        this.#cloudImage.src = cloudSprites;
        this.#cloudImage.onload = () => {console.log("clouds loaded")};

        this.#cloudType = cloudType;
    }

    getY () {
        return this.#y;
    }

    draw (context) {
        let [x,y,w,h] = CLOUD_FRAMES[this.#cloudType];
        context.save();
        context.shadowColor = "#3f51b5";
        context.shadowBlur = 150;
        this.#cloudImage.onload = () => {
            context.shadowColor = "#3f51b5";
            context.shadowBlur = 150;
            context.drawImage(this.#cloudImage, x, y, w, h, this.#x, this.#y, w, h);
        }
        context.drawImage(this.#cloudImage, x, y, w, h, this.#x, this.#y, w, h);
        context.restore();
    }

    update (speed, jumpGuy, deleteCallback) {
        if (this.#y > CANVAS.height) {
            deleteCallback();
        }

        if (!jumpGuy.falling) {
            this.#y -= speed;
        }
    }

}

export default Cloud;