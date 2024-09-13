import { TURTLE_ANIMATIONS } from "./contants/constants";
import { LaneObject } from "./laneObject";
import turtleSpriteSheet from "./sprites/tmnt.png";

export class Turtle extends LaneObject {
    constructor(speed, position, size, frameCount, spriteIndex = 0, turtleSpriteSheetImage = null) {
        super(speed, position, size);
        this.frameCount = frameCount;
        this.spriteIndex = spriteIndex;
        this.turtleSpriteSheetImg = new Image();
        this.turtleSpriteSheetImg.src = turtleSpriteSheet;
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

    nextFrame() {
        this.frameCount++;
    }

    animateTurtle(context) {
        if (this.frameCount % Math.floor(30) === 0) {
            this.nextSprite();
        }

        if (this.getSpriteIndex() === 4) {
            this.nextSprite(0);
        }

        const spriteFrame = TURTLE_ANIMATIONS[this.getSpriteIndex()];
        
        const position = this.getPosition();
        const size = this.getSize();

        context.drawImage(this.turtleSpriteSheetImg, spriteFrame[0], spriteFrame[1], spriteFrame[2], spriteFrame[3],
            position.x, position.y, size.width, size.height
        );

        // if (showHitboxes) {
        //     drawHitbox(context, position, size);
        // }

    }

    draw(context, type) {
        this.animateTurtle(context);
        this.nextFrame();

        // if (showHitboxes) {
        //     drawHitbox(context, position, size);
        // }
    }


}