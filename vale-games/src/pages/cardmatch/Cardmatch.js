import React, {useState, useRef, useEffect} from "react";
import Table from "./components/Table";
import style from "./styles/style.module.css";
import Timer from "../../components/timer/Timer"
import GameOver from "../../components/gameover/GameOver"
import Leaderboard from "../../components/leaderboard/Leaderboard"
import { EASY, MEDIUM, HARD } from "./constants";
import { getLeaderboard, sendLeaderboardData } from "../../util/restful";
import HowTo from "../../components/howTo/HowTo";


function CardMatch() {
    const [difficulty, setDifficulty] = useState(EASY);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [lives, setLives] = useState(1);
    const [matchedCount, setMatchedCount] = useState(difficulty.pairs);
    const [leaderboard, setLeaderboard] = useState([]);

    const gameWon = useRef(false);
    const disabled = useRef(false);
    const time = useRef("");

    // OPEN PAGE
    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLeaderboard(await getLeaderboard("/cardmatch/leaderboard-top10"));
        }

        fetchLeaderboard();
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
        let username = localStorage.getItem("user");
        if (username && gameWon.current) {
            await sendLeaderboardData("/cardmatch/add", username, time.current, "time");
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

    const summary = () => {
        return "Welcome to Cardmatch! The objective in this game is to match all the pairs of cards."
        + " Flip over a card and then different card to see if they match, if they do keep going, and if"
        + " not, try to keep note of what type the two cards you just flipped over were."
    }

    const controls = () => {
        return ["Left Click a card => Reveal the other side"
        ]
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

            <HowTo summary={summary()} controls={controls()}/>
            <Leaderboard data={leaderboard} printRow={printRow} metric="Time"/>
        </div>
    );
}

export default CardMatch;