import React, { useEffect, useRef, useState } from 'react';
import Board from './components/Board';
import Leaderboard from '../../components/leaderboard/Leaderboard';
import GameOver from '../../components/gameover/GameOver';
import game from "../../pages/game/game.module.css"
import customAxios from '../../util/customAxios';
import { ADD_PATH, LEADERBOARD_PATH } from "./utils/contants.js"


function Minesweeper() {
    const [times, setTimes] = useState([]);
    const [gameOver, setgameOver] = useState(false);

    const time = useRef("");
    const restart = useRef(null);
    const gameLost = useRef(false);
    
    const getLeaderboard = async () => {
        console.log(LEADERBOARD_PATH);

        await customAxios.get(LEADERBOARD_PATH)
        .then(res => {
            setTimes(res.data);
        })
        .catch(error => {
            console.error(error);
        })
    }

    // GET top ten leaderboard
    useEffect(() => {
        getLeaderboard();
    }, [gameOver]);


    // POST user's time to server db
    const postTime = async (time, username) => {
        await customAxios.post(ADD_PATH, null, 
            {
                params: {
                    time: time,
                    username, username
                }
            }
        )
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error(error);
        })
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
        <div className={game.page}>
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