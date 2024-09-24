import { LANES } from "./contants/constants";
import CarFactory from "./factories/carFactory";
import carSpriteSheet from "./sprites/cars.png";

class Road {
    #lanes;
    #spriteSheet;

    constructor() {
        this.#initRoad();
    }
    
    #initRoad() {
        this.#lanes = [];
        this.#spriteSheet = new Image();
        this.#spriteSheet.src = carSpriteSheet;

        this.#lanes.push(new CarFactory(this.#spriteSheet, 1, LANES[1]));
        this.#lanes.push(new CarFactory(this.#spriteSheet, 2, LANES[2]));
        this.#lanes.push(new CarFactory(this.#spriteSheet, 3, LANES[3]));
        this.#lanes.push(new CarFactory(this.#spriteSheet, 4, LANES[4]));
        this.#lanes.push(new CarFactory(this.#spriteSheet, 5, LANES[5]));
    }

    resetDifficulty() {
        this.#lanes.forEach(lane => {
            lane.reset();
        })
    }

    increaseDifficulty() {
        console.log("increase diff!");
        this.#lanes[4].increaseSpeed();
        this.#lanes[3].increaseSpeed();
        this.#lanes[1].increaseSpeed();
        this.#lanes[3].lowerSpawnInterval();
        this.#lanes[1].lowerSpawnInterval();
    }

    update(frogger) {
        this.#lanes.forEach(lane => {
            lane.update(frogger);
        })
    }

    draw(context, showHitbox) {
        this.#lanes.forEach(lane => {
            lane.draw(context, showHitbox);
        })
    }
}

export default Road;