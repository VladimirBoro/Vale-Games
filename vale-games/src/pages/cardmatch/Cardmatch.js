import React, {useState, useRef, useEffect} from "react";
import Table from "./components/Table";
import style from "./styles/style.module.css";
import Timer from "../../components/timer/Timer"
import GameOver from "../../components/gameover/GameOver"
import Leaderboard from "../../components/leaderboard/Leaderboard"
import { EASY, MEDIUM, HARD } from "./constants";
import { sendLeaderboardData } from "../../util/restful";
import { PiMouseLeftClickFill } from "react-icons/pi";
import HowTo from "../../components/howTo/HowTo";


function CardMatch() {
    const [difficulty, setDifficulty] = useState(EASY);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [resetFlag, setResetFlag] = useState(false);
    const [lives, setLives] = useState(1);
    const [matchedCount, setMatchedCount] = useState(difficulty.pairs);
    const [isScoreSent, setIsScoreSent] = useState([]);
    const [disabled, setDisabled] = useState(false); // disables click effect of flipping cards

    const gameWon = useRef(false);
    const time = useRef("");

    useEffect(() => {
        localStorage.setItem("currentGame", "Card Match");
        window.dispatchEvent(new Event("game"));
        setLives(difficulty.lives);
    }, [])

    useEffect(() => {
        setMatchedCount(difficulty.pairs);
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
            setTimeout(setIsScoreSent, 500, !isScoreSent);
        }
    }

    const handleGameOver = (won) => {
        setGameOver(true);
        setResetFlag(false);
        setGameStarted(false);
        setDisabled(true);
        gameWon.current = won;
        postTime();
    }
    
    const startGame = () => {
        setResetFlag(false);
        setGameStarted(true);
    }

    const resetGame = () => {
        console.log("resetting");
        setResetFlag(true);
        setDisabled(false);
        setGameStarted(false);
        setTimeout(setGameOver, 150, false);
        setLives(difficulty.lives);
    }

    const handleDifficultyButton = (mode) => {
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

    const summary = () => {
        return "Welcome to Cardmatch! The objective in this game is to match all the pairs of cards."
        + " Flip over a card and then different card to see if they match, if they do keep going, and if"
        + " not, try to keep note of what type the two cards you just flipped over were."
    }

    const controls = () => {
        return [{icon: <PiMouseLeftClickFill />, description: " Reveal card"}
        ]
    }

    return (
        <div className={style.table_container}>
            <div className={style.gameStats}>
                <h2><Timer initTime={0} startTimer={gameStarted} stopTimer={gameOver} updateTime={getTime}/></h2>
                <h2>Difficulty: {difficulty.string}</h2>
                <h2>❤️: {lives}</h2>
            </div>

            <Table difficulty={difficulty} gameEnded={gameOver} gameStarted={gameStarted} reset={resetFlag} disable={disabled} loseLife={loseLife} startGame={startGame} matchFound={matchFound}/>

            {
                gameOver ? (
                    <GameOver lost={!gameWon.current} metric="Time" value={time.current} tryAgain={resetGame}/>
                ) : (
                    <></>
                )
            }

            <div className={style.button_container}>
                <button onClick={() => handleDifficultyButton(EASY)}> Easy </button>
                <button onClick={() => handleDifficultyButton(MEDIUM)}> Medium </button>
                <button onClick={() => handleDifficultyButton(HARD)}> Hard </button>
            </div>

            <HowTo summary={summary()} controls={controls()}/>
            <Leaderboard metric={"Time"} gameName={"cardmatch"} refetchFlag={isScoreSent}/>
        </div>
    );
}

export default CardMatch;