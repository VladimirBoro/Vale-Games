import Platform from "./platform";
import MovingPlatform from "./movingPlatform";
import BouncyPlatform from "./bouncyPlatform";
import DestroyPlatform from "./destroyPlatform";
import { PLATFORM_TYPE, PLATFORM_ROLES, CANVAS, PLATFORM } from "../constants";

class PlatformFactory {
    #platforms;
    #minSpacing;
    #maxSpacing;
    #currentId;
    #stage;

    constructor() {
        this.#platforms = [];
        this.#maxSpacing = 90;
        this.#minSpacing = 20;
        this.#currentId = 0;
        this.#stage = 1;

        this.#initFactory();
    }

    #initFactory() {
        this.#platforms.push(this.createRandomPlatform(CANVAS.height)); 
        for (let i = 0; i <= 20; i++) {
            this.#platforms.push(this.createRandomPlatform(this.#platforms[this.#platforms.length - 1].y));
        }
    }
    
    #roll100() {
        return Math.round(Math.random() * 100); 
    }
    
    #nextPlatformDistance(stage) {
        let multiplier = stage;
        if (stage > 1) {
            multiplier = 1 + (stage / 10);
        }
        
        return (this.#minSpacing + (Math.random() * this.#maxSpacing)) * multiplier;  
    }

    reset() {
        this.#platforms = [];
        this.#currentId = 0;
        this.#stage = 1;
        this.#initFactory();
    }
    
    advanceStage() {
        this.#stage++;
    }

    createRandomPlatform(lastPlatformHeight) {
        const randomX = Math.random() * (CANVAS.width - PLATFORM.width);
        const randomY = lastPlatformHeight - this.#nextPlatformDistance(this.#stage);

        // roll for platform type
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
        else if (this.#stage > 1 && platformType === PLATFORM_TYPE.SLIDING) {
            platform = new MovingPlatform(randomX, randomY, this.#stage);
        }
        else if (platformType === PLATFORM_TYPE.BOUNCY) {
            platform = new BouncyPlatform(randomX, randomY);
        }
        else if (this.#stage > 3 && platformType === PLATFORM_TYPE.DESTROY) {
            platform = new DestroyPlatform(randomX, randomY, this.#currentId++, 
                (id) => {
                    this.deleteById(id); 
                })
        }
        else {
            // reroll it 
            return this.createRandomPlatform(lastPlatformHeight, this.#stage);
        }

        return platform;
    }

    deletePlatform() {
        this.#platforms.splice(0, 1);
    }
    
    // only used on destroyable platforms (red ones)
    deleteById(id) {
        this.#platforms = this.#platforms.filter((platform) => {
            if (platform.id !== null && platform.id !== id) {
                return true;
            }

            return false;
        })
    }

    drawPlatforms(context) {
        context.shadowBlur = 10;
        context.shadowColor = "black";
        context.strokeStyle = "black";
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
            this.#platforms.push(this.createRandomPlatform(lastPlatform.y, this.#stage));
        }
    }
}

export default PlatformFactory;