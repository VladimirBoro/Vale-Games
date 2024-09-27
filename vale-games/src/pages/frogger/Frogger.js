import React, { useEffect, useRef, useState } from "react";
import { HOP_DIRECTIONS, IDLE_ANIMATION, LANES, ANIMATIONS, GRID_DIMENSIONS, HOP_DISTANCE, CANVAS_SIZE } from "./contants/constants";
import { getLeaderboard, sendLeaderboardData } from "../../util/restful";
import frogSpriteSheet from "./sprites/frog/frog.png";
import Timer from "../../components/timer/Timer";
import GameOver from "../../components/gameover/GameOver";
import Leaderboard from '../../components/leaderboard/Leaderboard';
import styles from "./styles/styles.module.css";
import HowTo from "../../components/howTo/HowTo";
import Frog from "./objects/frog";
import Road from "./road";
import River from "./river";

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
    const contextRef = useRef();
    const frogRef = useRef(null);
    const roadRef = useRef(null);
    const riverRef = useRef(null);

    // SCORE DATA
    const touchedLanes = useRef([]);
    const levelMultiplier = useRef(1);
    const goalsReached = useRef(0);

    // STATIC BACKGROUND
    const background = useRef(null);

    const screenInFocus = useRef(true);
    const fpsRef = useRef(60);
    const fpsIntervalRef = useRef(1000 / fpsRef.current);
    const lastFrameTime = useRef(Date.now());

    const shouldDisplayLevelCleared = useRef(false);
    const levelCleared = useRef(false);

    // FLASHING TEXT FRAME TRACKERS
    const startGameFrameCount = useRef(0);
    const levelClearFrameCount = useRef(1);


    // DOCUMENT VISIBILITY HANDLER
    // init game on entry
    useEffect(() => {
        const initGame = () => {
            // canvas set up
            const canvas = canvasRef.current;
            canvas.width = CANVAS_SIZE.width;
            canvas.height = CANVAS_SIZE.height;
            contextRef.current = canvas.getContext("2d");
            // draw everything with shadowblur, it looks nice
            contextRef.current.strokeStyle = "white";
            contextRef.current.shadowColor = "black";
            contextRef.current.shadowBlur = 15;
            
            fetchLeaderboard();

            // create frog
            const frogSpriteSheetImg = new Image();
            frogSpriteSheetImg.src = frogSpriteSheet;
            frogRef.current = new Frog(frogSpriteSheetImg, loseHeart);
            // create road
            roadRef.current = new Road();
            // create river
            riverRef.current = new River();
        }

        localStorage.setItem("currentGame", "Frogger");
        window.dispatchEvent(new Event("game"));

        // initGame
        initGame();

        // tab out event listener
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                console.log("u cant see me!")
                screenInFocus.current = false;
            }
            else {
                console.log("document is here!");
                screenInFocus.current = true;
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return (document.removeEventListener("visibilitychange", handleVisibilityChange));
    }, [])

    // INPUT HANDLER
    useEffect(() => {
        const handleKeyDown = (event) => {
            const keyPress = event.keyCode;
            frogRef.current.hop(keyPress);

            const lane = frogRef.current.getLane();
            if (lane > 0 && !touchedLanes.current.includes(lane)) {
                touchedLanes.current.push(frogRef.current.getLane());
                setScore(prev => prev += 10 * (levelMultiplier.current));
            }
        }

        if (gameStarted && !gameOver) {
            document.body.addEventListener("keydown", handleKeyDown);
        }
        else {
            document.body.removeEventListener("keydown", handleKeyDown);
        }
        
        return () => {
            document.body.removeEventListener("keydown", handleKeyDown);
        };
    }, [gameStarted, gameOver]);

    // GAME LOOP HOOK
    useEffect(() => {
        let animFrame;

        fetchLeaderboard();
        updateGoals();
        drawBackground();
        
        const gameLoop = () => {
            // trigger lose game under these conditions!
            if (lives === 0 && gameStarted && !gameOver) {
                loseGame();
            }

            // UPDATES
            const deltaTime = Date.now() - lastFrameTime.current;
            if (deltaTime > fpsIntervalRef.current) {
                lastFrameTime.current = Date.now() - (deltaTime % fpsIntervalRef.current);
                
                // update all objects in world(frogger, and lanes (river factories objects, road factories objects))
                frogRef.current.update();
                roadRef.current.update(frogRef.current);
                riverRef.current.update(frogRef.current);
                scoreGoalHandler();
                updateTextFrames();
            }
            
            // DRAW
            clearScreen(contextRef.current);
            riverRef.current.draw(contextRef.current, showHitboxes);
            frogRef.current.draw(contextRef.current, showHitboxes);
            roadRef.current.draw(contextRef.current, showHitboxes);
            
            if ( ! gameStarted) {
                gameStartOverlay();
            }

            if (shouldDisplayLevelCleared.current) {
                levelClearMessage();
            }
            
            animFrame = requestAnimationFrame(gameLoop);
        }
        
        gameLoop();
        
        return () => {
            cancelAnimationFrame(animFrame);
        };
    }, [showGrid, showHitboxes, goals, gameOver, lives, gameStarted]);

    const updateTextFrames = () => {
        if ( ! gameStarted) {
            startGameFrameCount.current++;
        }
       
        if (levelCleared.current) {
            levelClearFrameCount.current++;
        }

        if (levelClearFrameCount.current % 15 == 0) {
            shouldDisplayLevelCleared.current = !shouldDisplayLevelCleared.current;
        }
        else if (levelClearFrameCount.current >= 75) {
            levelClearFrameCount.current = 1
            levelCleared.current = false;
            shouldDisplayLevelCleared.current = false;
        }
    }

    const updateGoals = () => {
        const initGoals = () => {
            let goalOffset = 1;
            let currentGoal;
            const initGoals = [];

            for (let i = 0; i < 5; i++) {
                let topLeftX = goalOffset * CANVAS_SIZE.width / 20 + (CANVAS_SIZE.width / 30)
                let topLeftY = HOP_DISTANCE.y / 5 * 2;
                let topL = {x: topLeftX , y: topLeftY};
                let bottomR = {x: topL.x + (1/3) * (CANVAS_SIZE.width / 10), y: (topL.y +  HOP_DISTANCE.y) / 4};

                currentGoal = {area: {topLeft: topL, bottomRight: bottomR}, occupied: false};
                initGoals.push(currentGoal);
                goalOffset += 4;
            }

            setGoals(prevGoals => [...prevGoals, ...initGoals]);
        }

        if (goals.length === 0) {
            initGoals();
        }
    }

    const scoreGoalHandler = () => {
        const froggerSize = frogRef.current.getSize();
        const froggerTopLeftHitbox = frogRef.current.getPosition();
        const froggerBottomRightHitbox = { x: froggerTopLeftHitbox.x + froggerSize.width,
            y: froggerTopLeftHitbox.y + froggerSize.height };

        for (let i = 0; i < goals.length; i++) {
            const goalTopLeft = goals[i].area.topLeft;
            const goalBottomRight = goals[i].area.bottomRight;

            // see if ith goal is colliding with frogger
            if ( ! ((froggerTopLeftHitbox.x >= goalBottomRight.x || goalTopLeft.x >= froggerBottomRightHitbox.x) 
                || (froggerTopLeftHitbox.y >= goalBottomRight.y / 2 || goalTopLeft.y >= froggerBottomRightHitbox.y)) 
                && !goals[i].occupied) {
                const updatedGoals = goals.map((goal, index) => 
                    index === i ? { ...goal, occupied: true } : goal
                );

                setGoals(updatedGoals);
                scoreGoal();
            }
        }
    }

    const levelClearMessage = () => {
        displayMessage("LEVEL CLEARED", "serif", "red");
    } 

    const displayMessage = (message, font, color) => {
        const context = contextRef.current;
        context.save();

        const x = (CANVAS_SIZE.width / 2) - ((1/7) * CANVAS_SIZE.width);
        const y = (CANVAS_SIZE.height / 2) + ((1/52) * CANVAS_SIZE.height);
        context.translate(x, y);
    
        const fontSize = Math.floor(CANVAS_SIZE.width / 22);
        context.font = `${fontSize}px ${font}`;
        context.fillStyle = color;
        context.fillText(message, 0, 0);
        
        context.restore();
    }

    const gameStartOverlay = () => {

        contextRef.current.fillStyle = "#00000052"
        contextRef.current.fillRect(0,0,CANVAS_SIZE.width,CANVAS_SIZE.height);

        if (startGameFrameCount.current < 75) {
            displayMessage("PRESS START", "serif", "red");
        }
        else if (startGameFrameCount.current > 125) {
            startGameFrameCount.current = 0;
        }
    }
    
    const drawBackground = () => {
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
                const goalX = goals[i].area.topLeft.x;
                const goalY = goals[i].area.topLeft.y;
                const goalWidth = goals[i].area.bottomRight.x - goalX;
                const goalHeight = goals[i].area.bottomRight.y;
                gridContext.fillRect(goalX, goalY, goalWidth, goalHeight);
            }
        }
        
        // TESTING GRID
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

        // set background
        background.current = grid;
    }

    const clearScreen = (context) => {
        context.clearRect(0, 0, GRID_DIMENSIONS.columnCount, GRID_DIMENSIONS.columnCount);
        context.drawImage(background.current, 0, 0);
    }
    
    const levelClear = () => {
        setGoals([]);
        goalsReached.current = 0;
        levelMultiplier.current += 1;
        roadRef.current.increaseDifficulty();
        riverRef.current.increaseDifficulty();
        levelCleared.current = true;
    }
    
    const scoreGoal = () => {
        scoreUp(100 * levelMultiplier.current);
        touchedLanes.current = [];
        frogRef.current.resetPosition();
        
        if (++goalsReached.current === 5) {
            levelClear();
        }
    }

    const scoreUp = (upAmount) => {
        setScore(prev => Math.floor(prev += upAmount));
    }
    
    const sendScore = async () => {
        let username = localStorage.getItem("user");
        console.log(username);
        
        if (username !== null) {
            sendLeaderboardData("frogger/add", username, score, "score");
        }
    }

    const fetchLeaderboard = async () => {
        setLeaderboard(await getLeaderboard("/frogger/leaderboard-top10"));
    }

    const loseHeart = () => {
        console.log("-1 life");
        setLives(prev => prev -= 1);
    }

    const loseGame =  async () => {
        setGameOver(true);
        sendScore();
    }

    const resetGame = () => {
        setGameStarted(false);
        setGameOver(false);
        setScore(0);
        setLives(3);
        setGoals([]);
        roadRef.current.resetDifficulty();
        riverRef.current.resetDifficulty();
        touchedLanes.current = [];
        goalsReached.current = 0;
        levelMultiplier.current = 1;
    }

    const handleGridPress = () => {
        setShowGrid(!showGrid);
    }

    const handleHitboxPress = () => {
        setShowHitboxes(!showHitboxes);
    }

    const startGame = () => {
        setGameStarted(true);
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
        <div className={styles.page}>
            <div className={styles.head}>
                <h2><Timer initTime={0} startTimer={gameStarted}/></h2>
                <h2>❤️ {lives}</h2>
                <h2>Score: {score}</h2>
            </div>
            <canvas ref={canvasRef} className={styles.canvas}/>
            <div className={styles.buttons}>
                <button onClick={handleGridPress}> Testing Grid </button>
                <button onClick={handleHitboxPress}> Hitboxes </button>
                {gameStarted ? (
                    <></>
                ) : (
                    <button onClick={startGame}> Start </button>
                )}
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