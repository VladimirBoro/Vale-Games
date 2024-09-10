import React, { useEffect, useRef, useState } from 'react';
import Board from './components/Board';
import Leaderboard from '../../components/leaderboard/Leaderboard';
import GameOver from '../../components/gameover/GameOver';
import styles from "./minesweeper.module.css";
import { getLeaderboard, sendLeaderboardData } from "../../util/restful";
import { ADD_PATH, LEADERBOARD_PATH } from "./utils/contants.js"


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

    return (
        <div className={styles.page}>
            <Board postTime={postTime} gg={gg}/>
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