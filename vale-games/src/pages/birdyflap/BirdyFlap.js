import React, { useEffect, useRef, useState } from "react";
import { CANVAS } from "./constants";
import { Pipe } from "./pipe";
import { Birdy } from "./birdy";
import { Mountains } from "./mountinas";
import { sendLeaderboardData } from "../../util/restful";
import { PiMouseLeftClickFill } from "react-icons/pi";
import GameOver from "../../components/gameover/GameOver";
import sky from "./images/sky.png";
import mountainRange from "./images/mountains.png"
import Leaderboard from "../../components/leaderboard/Leaderboard";
import HowTo from "../../components/howTo/HowTo";
import styles from "./styles.module.css";

function BirdyFlap () {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [gamePaused, setGamePaused] = useState(true);
    const [isScoreSent, setIsScoreSent] = useState(false);
    
    const skyImage = new Image();
    skyImage.src = sky;

    const mountainsImage = new Image();
    mountainsImage.onload = function () {
        let context = canvasRef.current.getContext("2d");
        drawGame(context, pipesRef.current, birdyRef.current, 
            mountainsRef.current);
    };
    mountainsImage.src = mountainRange;
    
    const canvasRef = useRef();
    const birdyRef = useRef();
    const pipesRef = useRef([]);
    const mountainsRef = useRef([]);
    const fpsRef = useRef(60);
    const fpsIntervalRef = useRef(1000 / fpsRef.current);
    const lastFrameTimeRef = useRef(Date.now());
    
    // initGame
    useEffect(() => {
        localStorage.setItem("currentGame", "Flappy Bat");
        window.dispatchEvent(new Event("game"));

        initGame();

        canvasRef.current.addEventListener("mousedown", onClick);

        return () => {
            document.body.removeEventListener("mousedown", onClick);
        };
    }, [])

    useEffect(() => {
        if (gameStarted) {
            sendScore(score);
        }
    }, [gameOver])

    // MAIN LOOP
    useEffect(() => {
        let canvas = canvasRef.current;
        canvas.width = CANVAS.width; 
        canvas.height = CANVAS.height;
        let context = canvas.getContext("2d"); 


        let animationFrame;
        const gameLoop = () => {
            const deltaTime = Date.now() - lastFrameTimeRef.current;

            // UPDATES
            if (deltaTime > fpsIntervalRef.current) {
                lastFrameTimeRef.current = Date.now() - (deltaTime % fpsIntervalRef.current);
                updateGame();
            }

            // DRAW
            drawGame(context);

            animationFrame = requestAnimationFrame(gameLoop);
        }

        let pipeInterval;

        // only spawn pipes
        if (!gameOver && !gamePaused) {
            pipeInterval = setInterval(spawnPipe, 2500);
        }

        if (!gamePaused) {
            gameLoop();
        }
        else {
            drawGame(context);
        }

        return () => {
            cancelAnimationFrame(animationFrame);
            clearInterval(pipeInterval);    
        }
    }, [gameOver, gamePaused])

    const initGame = () => {
        canvasRef.current.getContext("2d");
        mountainsRef.current.push(new Mountains(mountainsImage, 0));
        spawnBirdy();
    }
    
    const spawnBirdy = () => {
        birdyRef.current = new Birdy();
    }

    const randomPipeSpawn = () => {
        let x = CANVAS.width;
        const yLength = CANVAS.height / 3;
        let y = Math.random() * yLength + yLength;

        return {x: x, y: y};
    }

    const spawnPipe = () => {
        const width = 50;
        const gap = CANVAS.height / 6;
        let position = randomPipeSpawn();
        const speed = 2.4;

        let pipe = new Pipe(width, gap, position, speed, destroyPipe);

        // push new pipe 
        pipesRef.current.push(pipe);
    }

    const destroyPipe = () => {
        pipesRef.current.splice(0, 1);
    }
    
    const resetGame = () => {
        console.log("resetting game...");
        pipesRef.current = [];
        setGameOver(false);
        setScore(0);
        pauseGame();
        spawnBirdy();
    }
    
    const pauseGame = () => {
        setGamePaused(!gamePaused);
        setGameStarted(!gameStarted);
    }

    const updateGame = () => {
        if (!gameOver) {
            updatePipes();
            updateBackground();
        }

        updateBirdy();
    }

    const updatePipes = () => {
        pipesRef.current.forEach((pipe) => {
            pipe.update(birdyRef.current) // pass in birdy to check for collisions
            if (pipe.score(birdyRef.current)) {
                setScore(prev => prev += 1);
            }
        });
    }
    
    const updateBackground = () => {
        mountainsRef.current.forEach((mountain) => {
            mountain.scroll();
            if (mountain.noImgLeft()) {
                mountainsRef.current.push(new Mountains(mountainsImage));
            }
            
            if (mountain.timeToDestroy()) {
                mountainsRef.current.splice(0, 1);
            }
        });
    }
    
    const updateBirdy = () => {
        birdyRef.current.update();

        if (birdyRef.current.isHit() && !gameOver) {
            setGameOver(true);
        }
    }

    const clearCanvas = (context) => {
        context.clearRect(0, 0, CANVAS.width, CANVAS.height);
        context.drawImage(skyImage, 0, 0, CANVAS.width, CANVAS.height);
    }

    const drawBird = (context) => {
        birdyRef.current.draw(context);
    }

    const drawPipes = (context) => {
        pipesRef.current.forEach((pipe) => pipe.draw(context));
    }

    const drawMountains = (context) => {
        mountainsRef.current.forEach((mountain) => mountain.draw(context));
    }

    const drawStartText = (context) => {
        context.fillStyle = "white";
        context.font = "48px serif";
        context.fillText("Click anywhere to Start!", CANVAS.width/5, CANVAS.height/2);
    }

    const drawGame = (context) => {
        clearCanvas(context); 
        drawMountains(context);
        drawPipes(context);
        drawBird(context);

        if (!gameStarted) {
            drawStartText(context);
        }
    }

    const onClick = () => {
        if (gamePaused) {
            pauseGame();
            birdyRef.current.flap();
        }
    }


    const sendScore = async () => {
        let username = localStorage.getItem("user");

        if (username !== null) {
            sendLeaderboardData("/birdyflap/add", username, score, "score");
            setTimeout(setIsScoreSent, 500, !isScoreSent);
        }
    }

    const summary = () => {
        return "Welcome to Batty Flap! The objective in this game is to make it through the pillars."
        + " Make any contact with the pillars and you lose!"
    }

    const controls = () => {
        return [{icon: <PiMouseLeftClickFill />, description: " Flap upwards"}]
    }

    return (
        <div className={styles.page}>
            <div className={styles.head}>
                <h2>Score: {score}</h2>
            </div>
            <canvas style={{marginBottom: "3em"}} className={styles.canvas} ref={canvasRef} />
            <HowTo summary={summary()} controls={controls()}/>
            <Leaderboard metric={"Score"} gameName={"birdyflap"} refetchFlag={isScoreSent} />
            { gameOver ? (
                    <GameOver lost={true} metric="Score" value={score} tryAgain={resetGame}/>
                ) : (
                    <></>
                )
            }
        </div>
    )
}

export default BirdyFlap;