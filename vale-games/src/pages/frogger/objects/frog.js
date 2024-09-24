import { CANVAS_SIZE, HOP_DIRECTIONS, HOP_DISTANCE, ANIMATIONS, GRID_DIMENSIONS } from "../contants/constants";

class Frog {
    #headDirection = 1;
    #currentLane = 0;
    #dying = false;
    #hopping = false;
    #floating = false;
    #width = CANVAS_SIZE.width / GRID_DIMENSIONS.columnCount;
    #height = CANVAS_SIZE.height / GRID_DIMENSIONS.rowCount;
    #frameIndices = {
        idle: 0,
        hopping: 0,
        dying: 0
    };
    #frameCounts = {
        idle: 1,
        hopping: 1,
        dying: 1
    };
    
    #hopDirection;
    #position;
    #spriteSheet;
    #loseLife;

    constructor (spriteSheet, loseLife) {
        this.#position = {
            x: CANVAS_SIZE.width / 2, 
            y: CANVAS_SIZE.height - this.#height
        }

        this.#loseLife = loseLife;
        this.#spriteSheet = spriteSheet;
    }

    #move(direction) {
        const divisions = Object.keys(ANIMATIONS.HOP).length;

        if (HOP_DIRECTIONS.LEFT.includes(direction)) {
            this.#headDirection = -1;
            this.#position.x -= (HOP_DISTANCE.x / divisions);
        }
        else if (HOP_DIRECTIONS.RIGHT.includes(direction)) {
            this.#headDirection = 1;
            this.#position.x += (HOP_DISTANCE.x / divisions);
        }
        else if (HOP_DIRECTIONS.UP.includes(direction)) {
            this.#position.y -= (HOP_DISTANCE.y / divisions);
        }
        else {
            this.#position.y += (HOP_DISTANCE.y / divisions);
        }


        this.#frameIndices.hopping++;
    }

    resetPosition() {
        this.#currentLane = 0;
        this.#hopping = false; // stop hopping to return to proper position
        this.#floating = false;
        this.#position = {
            x: CANVAS_SIZE.width / 2, 
            y: CANVAS_SIZE.height - (CANVAS_SIZE.height / GRID_DIMENSIONS.rowCount)
        }

        if (this.#dying) {
            this.#loseLife();
        }  
    }

    getPosition() {
        return this.#position;
    }

    getSize() {
        return {width: this.#width, height: this.#height};
    }

    getLane() {
        return this.#currentLane;
    }

    update() {
        if (this.#dying) {
            this.#frameCounts.dying++;
            
            if (this.#frameCounts.dying % 15 == 0) {
                this.#frameIndices.dying++;
            }
            
            if (this.#frameIndices.dying >= Object.keys(ANIMATIONS.DIE).length) {
                this.resetPosition();
                this.#frameIndices.dying = 0;
                this.#dying = false;
            }
        }
        else if (this.#hopping) {
            this.#frameCounts.hopping++;
            if (this.#frameCounts.hopping % 2 != 0) {
                return;
            }
            
            this.#move(this.#hopDirection);
            
            if (this.#frameIndices.hopping >= Object.keys(ANIMATIONS.HOP).length) {
                // stop and reset
                this.#frameIndices.hopping = 0;
                this.#hopping = false;
                this.#floating = false;
            }

            return;
        }
        else {
            // idle frames
            this.#frameCounts.idle++;
            
            if (this.#frameCounts.idle % 15 == 0) {
                this.#frameIndices.idle++;
                this.#frameIndices.idle %= 3;
            }
        }

        if ((this.#currentLane > 6 
            && !this.#floating)
            || this.#position.x > CANVAS_SIZE.width - (this.#width/2)
            || this.#position.x < (-this.#width/2)
        ) {
            this.die();
        }
    } 
    
    hop(direction) {
        // prohibit hopping while hoppig
        if (this.#hopping || this.#dying) {
            return;
        }

        const hoppingLeft = HOP_DIRECTIONS.LEFT.includes(direction);
        const hoppingRight = HOP_DIRECTIONS.RIGHT.includes(direction);
        const hoppingUp = HOP_DIRECTIONS.UP.includes(direction);
        const hoppingDown = HOP_DIRECTIONS.DOWN.includes(direction);

        // prohibit hopping if it would send us O.O.B
        const jumpingTooFarLeft =   this.#position.x - HOP_DISTANCE.x < 0 && hoppingLeft; 
        const jumpingTooFarRight =  this.#position.x + HOP_DISTANCE.x > CANVAS_SIZE.width - this.#width && hoppingRight; 
        const jumpingTooFarUp =     this.#position.y - HOP_DISTANCE.y < 0 && hoppingUp; 
        const jumpingTooFarDown =   this.#position.y + HOP_DISTANCE.y > CANVAS_SIZE.height - this.#height && hoppingDown; 
        if (jumpingTooFarLeft || jumpingTooFarRight || jumpingTooFarUp || jumpingTooFarDown) {
            return;
        }
        
        if (hoppingDown) {
            this.#currentLane--;
        }
        else if (hoppingUp) {
            this.#currentLane++;
        }
        
        this.#frameIndices.hopping = 0;
        this.#frameCounts.hopping = 0;
        this.#hopDirection = direction;
        // this.#floating = false;
        this.#hopping = true;
    }

    draw(context, showHitbox) {
        context.save();

        if (this.#headDirection < 0) {
            context.translate(this.#position.x + this.#width, this.#position.y);
            context.scale(this.#headDirection, 1);
        }
        else {
            context.translate(this.#position.x, this.#position.y);
        }
        
        let x = 7;
        let y = 7;
        let stretchWidth = -15;
        let stretchHeight = -15;
        let spriteFrame;
        if (this.#hopping) {
            const currentFrameIndex = this.#frameIndices.hopping;
            spriteFrame = ANIMATIONS.HOP[currentFrameIndex];

            // have it so hopping has an increased y height to appear like it is jumping
            y = 0;
        }
        else if (this.#dying) {
            // hyelp
            const currentFrameIndex = this.#frameIndices.dying;
            spriteFrame = ANIMATIONS.DIE[currentFrameIndex];
            stretchWidth = 17;
        }
        else {
            // idle
            const currentFrameIndex = this.#frameIndices.idle;
            spriteFrame = ANIMATIONS.IDLE[currentFrameIndex];
        }

        context.drawImage(this.#spriteSheet, spriteFrame[0], spriteFrame[1], spriteFrame[2], spriteFrame[3],
            x, y, this.#width + stretchWidth, this.#height + stretchHeight);

        // context.strokeStyle = "white";
        
        if (showHitbox) {
            context.strokeRect(x, y, this.#width + stretchWidth, this.#height + stretchHeight);
        }

        context.restore();
    }

    stopDrifting() {
        this.#floating = false;
    }

    drift(speed) {
        if (!this.#dying) {
            this.#floating = true;
            this.#position.x += speed;
        }
    }

    die() {
        this.#dying = true;
        this.#hopping = false;
    }
}

export default Frog;