import { Log } from "../objects/log.js";
import { CANVAS_SIZE, HOP_DISTANCE } from "../contants/constants";
import Lane from "./lane.js";

class LogFactory extends Lane {
    #lastBatchTime = Date.now();

    #spriteSheet;
    #spawnPoint;
    #deltaTime;

    constructor (spriteSheet, laneNum, laneSpec) {
        super (laneNum,laneSpec);
        this.#spriteSheet = spriteSheet;
        this.#spawnPoint = {x: laneSpec.initX, y: CANVAS_SIZE.height - HOP_DISTANCE.y * (this.laneNum+1) + 25};

        this.#spawnBatch();
    }

    #spawnLog() {
        // new car specs
        const speed = this.laneSpec.speed * this.levelMulitplier;
        const size = {width: this.laneSpec.width, height: this.laneSpec.height};
        const direction = this.laneSpec.direction;
        const spriteSheet = this.#spriteSheet;
        const spawnPoint = {...this.#spawnPoint};

        const newLog = new Log(speed, direction, spawnPoint, size, spriteSheet);
        this.laneObjects.push(newLog)
    }
    
    #spawnBatch() {
        const batchSize = this.laneSpec.batchSize;
        const spawnInterval = this.laneSpec.spawnInterval;

        for (let i = 1; i <= batchSize; i++) {
            // spawn batch of cars with its delays
            setTimeout(this.#spawnLog.bind(this), spawnInterval * i);
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
            object.draw(context, this.laneSpec.type, showHitboxes);
        })
    }
}

export default LogFactory;