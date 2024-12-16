import { CANVAS_SIZE, HOP_DISTANCE } from "../contants/constants.js";
import Lane from "./lane.js";
import { Turtle } from "../objects/turtle.js";

class TurtleFactory extends Lane {
    #lastBatchTime = Date.now();

    #spriteSheet;
    #spawnPoint;
    #deltaTime;

    constructor (spriteSheet, laneNum, laneSpec) {
        super (laneNum, laneSpec);
        this.#spriteSheet = spriteSheet;
        this.#spawnPoint = {x: laneSpec.initX, y: CANVAS_SIZE.height - HOP_DISTANCE.y * (this.laneNum+1) + 15};

        this.#spawnBatch();
    }

    #spawnTurtle() {
        // new car specs
        const speed = this.laneSpec.speed * this.levelMulitplier;
        const size = {width: this.laneSpec.width, height: this.laneSpec.height};
        const direction = this.laneSpec.direction;
        const spriteSheet = this.#spriteSheet;
        const spawnPoint = {...this.#spawnPoint};

        const newTurtle = new Turtle(speed, direction, spawnPoint, size, spriteSheet);
        this.laneObjects.push(newTurtle)
    }
    
    #spawnBatch() {
        const batchSize = this.laneSpec.batchSize;
        const spawnInterval = this.laneSpec.spawnInterval;

        for (let i = 1; i <= batchSize; i++) {
            // spawn batch of cars with its delays
            setTimeout(this.#spawnTurtle.bind(this), spawnInterval * i);
        }
    }

    update (frogger) {
        super.update(frogger);

        this.#deltaTime = Date.now() - this.#lastBatchTime; 
        const batchInterval = this.laneSpec.batchInterval;
        if (this.#deltaTime >= batchInterval) {
            this.#lastBatchTime = Date.now();
            this.#spawnBatch();
        }
    }

    draw (context, showHitboxes) {
        this.laneObjects.forEach(object => {
            object.draw(context, showHitboxes);
        })
    }
}

export default TurtleFactory;