import React, { useEffect, useRef, useState } from "react";
import { CANVAS } from "./constants";
import { Pipe } from "./pipe";
import { Birdy } from "./birdy";
import { Mountains } from "./mountinas";
import GameOver from "../../components/gameover/GameOver";
import sky from "./images/sky.png";
import mountainRange from "./images/mountains.png"
import Leaderboard from "../../components/leaderboard/Leaderboard";
import { getLeaderboard, sendLeaderboardData } from "../../util/restful";
import HowTo from "../../components/howTo/HowTo";

function BirdyFlap () {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [gamePaused, setGamePaused] = useState(true);
    const [leaderboard, setLeaderboard] = useState([]);
    
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
    
    // initGame
    useEffect(() => {
        initGame();

        console.log("listening..." , birdyRef.current);
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
        let birdy = birdyRef.current;
        let pipes = pipesRef.current;
        let mountains = mountainsRef.current;
        
        let canvas = canvasRef.current;
        canvas.width = CANVAS.width; 
        canvas.height = CANVAS.height;
        let context = canvas.getContext("2d"); 
        context.shadowBlur = 10;
        context.shadowColor = "black";

        fetchLeaderboard();

        let animationFrame;
        const gameLoop = () => {
            // UPDATES
            if (!gameOver) {
                pipes.forEach((pipe) => {
                    pipe.update(birdy) // pass in birdy to check for collisions
                    if (pipe.score(birdy)) {
                        setScore(prev => prev += 1);
                    }
                });

                mountains.forEach((mountain) => {
                    mountain.scroll();
                    if (mountain.noImgLeft()) {
                        mountains.push(new Mountains(mountainsImage));
                    }
                    
                    if (mountain.timeToDestroy()) {
                        mountains.splice(0, 1);
                    }
                });
            }

            birdy.update();
            
            if (birdy.isHit() && !gameOver) {
                console.log("im hit!");
                
                setGameOver(true);
            }
            
            if (birdy.isDead()) {
                pauseGame();
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
        console.log("new bird new me", birdyRef.current); 
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
        const speed = 1;

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
        spawnBirdy();
        
    }
    
    const pauseGame = () => {
        setGamePaused(!gamePaused);
        setGameStarted(!gameStarted);
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

    const fetchLeaderboard = async () => {
        setLeaderboard(await getLeaderboard("/birdyflap/leaderboard-top10"));
    }

    const sendScore = async () => {
        let username = localStorage.getItem("user");
        console.log("sending...", username, score);

        if (username !== null) {
            sendLeaderboardData("/birdyflap/add", username, score, "score");
        }
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
        return "Welcome to Batty Flap! The objective in this game is to make it through the pillars."
        + " Make any contact with the pillars and you lose!"
    }

    const controls = () => {
        return ["Left Click => Flap upwards"
        ]
    }

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>Birdy Flap</h1>
            <div>
                <h2>Score: {score}</h2>
            </div>
            <canvas style={{marginBottom: "1em"}} ref={canvasRef} />
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

export default BirdyFlap;