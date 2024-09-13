import { LaneObject } from "./laneObject";

export class animatedLaneaneObject extends LaneObject {
    
    constructor(speed, position, size, frameCount, spriteIndex = 0) {
        super(speed, position, size);
        this.frameCount = frameCount;
        this.spriteIndex = spriteIndex;
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


}