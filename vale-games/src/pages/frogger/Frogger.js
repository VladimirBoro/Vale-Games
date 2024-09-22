import React, { useEffect, useRef, useState } from "react";
import { HOP_DIRECTIONS, IDLE_ANIMATION, LANES, ANIMATIONS, GRID_DIMENSIONS, HOP_DISTANCE, CANVAS_SIZE } from "./contants/constants";
import { getLeaderboard, sendLeaderboardData } from "../../util/restful";
import Lane from "./Lane";
import frogSpriteSheet from "./sprites/frog/frog.png";
import Timer from "../../components/timer/Timer";
import GameOver from "../../components/gameover/GameOver";
import Leaderboard from '../../components/leaderboard/Leaderboard';
import styles from "./styles/styles.module.css";
import HowTo from "../../components/howTo/HowTo";
import Frog from "./frog";

function Frogger() {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [showGrid, setShowGrid] = useState(false);
    const [showHitboxes, setShowHitboxes] = useState(false);
    const [goals, setGoals] = useState([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [leaderboard, setLeaderboard] = useState([]);

    const canvasRef = useRef(); // canvas dom reference
    const frogRef = useRef();
    const roadRef = useRef();
    const riverRef = useRef();

    // SCORE DATA
    const touchedLanes = useRef([]);
    const levelMultiplier = useRef(1);
    const goalsReached = useRef(0);

    // STATIC BACKGROUND
    const testGrid = useRef(null);

    const fpsRef = useRef(60);
    const fpsIntervalRef = useRef(1000 / fpsRef.current);
    const lastFrameTime = useRef(Date.now());
    
    // const uncenteredY = GRID_DIMENSIONS.columnCount - HOP_DISTANCE.y;
    // const lanes = [
    //     { laneNumber: 1, laneYPosition: uncenteredY - (HOP_DISTANCE.y * 1) + 12, showHitboxes, isLevelScaled: false},
    //     { laneNumber: 2, laneYPosition: uncenteredY - (HOP_DISTANCE.y * 2) + 12, showHitboxes, isLevelScaled: true},
    //     { laneNumber: 3, laneYPosition: uncenteredY - (HOP_DISTANCE.y * 3) + 12, showHitboxes, isLevelScaled: false},
    //     { laneNumber: 4, laneYPosition: uncenteredY - (HOP_DISTANCE.y * 4) + 12, showHitboxes, isLevelScaled: true},
    //     { laneNumber: 5, laneYPosition: uncenteredY - (HOP_DISTANCE.y * 5) + 12, showHitboxes, isLevelScaled: false},
    //     { laneNumber: 6, laneYPosition: uncenteredY - (HOP_DISTANCE.y * 5) + 12, showHitboxes, isLevelScaled: false},
    //     { laneNumber: 7, laneYPosition: uncenteredY - (HOP_DISTANCE.y * 7) + 15, showHitboxes, isLevelScaled: true},
    //     { laneNumber: 8, laneYPosition: uncenteredY - (HOP_DISTANCE.y * 8) + 25, showHitboxes, isLevelScaled: false},
    //     { laneNumber: 9, laneYPosition: uncenteredY - (HOP_DISTANCE.y * 9) + 25, showHitboxes, isLevelScaled: true},
    //     { laneNumber: 10, laneYPosition: uncenteredY - (HOP_DISTANCE.y * 10) + 25, showHitboxes, isLevelScaled: true},
    //     { laneNumber: 11, laneYPosition: uncenteredY - (HOP_DISTANCE.y * 11) + 25, showHitboxes, isLevelScaled: false},
    //     { laneNumber: 12, laneYPosition: uncenteredY - (HOP_DISTANCE.y * 12) + 25, showHitboxes, isLevelScaled: false}
    // ]
    // .map(({ laneNumber, laneYPosition, showHitboxes, isLevelScaled }) => new Lane({ laneNumber, laneYPosition, showHitboxes, isLevelScaled }));

    // INPUT HANDLER
    useEffect(() => {
        const frogSpriteSheetImg = new Image();
        frogSpriteSheetImg.src = frogSpriteSheet;
        frogRef.current = new Frog(GRID_DIMENSIONS.rowCount, GRID_DIMENSIONS.columnCount, frogSpriteSheetImg);

        const handleKeyDown = (event) => {
            const keyPress = event.keyCode;
            frogRef.current.hop(keyPress);
        }

        if (gameStarted) {
            document.body.addEventListener("keydown", handleKeyDown);
        }
        else {
            document.body.removeEventListener("keydown", handleKeyDown);
        }
        
        return () => {
            document.body.removeEventListener("keydown", handleKeyDown);
        };
    });

    // GAME LOOP HOOK
    useEffect(() => {
        const initGame = () => {
            const canvas = canvasRef.current;
            canvas.width = CANVAS_SIZE.width;
            canvas.height = CANVAS_SIZE.height;
            const context = canvas.getContext("2d");
            context.shadowColor = "black";
            context.shadowBlur = 10;

            return context;
        }

        // initGame and get context;
        const context = initGame();
        let animFrame;
        
        // fetchLeaderboard();
        drawGrid();
        updateGoals();

        const gameLoop = () => {
            // if (lives === 0 && gameStarted && !gameOver) {
            //     //ggs
            //     console.log("stop!");
            //     loseGame();
            // }

            const deltaTime = Date.now() - lastFrameTime.current;
            if (deltaTime > fpsIntervalRef.current) {
                // update all objects in world(frogger, and lanes (river factories objects, road factories objects))
                lastFrameTime.current = Date.now() - (deltaTime % fpsIntervalRef.current);
                frogRef.current.update();
            }
            
            // DRAW
            clearScreen(context);
            frogRef.current.draw(context);
            // drawFrogger(context, deltaFroggerTime);
            
            animFrame = requestAnimationFrame(gameLoop);
        }
        
        gameLoop();
        
        return () => {
            cancelAnimationFrame(animFrame);
        };
    }, [showGrid, showHitboxes, goals, lives, gameOver]);

    const updateGoals = () => {
        const initGoals = () => {
            let goalOffset = 1;
            let currentGoal;
            const initGoals = [];

            for (let i = 0; i < 5; i++) {
                let topLeftX = goalOffset * CANVAS_SIZE.width / 20 + (CANVAS_SIZE.width / 30)
                let topLeftY = HOP_DISTANCE.y / 5 * 2;
                let topL = {x: topLeftX , y: topLeftY};
                let bottomR = {x: topL.x + (1/3) * (CANVAS_SIZE.width / 10), y: topL.y +  HOP_DISTANCE.y};
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
        grid.width = CANVAS_SIZE.width;
        grid.height = CANVAS_SIZE.height;
        const gridContext = grid.getContext("2d");

        gridContext.fillStyle = "#161518"; // black road
        gridContext.fillRect(0,0,CANVAS_SIZE.width,CANVAS_SIZE.height);

        gridContext.fillStyle = "grey";
        gridContext.fillRect(0, CANVAS_SIZE.height - HOP_DISTANCE.y, CANVAS_SIZE.width, HOP_DISTANCE.y);
        gridContext.fillRect(0, CANVAS_SIZE.height - HOP_DISTANCE.y * 7, CANVAS_SIZE.width, HOP_DISTANCE.y);
        
        gridContext.fillStyle = "#1a237e"; // water
        gridContext.fillRect(0, 0, CANVAS_SIZE.width, HOP_DISTANCE.y * 6);
        
        gridContext.fillStyle = "green";
        gridContext.fillRect(0, 0, CANVAS_SIZE.width, HOP_DISTANCE.y);
        
        gridContext.fillStyle = "#1a237e"; // water
        
        // SET AND DRAW GOALS
        let goalOffset = 1;
        for (let i = 0; i < 5; i++) {
            gridContext.fillRect(goalOffset * CANVAS_SIZE.width / 20, HOP_DISTANCE.y / 5, CANVAS_SIZE.width / 10, HOP_DISTANCE.y - (HOP_DISTANCE.y / 5));
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
            for (let i = 0; i < GRID_DIMENSIONS.columnCount; i++) {
                gridContext.moveTo(HOP_DISTANCE.x * i, HOP_DISTANCE.y);
                gridContext.lineTo(HOP_DISTANCE.x * i, CANVAS_SIZE.height);
            }
            
            // grid row lines
            for (let i = 0; i < GRID_DIMENSIONS.rowCount; i++) {
                gridContext.moveTo(0, HOP_DISTANCE.y * i);
                gridContext.lineTo(CANVAS_SIZE.width, HOP_DISTANCE.y * i);
            }
            
            // GOAL SEGMENTS
            for (let i = 0; i < 5; i++) {
                gridContext.moveTo(CANVAS_SIZE.width / 5 * i, 0);
                gridContext.lineTo(CANVAS_SIZE.width / 5 * i, HOP_DISTANCE.y);
            }
    
            gridContext.strokeStyle = "white";
            gridContext.stroke();
        }

        testGrid.current = grid;
    }

    const clearScreen = (context) => {
        context.clearRect(0, 0, GRID_DIMENSIONS.columnCount, GRID_DIMENSIONS.columnCount);
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
        // isHit.current = false;
        // isHopping.current = false;
        // hopFrameIndex.current = 0;
        // dieFrameCount.current = 0;
        // dieSpriteIndex.current = 0;
        // froggerPosition.current = {x: initFrogX, y: initFrogY};
        // froggerLane.current = -1;
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
            {/* <canvas ref={canvasRef} style={{width: GRID_DIMENSIONS.columnCount, height: GRID_DIMENSIONS.columnCount}}/> */}
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