import Platform from "./platform";
import MovingPlatform from "./movingPlatform";
import { PLATFORM_TYPE, PLATFORM_ROLES, CANVAS } from "../constants";
import BouncyPlatform from "./bouncyPlatform";

class PlatformFactory {
    #platforms;
    #minSpacing;
    #maxSpacing;

    constructor() {
        this.#platforms = [];
        this.#maxSpacing = 90;
        this.#minSpacing = 20;

        this.#initFactory();
    }

    #initFactory() {
        this.spawnRandomPlatform(CANVAS.height); 
        for (let i = 0; i <= 20; i++) {
            this.spawnRandomPlatform(this.#platforms[this.#platforms.length - 1].y);
        }

    }

    #roll100() {
        return Math.round(Math.random() * 100); 
    }

    #nextPlatformDistance() {
        return this.#minSpacing + (Math.random() * this.#maxSpacing);  
    }

    spawnRandomPlatform(lastPlatformHeight) {
        const randomX = Math.random() * (CANVAS.width - 60);
        const randomY = lastPlatformHeight - this.#nextPlatformDistance();

        const roll = this.#roll100();
        
        let platformType; 
        for (let i = 0; i < PLATFORM_ROLES.length; i++) {
            if (PLATFORM_ROLES[i].roll > roll) {
                platformType = PLATFORM_ROLES[i].type;
                break;
            }
        }

        let platform;
        if (platformType === PLATFORM_TYPE.STATIC) {
            platform = new Platform(randomX, randomY);
        }
        else if (platformType === PLATFORM_TYPE.BOUNCY) {
            platform = new BouncyPlatform(randomX, randomY);
        }
        else if (platformType === PLATFORM_TYPE.SLIDING) {
            platform = new MovingPlatform(randomX, randomY);
        }
        else if (platformType === PLATFORM_TYPE.DESTROY) {
            platform = new Platform(randomX, randomY);
        }
        else {
            platform = new Platform(randomX, randomY);
        }

        this.#platforms.push(platform);
    }

    deletePlatform() {
        this.#platforms.splice(0,1);
    }

    drawPlatforms(context) {
        this.#platforms.forEach(platform => {
            platform.draw(context);
        })
    }

    updatePlatforms(speed, jumpGuy) {
        this.#platforms.forEach((platform) => {
            platform.update(speed, jumpGuy, () => this.deletePlatform());
        })

        const lastPlatform = this.#platforms[this.#platforms.length - 1];
        if (lastPlatform.y > 0) {
            this.spawnRandomPlatform(lastPlatform.y);
        }
    }

}

export default PlatformFactory;