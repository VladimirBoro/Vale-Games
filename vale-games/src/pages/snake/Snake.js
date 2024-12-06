import React, { useState, useRef, useEffect } from "react";
import { sendLeaderboardData } from "../../util/restful";
import styles from "./styles.module.css"
import Timer from "../../components/timer/Timer";
import Leaderboard from "../../components/leaderboard/Leaderboard";
import GameOver from "../../components/gameover/GameOver";
import HowTo from "../../components/howTo/HowTo";

function Snake() {
    const ADD_SCORE_PATH = process.env.REACT_APP_SNAKE_ADD_PATH;
    const LEADERBOARD_PATH = process.env.REACT_APP_SNAKE_LEADERBOARD_PATH;

    const CANVAS_SIZE = 500;

    const SNAKE_SPEED = 20;
    const SNAKE_SIZE = 20;
    const FRAME_INTERVAL = 70;
    const LEFT = 0;
    const RIGHT = 1;
    const UP = 2;
    const DOWN = 3;

    const DIRECTION_OPPS = {
        0: RIGHT,
        1: LEFT,
        2: DOWN,
        3: UP
    };

    // refs
    const ref = useRef();
    const snakeDirection = useRef(RIGHT);
    const directionQueue = useRef([]);
    const snakeHead = useRef({x: 10, y: 10});
    const snakeBody = useRef([]);
    const foodPosition = useRef({x: 0, y: 0});
    const foodEaten = useRef(true);
    const canvasCtx = useRef();
   
    // states
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [currentScore, setCurrentScore] = useState(1);
    const [isScoreSent, setIsScoreSent] = useState(false);

    // fetch scores and show canvas when page opens
    useEffect(() => {
        localStorage.setItem("currentGame", "Snake");
        window.dispatchEvent(new Event("game"));

        let canvas = ref.current;
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE; 
        canvasCtx.current = canvas.getContext('2d');
        clearScreen();

    }, []);
        
    // Event listener for keyboard input
    useEffect(() => {
        if (gameStarted) {
            document.body.addEventListener("keydown", changeDirection);
        }
        else {
            document.body.removeEventListener("keydown", changeDirection);
        }
        
        return () => {
            document.body.removeEventListener("keydown", changeDirection);
        };
    }); 
    
    
    // styles LOOP
    useEffect(() => {
        // Set up canvas element
        if (gameStarted) {
            // BLANK CANVAS
            let canvas = ref.current;
            canvas.width = CANVAS_SIZE;
            canvas.height = CANVAS_SIZE; 
            canvasCtx.current = canvas.getContext('2d');
            clearScreen(canvasCtx.current);
            drawSnake(canvasCtx.current);
            
            let intervalId = 0;
            let requestId = 0;
        
            // main loop handling rendering and logic
            function mainLoop() {
                // clear canvas for next frame
                clearScreen(canvasCtx.current);

                // move and draw the snake
                drawSnake();     
                drawFood();

                eatFood(); // check for food collision
                eatSelf(); // check for self collision
                hitWall(canvas);
                
                if (foodEaten.current) {
                    placeFood(canvas);
                }
                
                const isBadSpawn = snakeBody.current.some(obj => {
                    return obj.x === foodPosition.current.x && obj.y === foodPosition.current.y;
                })

                if (isBadSpawn) {
                    console.log("collesion");
                    placeFood(canvas);
                }
                
                requestId = requestAnimationFrame(mainLoop);
            };
            
            mainLoop();
            intervalId = setInterval(translateSnake, FRAME_INTERVAL);
            
            return () => {
                cancelAnimationFrame(requestId);
                clearInterval(intervalId);
            };
        }
    }, [gameStarted]);
    
    const sendScore = async (username) => {
        await sendLeaderboardData(ADD_SCORE_PATH, username, snakeBody.current.length + 1, "score");
        setTimeout(setIsScoreSent, 500, !isScoreSent);
    }

    function translateSnake() { 
        // get queued direction
        if (directionQueue.current.length > 0) {
            const newDirection = directionQueue.current.shift();

            // do not accept direction if it direct opposite of current direction
            if (DIRECTION_OPPS[snakeDirection.current] != newDirection) {
                snakeDirection.current = newDirection;
            }
        }
        
        if (snakeDirection.current === UP) {
            snakeHead.current.x = Math.round(snakeHead.current.x / SNAKE_SIZE) * SNAKE_SIZE;
            snakeHead.current.y -= SNAKE_SPEED;
        }
        else if (snakeDirection.current === DOWN) {
            snakeHead.current.x = Math.round(snakeHead.current.x / SNAKE_SIZE) * SNAKE_SIZE;
            snakeHead.current.y += SNAKE_SPEED;
        }
        else if (snakeDirection.current === RIGHT) {
            snakeHead.current.y = Math.round(snakeHead.current.y / SNAKE_SIZE) * SNAKE_SIZE;
            snakeHead.current.x += SNAKE_SPEED;
        }
        else {
            snakeHead.current.y = Math.round(snakeHead.current.y / SNAKE_SIZE) * SNAKE_SIZE;
            snakeHead.current.x -= SNAKE_SPEED;
        }
        
        dragBody(); // move body with head
    }
    
    function drawSnake() {
        // draw the head
        canvasCtx.current.beginPath();
        canvasCtx.current.fillStyle = "green";
        canvasCtx.current.strokeStyle = "limegreen";
        canvasCtx.current.rect(snakeHead.current.x, snakeHead.current.y, SNAKE_SIZE, SNAKE_SIZE);
        canvasCtx.current.fill();
        canvasCtx.current.stroke();
        
        // drag body along behind the head
        for (let i = 0; i < snakeBody.current.length; i++) {
            canvasCtx.current.rect(snakeBody.current[i].x, snakeBody.current[i].y, SNAKE_SIZE, SNAKE_SIZE);
            canvasCtx.current.fill();
            canvasCtx.current.stroke();
        }
    }

    // link body to follow path of head
    function dragBody() {
        snakeBody.current.pop();
        snakeBody.current.unshift({...snakeHead.current});
    }
    
    // check for head and food collision
    function eatFood() {
        if (snakeHead.current.x === foodPosition.current.x && snakeHead.current.y === foodPosition.current.y) {
            foodEaten.current = true;
            growSnake();
            setCurrentScore(score => score += 4);
        }
    }

    // check for head and body collision
    function eatSelf() {
        for (let i = 1; i < snakeBody.current.length; i++) {
            if (snakeBody.current[i].x === snakeHead.current.x && snakeBody.current[i].y === snakeHead.current.y) {
                loseGame();
                break;
            }
        }
    }

    function hitWall(canvas) {
        if (snakeHead.current.x <= -1 || snakeHead.current.x >= canvas.width 
            || snakeHead.current.y <= -1 || snakeHead.current.y >= canvas.height) {
            
            loseGame();
        }
    }

    function placeFood(canvas) {
        const x = (Math.floor(Math.random() * (canvas.width / SNAKE_SIZE)) * SNAKE_SIZE);
        const y = (Math.floor(Math.random() * (canvas.height / SNAKE_SIZE)) * SNAKE_SIZE);
        

        foodPosition.current = {x: x, y: y};
        foodEaten.current = false;
    }

    function drawFood() {
        const x = foodPosition.current.x;
        const y = foodPosition.current.y;

        canvasCtx.current.fillStyle = "red";
        canvasCtx.current.strokeStyle = "red";

        canvasCtx.current.beginPath();
        canvasCtx.current.arc(x + 6, y + 7, 5, 0, Math.PI * 2);
        canvasCtx.current.arc(x + 15, y + 7, 5, 0, Math.PI * 2);
  
        canvasCtx.current.moveTo(x + 10, y + 20);
        canvasCtx.current.lineTo(x, y + 7);
        canvasCtx.current.lineTo(x + 21, y + 7);
        canvasCtx.current.closePath();
        canvasCtx.current.fill();
        canvasCtx.current.stroke();
    }

    // add postions to array
    function growSnake() {
        snakeBody.current.push([0,0]);
        snakeBody.current.push([0,0]);
        snakeBody.current.push([0,0]);
        snakeBody.current.push([0,0]);
    }
    
    function changeDirection(direction) {
        // stop scrolling with arrow keys during game
        if (gameStarted) {
            direction.preventDefault();
        }
       
        if (directionQueue.current.length < 2) {
            if ((direction.keyCode === 83 || direction.keyCode === 40)) {
                directionQueue.current.push(DOWN);
            }
            else if ((direction.keyCode === 87 || direction.keyCode === 38)) {
                directionQueue.current.push(UP);
            }
            else if ((direction.keyCode === 65 || direction.keyCode === 37)) {
                directionQueue.current.push(LEFT);
            }
            else if ((direction.keyCode === 68 || direction.keyCode === 39)) {
                directionQueue.current.push(RIGHT);
            }
        }
    }
    
    function clearScreen() {
        // clear canvas for next frame
        canvasCtx.current.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            
        // background
        canvasCtx.current.fillStyle = "black";
        canvasCtx.current.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }

    function startGame() {
        directionQueue.current = [];
        foodEaten.current = true;
        snakeBody.current = [];
        snakeHead.current = {x: 0, y: 0};
        snakeDirection.current = RIGHT;
        setGameStarted(true);
        setGameOver(false);
        setCurrentScore(1);
    }

    async function loseGame() {
        setGameStarted(false);
        setGameOver(true);

        // attempt to get current user
        let username = localStorage.getItem("user");
        console.log(username);

        // if we logged in then save the score in the DB
        if (username) {
            sendScore(username);
        }
    }

    const summary = () => {
        return "Welcome to Snake! Grow as long as possible by consuming hearts, but be sure to not"
        + " run into yourself or the walls! Then it is game over."
    }

    const controls = () => {
        return [{icon: "WASD or Arrow Keys", description: " Up, Right, Down, Left"}
        ]
    }

    return (
        <div className={styles.page}>
            <div className={styles.info}>
                <h2><Timer initTime={0} startTimer={gameStarted} stopTimer={gameOver}/></h2> 
                <h2>Score: {currentScore}</h2>
            </div>
            
            <canvas 
                ref={ref}
                className={styles.canvas}
            />

            {
                gameOver ? (
                    <GameOver lost={true} metric="Score" value={currentScore} tryAgain={startGame}/>
                ) : (
                    <></>
                )
            }
            <button onClick={startGame} className={styles.startButton}>start</button>
            <HowTo summary={summary()} controls={controls()}/>
            <Leaderboard metric={"Score"} gameName={"snake"} refetchFlag={isScoreSent}/>
        </div>
    );
};

export default Snake;