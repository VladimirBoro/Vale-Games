import React, { useEffect, useRef, useState } from "react";
import {LANES, CANVAS_WIDTH } from "./contants/constants";
import { Turtle } from "./turtle";
import { Car } from "./car";
import { Log } from "./log";

function Lane({ laneNumber, laneYPosition, showHitboxes, isLevelScaled}) {
    const laneSettings = LANES[laneNumber];

    const [respawnBatch, setRespawnBatch] = useState(false);

    const lane = useRef([]);
    const spawnInterval = useRef(null);
    const carInterval = useRef(null);
    const multiplier = useRef(1);

    // SPAWN LANE OBJECTS IN LOOP
    useEffect(() => {
        const carSpawnInterval = laneSettings.spawnInterval;

        const respawn = () => {
            setRespawnBatch(!respawnBatch);
        }

        const spawn = () => {
            if (laneNumber < 6) {
                lane.current.push(new Car(
                    laneSettings.speed,
                    {x: laneSettings.initX, y: laneYPosition},
                    {width: laneSettings.width, height: laneSettings.height}
                ));
            }
            else if (laneNumber === 7 || laneNumber === 10) {
                lane.current.push(new Turtle(
                    laneSettings.speed,
                    {x: laneSettings.initX, y: laneYPosition},
                    {width: laneSettings.width, height: laneSettings.height},
                    0 // frame index
                ));
            }
            else {
                lane.current.push(new Log(
                    laneSettings.speed,
                    {x: laneSettings.initX, y: laneYPosition},
                    {width: laneSettings.width, height: laneSettings.height}
                ));
            }
        }

        for (let i = 0; i < laneSettings.batchSize; i++) {
            carInterval.current = setTimeout(spawn, (carSpawnInterval * i) / multiplier.current);

            if (i === laneSettings.batchSize - 1) {
                setTimeout(respawn, (laneSettings.batchInterval) / multiplier.current);
            }
        }
        
        return () => {
            clearTimeout(spawnInterval);
            clearTimeout(carInterval);
        };
    }, [respawnBatch])
    
    const updateLaneObjects = (levelMultiplier) => {
        if (isLevelScaled && multiplier.current !== levelMultiplier) {
            multiplier.current = levelMultiplier;
        }

        for (let i = 0; i < lane.current.length; i++) {
            let newPosition = lane.current[i].getPosition(); // this acts like a pointer for some reason
            
            if (((newPosition.x < 0 - 135) && laneSettings.direction < 0) ||
            ((newPosition.x > CANVAS_WIDTH) && laneSettings.direction > 0)) {
                lane.current.splice(0, 1);
            }
            else {
                newPosition.x += laneSettings.speed * laneSettings.direction * multiplier.current;
            }
        }
    }

    const drawLaneObjects = (context) => {
        for (let i = 0; i < lane.current.length; i++) {
            lane.current[i].draw(context, laneSettings.type);
        }
    }

    const frogHitByCar = (frogPosition) => {
        let topLeftOfFrog = {x: frogPosition.x, y: frogPosition.y};
        let bottomRightOfFrog = {x: frogPosition.x + 38, y: frogPosition.y + 32};

        let laneObjectWidth;
        let laneObjectHeight; 
        
        let topLeftOfCar;
        let bottomRightOfCar;
        for (let i = 0; i < lane.current.length; i++) {
            const car = lane.current[i];

            laneObjectWidth = car.getSize().width;
            laneObjectHeight = car.getSize().height;
            
            topLeftOfCar = {x: car.getPosition().x, y: car.getPosition().y};
            bottomRightOfCar = {x: car.getPosition().x + laneObjectWidth, y: car.getPosition().y + laneObjectHeight}

            // see that there is no overlap between out topLeft and bottomRight corners
            if (!((topLeftOfFrog.x >= bottomRightOfCar.x || topLeftOfCar.x >= bottomRightOfFrog.x) || 
                    (topLeftOfFrog.y >= bottomRightOfCar.y || topLeftOfCar.y >= bottomRightOfFrog.y))) {
                return true;
            }
        }
        return false;
    }

    const frogLandOnFloater = (frogPosition) => {
        let topLeftOfFrog = {x: frogPosition.x, y: frogPosition.y};
        let bottomRightOfFrog = {x: frogPosition.x + 38, y: frogPosition.y + 32};

        let laneObjectWidth;
        let laneObjectHeight; 
        
        let topLeftOfFloater;
        let bottomRightOfFloater;
        for (let i = 0; i < lane.current.length; i++) {
            const floater = lane.current[i];

            laneObjectWidth = floater.getSize().width - 10;
            laneObjectHeight = floater.getSize().height + 30;

            // turtles are too long in the back
            if (laneSettings.type === "turtle") {
                laneObjectWidth -= 30;
            }
            
            topLeftOfFloater = {x: floater.getPosition().x + 10, y: floater.getPosition().y - 50};
            bottomRightOfFloater = {x: floater.getPosition().x + laneObjectWidth, y: floater.getPosition().y + laneObjectHeight}

            // see that there is no overlap between out topLeft and bottomRight corners
            if (!((topLeftOfFrog.x >= bottomRightOfFloater.x || topLeftOfFloater.x >= bottomRightOfFrog.x) || 
                    (topLeftOfFrog.y >= bottomRightOfFloater.y || topLeftOfFloater.y >= bottomRightOfFrog.y))) {
                return false;
            }
        }
        return true;
    }

    const collideWithFrog = (frogPosition) => {
        return laneNumber > 5 ? frogLandOnFloater(frogPosition) : frogHitByCar(frogPosition);
    }

    return { updateLaneObjects, drawLaneObjects, collideWithFrog };
}

export default Lane;