import { CANVAS } from "./constants";

export class Pipe {
    constructor(width, gapSize, position, speed, onDestroy) {
        this.width = width;
        this.gapSize = gapSize;
        this.position = position;
        this.speed = speed;
        this.onDestroy = onDestroy;

        this.height = CANVAS.height;
        this.scored = false;
    }

    // ignore birdycoords for now
    update(birdy) {
        this.position.x -= this.speed;

        if (this.collision(birdy)) {
            birdy.hitPipe();
        }

        // destroy this object!
        if (this.position.x < -this.width) {
            this.onDestroy();
        }
    }

    score(birdy) {
        const birdyTopLeft = birdy.getPosition();
        if (birdyTopLeft.x > this.position.x + this.width && birdyTopLeft.y > 0 && this.scored === false) {
            this.scored = true;
            return true;
        }

        return false;
    }

    collision(birdy) {
        const birdyTopLeft = birdy.getPosition();
        const birdyBottomRight = {x: birdyTopLeft.x + birdy.getSize().width, y: birdyTopLeft.y + birdy.getSize().height};

        // TOP COLUMN COLLISION
        const topColumnTopLeft = {x: this.position.x, y: this.position.y - this.height - this.gapSize};
        const topColumnBottomRight = {x: this.position.x + this.width, y: this.position.y - this.gapSize};
        if (!((birdyTopLeft.x >= topColumnBottomRight.x || topColumnTopLeft.x >= birdyBottomRight.x) ||
            (birdyTopLeft.y >= topColumnBottomRight.y || topColumnTopLeft.y >= birdyBottomRight.y))) {
            return true;
        }

        // BOTTOM COLUMN COLLISION
        const bottomColumnTopLeft = {x: this.position.x, y: this.position.y};
        const bottomColumnBottomRight = {x: this.position.x + this.width, y: this.position.y + this.height};
        if (!((birdyTopLeft.x >= bottomColumnBottomRight.x || bottomColumnTopLeft.x >= birdyBottomRight.x) ||
            (birdyTopLeft.y >= bottomColumnBottomRight.y || bottomColumnTopLeft.y >= birdyBottomRight.y))) {
            return true;
        }

        return false;
    }

    draw(context) {
        context.fillStyle = "darkblue";
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
        context.fillRect(this.position.x, this.position.y - this.height - this.gapSize, this.width, this.height);
    }
}