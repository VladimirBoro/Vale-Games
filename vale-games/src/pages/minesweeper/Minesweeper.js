import React, { useEffect, useRef, useState } from 'react';
import Board from './components/Board';
import Leaderboard from '../../components/leaderboard/Leaderboard';
import GameOver from '../../components/gameover/GameOver';
import styles from "./minesweeper.module.css";
import { getLeaderboard, sendLeaderboardData } from "../../util/restful";
import { ADD_PATH, LEADERBOARD_PATH } from "./utils/contants.js"
import HowTo from '../../components/howTo/HowTo.js';


function Minesweeper() {
    const [times, setTimes] = useState([]);
    const [gameOver, setgameOver] = useState(false);

    const time = useRef("");
    const restart = useRef(null);
    const gameLost = useRef(false);
    
    const fetchLeaderboard = async () => {
        console.log(LEADERBOARD_PATH);
        setTimes(await getLeaderboard(LEADERBOARD_PATH));
    }

    // GET top ten leaderboard
    useEffect(() => {
        fetchLeaderboard();
    }, [gameOver]);


    // POST user's time to server db
    const postTime = async (time, username) => {
        await sendLeaderboardData(ADD_PATH, username, time, "time");
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

    // params: bool, string, function
    const gg = (gameL, timed, resetGame) => {
        console.log("ggs...", gameLost);
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
    }

    const controls = () => {
        return ["Left Click Cell => Open it up",
                "Right Click Cell => Place Flag/Remove Flag"
        ]
    }

    return (
        <div className={styles.page}>
            <Board postTime={postTime} gg={gg}/>
            <HowTo summary={summary()} controls={controls()}/>
            <Leaderboard data={times} printRow={printRow} metric={"Time"}/>
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