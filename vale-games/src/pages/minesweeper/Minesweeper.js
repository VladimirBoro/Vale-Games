import React, { useEffect, useRef, useState } from 'react';
import Board from './components/Board';
import Leaderboard from '../../components/leaderboard/Leaderboard';
import GameOver from '../../components/gameover/GameOver';
import styles from "./minesweeper.module.css";
import { sendLeaderboardData } from "../../util/restful";
import { ADD_PATH } from "./utils/contants.js"
import { PiMouseLeftClickFill, PiMouseRightClickFill } from "react-icons/pi";
import HowTo from '../../components/howTo/HowTo.js';


function Minesweeper() {
    const [gameOver, setgameOver] = useState(false);
    const [isScoreSent, setIsScoreSent] = useState(false);

    const time = useRef("");
    const restart = useRef(null);
    const gameLost = useRef(false);
    
    useEffect(() => {
        localStorage.setItem("currentGame", "Minesweeper");
        window.dispatchEvent(new Event("game"));
    }, [])

    // POST user's time to server db
    const postTime = async (time, username) => {
        await sendLeaderboardData(ADD_PATH, username, time, "time");
        setTimeout(setIsScoreSent, 500, !isScoreSent);
    }

    // params: bool, string, function
    const gg = (gameL, timed, resetGame) => {
        setgameOver(true);
        gameLost.current = gameL;
        time.current = timed;
        restart.current = resetGame; 
    }

    const hideGameOver = () => {
        setgameOver(false); // hide menu
        restart.current(); // reset board
    }

    const summary = () => {
        return "Open squares with the left mouse button and put flags on mines with the right mouse button."
        + " When you open a square that does not touch any mines, it will be empty and the adjacent"
        + " squares will automatically open in all directions until reaching squares that contain numbers."
        + " A common strategy for starting games is to randomly click until you get a big opening with lots of numbers."
        + " Clear the field without left-clicking any mines to win!"
    }

    const controls = () => {
        return [{icon: <PiMouseLeftClickFill />, description: " Check cell"},
                {icon: <PiMouseRightClickFill />, description: " Place Flag/Remove Flag"}
        ]
    }

    return (
        <div className={styles.page}>
            <div className={styles.contents}>
                <Board postTime={postTime} gg={gg}/>
                <HowTo summary={summary()} controls={controls()}/>
            </div>

            <Leaderboard metric={"Time"} gameName={"minesweeper"} refetchFlag={isScoreSent} />
            { gameOver ? (
                    <GameOver lost={gameLost.current} metric="Time" value={time.current} tryAgain={hideGameOver}/>
                ) : (
                    <></>
                )
            }
        </div>
    );
}

export default Minesweeper;