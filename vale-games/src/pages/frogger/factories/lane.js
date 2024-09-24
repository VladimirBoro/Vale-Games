import { CANVAS_SIZE, LANES } from "../contants/constants";

class Lane {
    levelMulitplier = 1;

    laneSpec;
    laneNum;

    constructor (laneNum, laneSpec) {
        this.laneObjects = [];
        this.laneNum = laneNum;
        this.laneSpec = laneSpec;
    }

    reset() {
        this.laneSpec = LANES[this.laneNum];
        this.levelMulitplier = 1;
    }

    increaseSpeed() {
        this.levelMulitplier += 0.1;
    }

    lowerSpawnInterval() {
        this.laneSpec.spawnInterval *= 0.95;
        this.laneSpec.batchInterval *= 0.95;
    }

    update (frogger) {
        // move lane members
        this.laneObjects.forEach(object => object.update(frogger));
        // check for collision 
        if (frogger.getLane() === this.laneNum) {
            this.laneObjects.forEach(object => object.checkForCollision(frogger));
        }
        
        // delete car when out of bounds
        if (this.laneObjects.length > 0) {
            this.deleteLaneObject();
        }    
    }

    deleteLaneObject () {
        const lastXPosition = this.laneObjects[0].getPosition().x; 
        if (this.laneSpec.direction > 0 && lastXPosition > CANVAS_SIZE.width + this.laneSpec.width) {
            this.laneObjects.splice(0,1);
        } 
        else if (lastXPosition < -this.laneSpec.width) {
            this.laneObjects.splice(0,1);
        }
    }
}

export default Lane;