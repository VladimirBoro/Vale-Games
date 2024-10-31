import React,{useState,useEffect,useRef} from 'react';
import CreateBoard from '../utils/CreateBoard';
import { revealed } from "../utils/Reveal";
import Cell from './Cell';
import Timer from "../../../components/timer/Timer"
import styles from './styles/board.module.css';
import * as contants from "../utils/contants";

function Board({postTime, gg}) {
    const [grid, setGrid] = useState([]);
    const [mineCount, setmineCount] = useState(0);
    const [mineLocation, setmineLocation] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [time, setTime] = useState("00:00");
    const [difficulty, setDifficulty] = useState(contants.easyGame);
    
    const gameOver = useRef(false);
    const nonMineCount = useRef(0);
    const loggedIn = useRef(false);

    const style = {
        display : 'flex',
        flexDirection : 'row',
        width:'fit-content',
        color:'white'
    }

    useEffect(() => {
        // user is logged in
        if (localStorage.getItem("user")) {
            loggedIn.current = true;
        }

        freshBoard();
    }, [difficulty]);

    // Making freshboard atstart
    const freshBoard = () => {
        const newBoard = CreateBoard(difficulty.size, difficulty.size, difficulty.minesAmount);
        setmineCount(difficulty.minesAmount);
        nonMineCount.current = difficulty.size * difficulty.size - difficulty.minesAmount;
        setmineLocation(newBoard.mineLocation);
        setGrid(newBoard.board);
    }

    const updateFlag = (e, x, y) => {
        e.preventDefault();
        // deep copy of the object
        let newGrid=JSON.parse(JSON.stringify(grid));

        if (newGrid[x][y].flagged && newGrid[x][y].revealed !== true) {
            newGrid[x][y].flagged = false;
            setmineCount(prev => prev += 1);
        }
        else if (mineCount > 0 && newGrid[x][y].revealed !== true) {
            newGrid[x][y].flagged = true;
            setmineCount(prev => prev -= 1);
        }

        setGrid(newGrid);
    }

    const revealcell = (x,y) => {
        // prohibit making moves when game over
        if (gameOver.current) {
            return;
        }

        let newGrid=JSON.parse(JSON.stringify(grid));
        
        if (!gameStarted && !gameOver.current) {
            setGameStarted(true);
        }

        // LOSS
        if (newGrid[x][y].value === "X") {
            for(let i = 0; i < mineLocation.length; i++) {
                newGrid[mineLocation[i][0]][mineLocation[i][1]].revealed = true;
            }

            setGrid(newGrid);
            gameOver.current = true;
            setGameStarted(false);
            gg(true, time, resetGame);
        }
        
        // get cleared non mines count
        let revealedboard = revealed(newGrid, x, y, nonMineCount.current);
        setGrid(revealedboard.arr);
        nonMineCount.current = revealedboard.newNonMines;
        console.log(nonMineCount.current);
        
        // WIN
        if (nonMineCount.current === 0) {
            // SEND SCORE TO SERVER HERE
            if (loggedIn.current) {
                postTime(time, localStorage.getItem("user"));
            }
            
            gameOver.current = true;
            setGameStarted(false);
            gg(false, time, resetGame);
        }    
    }
    
    const resetGame = () => {
        setGameStarted(false);
        setTime("00:00");
        gameOver.current = false;
        freshBoard();
    }

    const updateTime = (timeString) => {
        setTime(timeString);
    }

    const changeDifficulty = (mode) => {
        console.log("we are here and changing the difficulty", mode);
        if (!gameOver.current) {
            setDifficulty(mode);
            resetGame();
        }
    }
    
    return (
            <div className={styles.board}>
                <div className={styles.head}>
                    <h2>🚩: {mineCount}</h2>
                    
                    
                            <h2><Timer initTime={0} startTimer={gameStarted} updateTime={updateTime}/></h2>
                    
                    
                </div>
                {grid.map((singlerow,index1) => {
                    return (
                        <div style={style} key={index1}>
                            {singlerow.map((singlecol,index2) => {
                                return  <Cell details={singlecol} key={index2} updateFlag={updateFlag} revealcell={revealcell}/>
                            })}
                        </div>
                    )
                })}
                {/* <button style={{position:'absolute', top:'50%', bottom:'50%', transform:'translate(-50%, -50%)', width:'50%'}}>Easy</button> */}
                <div className={styles.options}>
                    <button onClick={() => changeDifficulty(contants.easyGame)} >Easy</button>
                    <button onClick={() => changeDifficulty(contants.mediumGame)} >Medium</button>
                    <button onClick={() => changeDifficulty(contants.hardGame)} >Hard</button>
                    <button onClick={resetGame}>Restart</button>
                </div>
            </div>
    ) 
}
export default Board;