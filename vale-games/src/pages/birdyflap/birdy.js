import { CANVAS, BAT_FLAPPING, BAT_DEAD } from "./constants";
import batSpriteSheet from "./images/bat.png";

export class Birdy {
    constructor() {
        this.dropRate = 0.055;
        this.size = {width: 40, height: 40};
        this.position = {x: CANVAS.width / 5, y: CANVAS.height / 2};

        this.currentSpeed = 0;
        this.dead = false;
        this.hit = false;

        this.batSprites = new Image();
        this.batSprites.src = batSpriteSheet;

        this.frameCount = 18;
        this.spriteIndex = 0;
        this.isFlapping = false;
        this.idle = true;
    }

    getPosition() {
        return this.position;
    }

    getSize() {
        return this.size;
    }

    isDead() {
        return this.dead;
    }

    isHit() {
        return this.hit;
    }

    #fall() {
        this.position.y += this.currentSpeed;
        this.currentSpeed += this.dropRate;
    }
    
    flap() {
        if (!this.hit) {
            this.currentSpeed = -2.75;
            this.spriteIndex = 0;
            this.frameCount = 19;
            this.isFlapping = true;
        }
    }

    die() {
        console.log("IM DEAD 💀")
        this.dead = true;
    }

    hitPipe() {
        this.hit = true;
    }
    
    update() {
        this.frameCount++;
        if (this.isFlapping && this.frameCount % 20 === 0) {
            this.frameCount = 0;
            this.spriteIndex++;
            
            if (this.spriteIndex > 2) {
                this.spriteIndex = 0;
                this.frameCount = 19;
                this.isFlapping = false;
            }
        }


        if (this.position.y > CANVAS.height - this.size.height) {
            this.die();
            this.hitPipe();
            this.dropRate = 0;
            this.currentSpeed = 0;
        }
        
        this.#fall();
    }

    draw(context) {
        let currentSprite = BAT_FLAPPING[this.spriteIndex]; 

        if (this.isDead()) {
            currentSprite = BAT_DEAD;
        } 

        context.drawImage(this.batSprites, currentSprite.x, currentSprite.y, currentSprite.w, 
            currentSprite.h, this.position.x, this.position.y, this.size.width, this.size.height);

        // context.strokeStyle = "white";
        // context.lineWidth = 2;
        // context.strokeRect(this.position.x, this.position.y, this.size.width, this.size.height); 
    } 
}