import { CANVAS, DIRECTIONS, GUY, GUY_JUMPING_FRAMES, GUY_FALLING_FRAMES } from "./constants";
import JumpGuySpriteSheet from "./sprites/JumpGuy.png";

class Guy {
    #x;
    #y;
    #width;
    #height;
    #direction;
    #sideSpeed;
    #movingLeft;
    #movingRight;
    #isJumping;
    #jumpSpeed;
    #gravity;
    #falling;
    #currentHeight;
    #spriteSheet;
    #spriteJumpFrame;
    #spriteFallFrame;
    #currentFrameCount;

    constructor(x, y, width, height, loseGame) {
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
        this.#direction = 1;

        this.#sideSpeed = 2;
        this.#movingLeft = false;
        this.#movingRight = false;

        this.#isJumping = false;
        this.#jumpSpeed = GUY.jumpSpeed;
        this.#gravity = 0.06; 

        this.#falling = false;
        this.#currentHeight = 0;

        this.loseGame = loseGame;

        this.#spriteSheet = new Image();
        this.#spriteSheet.src = JumpGuySpriteSheet;
     
        this.#spriteJumpFrame = 0;
        this.#spriteFallFrame = 0;
        this.#currentFrameCount = 0;

        this.showHitbox = false;
    }
    
    set movingRight(isMoving) { 
        this.#movingRight = isMoving;
    }
    set movingLeft(isMoving) { 
        this.#movingLeft = isMoving;
    }
    get movingRight() { 
        return this.#movingRight ;
    }
    get movingLeft() {
        return this.#movingLeft;
    }
    get currentHeight() { 
        return this.#currentHeight;
    }
    get falling() {
        return this.#falling; 
    }
    get y() { 
        return this.#y;
    }
    get jumpSpeed() { 
        return this.#jumpSpeed
    }

    getAreaCoords = () => { 
        return {
            x: this.#x,
            y: this.#y,
            width: this.#width,
            height: this.#height
        }
    }

    update () {
        // teleport guy to the right siode
        if (this.#x < -this.#width) {
            this.#x = CANVAS.width - 1;
        }

        // teleport to the left siode
        if (this.#x > CANVAS.width) {
            this.#x = -this.#width + 1;
        }

        if (this.#isJumping) {
            // jump up
            if (this.#y > CANVAS.height - (2 * CANVAS.height / 3)) {
                this.#y += this.#jumpSpeed;
            }
            
            this.#currentHeight += this.#jumpSpeed;

            this.#jumpSpeed += this.#gravity; // pull down
            
            // start falling
            if (this.#jumpSpeed > 0) {
                this.#currentHeight += this.#jumpSpeed;
                this.#y += this.#jumpSpeed;
                this.#falling = true;
                // this.#currentFrameCount = 49;
            }

            if (this.#y >= CANVAS.height) {
                this.loseGame();
            }
        }
    }

    jump (jumpMultiplier = 1) {
        this.#falling = false; 
        this.#isJumping = true;
        this.#jumpSpeed = GUY.jumpSpeed * jumpMultiplier;
        this.#currentFrameCount = 0;
        this.#spriteJumpFrame = 0;
    }

    move (direction) {
        if (direction == DIRECTIONS.left) {
            // move guy to the left
            this.#x -= this.#sideSpeed;
            this.#direction = -1;
        }
        else {
            // move guy to the right
            this.#x += this.#sideSpeed;
            this.#direction = 1;
        }
    }

    draw (context) {
        context.save();

        if (this.#direction < 0) {
            context.translate(this.#x + this.#width, this.#y);
            context.scale(-1,1);
        }
        else {
            context.translate(this.#x, this.#y);
        }
        
        context.shadowColor = "black";
        context.shadowBlur = 10;
        
        // show on refresh
        this.#spriteSheet.onload = () => {
            context.shadowColor = "black";
            context.shadowBlur = 10;
            const [x, y, h] = GUY_JUMPING_FRAMES[this.#spriteJumpFrame];
            context.drawImage(this.#spriteSheet, x, y, this.#width, h, this.#x, this.#y, this.#width, this.#height);
        }

        if (this.#spriteJumpFrame < 5) {
            const [x, y, h] = GUY_JUMPING_FRAMES[this.#spriteJumpFrame];
            context.drawImage(this.#spriteSheet, x, y, this.#width, h, 0, 0, this.#width, this.#height);
        }
        else {
            const [x, y, h] = GUY_FALLING_FRAMES[this.#spriteFallFrame];
            context.drawImage(this.#spriteSheet, x, y, this.#width, h, 0, 0, this.#width, this.#height);
        }

        context.restore();

        this.#currentFrameCount++;
        
        if (this.#falling && this.#currentFrameCount % 20 == 0) {
            this.#spriteFallFrame++;
            this.#spriteFallFrame %= 2;
        }
        else if (this.#currentFrameCount % 15 == 0) {
            this.#spriteJumpFrame++;
        }

        if (this.showHitbox) {
            // context.strokeStyle = "limegreen";
            context.strokeRect(this.#x, this.#y, this.#width, this.#height);
        }
    }

    reset () {
        this.#x = GUY.x;
        this.#y = GUY.y;
        this.#currentHeight = 0;
    }
}

export default Guy;