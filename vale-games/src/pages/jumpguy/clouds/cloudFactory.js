import { CANVAS } from "../constants";
import Cloud from "./cloud";

class CloudFactory {
    #clouds;

    constructor() {
        this.#clouds = [];
        this.#initFactory();
    }

    #initFactory () {
        this.#clouds.push(this.createRandomCloud(CANVAS.height));
        
        const initCloudAmount = 1 + Math.random() * 10;
        
        for (let i = 0; i < initCloudAmount; i++) {
            let nextY = this.#clouds[this.#clouds.length - 1].getY();
            this.#clouds.push(this.createRandomCloud(nextY));
        }
    }

    #nextCloudYPosition () {
        return Math.random() * 300; 
    }

    deleteCloud () {
        this.#clouds.splice(0,1);
    }

    drawClouds (context) {
        this.#clouds.forEach(cloud => {
            cloud.draw(context);
        })
    }

    createRandomCloud (lastCloudHeight) {
        const randomX = -50 + (Math.random() * CANVAS.width);
        const randomY = lastCloudHeight - this.#nextCloudYPosition();

        const rollForCloud = Math.round(Math.random() * 5);

        return new Cloud(randomX, randomY, rollForCloud);
    }

    updateClouds (speed, jumpGuy) {
        speed /= 3;
        this.#clouds.forEach(cloud => {
            cloud.update(speed, jumpGuy, () => this.deleteCloud());
        });

        const lastCloud = this.#clouds[this.#clouds.length - 1];
        if (lastCloud.getY() + 200 > 0) {
            this.#clouds.push(this.createRandomCloud(lastCloud.getY()));
        }
    }

    reset () {
        this.#clouds = [];
        this.#initFactory();
    }

}

export default CloudFactory;