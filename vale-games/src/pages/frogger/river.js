import LogFactory from "./factories/logFactory";
import logSpriteSheet from "./sprites/logs.png";
import turtleSpriteSheet from "./sprites/tmnt.png";
import TurtleFactory from "./factories/turtleFactory";
import { LANES } from "./contants/constants";

class River {
    #lanes;

    constructor() {
        this.#initRiver();
    }
    
    #initRiver() {
        this.#lanes = [];
        const logSpriteSheetImg = new Image();
        logSpriteSheetImg.src = logSpriteSheet;

        const turtleSpriteSheetImg = new Image();
        turtleSpriteSheetImg.src = turtleSpriteSheet;

        console.log(LANES[1]);
        this.#lanes.push(new TurtleFactory(turtleSpriteSheetImg, 7, LANES[7]));
        this.#lanes.push(new LogFactory(logSpriteSheetImg, 8, LANES[8]));
        this.#lanes.push(new LogFactory(logSpriteSheetImg, 9, LANES[9]));
        this.#lanes.push(new TurtleFactory(turtleSpriteSheetImg, 10, LANES[10]));
        this.#lanes.push(new LogFactory(logSpriteSheetImg, 11, LANES[11]));
    }

    resetDifficulty() {
        this.#lanes.forEach(lane => {
            lane.reset();
        })
    }

    increaseDifficulty() {
        console.log("increase diff!");
        this.#lanes[0].increaseSpeed();
        this.#lanes[2].increaseSpeed();
        this.#lanes[3].increaseSpeed();
        this.#lanes[3].lowerSpawnInterval();
        this.#lanes[0].lowerSpawnInterval();
    }

    update(frogger) {
        this.#lanes.forEach(lane => {
            lane.update(frogger);
        })
    }

    draw(context, showHitboxes) {
        this.#lanes.forEach(lane => {
            lane.draw(context, showHitboxes);
        })
    }
}

export default River;