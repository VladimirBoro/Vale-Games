
class Frog {
    #direction = 1;
    #currentLane = 0;
    #position;
    #spriteSheet;
    #hopDistance;
    #hopDirection;
    #isHopping;
    #frameCounts;
    #frameIndices;

    constructor () {

    }

    drawCurrentFrogSprite = (context, currentFrame) => {
        const postion = froggerPosition.current;
        
        const drawWidth = currentFrame[2] - 10;
        const drawHeight = currentFrame[3] ;
        const hopHeight = isHopping.current ? 10 : 0; 
        const flipCorrectionShift = froggerDirection.current < 0 ? drawWidth : 0;
        const deathCorrectionShift = isHit.current ? 30 : 0;

        context.drawImage(
            frogSpriteSheetImg, currentFrame[0], currentFrame[1], currentFrame[2], currentFrame[3], 
            postion.x * froggerDirection.current - flipCorrectionShift - deathCorrectionShift * froggerDirection.current, postion.y - hopHeight, drawWidth, drawHeight 
        );

        if (showHitboxes) {
            context.strokeStyle = "white";
            context.lineWidth = 2;
            context.strokeRect(postion.x * froggerDirection.current - flipCorrectionShift - deathCorrectionShift * froggerDirection.current, postion.y - hopHeight, drawWidth, drawHeight);
        }
    }

    hopAnimation = (context) => {
        hopFrameCount.current++;

        if (hopFrameCount.current % 5 == 0) {
            moveFrogger();
            hopFrameIndex.current++;
        }
        
        const spriteSheet = ANIMATIONS.HOP;
        let currentFrame = spriteSheet[hopFrameIndex.current];
        
        drawCurrentFrogSprite(context, currentFrame);
        
        if (hopFrameIndex.current > 2) {
            isHopping.current = false;
            hopFrameCount.current = 0;
            hopFrameIndex.current = 0;
            return;
        }
    }

    idleAnimation = (context) => {
          
        // update sprite frame index
        idleFrameCount.current++;

        if (idleFrameCount.current % 20 === 0) {
            idleFrameIndex.current++;
        }

        // reset sprite frame index
        if (idleFrameIndex.current > 2) {
            idleFrameIndex.current = 0;
        }

        let currentFrame = IDLE_ANIMATION[idleFrameIndex.current];
        drawCurrentFrogSprite(context, currentFrame);
    }

    deathAnimation = (context) => {
        // update sprite frame index
        dieFrameCount.current++;

        if (dieFrameCount.current % 25 === 0) {
            dieSpriteIndex.current++;
        }
        
        const spriteSheet = ANIMATIONS.DIE;
        let currentFrame = spriteSheet[dieSpriteIndex.current];
        
        drawCurrentFrogSprite(context, currentFrame);
        
        // death animation done but game still going
        if (dieSpriteIndex.current > 2) {
            resetFrogger();
            loseHeart();
            return;
        }
    }

    drawFrogger = (context, deltaTime) => {
        // TODO: move to move function
        if (!isHopping.current && froggerLane.current == 11) {
            if (!missGoal()) {
                scoreGoal();
            }
            else {
                isHit.current = true;
            }            
        }

        context.save();
        context.scale(froggerDirection.current, 1);

        if (deltaTime > fpsIntervalRef.current) {
            lastFroggerTime.current = Date.now() - (deltaTime % fpsIntervalRef.current);
            if (isHit.current && !isHopping.current) {
                deathAnimation(context, deltaTime);
            }
            
            if (isHopping.current) {
                idleFrameIndex.current = 0;
                hopAnimation(context, deltaTime);
            }
            else if (!isHit.current) {
                idleAnimation(context, deltaTime);
            }
        }
        
        context.restore();
    }

    driftFrogger = () => {
        const currentLane = froggerLane.current + 1; 
        const laneSettings = LANES[currentLane];
        // drifting...
        let driftMultiplier = 1;
        
        if (currentLane === 2 || currentLane === 4 || currentLane === 7 || 
                currentLane === 10 || currentLane === 9) {
            driftMultiplier = levelMultiplier.current;
        }

        froggerPosition.current.x += laneSettings.speed * laneSettings.direction * driftMultiplier;
    }

    moveFrogger = () => {
        let hopSegment;
        const position = froggerPosition.current;
        const jumpFrames = 3;

        if (hopDirection.current === HOP_DIRECTIONS.UP) {
            hopSegment = hopDistanceY / jumpFrames;
            position.y -= hopSegment;
        }
        else if(hopDirection.current === HOP_DIRECTIONS.DOWN) {
            hopSegment = hopDistanceY / jumpFrames;
            position.y += hopSegment;
            
        }
        else if(hopDirection.current === HOP_DIRECTIONS.RIGHT) {
            hopSegment = hopDistanceX / jumpFrames;
            position.x += hopSegment;
            
        }
        else {
            hopSegment = hopDistanceX / jumpFrames;
            position.x -= hopSegment;
        }
    }

    hop = (event) => {
        const keyPressed = event.keyCode;
        const position = froggerPosition.current;
        
        if (HOP_DIRECTIONS.LEFT.includes(keyPressed) && !isHopping.current && !isHit.current) {
            if (position.x - hopDistanceX < 0) {
                return;
            }
            isHopping.current = true;
            hopDirection.current = HOP_DIRECTIONS.LEFT;
            froggerDirection.current *= froggerDirection.current < 0 ? 1 : -1;
        }
        else if (HOP_DIRECTIONS.RIGHT.includes(keyPressed) && !isHopping.current && !isHit.current) {
            if (position.x + hopDistanceX > CANVAS_WIDTH) {
                return;
            }
            isHopping.current = true;
            hopDirection.current = HOP_DIRECTIONS.RIGHT;
            froggerDirection.current *= froggerDirection.current;
        }
        else if (HOP_DIRECTIONS.UP.includes(keyPressed) && !isHopping.current && !isHit.current) {
            if (position.y - hopDistanceY < 0) {
                return;
            }
            isHopping.current = true;
            hopDirection.current = HOP_DIRECTIONS.UP;
            froggerLane.current += 1;
            
            // score up 10 on new lanes
            if (touchedLanes.current.length == 0) {
                touchedLanes.current.push(froggerLane.current);
                scoreUp(10 * levelMultiplier.current);
            }
            else if (!touchedLanes.current.includes(froggerLane.current)) {
                touchedLanes.current.push(froggerLane.current);
                scoreUp(10 * levelMultiplier.current);
            }
        }
        else if (HOP_DIRECTIONS.DOWN.includes(keyPressed) && !isHopping.current && !isHit.current) {
            if (position.y + hopDistanceY > CANVAS_HEIGHT) {
                return;
            }
            isHopping.current = true;
            hopDirection.current = HOP_DIRECTIONS.DOWN;
            froggerLane.current -= 1;
        }
    }
}

export default Frog;