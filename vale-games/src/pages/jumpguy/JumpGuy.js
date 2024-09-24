import React, { useEffect, useRef, useState } from "react";
import { CANVAS, DIRECTIONS, GUY } from "./constants";
import { getLeaderboard, sendLeaderboardData } from "../../util/restful";
import styles from "./styles.module.css";
import Guy from "./guy";
import PlatformFactory from "./platforms/platformFactory";
import GameOver from "../../components/gameover/GameOver";
import Leaderboard from "../../components/leaderboard/Leaderboard";
import HowTo from "../../components/howTo/HowTo";
import StartButton from "./components/StartButton";
import CloudFactory from "./clouds/cloudFactory";

function JumpGuy() {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [hideStartButton, setHideStartButton] = useState(false);
    const [score, setScore] = useState(0);
    const [leaderboard, setLeaderboard] = useState([]);
    
    const canvasRef = useRef(null);
    const jumpGuyRef = useRef(null);
    const stage = useRef(1);
    const platformFactory = useRef();
    const cloudFactory = useRef();
    
    const gameScoreRef = useRef(0);
    const nextStageRef = useRef(2500);

    const fps = useRef(60);
    const fpsIntervalRef = useRef(1000/ fps.current);
    const lastFrameTimeRef = useRef(Date.now());

    // init game and set up controls
    useEffect(() => {
        initGame();
        const jumpGuy = jumpGuyRef.current;

        const handleKeyDown = (event) => {
            let key = event.key;
            if (key === "ArrowLeft" || key === "a" || key === "A") {
                jumpGuy.movingLeft = true;

            }
            else if (key === "ArrowRight" || key === "d" || key === "D") {
                jumpGuy.movingRight = true;
            }
        }

        const handleKeyUp = (event) => {
            let key = event.key;
            if (key === "ArrowLeft" || key === "a" || key === "A") {
                jumpGuy.movingLeft = false;

            }
            else if (key === "ArrowRight" || key === "d" || key === "D") {
                jumpGuy.movingRight = false;
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        }
    }, []);

    useEffect(() => {
        const username = localStorage.getItem("user");
        if (username !== null && score !== 0) {
            submitScore(username);
        }
    }, [gameOver])

    // GAME LOOP HERE
    useEffect(() => {
        // set some stuff up before starting the game loop
        const canvas = canvasRef.current;
        canvas.width = CANVAS.width;
        canvas.height = CANVAS.height;
        const context = canvas.getContext("2d");
        
        const jumpGuy = jumpGuyRef.current;

        fetchLeaderboard();

        clearCanvas(context);
        cloudFactory.current.drawClouds(context);
        platformFactory.current.drawPlatforms(context);
        jumpGuy.draw(context);
        console.log("right after init drawing");

        let animationId;
         
        // START THE GAME LOOP HERE
        if (gameStarted) {
            jumpGuy.jump();

            const gameLoop = () => {
                clearCanvas(context);
                
                const deltaTime = Date.now() - lastFrameTimeRef.current;

                // update game at 60fps
                if (deltaTime > fpsIntervalRef.current) {
                    lastFrameTimeRef.current = Date.now() - (deltaTime % fpsIntervalRef.current);
                    updateGame();
                }

                // draw everything
                cloudFactory.current.drawClouds(context);
                platformFactory.current.drawPlatforms(context);
                jumpGuy.draw(context);
    
                animationId = requestAnimationFrame(gameLoop);
            }
    
            gameLoop();
    
            return () => {
                cancelAnimationFrame(animationId);
            }
        }
    }, [gameStarted, gameOver])

    const updateJumpGuy = () => {
        if (jumpGuyRef.current.movingRight) {
            jumpGuyRef.current.move(DIRECTIONS.right);
        }
        if (jumpGuyRef.current.movingLeft) {
            jumpGuyRef.current.move(DIRECTIONS.left);
        }

        // apply jumping/falling to our guy
        jumpGuyRef.current.update(); 

        /*
        when jump guy reaches 2/3 up the canvas, apply his current speed
        in the opposite direction to the platforms. During this time
        jump guy will be glued to the 2/3 position for the effect of
        shifting our camera upwards. 
        */
       let speed = 0;
       if (jumpGuyRef.current.y < CANVAS.height - (2 * CANVAS.height / 3)) {
           speed = jumpGuyRef.current.jumpSpeed;
        }

        return speed;
    }

    const updatePlatforms = (speed) => {
        platformFactory.current.updatePlatforms(speed, jumpGuyRef.current, stage.current);
    }
    
    const updateClouds = (speed) => {
        cloudFactory.current.updateClouds(speed, jumpGuyRef.current);
    }

    const updateGame = () => {
       const speed = updateJumpGuy();
        
       updateClouds(speed);
       updatePlatforms(speed);

        // track jumpguy's current height and use max value as our score
        const currentHeight = Math.abs(Math.round(jumpGuyRef.current.currentHeight));
        if (currentHeight > gameScoreRef.current) {
            gameScoreRef.current = currentHeight;
            setScore(currentHeight);
        }

        // increase difficulty based on current score
        if (gameScoreRef.current > nextStageRef.current && nextStageRef.current < 27500) {
            nextStageRef.current += 2500;
            platformFactory.current.advanceStage();
            console.log("NEXT LEVEL", stage.current, nextStageRef.current);
        }
    }

    const initGame = async () => {
        stage.current = 1;
        cloudFactory.current =  new CloudFactory();
        platformFactory.current =  new PlatformFactory();
        jumpGuyRef.current = new Guy(GUY.x, GUY.y, GUY.width, GUY.height, loseGame);

    }

    const clearCanvas = (context) => {
        context.clearRect(0, 0, CANVAS.width, CANVAS.height);
        context.fillStyle = "#3f51b5";
        context.fillRect(0, 0, CANVAS.width, CANVAS.height);
    }

    const resetGame = () => {
        cloudFactory.current.reset();
        platformFactory.current.reset();
        jumpGuyRef.current.reset();
        setGameOver(false);
        setHideStartButton(false);
        gameScoreRef.current = 0;
        setScore(0);
    }

    const startGame = () => {
        setHideStartButton(true);
        setGameStarted(true);
    }

    const fetchLeaderboard = async () => {
        setLeaderboard(await getLeaderboard("/jumpguy/leaderboard-top10"));
    }

    const submitScore = (username) => {
        sendLeaderboardData("/jumpguy/add", username, score, "score");
    }

    const loseGame = () => {
        stage.current = 1;
        setGameOver(true);
        setGameStarted(false);
    }

    const toggleHitbox = () => {
        jumpGuyRef.current.showHitbox = !jumpGuyRef.current.showHitbox;
    }

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
        return "Welcome to Jump Guy! The objective in this game is to get as high as possible"
        + " without falling below the screen.\n As you climb higher the difficulty will increase, with new"
        + " platform types appearing and the distance between them increasing. \n"
    }

    const controls = () => {
        return ["Left Arrow / Right Arrow OR A / D => Move Left and Move Right",
                "Going off the side of the screen brings you to the opposite side"
        ]
    }

    return (
        <div className={styles.page}>
            <h2>Score: {score}</h2>
            <div >
                <canvas className={styles.canvas} ref={canvasRef} />
            </div>
            <div className={styles.button}>
                <StartButton hideButton={hideStartButton} startGame={startGame} />
                <button onClick={toggleHitbox}>Show Hitbox</button>
            </div>
            <HowTo summary={summary()} controls={controls()}/>
            <Leaderboard data={leaderboard} printRow={printRow} metric={"score"}/>
            { gameOver ? (
                    <GameOver lost={true} metric="Score" value={score} tryAgain={resetGame}/>
                ) : (
                    <></>
                )
            }
        </div>
    )
}

export default JumpGuy;