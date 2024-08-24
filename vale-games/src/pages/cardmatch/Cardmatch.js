import React, {useState, useRef, useEffect} from "react";
import Table from "./components/Table";
import style from "./styles/style.module.css";
import Timer from "../../components/timer/Timer"
import GameOver from "../../components/gameover/GameOver"
import Leaderboard from "../../components/leaderboard/Leaderboard"
import { EASY, MEDIUM, HARD } from "./constants";
import customAxios from "../../util/customAxios";

function CardMatch() {
    const [difficulty, setDifficulty] = useState(EASY);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [lives, setLives] = useState(1);
    const [matchedCount, setMatchedCount] = useState(difficulty.pairs);
    const [leaderboard, setLeaderboard] = useState([]);

    const gameWon = useRef(false);
    const disabled = useRef(false);
    // const leaderboard = useRef([]);
    const time = useRef("");

    // OPEN PAGE
    useEffect(() => {
        const getLeaderboard = async () => {
            await customAxios.get("/cardmatch/leaderboard-top10")
            .then(response => {
                setLeaderboard(response.data);
            })
            .catch(error => console.error(error));
        }

        getLeaderboard();
        setMatchedCount(difficulty.pairs);
        setLives(difficulty.lives);

    }, [gameOver]);

    // LOSE CONDITION
    useEffect(() => {
        if (lives < 1) {
            // GG's
            console.log("GG's yall >:(");
            handleGameOver(false);
        }
    }, [lives])

    // WIN CONDITION
    useEffect(() => {
        if (matchedCount <= 0) {
            console.log("GG's yall :)");
            handleGameOver(true);
        }
    }, [matchedCount])

    const postTime = async () => {
        let user = localStorage.getItem("user");
        if (user && gameWon.current) {
            await customAxios.post("/cardmatch/add", null,
                {
                    params: {
                        username: user,
                        time: time.current
                    }
                }
            )
            .then(response => console.log(response.data))
            .catch(error => console.error(error));
        }
    }

    const handleGameOver = (won) => {
        console.log("won!", won);
        setGameOver(true);
        setGameStarted(false);
        disabled.current = true;
        gameWon.current = won;
        postTime();
    }

    const startGame = () => {
        setGameStarted(true);
    }

    const resetGame = () => {
        console.log("reset!");
        // time.current = "";
        setGameStarted(false);
        setGameOver(false);
        setLives(difficulty.lives);
        disabled.current = false;
    }

    const handleDifficultyButton = (mode) => {
        console.log("setter done!", mode);
        resetGame();
        setDifficulty(mode);
        setMatchedCount(mode.pairs);
        setLives(mode.lives);
    }

    const loseLife = () => {
        setLives(prev => prev - 1);
    }

    const matchFound = () => {
        setMatchedCount(prev => prev - 1);
    }

    const getTime = (currentTime) => {
        time.current = currentTime;
    }

    // print row function to be passed into Leaderboard
    const printRow = (entry) => {
        return (
            <>
                <th scope="row">{entry.username}</th>
                <td>{entry.date}</td>
                <td>{entry.time}</td>
            </>
        )
    }

    return (
        <div className={style.table_container}>
            <h1 className={style.h1}>Card Match</h1>
            <div className={style.gameStats}>
                <h2><Timer initTime={0} startTimer={gameStarted} updateTime={getTime}/></h2>
                <h2>Lives: {lives}</h2>
            </div>

            <Table difficulty={difficulty} gameEnded={gameOver} disable={disabled.current} loseLife={loseLife} startGame={startGame} matchFound={matchFound}/>

            {
                gameOver ? (
                    <GameOver lost={!gameWon.current} metric="Time" value={time.current} tryAgain={resetGame}/>
                ) : (
                    <></>
                )
            }

            <h2>Difficulty: {difficulty.string}</h2>
            <div className={style.button_container}>
                <button onClick={() => handleDifficultyButton(EASY)}> Easy </button>
                <button onClick={() => handleDifficultyButton(MEDIUM)}> Medium </button>
                <button onClick={() => handleDifficultyButton(HARD)}> Hard </button>
            </div>

            <Leaderboard data={leaderboard} printRow={printRow} metric="Time"/>
        </div>
    );
}

export default CardMatch;