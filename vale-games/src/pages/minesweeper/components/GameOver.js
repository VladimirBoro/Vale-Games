import React from "react";
import gameOver from "./styles/gameOver.module.css"

function GameOver({lost, time, tryAgain}) {
    return (
        <section className={gameOver.window}>
            { lost ? (
                <h2>Game Over!</h2>
            ) : (
                <h2>You Win!</h2>
            )}
            <p>Time: {time}</p>
            <button onClick={tryAgain}>Try Again</button>
        </section>
    );
}

export default GameOver;