import { LaneObject } from "./laneObject";
import { CAR_COORDS } from "./contants/constants";
import carsSpriteSheet from "./sprites/cars.png";

export class Car extends LaneObject {
    constructor(speed, position, size, carsSpriteSheetImg = null) {
        super(speed, position, size);
        this.carsSpriteSheetImg = new Image();
        this.carsSpriteSheetImg.src = carsSpriteSheet;
    }

    draw(context, type) {
        const sprite = CAR_COORDS[type];
    
        const position = this.getPosition();
        const size = this.getSize();
        
        context.drawImage(this.carsSpriteSheetImg, sprite.x, sprite.y, 48,18, position.x, position.y, size.width, size.height);

        // if (showHitboxes) {
        //     drawHitbox(context, position, size);
        // }
    }
}