import { LaneObject } from "./laneObject";
import { LOG_COORDS } from "../contants/constants";
// import logSpriteSheet from "./sprites/logs.png";


export class Log extends LaneObject {
    constructor(speed, direction, position, size, logSpriteSheetImage) {
        super(speed, direction, position, size);
        this.logSpriteSheetImage = logSpriteSheetImage;
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

    draw(context, type, showHitboxes) {
        const sprite = LOG_COORDS[type];
        
        const position = this.getPosition();
        const size = this.getSize();
        
        context.drawImage(this.logSpriteSheetImage, sprite.x, sprite.y, sprite.width, sprite.height, position.x, position.y, size.width, size.height);
        
        if (showHitboxes) {
            context.strokeRect(position.x + 30, position.y - 30, size.width - 40, size.height + 30);
        }
    }
}