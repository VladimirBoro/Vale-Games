import { CANVAS_SIZE, HOP_DIRECTIONS, HOP_DISTANCE, ANIMATIONS, GRID_DIMENSIONS } from "./contants/constants";

class Frog {
    #headDirection = 1;
    #currentLane = 0;
    #dying = false;
    #hopping = false;
    #width = CANVAS_SIZE.width / GRID_DIMENSIONS.columnCount;
    #height = CANVAS_SIZE.height / GRID_DIMENSIONS.rowCount;
    #frameIndices = {
        idle: 0,
        hopping: 0,
        dying: 0
    };
    #frameCounts = {
        idle: 0,
        hopping: 0,
        dying: 0
    };
    
    #hopDirection;
    #position;
    #spriteSheet;

    constructor (numRows, numCols, spriteSheet) {
        this.#position = {
            x: CANVAS_SIZE.width / 2, 
            y: CANVAS_SIZE.height - this.#height
        }

        this.#spriteSheet = spriteSheet;
    }

    #move(direction) {
        const divisions = ANIMATIONS.HOP.length;

        switch (direction) {
            case HOP_DIRECTIONS.LEFT:
                this.#headDirection = -1;
                this.#position.x -= HOP_DISTANCE.x / divisions;
            case HOP_DIRECTIONS.RIGHT:
                this.#headDirection = 1;
                this.#position.x += this.HOP_DISTANCE.x / divisions;
            case HOP_DIRECTIONS.UP:
                this.#position.y -= this.HOP_DISTANCE.y / divisions;
            case HOP_DIRECTIONS.DOWN:
                this.#position.y += this.HOP_DISTANCE.y / divisions;
        }
    }

    update() {
        // update froggers placement and frameIndex
        // collision happens on object's end

        if (this.#hopping) {
            this.#frameCounts.hopping++;
            this.#move(this.#hopDirection);

            if (this.#frameCounts.hopping % 10 == 0) {
                this.#frameIndices.hopping++;
            }

            if (this.#frameIndices.hopping >= ANIMATIONS.HOP.length) {
                // stop and reset
                this.#frameIndices.hopping = 0;
                this.#hopping = false;
            }
        }
        else if (this.#dying) {

        }
        else {
            // idle frames
            this.#frameCounts.idle++;

            if (this.#frameCounts.idle % 25 == 0) {
                this.#frameIndices.idle++;
                this.#frameIndices.idle %= 3;
            }
        }
    } 
    
    hop(direction) {
        this.#frameIndices.hopping = 0;
        this.#frameCounts.hopping = 0;
        this.#hopDirection = direction;
        this.#hopping = true;
    }

    draw(context) {
        context.save();

        if (this.#headDirection < 0) {
            context.translate(this.#position.x + this.#width, this.#position.y);
            context.scale(this.#headDirection, 1);
        }
        else {
            context.translate(this.#position.x, this.#position.y);
        }
        
        let spriteFrame;
        if (this.#hopping) {
            const currentFrameIndex = this.#frameIndices.hopping;
            spriteFrame = ANIMATIONS.HOP[currentFrameIndex];
        }
        else if (this.#dying) {
            // hyelp
        }
        else {
            // idle
            const currentFrameIndex = this.#frameIndices.idle;
            spriteFrame = ANIMATIONS.IDLE[currentFrameIndex];
        }

        context.drawImage(this.#spriteSheet, spriteFrame[0], spriteFrame[1], spriteFrame[2], spriteFrame[3],
            0, 0, this.#width, this.#height);

        context.restore();
    }

    die() {
        this.#dying = true;
        this.#hopping = false;

        this.#resetPosition();
    }

    #resetPosition() {
        this.#position = {
            x: CANVAS_SIZE.width / 2, 
            y: CANVAS_SIZE.height - (CANVAS_SIZE.height / GRID_DIMENSIONS.rowCount)
        }
    }
   
}

export default Frog;