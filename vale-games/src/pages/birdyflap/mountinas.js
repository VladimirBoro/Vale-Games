import { CANVAS } from "./constants";

export class Mountains {
    constructor(image, position = CANVAS.width) {
        this.image = image;
        this.position = position;

        this.width = 1500;
        this.scrollSpeed = 0.15;
        this.spawnedNextSet = false;
    }

    scroll() {
        this.position -= this.scrollSpeed;
    }

    // mountains cutoff, time to spawn another if true.
    noImgLeft() {
        if (this.position + this.width <= CANVAS.width && !this.spawnedNextSet) {
            console.log("creating mountain!!!!", this.position,  this.width, CANVAS.width);
            this.spawnedNextSet = true;
            return true;
        }

        return false;
    }

    // image is out of view?
    timeToDestroy() {
        if (this.position + this.width <= 0) {
            console.log("destroying mountain!");
            return true;
        }

        return false;
    }

    draw(context) {
        context.drawImage(this.image, -this.position, 0, 500, 400, 0, 0, CANVAS.width, CANVAS.height);
    }
}