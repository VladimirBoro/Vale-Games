import React, { useEffect, useRef, useState } from "react";
import { CANVAS, DIRECTIONS, GUY, PLATFORM_TYPE, PLATFORM_ROLES } from "./constants";
import styles from "./styles.module.css";
import Guy from "./guy";
import PlatformFactory from "./platforms/platformFactory";
import GameOver from "../../components/gameover/GameOver";
import Leaderboard from "../../components/leaderboard/Leaderboard";
import StartButton from "./components/StartButton";

function JumpGuy() {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    
    const canvasRef = useRef(null);
    const jumpGuyRef = useRef(null);
    const stage = useRef(1);
    const platformFactory = useRef();
    
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
    }, [gameStarted]);

    // GAME LOOP HERE
    useEffect(() => {
        // set some stuff up before starting the game loop
        const canvas = canvasRef.current;
        canvas.width = CANVAS.width;
        canvas.height = CANVAS.height;
        const context = canvas.getContext("2d");
        
        const jumpGuy = jumpGuyRef.current;

        clearCanvas(context);
        jumpGuy.draw(context);
        platformFactory.current.drawPlatforms(context);

        let animationId;
        let gameScore = 0;
        let nextStage = 100;
         
        // START THE GAME LOOP HERE
        if (gameStarted) {
            jumpGuy.jump();

            const gameLoop = () => {
                clearCanvas(context);
    
                if (jumpGuy.movingRight) {
                    jumpGuy.move(DIRECTIONS.right);
                }
                if (jumpGuy.movingLeft) {
                    jumpGuy.move(DIRECTIONS.left);
                }

                // apply jumping/falling to our guy
                jumpGuy.update(); 

                // track jumpguy's current height and use max value as our score
                const currentHeight = Math.abs(Math.round(jumpGuy.currentHeight));
                if (currentHeight > gameScore) {
                    gameScore = currentHeight;
                    setScore(currentHeight);
                }

                // increase difficulty based on current score
                if (gameScore > nextStage && nextStage != 100000) {
                    nextStage += nextStage;
                    stage.current += 1;
                    console.log("NEXT LEVEL", stage.current);
                }

                /*
                    when jump guy reaches 2/3 up the canvas, apply his current speed
                    in the opposite direction to the platforms. During this time
                    jump guy will be glued to the 2/3 position for the effect of
                    shifting our camera upwards. 
                */
                let speed = 0;
                if (jumpGuy.y < CANVAS.height - (2 * CANVAS.height / 3)) {
                    speed = jumpGuy.jumpSpeed;
                }

                // update platforms
                platformFactory.current.updatePlatforms(speed, jumpGuy);
    
                // draw everything
                platformFactory.current.drawPlatforms(context);
                jumpGuy.draw(context);
    
                animationId = requestAnimationFrame(gameLoop);
            }
    
            gameLoop();
    
            return () => {
                cancelAnimationFrame(animationId);
            }
        }

    }, [gameStarted])

    const initGame = () => {
        stage.current = 1;
        platformFactory.current = new PlatformFactory();
        jumpGuyRef.current = new Guy(GUY.x, GUY.y, GUY.width, GUY.height, loseGame);
    }

    const clearCanvas = (context) => {
        context.clearRect(0, 0, CANVAS.width, CANVAS.height);
        context.fillStyle = "black";
        context.fillRect(0, 0, CANVAS.width, CANVAS.height);
    }

    const startGame = () => {
        setGameOver(false);
        setScore(0);
        setGameStarted(true);
    }

    const loseGame = () => {
        setGameOver(true);
        setGameStarted(false);
    }

    return (
        <div className={styles.page}>
            <h2>Score: {score}</h2>
            <div >
                <canvas className={styles.canvas} ref={canvasRef} />
            </div>
            <div className={styles.button}>
                <StartButton gameStarted={gameStarted} startGame={startGame} />
            </div>
            {/* <Leaderboard data={[1,2,3]} printRow={[]} metric={"score"}/> */}
            { gameOver ? (
                    <GameOver lost={true} metric="Score" value={score} tryAgain={startGame}/>
                ) : (
                    <></>
                )
            }
        </div>
    )
}

export default JumpGuy;