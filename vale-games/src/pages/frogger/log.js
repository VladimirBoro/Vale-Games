import { LaneObject } from "./laneObject";
import { LOG_COORDS } from "./contants/constants";
import logSpriteSheet from "./sprites/logs.png";


export class Log extends LaneObject {
    constructor(speed, position, size, logSpriteSheetImage = null) {
        super(speed, position, size);
        this.logSpriteSheetImage = new Image();
        this.logSpriteSheetImage.src = logSpriteSheet;
    }

    draw(context, type) {
        const sprite = LOG_COORDS[type];

        const position = this.getPosition();
        const size = this.getSize();
        
        context.drawImage(this.logSpriteSheetImage, sprite.x, sprite.y, sprite.width, sprite.height, position.x, position.y, size.width, size.height);
    }
}