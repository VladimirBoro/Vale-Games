import React, { useEffect, useRef, useState } from "react";
import { HOP_DIRECTIONS, IDLE_ANIMATION, LANES, ANIMATIONS, CANVAS_WIDTH, CANVAS_HEIGHT } from "./contants/constants";
import Lane from "./Lane";
import frogSpriteSheet from "./sprites/frog/frog.png";
import Timer from "../../components/timer/Timer";
import GameOver from "../../components/gameover/GameOver";
import Leaderboard from '../../components/leaderboard/Leaderboard';
import styles from "./styles/styles.module.css";
import { getLeaderboard, sendLeaderboardData } from "../../util/restful";
import HowTo from "../../components/howTo/HowTo";

function Frogger() {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [showGrid, setShowGrid] = useState(false);
    const [showHitboxes, setShowHitboxes] = useState(false);
    const [goals, setGoals] = useState([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [leaderboard, setLeaderboard] = useState([]);

    // LOCAL CONSTANTS
    const numRows = 13;
    const numCols = 14;
    const framesPerJump = 5;
    const hopDistanceX = Math.floor(CANVAS_WIDTH / numCols);
    const hopDistanceY = Math.floor(CANVAS_HEIGHT / numRows);
    const initFrogX = (CANVAS_WIDTH / 2) - (hopDistanceX - 8);
    const initFrogY = CANVAS_HEIGHT - (hopDistanceY - 5);
    const fps = 60;
    const fpsInterval = 1000 / fps;

    const canvasRef = useRef(); // canvas dom reference

    // FROG SPRITE SHEET
    const frogSpriteSheetImg = new Image();
    frogSpriteSheetImg.src = frogSpriteSheet;
    // FROG FACING DIRECTION AND LANE POSITION
    const froggerDirection = useRef(1);
    const froggerLane = useRef(-1);
    // IDLE FRAMES
    const idleFrameIndex = useRef(0);
    const idleFrameCount = useRef(0);
    // HOPPING FRAMES
    const isHopping = useRef(false);
    const hopDirection = useRef(null);
    const hopFrameCount = useRef(0);
    const hopFrameIndex = useRef(0);
    // DYING FRAMES
    const dieFrameCount = useRef(0);
    const dieSpriteIndex = useRef(0);

    // SCORE DATA
    const touchedLanes = useRef([]);
    const levelMultiplier = useRef(1);
    const goalsReached = useRef(0);

    // STATIC BACKGROUND
    const testGrid = useRef(null);

    const isHit = useRef(false);

    const lastFroggerTime = useRef(Date.now());

    const froggerPosition = useRef({
        x: initFrogX, 
        y: initFrogY
    });
    
    const uncenteredY = CANVAS_HEIGHT - hopDistanceY;
    const lanes = [
        { laneNumber: 1, laneYPosition: uncenteredY - (hopDistanceY * 1) + 12, showHitboxes, isLevelScaled: false},
        // { laneNumber: 2, laneYPosition: uncenteredY - (hopDistanceY * 2) + 12, showHitboxes, isLevelScaled: true},
        // { laneNumber: 3, laneYPosition: uncenteredY - (hopDistanceY * 3) + 12, showHitboxes, isLevelScaled: false},
        // { laneNumber: 4, laneYPosition: uncenteredY - (hopDistanceY * 4) + 12, showHitboxes, isLevelScaled: true},
        // { laneNumber: 5, laneYPosition: uncenteredY - (hopDistanceY * 5) + 12, showHitboxes, isLevelScaled: false},
        // { laneNumber: 6, laneYPosition: uncenteredY - (hopDistanceY * 5) + 12, showHitboxes, isLevelScaled: false},
        // { laneNumber: 7, laneYPosition: uncenteredY - (hopDistanceY * 7) + 15, showHitboxes, isLevelScaled: true},
        // { laneNumber: 8, laneYPosition: uncenteredY - (hopDistanceY * 8) + 25, showHitboxes, isLevelScaled: false},
        // { laneNumber: 9, laneYPosition: uncenteredY - (hopDistanceY * 9) + 25, showHitboxes, isLevelScaled: true},
        // { laneNumber: 10, laneYPosition: uncenteredY - (hopDistanceY * 10) + 25, showHitboxes, isLevelScaled: true},
        // { laneNumber: 11, laneYPosition: uncenteredY - (hopDistanceY * 11) + 25, showHitboxes, isLevelScaled: false},
        // { laneNumber: 12, laneYPosition: uncenteredY - (hopDistanceY * 12) + 25, showHitboxes, isLevelScaled: false}
    ]
    .map(({ laneNumber, laneYPosition, showHitboxes, isLevelScaled }) => new Lane({ laneNumber, laneYPosition, showHitboxes, isLevelScaled }));

    // INPUT HANDLER
    useEffect(() => {
        if (gameStarted) {
            document.body.addEventListener("keydown", hop);
        }
        else {
            document.body.removeEventListener("keydown", hop);
        }
        
        return () => {
            document.body.removeEventListener("keydown", hop);
        };
    });

    // GAME LOOP HOOK
    useEffect(() => {
        let canvas = canvasRef.current;
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        let context = canvas.getContext("2d");
        context.shadowColor = "black";
        context.shadowBlur = 10;

        let lastLaneTime = Date.now();

        let animFrame;
        
        fetchLeaderboard();
        drawGrid();
        updateGoals();

        const gameLoop = () => {
            if (lives === 0 && gameStarted && !gameOver) {
                //ggs
                console.log("stop!");
                loseGame();
            }

            let deltaLaneTime = Date.now() - lastLaneTime;

            if (deltaLaneTime > fpsInterval) {
                lastLaneTime = Date.now() - (deltaLaneTime % fpsInterval);
                // LOGIC (move all objects)
                lanes.forEach(lane => lane.updateLaneObjects(levelMultiplier.current));
            }
            // lanes.forEach(lane => lane.updateLaneObjects(levelMultiplier.current));


            // check current lane for collisions with frog
            if ((froggerLane.current !== -1 && froggerLane.current !== 5 && froggerLane.current !== 11) && !isHit.current) {
                isHit.current = lanes[froggerLane.current].collideWithFrog(froggerPosition.current);
            }

            if (!isHit.current && froggerLane.current > 5 && froggerLane.current != 11) {
                driftFrogger();
            }
            
            // DRAW
            clearScreen(context);
            lanes.forEach(lane => lane.drawLaneObjects(context));
            
            let deltaFroggerTime = Date.now() - lastFroggerTime.current;
            drawFrogger(context, deltaFroggerTime);
            
            animFrame = requestAnimationFrame(gameLoop);
        }
        
        gameLoop();
        
        return () => {
            cancelAnimationFrame(animFrame);
        };
    }, [showGrid, showHitboxes, goals, lives, gameOver]);

    const missGoal = () => {
        let topLeftOfFrog = {x: froggerPosition.current.x, y: froggerPosition.current.y};
        let bottomRightOfFrog = {x: topLeftOfFrog.x + 38, y: topLeftOfFrog.y + 32};

        for (let i = 0; i < goals.length; i++) {
            const goalTopLeft = goals[i].area.topLeft;
            const goalBottomRight = goals[i].area.bottomRight;

            if (!((topLeftOfFrog.x >= goalBottomRight.x || goalTopLeft.x >= bottomRightOfFrog.x) || 
            (topLeftOfFrog.y >= goalBottomRight.y || goalTopLeft.y >= bottomRightOfFrog.y)) && !goals[i].occupied) {
                console.log("we made it!", topLeftOfFrog, bottomRightOfFrog, goalTopLeft, goalBottomRight);
                const updatedGoals = goals.map((goal, index) => 
                    index === i ? { ...goal, occupied: true } : goal
                );
                setGoals(updatedGoals);
                return false;
            }
        }

        return true;
    }

    const updateGoals = () => {
        const initGoals = () => {
            let goalOffset = 1;
            let currentGoal;
            const initGoals = [];

            for (let i = 0; i < 5; i++) {
                let topLeftX = goalOffset * CANVAS_WIDTH / 20 + (CANVAS_WIDTH / 30)
                let topLeftY = hopDistanceY / 5 * 2;
                let topL = {x: topLeftX , y: topLeftY};
                let bottomR = {x: topL.x + (1/3) * (CANVAS_WIDTH / 10), y: topL.y +  hopDistanceY};
                currentGoal = {area: {topLeft: topL, bottomRight: bottomR}, occupied: false};
                initGoals.push(currentGoal);
                goalOffset += 4;
            }

            setGoals(prevGoals => [...prevGoals, ...initGoals]);
        }

        if (goals.length === 0) {
            console.log("initializing goals");
            initGoals();
        }
    }
    
    const drawGrid = () => {
        const grid = document.createElement("canvas");
        grid.width = CANVAS_WIDTH;
        grid.height = CANVAS_HEIGHT;
        const gridContext = grid.getContext("2d");

        gridContext.fillStyle = "#161518"; // black road
        gridContext.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

        gridContext.fillStyle = "grey";
        gridContext.fillRect(0, CANVAS_HEIGHT - hopDistanceY, CANVAS_WIDTH, hopDistanceY);
        gridContext.fillRect(0, CANVAS_HEIGHT - hopDistanceY * 7, CANVAS_WIDTH, hopDistanceY);
        
        gridContext.fillStyle = "#1a237e"; // water
        gridContext.fillRect(0, 0, CANVAS_WIDTH, hopDistanceY * 6);
        
        gridContext.fillStyle = "green";
        gridContext.fillRect(0, 0, CANVAS_WIDTH, hopDistanceY);
        
        gridContext.fillStyle = "#1a237e"; // water
        
        // SET AND DRAW GOALS
        let goalOffset = 1;
        for (let i = 0; i < 5; i++) {
            gridContext.fillRect(goalOffset * CANVAS_WIDTH / 20, hopDistanceY / 5, CANVAS_WIDTH / 10, hopDistanceY - (hopDistanceY / 5));
            goalOffset += 4;
        }
        
        // GOAL LANDING PADS
        gridContext.fillStyle = "limegreen";
        for (let i = 0; i < goals.length; i++) {
            if (!goals[i].occupied) {
                let goalX = goals[i].area.topLeft.x;
                let goalY = goals[i].area.topLeft.y;
                let goalWidth = goals[i].area.bottomRight.x - goalX;
                let goalHeight = goals[i].area.bottomRight.y / 4;
                gridContext.fillRect(goalX, goalY, goalWidth, goalHeight);
            }
        }
        
        if (showGrid) {
            gridContext.beginPath();
    
            // grid column lines
            for (let i = 0; i < numCols; i++) {
                gridContext.moveTo(hopDistanceX * i, hopDistanceY);
                gridContext.lineTo(hopDistanceX * i, CANVAS_HEIGHT);
            }
            
            // grid row lines
            for (let i = 0; i < numRows; i++) {
                gridContext.moveTo(0, hopDistanceY * i);
                gridContext.lineTo(CANVAS_WIDTH, hopDistanceY * i);
            }
            
            // GOAL SEGMENTS
            for (let i = 0; i < 5; i++) {
                gridContext.moveTo(CANVAS_WIDTH / 5 * i, 0);
                gridContext.lineTo(CANVAS_WIDTH / 5 * i, hopDistanceY);
            }
    
            gridContext.strokeStyle = "white";
            gridContext.stroke();
        }

        testGrid.current = grid;
    }

    const driftFrogger = () => {
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

    const moveFrogger = () => {
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

    const drawCurrentFrogSprite = (context, currentFrame) => {
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

    const hopAnimation = (context, deltaTime) => {
        hopFrameCount.current++;

        if (deltaTime > fpsInterval) {
            lastFroggerTime.current = Date.now() - (deltaTime % fpsInterval);
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

    const idleAnimation = (context, deltaTime) => {
        const postion = froggerPosition.current;
            
        if (deltaTime > fpsInterval) {
            idleFrameCount.current++;
        }
    
        if (idleFrameCount.current % 15 === 0) {
            lastFroggerTime.current = Date.now() - (deltaTime % fpsInterval);
            idleFrameIndex.current++;
        }

        if (idleFrameIndex.current > 2) {
            idleFrameIndex.current = 0;
        }

        let currentFrame = IDLE_ANIMATION[idleFrameIndex.current];
        drawCurrentFrogSprite(context, currentFrame);
    }

    const deathAnimation = (context) => {
        dieFrameCount.current++;

        if (dieFrameCount.current % 15 === 0) {
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

    const drawFrogger = (context, deltaTime) => {
        context.save();
        context.scale(froggerDirection.current, 1);
        
        if (isHit.current && !isHopping.current) {
            // RIP...
            deathAnimation(context, deltaTime);
        }

        // TODO: move to move function
        if (!isHopping.current && froggerLane.current == 11) {
            if (!missGoal()) {
                scoreGoal();
            }
            else {
                isHit.current = true;
            }            
        }
        
        if (isHopping.current) {
            idleFrameIndex.current = 0;
            // playAnimation(ANIMATIONS.HOP);
            hopAnimation(context, deltaTime);
        }
        else if (!isHit.current) {
            // idle...
            idleAnimation(context, deltaTime);
        }
        
        context.restore();
    }

    const hop = (event) => {
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

    const clearScreen = (context) => {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.drawImage(testGrid.current, 0, 0);
    }

    const loseHeart = () => {
        setLives(prev => prev -= 1);
    }

    const scoreUp = (upAmount) => {
        setScore(prev => Math.floor(prev += upAmount));
    }

    const scoreGoal = () => {
        scoreUp(200 * levelMultiplier.current);
        touchedLanes.current = [];
        
        console.log("golasos", goalsReached.current);
        if (++goalsReached.current === 5) {
            levelClear();
        }

        resetFrogger();
    }
    
    const levelClear = () => {
        console.log("cleared!");
        setGoals([]);
        goalsReached.current = 0;
        levelMultiplier.current += 0.25;
    }

    const fetchLeaderboard = async () => {
        setLeaderboard(await getLeaderboard("/frogger/leaderboard-top10"));
    }

    const sendScore = async () => {
        let username = localStorage.getItem("user");
        console.log(username);

        if (username !== null) {
            sendLeaderboardData("frogger/add", username, score, "score");
        }
    }

    const loseGame =  () => {
        setGameOver(true);
        setGameStarted(false);

        // send score to server here
        sendScore();
    }

    const resetGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setLives(3);
        setGoals([]);
        resetFrogger();
        touchedLanes.current = [];
        goalsReached.current = 0;
        levelMultiplier.current = 1;
    }

    const resetFrogger = () => {
        isHit.current = false;
        isHopping.current = false;
        hopFrameIndex.current = 0;
        dieFrameCount.current = 0;
        dieSpriteIndex.current = 0;
        froggerPosition.current = {x: initFrogX, y: initFrogY};
        froggerLane.current = -1;
    }

    const handleGridPress = () => {
        setShowGrid(!showGrid);
    }

    const handleHitboxPress = () => {
        setShowHitboxes(!showHitboxes);
    }

    const startGame = () => {
        resetGame();
    }

    // print row function to be passed into Leaderboard
    const printRow = (entry) => {
        return (
            <>
                <th scope="row">{entry.username}</th>
                <td>{entry.date}</td>
                <td>{entry.score}</td>
            </>
        )
    }

    const summary = () => {
        return "Welcome to Frogger! Try your best to reach one of the square lilypads on the other"
        + " side of the road and river. Reaching every platform will restart the process except"
        + " the speed of some of the lanes increase, so don't get too comfortable!"
    }

    const controls = () => {
        return ["WASD or Arrow Keys => Hop left, right, up, or down"
        ]
    }

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{display: "flex", justifyContent: "space-around", width: "500px"}}>
                <h2><Timer initTime={0} startTimer={gameStarted}/></h2>
                <h2>❤️ {lives}</h2>
                <h2>Score: {score}</h2>
            </div>
            {/* <canvas ref={canvasRef} style={{width: CANVAS_WIDTH, height: CANVAS_HEIGHT}}/> */}
            <canvas ref={canvasRef} className={styles.canvas}/>
            <div>
                <button onClick={handleGridPress} style={{margin:"1em"}}>Testing Grid</button>
                <button onClick={handleHitboxPress} style={{marginTop:"1em"}}>Hitboxes</button>
                <button onClick={startGame} style={{marginTop:"1em"}}>Start</button>
            </div>
            <HowTo summary={summary()} controls={controls()}/>
            <Leaderboard data={leaderboard} printRow={printRow} metric={"Score"}/>
            { gameOver ? (
                    <GameOver lost={true} metric="Score" value={score} tryAgain={resetGame}/>
                ) : (
                    <></>
                )
            }
        </div>

    )
}

export default Frogger;