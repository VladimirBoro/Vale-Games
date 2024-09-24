import { LaneObject } from "./laneObject";
import { CAR_COORDS } from "../contants/constants";

export class Car extends LaneObject {
    constructor(speed, direction, position, size, spriteSheet) {
        super(speed, direction, position, size);
        this.spriteSheet = spriteSheet;
    }

    draw(context, type, showHitbox) {
        const sprite = CAR_COORDS[type];
    
        const position = this.getPosition();
        const size = this.getSize();
        
        context.drawImage(this.spriteSheet, sprite.x, sprite.y, 48,18, position.x, position.y, size.width, size.height);

        if (showHitbox) {
            context.strokeRect(this.position.x, this.position.y, this.size.width, this.size.height);
        }
    }

    checkForCollision(frogger) {
        const thisTopLeftHitbox = {x: this.position.x + 20, y: this.position.y + 10};
        const thisBottomRightHitbox = {x: this.position.x + this.size.width - 20,
                                    y: this.position.y + this.size.height - 10 };

        const froggerSize = frogger.getSize();
        const froggerTopLeftHitbox = frogger.getPosition();
        const froggerBottomRightHitbox = {x: froggerTopLeftHitbox.x + froggerSize.width,
                                            y: froggerTopLeftHitbox.y + froggerSize.height};
        

        if (!((froggerTopLeftHitbox.x >= thisBottomRightHitbox.x   || thisTopLeftHitbox.x >= froggerBottomRightHitbox.x)  || 
                (froggerTopLeftHitbox.y >= thisBottomRightHitbox.y || thisTopLeftHitbox.y >= froggerBottomRightHitbox.y))) {
            frogger.die();
        }  
    }
}