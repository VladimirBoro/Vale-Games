import { TURTLE_ANIMATIONS } from "../contants/constants";
import { LaneObject } from "./laneObject";

export class Turtle extends LaneObject {
    constructor(speed, direction, position, size, turtleSpriteSheetImage) {
        super(speed, direction, position, size);
        this.frameCount = 0;
        this.spriteIndex = 0;
        this.turtleSpriteSheetImg = turtleSpriteSheetImage;
    }

    getFrameCount() {
        return this.frameCount;
    }

    getSpriteIndex() {
        return this.spriteIndex;
    }

    nextSprite(index = null) {
        if (index !== null) {
            this.spriteIndex = index;
            return;
        }
        this.spriteIndex++;
    }

    checkForCollision(frogger) {
        const thisTopLeftHitbox = {x: this.position.x + 30, y: this.position.y - 30};
        const thisBottomRightHitbox = {x: this.position.x + this.size.width - 40,
                                    y: this.position.y + this.size.height + 30};

        const froggerSize = frogger.getSize();
        const froggerTopLeftHitbox = frogger.getPosition();
        const froggerBottomRightHitbox = {x: froggerTopLeftHitbox.x + froggerSize.width,
                                            y: froggerTopLeftHitbox.y + froggerSize.height};
        

        if (!((froggerTopLeftHitbox.x >= thisBottomRightHitbox.x   || thisTopLeftHitbox.x >= froggerBottomRightHitbox.x)  || 
                (froggerTopLeftHitbox.y >= thisBottomRightHitbox.y || thisTopLeftHitbox.y >= froggerBottomRightHitbox.y))) {
            frogger.drift(this.speed);
        }  
    }

    nextFrame() {
        this.frameCount++;
    }

    animateTurtle(context, showHitboxes) {
        if (this.frameCount % 30 === 0) {
            this.nextSprite();
        }

        if (this.getSpriteIndex() === 4) {
            this.nextSprite(0);
        }

        const spriteFrame = TURTLE_ANIMATIONS[this.getSpriteIndex()];
        
        const position = this.getPosition();
        const size = this.getSize();
        
        if (showHitboxes) {
            context.strokeRect(position.x + 30, position.y - 30, size.width - 40, size.height + 30);
        }

        context.drawImage(this.turtleSpriteSheetImg, spriteFrame[0], spriteFrame[1], spriteFrame[2], spriteFrame[3],
            position.x, position.y, size.width, size.height
        );

    }
    
    draw(context, showHitboxes) {
        this.animateTurtle(context, showHitboxes);
        

        this.nextFrame();
    }
}