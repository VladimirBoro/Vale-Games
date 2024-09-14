import { CANVAS, DIRECTIONS, GUY } from "./constants";

class Guy {
    #x;
    #y;
    #width;
    #height;
    #sideSpeed;
    #movingLeft;
    #movingRight;
    #isJumping;
    #jumpSpeed;
    #gravity;
    #falling;
    #currentHeight;

    constructor(x, y, width, height, loseGame) {
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;

        this.#sideSpeed = 2;
        this.#movingLeft = false;
        this.#movingRight = false;

        this.#isJumping = false;
        this.#jumpSpeed = GUY.jumpSpeed;
        this.#gravity = 0.055; 

        this.#falling = false;
        this.#currentHeight = 0;

        this.loseGame = loseGame;
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
        if (this.#isJumping) {
            // jump up
            if (this.#y > CANVAS.height - (2 * CANVAS.height / 3)) {
                this.#y += this.#jumpSpeed;
            }
            
            this.#currentHeight += this.#jumpSpeed;
            
            // apply gravity
            this.#jumpSpeed += this.#gravity; 
            
            // start falling
            if (this.#jumpSpeed > 0) {
                this.#currentHeight += this.#jumpSpeed;
                this.#y += this.#jumpSpeed;
                this.#falling = true;
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
    }

    move (direction) {
        if (direction == DIRECTIONS.left) {
            // move guy to the left
            this.#x -= this.#sideSpeed;
        }
        else {
            // move guy to the right
            this.#x += this.#sideSpeed;
        }
    }

    draw (context) {
        context.fillStyle = "yellow";
        context.fillRect(this.#x, this.#y, this.#width, this.#height);
    }

    reset () {
        this.#x = GUY.x;
        this.#y = GUY.y;
    }
}

export default Guy;