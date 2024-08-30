import React, { useState, useRef, useEffect, useCallback } from "react";
import { getLeaderboard, sendLeaderboardData } from "../../util/restful";
import game from "../../pages/game/game.module.css"
import Timer from "../../components/timer/Timer";
import Leaderboard from "../../components/leaderboard/Leaderboard";
import GameOver from "../../components/gameover/GameOver";

function Snake() {
    const ADD_SCORE_PATH = process.env.REACT_APP_SNAKE_ADD_PATH;
    const LEADERBOARD_PATH = process.env.REACT_APP_SNAKE_LEADERBOARD_PATH;

    const CANVAS_SIZE = 740;

    const SNAKE_SPEED = 20;
    const SNAKE_SIZE = 20;
    const FRAME_INTERVAL = 60;
    const LEFT = 0;
    const RIGHT = 1;
    const UP = 2;
    const DOWN = 3;

    // 
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
   
    // states
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [scores, setScores] = useState([]);
    const [currentScore, setCurrentScore] = useState(1);

    // fetch scores and show canvas when page opens
    useEffect(() => {
        let canvas = ref.current;
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE; 
        let ctx = canvas.getContext('2d');
        clearScreen(ctx);
        fetchScores();
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
    
    
    // GAME LOOP
    useEffect(() => {
        // Set up canvas element
        if (gameStarted) {
            // BLANK CANVAS
            let canvas = ref.current;
            canvas.width = CANVAS_SIZE;
            canvas.height = CANVAS_SIZE; 
            let ctx = canvas.getContext('2d');
            clearScreen(ctx);
            drawSnake(ctx);
            
            let intervalId = 0;
            let requestId = 0;
        
            // main loop handling rendering and logic
            function mainLoop() {
                // clear canvas for next frame
                clearScreen(ctx);

                // move and draw the snake
                drawSnake(ctx);
                drawFood(ctx);

                eatFood(); // check for food collision
                eatSelf(); // check for self collision
                hitWall(canvas);
                
                if (foodEaten.current) {
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
    
    const fetchScores = useCallback(async () => {
        setScores(await getLeaderboard(LEADERBOARD_PATH));
    }, [scores]);

    const sendScore = async (username) => {
        await sendLeaderboardData(ADD_SCORE_PATH, username, snakeBody.current.length, "score")
        fetchScores();
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
    
    function drawSnake(ctx) {
        // draw the head
        ctx.fillStyle = "green";
        ctx.strokeStyle = "limegreen"
        ctx.rect(snakeHead.current.x, snakeHead.current.y, SNAKE_SIZE, SNAKE_SIZE);
        ctx.fill();
        ctx.stroke();
        
        // drag body along behind the head
        for (let i = 0; i < snakeBody.current.length; i++) {
            ctx.rect(snakeBody.current[i].x, snakeBody.current[i].y, SNAKE_SIZE, SNAKE_SIZE);
            ctx.fill();
            ctx.stroke();
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
        
        while (snakeBody.current.includes([x, y])) {
            x = (Math.floor(Math.random() * (canvas.width / SNAKE_SIZE)) * SNAKE_SIZE);
            y = (Math.floor(Math.random() * (canvas.height / SNAKE_SIZE)) * SNAKE_SIZE);
        }

        foodPosition.current = {x: x, y: y};
        
        foodEaten.current = false;
    }

    function drawFood(ctx) {
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";
        // ctx.fillRect(foodPosition.current.x, foodPosition.current.y, SNAKE_SIZE, SNAKE_SIZE); 
        const x = foodPosition.current.x;
        const y = foodPosition.current.y;

        ctx.beginPath();
        ctx.arc(x + 6, y + 7, 5, 0, Math.PI * 2);
        ctx.arc(x + 15, y + 7, 5, 0, Math.PI * 2);
  
        ctx.moveTo(x + 10, y + 20);
        ctx.lineTo(x, y + 7);
        ctx.lineTo(x + 21, y + 7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

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
    
    function clearScreen(ctx) {
        // clear canvas for next frame
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            
        // background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
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

    function printLeaderboardRow(entry) {
        return (
            <>
                <th scope="row">{entry.username}</th>
                <td>{entry.date}</td>
                <td>{entry.score}</td>
            </>
        )
    }

    return (
        <div className={game.page}>
            <h1>Snake</h1>
            <section className={game.info}>
                { gameStarted ? (
                    <h3><Timer initTime={0} startTimer={gameStarted}/></h3>
                    ) : (
                        <h3>00:00</h3>
                    )
                }
                <h3>Score: {currentScore}</h3>
            </section>
            <canvas 
                ref={ref}
                style={{width: '740px', height: '740px'}}
            />

            {
                gameOver ? (
                    <GameOver lost={true} metric="Score" value={currentScore} tryAgain={startGame}/>
                ) : (
                    <></>
                )
            }
            <button onClick={startGame} className={game.startButton}>start game</button>
            <h2>Leaderboard</h2>
            <Leaderboard data={scores} printRow={printLeaderboardRow} metric={"Score"}/>
        </div>
    );
};

export default Snake;